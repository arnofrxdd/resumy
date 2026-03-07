import sharp from 'sharp'

/**
 * Image Compression Service
 *
 * Handles automatic compression of image files before upload to Supabase.
 * Supports multiple formats (JPEG, PNG, WebP, GIF, TIFF) with configurable quality.
 *
 * Features:
 * - JPEG compression at ~80% quality
 * - PNG optimization
 * - WebP conversion for supported browsers
 * - Automatic resizing of large images (max 2048px width)
 * - Maintains aspect ratio
 * - Size reduction estimation
 */

interface CompressionOptions {
    /**
     * Maximum width in pixels (default: 2048)
     * Images wider than this will be resized
     */
    maxWidth?: number

    /**
     * Maximum height in pixels (default: 2048)
     * Images taller than this will be resized
     */
    maxHeight?: number

    /**
     * JPEG quality (0-100, default: 80)
     * Higher values = better quality but larger file size
     */
    jpegQuality?: number

    /**
     * PNG compression level (0-9, default: 9)
     * Higher values = better compression but slower
     */
    pngCompression?: number

    /**
     * WebP quality (0-100, default: 80)
     * Higher values = better quality but larger file size
     */
    webpQuality?: number

    /**
     * Whether to convert to WebP format
     * WebP provides better compression than JPEG/PNG
     */
    convertToWebP?: boolean

    /**
     * Whether to convert PNG to JPEG if no transparency
     * JPEG is usually smaller than PNG for photos
     */
    convertPngToJpeg?: boolean
}

interface CompressionResult {
    buffer: Buffer
    format: string
    originalSize: number
    compressedSize: number
    reduction: number // percentage
    width: number
    height: number
    mimeType: string
}

/**
 * Default compression settings
 * Balance between quality and file size
 */
const DEFAULT_COMPRESSION_OPTIONS: CompressionOptions = {
    maxWidth: 2048,
    maxHeight: 2048,
    jpegQuality: 80,
    pngCompression: 9,
    webpQuality: 80,
    convertToWebP: false, // Default to false for broader compatibility
    convertPngToJpeg: true
}

/**
 * Image formats that are compressible
 */
const COMPRESSIBLE_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'tiff', 'tif']

/**
 * MIME type mappings for compressed formats
 */
const MIME_TYPE_MAP: Record<string, string> = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    tiff: 'image/tiff',
    tif: 'image/tiff'
}

/**
 * Compress image buffer
 *
 * @param buffer - Raw image buffer
 * @param options - Compression options
 * @returns Compression result with buffer and metadata
 */
export async function compressImage(
    buffer: Buffer,
    options: CompressionOptions = {}
): Promise<CompressionResult> {
    const config = { ...DEFAULT_COMPRESSION_OPTIONS, ...options }
    const originalSize = buffer.length

    try {
        // Detect image format
        const metadata = await sharp(buffer).metadata()
        const originalFormat = metadata.format?.toLowerCase() || ''

        // Check if image is compressible
        if (!COMPRESSIBLE_FORMATS.includes(originalFormat)) {
            throw new Error(`Unsupported image format: ${originalFormat}`)
        }

        // Start building sharp pipeline
        let pipeline = sharp(buffer)

        // Calculate resize dimensions to maintain aspect ratio
        const width = metadata.width || 0
        const height = metadata.height || 0

        // Resize if image exceeds max dimensions
        if (width > config.maxWidth! || height > config.maxHeight!) {
            pipeline = pipeline.resize(config.maxWidth, config.maxHeight, {
                fit: 'inside',
                withoutEnlargement: true
            })
        }

        // Determine output format and compress
        let outputFormat = originalFormat
        let compressed: Buffer

        // Check if image has alpha channel (transparency)
        const hasAlpha = metadata.hasAlpha || false

        // Convert PNG to JPEG if possible and enabled
        if (
            originalFormat === 'png' &&
            config.convertPngToJpeg &&
            !hasAlpha
        ) {
            compressed = await pipeline
                .jpeg({ quality: config.jpegQuality, progressive: true })
                .toBuffer()
            outputFormat = 'jpeg'
        }
        // Convert to WebP if enabled (best compression)
        else if (config.convertToWebP) {
            compressed = await pipeline
                .webp({ quality: config.webpQuality })
                .toBuffer()
            outputFormat = 'webp'
        }
        // Compress in original format
        else if (originalFormat === 'png') {
            compressed = await pipeline
                .png({ compressionLevel: config.pngCompression })
                .toBuffer()
        } else if (originalFormat === 'gif') {
            // GIF compression (no additional options, sharp handles optimization)
            compressed = await pipeline
                .gif()
                .toBuffer()
        } else if (originalFormat === 'tiff' || originalFormat === 'tif') {
            // Convert TIFF to JPEG for better compression
            compressed = await pipeline
                .jpeg({ quality: config.jpegQuality, progressive: true })
                .toBuffer()
            outputFormat = 'jpeg'
        } else {
            // JPEG or WebP - use JPEG quality
            compressed = await pipeline
                .jpeg({ quality: config.jpegQuality, progressive: true })
                .toBuffer()
            outputFormat = 'jpeg'
        }

        // Get final metadata
        const finalMetadata = await sharp(compressed).metadata()
        const finalWidth = finalMetadata.width || width
        const finalHeight = finalMetadata.height || height

        // Calculate reduction percentage
        const reduction = Math.round(
            ((originalSize - compressed.length) / originalSize) * 100
        )

        // Log compression stats
        console.log(`[ImageCompress] ${originalFormat.toUpperCase()} → ${outputFormat.toUpperCase()}`)
        console.log(`[ImageCompress] Size: ${formatBytes(originalSize)} → ${formatBytes(compressed.length)} (${reduction}% reduction)`)
        console.log(`[ImageCompress] Dimensions: ${width}x${height} → ${finalWidth}x${finalHeight}`)

        return {
            buffer: compressed,
            format: outputFormat,
            originalSize,
            compressedSize: compressed.length,
            reduction,
            width: finalWidth,
            height: finalHeight,
            mimeType: MIME_TYPE_MAP[outputFormat] || 'application/octet-stream'
        }
    } catch (error) {
        console.error('[ImageCompress] Compression failed:', error)
        throw new Error(
            `Image compression failed: ${error instanceof Error ? error.message : String(error)}`
        )
    }
}

/**
 * Check if a file is likely an image based on MIME type
 *
 * @param mimeType - File MIME type
 * @returns True if file is likely an image
 */
export function isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/')
}

/**
 * Get recommended MIME type for file after compression
 *
 * @param originalMimeType - Original file MIME type
 * @param options - Compression options
 * @returns Recommended MIME type
 */
export function getCompressedMimeType(
    originalMimeType: string,
    options: CompressionOptions = {}
): string {
    const config = { ...DEFAULT_COMPRESSION_OPTIONS, ...options }

    // Extract format from MIME type
    const [, format] = originalMimeType.split('/')

    if (config.convertToWebP) {
        return 'image/webp'
    }

    if (format === 'png' && config.convertPngToJpeg) {
        return 'image/jpeg'
    }

    return originalMimeType
}

/**
 * Format bytes as human-readable string
 *
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get compression statistics
 *
 * @returns Current compression configuration
 */
export function getCompressionConfig(): CompressionOptions {
    return { ...DEFAULT_COMPRESSION_OPTIONS }
}

/**
 * Estimate potential compression for an image type
 *
 * @param mimeType - Image MIME type
 * @param options - Compression options
 * @returns Estimated reduction percentage
 */
export function estimateCompression(
    mimeType: string,
    options: CompressionOptions = {}
): number {
    const config = { ...DEFAULT_COMPRESSION_OPTIONS, ...options }
    const format = mimeType.split('/')[1]?.toLowerCase() || ''

    // Rough estimates based on format
    const estimates: Record<string, number> = {
        jpeg: 15, // JPEG already compressed
        jpg: 15,
        png: config.convertPngToJpeg ? 70 : 40, // PNG to JPEG saves more
        gif: 50,
        tiff: 85, // TIFF to JPEG saves a lot
        tif: 85,
        webp: 20 // WebP already well compressed
    }

    return estimates[format] || 30 // Default estimate
}

/**
 * Get supported output formats
 *
 * @returns Array of supported MIME types
 */
export function getSupportedFormats(): string[] {
    return Object.values(MIME_TYPE_MAP)
}

/**
 * Get default compression presets
 *
 * @returns Object with preset configurations
 */
export function getCompressionPresets(): Record<string, CompressionOptions> {
    return {
        /**
         * High quality - minimal compression, larger files
         * For premium/high-res images
         */
        high: {
            maxWidth: 4096,
            maxHeight: 4096,
            jpegQuality: 90,
            pngCompression: 6,
            webpQuality: 90,
            convertToWebP: false
        },

        /**
         * Balanced - good quality with decent compression
         * Recommended for most use cases
         */
        balanced: {
            maxWidth: 2048,
            maxHeight: 2048,
            jpegQuality: 80,
            pngCompression: 9,
            webpQuality: 80,
            convertToWebP: false
        },

        /**
         * Aggressive - significant compression for small file sizes
         * For thumbnails or bandwidth-constrained scenarios
         */
        aggressive: {
            maxWidth: 1024,
            maxHeight: 1024,
            jpegQuality: 65,
            pngCompression: 9,
            webpQuality: 65,
            convertToWebP: true,
            convertPngToJpeg: true
        },

        /**
         * Mobile optimized - suitable for mobile viewing
         */
        mobile: {
            maxWidth: 1280,
            maxHeight: 1280,
            jpegQuality: 75,
            pngCompression: 9,
            webpQuality: 75,
            convertToWebP: true,
            convertPngToJpeg: true
        },

        /**
         * Web optimized - for general web use
         */
        web: {
            maxWidth: 2048,
            maxHeight: 2048,
            jpegQuality: 80,
            pngCompression: 9,
            webpQuality: 80,
            convertToWebP: true,
            convertPngToJpeg: true
        }
    }
}

/**
 * Apply compression preset
 *
 * @param buffer - Image buffer
 * @param preset - Preset name ('high', 'balanced', 'aggressive', 'mobile', 'web')
 * @returns Compression result
 */
export async function compressWithPreset(
    buffer: Buffer,
    preset: keyof ReturnType<typeof getCompressionPresets> = 'balanced'
): Promise<CompressionResult> {
    const presets = getCompressionPresets()
    const options = presets[preset]

    if (!options) {
        throw new Error(`Unknown compression preset: ${preset}`)
    }

    return compressImage(buffer, options)
}
