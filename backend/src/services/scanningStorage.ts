/**
 * Virus-Scanning Multer Storage Engine
 *
 * Custom Multer storage engine that scans files for viruses before
 * uploading to Supabase. Files are scanned during the streaming process.
 *
 * This engine combines security scanning with efficient streaming upload.
 */

import { StorageEngine } from 'multer'
import { Request } from 'express'
import { Readable } from 'stream'
import { getVirusScanner, VirusScanResult } from '../services/virusScanner'
import { supabase } from '../services/supabase'

export interface ScanningStorageOptions {
    bucket: string
    path: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, path?: string) => void
    ) => void
    enableScanning?: boolean
    blockOnScanError?: boolean
}

/**
 * Create scanning storage engine
 * Scans files and uploads to Supabase
 */
export function createScanningStorage(
    options: ScanningStorageOptions
): StorageEngine {
    return {
        _handleFile(req, file, cb) {
            // Buffer the file to scan it
            const chunks: Buffer[] = []
            let fileSize = 0

            file.stream.on('data', (chunk: Buffer) => {
                chunks.push(chunk)
                fileSize += chunk.length

                // Check size limit (prevent memory overflow)
                const maxSize = 100 * 1024 * 1024 // 100MB max
                if (fileSize > maxSize) {
                    file.stream.destroy()
                    cb(new Error('File too large'))
                }
            })

            file.stream.on('end', async () => {
                try {
                    const buffer = Buffer.concat(chunks)

                    // Scan the file
                    const scanner = getVirusScanner()
                    const scanResult = await scanner.scanFile(
                        buffer,
                        file.originalname,
                        {
                            timeout: parseInt(process.env.SCAN_TIMEOUT || '30000')
                        }
                    )

                        // Store scan result in request for later use
                        ; (req as any).virusScanResult = scanResult

                    // Log scan result
                    const userId = (req as any).user?.id || 'unknown'
                    await logScanResult(userId, file.originalname, scanResult)

                    // Block if infected
                    if (!scanResult.isClean) {
                        console.error(
                            `[ScanningStorage] MALWARE DETECTED: ${file.originalname}`
                        )
                        await logSecurityIncident(userId, file.originalname, scanResult)
                        return cb(new Error(`Malware detected: ${scanResult.threat}`))
                    }

                    // File is clean, proceed with upload
                    console.log(
                        `[ScanningStorage] File clean: ${file.originalname}, uploading to Supabase...`
                    )

                    // Get upload path
                    options.path(req, file, async (pathError, uploadPath) => {
                        if (pathError) {
                            return cb(pathError)
                        }

                        try {
                            // Upload to Supabase
                            const { data, error: uploadError } = await supabase.storage
                                .from(options.bucket)
                                .upload(uploadPath!, buffer, {
                                    contentType: file.mimetype,
                                    upsert: false
                                })

                            if (uploadError) {
                                console.error(
                                    '[ScanningStorage] Upload failed:',
                                    uploadError
                                )
                                return cb(uploadError)
                            }

                            // Success
                            ; (file as any).path = uploadPath
                                ; (file as any).bucket = options.bucket
                                ; (file as any).scanResult = scanResult
                                ; (file as any).size = buffer.length

                            cb(null, file as any)
                        } catch (uploadErr) {
                            console.error('[ScanningStorage] Upload exception:', uploadErr)
                            cb(uploadErr as Error)
                        }
                    })
                } catch (error) {
                    console.error('[ScanningStorage] Processing error:', error)
                    cb(error as Error)
                }
            })

            file.stream.on('error', (error) => {
                console.error('[ScanningStorage] Stream error:', error)
                cb(error)
            })
        },

        _removeFile(req, file, cb) {
            // Optional: implement file removal if needed
            cb(null)
        }
    }
}

/**
 * Log scan result
 */
async function logScanResult(
    userId: string,
    filename: string,
    result: VirusScanResult
) {
    try {
        if (process.env.LOG_SCAN_RESULTS !== 'true') {
            return
        }

        const { error } = await supabase.from('security_logs').insert({
            user_id: userId,
            event_type: result.isClean ? 'file_scanned_clean' : 'file_scanned_threat',
            filename: filename,
            file_size: result.file_size,
            scan_engine: result.engine,
            threat_detected: result.threat || null,
            scanning_time_ms: result.scanning_time,
            metadata: {
                isClean: result.isClean,
                engine: result.engine,
                message: result.message
            },
            created_at: new Date()
        })

        if (error) {
            console.warn('[ScanningStorage] Failed to log result:', error)
        }
    } catch (error) {
        console.warn('[ScanningStorage] Logging error:', error)
    }
}

/**
 * Log security incident
 */
async function logSecurityIncident(
    userId: string,
    filename: string,
    result: VirusScanResult
) {
    try {
        const { error } = await supabase.from('security_incidents').insert({
            user_id: userId,
            incident_type: 'malware_detected',
            filename: filename,
            threat: result.threat,
            scan_engine: result.engine,
            file_size: result.file_size,
            details: {
                threat: result.threat,
                engine: result.engine,
                message: result.message,
                timestamp: result.timestamp
            },
            severity: 'high',
            status: 'reported',
            created_at: new Date()
        })

        if (error) {
            console.warn('[ScanningStorage] Failed to log incident:', error)
        }
    } catch (error) {
        console.warn('[ScanningStorage] Incident logging error:', error)
    }
}

export default createScanningStorage
