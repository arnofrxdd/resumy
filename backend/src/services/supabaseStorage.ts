import { StorageEngine } from 'multer'
import { supabase } from './supabase'
import { Request } from 'express'
import { Readable } from 'stream'

export interface SupabaseStorageOptions {
    bucket?: string
    path?: string | ((req: Request, file: Express.Multer.File, cb: (error: Error | null, path?: string) => void) => void)
    acl?: 'public-read' | 'private'
}

/**
 * Sanitizes the filename while preserving the folder path structure.
 * This prevents special characters from breaking Supabase storage URLs.
 */
function sanitizeFileName(fileName: string): string {
    const parts = fileName.split('/')
    const file = parts.pop() || ''
    const safeFile = file.replace(/[^a-zA-Z0-9._-]/g, "_")
    return [...parts, safeFile].join('/')
}

/**
 * Custom Multer Storage Engine for Supabase
 * Streams files directly to Supabase Storage without buffering in memory
 *
 * Usage:
 * const storage = supabaseStorage({
 * bucket: 'resumes',
 * path: (req, file, cb) => {
 * const userId = req.user?.id
 * const filename = `${userId}/${Date.now()}-${file.originalname}`
 * cb(null, filename)
 * }
 * })
 * const upload = multer({ storage })
 */
export function supabaseStorage(options: SupabaseStorageOptions = {}): StorageEngine {
    const bucket = options.bucket || 'resumes'
    const getPath = typeof options.path === 'function' ? options.path : undefined
    const staticPath = typeof options.path === 'string' ? options.path : undefined

    return {
        _handleFile(req: Request, file: Express.Multer.File, cb: (error: Error | null, info?: Partial<Express.Multer.File>) => void) {
            // Determine the upload path
            if (getPath) {
                getPath(req, file, async (err, path) => {
                    if (err) return cb(err)
                    try {
                        const safePath = sanitizeFileName(path || file.originalname)
                        const uploadInfo = await performUpload(file.stream, safePath, file.mimetype, bucket)
                        
                        cb(null, {
                            size: uploadInfo.size,
                            bucket,
                            path: uploadInfo.path,
                            mimetype: file.mimetype
                        } as any)
                    } catch (error) {
                        cb(error instanceof Error ? error : new Error(String(error)))
                    }
                })
            } else {
                const rawPath = staticPath || file.originalname
                const safePath = sanitizeFileName(rawPath)
                
                performUpload(file.stream, safePath, file.mimetype, bucket)
                    .then((uploadInfo) => {
                        cb(null, {
                            size: uploadInfo.size,
                            bucket,
                            path: uploadInfo.path,
                            mimetype: file.mimetype
                        } as any)
                    })
                    .catch((error) => {
                        cb(error instanceof Error ? error : new Error(String(error)))
                    })
            }
        },

        _removeFile(req: Request, file: any, cb: (error: Error | null) => void) {
            // Implement file removal if needed
            if (file.path) {
                supabase.storage
                    .from(bucket)
                    .remove([file.path])
                    .then(() => cb(null))
                    .catch((err) => cb(err))
            } else {
                cb(null)
            }
        }
    }
}

/**
 * Perform the actual stream upload to Supabase
 */
async function performUpload(
    stream: Readable,
    filePath: string,
    contentType: string,
    bucket: string
): Promise<{ path: string; size: number }> {
    const chunks: Buffer[] = []
    let totalSize = 0

    return new Promise((resolve, reject) => {
        // Track data as it flows through
        stream.on('data', (chunk: Buffer) => {
            chunks.push(chunk)
            totalSize += chunk.length
        })

        stream.on('error', (err) => {
            reject(new Error(`Stream error: ${err.message}`))
        })

        stream.on('end', async () => {
            try {
                // Upload the collected data to Supabase
                const buffer = Buffer.concat(chunks, totalSize)

                const { data, error } = await supabase.storage
                    .from(bucket)
                    .upload(filePath, buffer, {
                        contentType,
                        upsert: false
                    })

                if (error) {
                    // If bucket doesn't exist, try to create it
                    if ((error.message || '').includes('bucket') || (error.message || '').includes('not found')) {
                        try {
                            await supabase.storage.createBucket(bucket, { public: false })
                            // Retry upload
                            const retryRes = await supabase.storage
                                .from(bucket)
                                .upload(filePath, buffer, {
                                    contentType,
                                    upsert: false
                                })

                            if (retryRes.error) {
                                reject(new Error(`Upload failed after bucket creation: ${retryRes.error.message}`))
                            } else {
                                resolve({
                                    path: retryRes.data.path,
                                    size: totalSize
                                })
                            }
                        } catch (createErr) {
                            reject(new Error(`Failed to create bucket: ${(createErr as any)?.message || createErr}`))
                        }
                    } else {
                        reject(new Error(`Upload failed: ${error.message}`))
                    }
                } else {
                    resolve({
                        path: data.path,
                        size: totalSize
                    })
                }
            } catch (err) {
                reject(err instanceof Error ? err : new Error(String(err)))
            }
        })
    })
}