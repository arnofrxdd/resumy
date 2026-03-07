import { Request, Response, NextFunction } from 'express'
import { compressImage, isImage, getCompressedMimeType } from '../services/imageCompression'

/**
 * Image Compression Middleware
 *
 * Automatically compresses image files before they reach the upload storage.
 * Maintains file quality while significantly reducing file sizes.
 *
 * Usage:
 * router.post('/upload', imageCompressMiddleware, upload.single('file'), handler)
 */

/**
 * Compression configuration
 * Override with environment variables if needed
 */
interface CompressionConfig {
    /**
     * Enable/disable image compression
     * Default: true (set to false to disable entirely)
     */
    enabled: boolean

    /**
     * Whether to compress images for resumes
     * Default: true
     */
    compressResumes: boolean

    /**
     * Maximum image file size to compress (bytes)
     * Files larger than this are skipped
     * Default: 100MB (100 * 1024 * 1024)
     */
    maxFileSize: number

    /**
     * Minimum image file size to compress (bytes)
     * Files smaller than this are skipped (already small)
     * Default: 100KB (100 * 1024)
     */
    minFileSize: number

    /**
     * Maximum width in pixels
     * Default: 2048
     */
    maxWidth: number

    /**
     * Maximum height in pixels
     * Default: 2048
     */
    maxHeight: number

    /**
     * JPEG quality (0-100)
     * Default: 80
     */
    jpegQuality: number

    /**
     * Whether to convert PNG to JPEG when possible
     * Default: true
     */
    convertPngToJpeg: boolean

    /**
     * Whether to convert images to WebP
     * Default: false (for broader browser compatibility)
     */
    convertToWebP: boolean

    /**
     * Whether to log compression details
     * Default: true
     */
    logDetails: boolean
}

/**
 * Get compression configuration from environment variables
 */
function getCompressionConfig(): CompressionConfig {
    return {
        enabled: process.env.IMAGE_COMPRESSION_ENABLED !== 'false',
        compressResumes: process.env.COMPRESS_RESUME_IMAGES !== 'false',
        maxFileSize:
            parseInt(process.env.IMAGE_COMPRESSION_MAX_SIZE || '') ||
            100 * 1024 * 1024, // 100MB
        minFileSize:
            parseInt(process.env.IMAGE_COMPRESSION_MIN_SIZE || '') ||
            100 * 1024, // 100KB
        maxWidth: parseInt(process.env.IMAGE_MAX_WIDTH || '') || 2048,
        maxHeight: parseInt(process.env.IMAGE_MAX_HEIGHT || '') || 2048,
        jpegQuality: parseInt(process.env.IMAGE_JPEG_QUALITY || '') || 80,
        convertPngToJpeg: process.env.IMAGE_CONVERT_PNG_TO_JPEG !== 'false',
        convertToWebP: process.env.IMAGE_CONVERT_TO_WEBP === 'true',
        logDetails: process.env.IMAGE_COMPRESSION_LOG !== 'false'
    }
}

/**
 * Create image compression middleware
 *
 * @param config - Optional configuration override
 * @returns Express middleware function
 */
export function createImageCompressMiddleware(config?: Partial<CompressionConfig>) {
    const baseConfig = getCompressionConfig()
    const finalConfig = { ...baseConfig, ...config }

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Check if compression is enabled
            if (!finalConfig.enabled) {
                if (finalConfig.logDetails) {
                    console.log('[ImageCompress] Compression disabled, skipping')
                }
                return next()
            }

            // Check if file exists
            if (!req.file) {
                return next()
            }

            // Check if file is an image
            if (!isImage(req.file.mimetype)) {
                if (finalConfig.logDetails) {
                    console.log(
                        `[ImageCompress] Not an image (${req.file.mimetype}), skipping`
                    )
                }
                return next()
            }

            // Check file size limits
            const fileSize = req.file.size || 0

            if (fileSize < finalConfig.minFileSize) {
                if (finalConfig.logDetails) {
                    console.log(
                        `[ImageCompress] File too small (${fileSize} bytes), skipping`
                    )
                }
                return next()
            }

            if (fileSize > finalConfig.maxFileSize) {
                console.warn(
                    `[ImageCompress] File too large (${fileSize} bytes), skipping compression`
                )
                return next()
            }

            // Get file buffer
            const fileBuffer = req.file.buffer

            if (!fileBuffer) {
                console.warn('[ImageCompress] No file buffer available, skipping')
                return next()
            }

            try {
                // Compress the image
                if (finalConfig.logDetails) {
                    console.log(
                        `[ImageCompress] Compressing image: ${req.file.originalname}`
                    )
                }

                const result = await compressImage(fileBuffer, {
                    maxWidth: finalConfig.maxWidth,
                    maxHeight: finalConfig.maxHeight,
                    jpegQuality: finalConfig.jpegQuality,
                    convertPngToJpeg: finalConfig.convertPngToJpeg,
                    convertToWebP: finalConfig.convertToWebP
                })

                // Only use compressed version if it's actually smaller
                // Some images may already be optimized
                if (result.compressedSize < fileSize) {
                    // Update request with compressed file
                    req.file.buffer = result.buffer
                    req.file.size = result.compressedSize

                    // Update MIME type if format changed
                    const newMimeType = getCompressedMimeType(req.file.mimetype, {
                        convertPngToJpeg: finalConfig.convertPngToJpeg,
                        convertToWebP: finalConfig.convertToWebP
                    })

                    if (newMimeType !== req.file.mimetype) {
                        req.file.mimetype = newMimeType

                        // Update filename extension if format changed
                        const format = result.format
                        const oldExtension = req.file.originalname.split('.').pop()
                        if (oldExtension && oldExtension !== format) {
                            const nameWithoutExt = req.file.originalname.slice(
                                0,
                                -(oldExtension.length + 1)
                            )
                            req.file.originalname = `${nameWithoutExt}.${format}`
                        }
                    }

                    // Store compression metadata in request for logging
                    ; (req as any).imageCompressionResult = {
                        originalSize: result.originalSize,
                        compressedSize: result.compressedSize,
                        reduction: result.reduction,
                        originalFormat: req.file.mimetype.split('/')[1],
                        compressedFormat: result.format,
                        width: result.width,
                        height: result.height
                    }

                    if (finalConfig.logDetails) {
                        console.log(
                            `[ImageCompress] ✅ Compression successful: ${result.reduction}% reduction`
                        )
                    }
                } else {
                    if (finalConfig.logDetails) {
                        console.log(
                            '[ImageCompress] Image already optimized, using original'
                        )
                    }
                }

                next()
            } catch (compressionError) {
                // Log error but don't block upload
                console.error(
                    '[ImageCompress] Compression error:',
                    compressionError instanceof Error
                        ? compressionError.message
                        : String(compressionError)
                )

                // Continue with uncompressed image
                next()
            }
        } catch (error) {
            console.error(
                '[ImageCompress] Middleware error:',
                error instanceof Error ? error.message : String(error)
            )

            // Don't block on middleware errors
            next()
        }
    }
}

/**
 * Simple image compression middleware (default configuration)
 *
 * Usage:
 * import { imageCompressMiddleware } from '../middlewares/imageCompress'
 * router.post('/upload', imageCompressMiddleware, upload.single('file'), handler)
 */
export const imageCompressMiddleware = createImageCompressMiddleware()

/**
 * Create a custom compression middleware with specific preset
 *
 * @param preset - Compression preset ('high', 'balanced', 'aggressive', 'mobile', 'web')
 * @returns Express middleware function
 */
export function createCustomCompressionMiddleware(
    preset: 'high' | 'balanced' | 'aggressive' | 'mobile' | 'web' = 'balanced'
) {
    const presets: Record<string, Partial<CompressionConfig>> = {
        high: {
            maxWidth: 4096,
            maxHeight: 4096,
            jpegQuality: 90,
            convertPngToJpeg: false,
            convertToWebP: false
        },
        balanced: {
            maxWidth: 2048,
            maxHeight: 2048,
            jpegQuality: 80,
            convertPngToJpeg: true,
            convertToWebP: false
        },
        aggressive: {
            maxWidth: 1024,
            maxHeight: 1024,
            jpegQuality: 65,
            convertPngToJpeg: true,
            convertToWebP: true
        },
        mobile: {
            maxWidth: 1280,
            maxHeight: 1280,
            jpegQuality: 75,
            convertPngToJpeg: true,
            convertToWebP: true
        },
        web: {
            maxWidth: 2048,
            maxHeight: 2048,
            jpegQuality: 80,
            convertPngToJpeg: true,
            convertToWebP: true
        }
    }

    return createImageCompressMiddleware(presets[preset])
}

/**
 * Middleware to get compression metadata from request
 *
 * Usage after imageCompressMiddleware:
 * router.post('/upload', imageCompressMiddleware, upload.single('file'), (req, res) => {
 *   const metadata = getCompressionMetadata(req)
 *   // Use metadata for logging or API response
 * })
 */
export function getCompressionMetadata(req: Request): Record<string, any> | null {
    return (req as any).imageCompressionResult || null
}

/**
 * Configuration documentation
 */
export const COMPRESSION_CONFIG_DOCS = `
# Image Compression Middleware Configuration

Set these environment variables to customize image compression behavior:

## Enabled/Disabled
IMAGE_COMPRESSION_ENABLED=true          # Enable/disable all compression (default: true)

## File Size Limits
IMAGE_COMPRESSION_MIN_SIZE=102400       # Skip compression if file < size (bytes, default: 100KB)
IMAGE_COMPRESSION_MAX_SIZE=104857600    # Skip compression if file > size (bytes, default: 100MB)

## Dimension Limits
IMAGE_MAX_WIDTH=2048                    # Maximum image width (pixels, default: 2048)
IMAGE_MAX_HEIGHT=2048                   # Maximum image height (pixels, default: 2048)

## Format Conversion
IMAGE_JPEG_QUALITY=80                   # JPEG compression quality (0-100, default: 80)
IMAGE_CONVERT_PNG_TO_JPEG=true          # Convert PNG to JPEG when possible (default: true)
IMAGE_CONVERT_TO_WEBP=false             # Convert to WebP format (default: false)

## Logging
IMAGE_COMPRESSION_LOG=true              # Log compression details (default: true)

## Feature Flags
COMPRESS_RESUME_IMAGES=true             # Compress images in resume uploads (default: true)

# Examples:
# Aggressive compression:
IMAGE_MAX_WIDTH=1024
IMAGE_MAX_HEIGHT=1024
IMAGE_JPEG_QUALITY=65
IMAGE_CONVERT_TO_WEBP=true

# Conservative compression:
IMAGE_MAX_WIDTH=4096
IMAGE_MAX_HEIGHT=4096
IMAGE_JPEG_QUALITY=90
IMAGE_CONVERT_TO_WEBP=false
`
