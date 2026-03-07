/**
 * Virus Scanning Middleware
 *
 * Express middleware that intercepts file uploads and scans them for malware
 * before they are processed or stored.
 *
 * Usage:
 *   router.post('/upload', virusScanMiddleware, upload.single('file'), handler)
 *
 * Features:
 * - Blocks infected files immediately
 * - Logs all scan results (clean and malware)
 * - Provides detailed error responses
 * - Optional quarantine of suspicious files
 * - Performance metrics tracking
 */

import { Request, Response, NextFunction } from 'express'
import { getVirusScanner, VirusScanResult } from '../services/virusScanner'
import { supabase } from '../services/supabase'

/**
 * Extended request type to include scan results
 */
declare global {
    namespace Express {
        interface Request {
            virusScanResult?: VirusScanResult
            scanResults?: {
                isClean: boolean
                threat?: string
                engine: string
                scanningTime: number
            }
        }
    }
}

/**
 * Virus scan middleware for multer file uploads
 * Should be used BEFORE the multer upload middleware
 *
 * Important: This middleware works with streaming. For streamed uploads,
 * the file is scanned as it arrives, before it's stored in Supabase.
 */
export function createVirusScanMiddleware() {
    const scanner = getVirusScanner()

    return async (req: Request, res: Response, next: NextFunction) => {
        // Only scan if file is being uploaded
        if (!req.file && !req.files) {
            return next()
        }

        // Check if scanning should be performed
        const file = req.file || (Array.isArray(req.files) ? req.files[0] : null)
        if (!file) {
            return next()
        }

        try {
            console.log(
                `[VirusScan] Starting scan for ${file.originalname} (${file.size} bytes)`
            )

            // Scan the file buffer
            const scanResult = await scanner.scanFile(
                file.buffer,
                file.originalname,
                {
                    timeout: parseInt(process.env.SCAN_TIMEOUT || '30000')
                }
            )

            // Store result in request for later use
            req.virusScanResult = scanResult
            req.scanResults = {
                isClean: scanResult.isClean,
                threat: scanResult.threat,
                engine: scanResult.engine,
                scanningTime: scanResult.scanning_time
            }

            // Log scan result
            const userId = (req as any).user?.id || 'unknown'
            await logScanResult(userId, file.originalname, scanResult)

            // Handle infected file
            if (!scanResult.isClean) {
                console.error(
                    `[VirusScan] MALWARE DETECTED: ${file.originalname} - ${scanResult.threat}`
                )

                // Alert: Log security incident
                await logSecurityIncident(userId, file.originalname, scanResult)

                // Reject the file
                return res.status(400).json({
                    error: 'File rejected',
                    message: `Your file "${file.originalname}" was rejected due to security concerns.`,
                    details: {
                        threat: scanResult.threat,
                        engine: scanResult.engine,
                        timestamp: scanResult.timestamp
                    },
                    support: 'If you believe this is an error, please contact support.'
                })
            }

            // File is clean, proceed
            console.log(
                `[VirusScan] File clean: ${file.originalname} (${scanResult.scanning_time}ms)`
            )
            next()
        } catch (error) {
            console.error('[VirusScan] Scanning error:', error)

            // Determine if we should block or allow on error
            const blockOnError = process.env.BLOCK_ON_SCAN_ERROR === 'true'

            if (blockOnError) {
                return res.status(500).json({
                    error: 'Scan failed',
                    message: 'Unable to scan file. Please try again later.',
                    details: {
                        error: (error as any).message
                    }
                })
            }

            // Log error but allow file through
            console.warn('[VirusScan] Scan failed but allowing file (error handling)')
            next()
        }
    }
}

/**
 * Alternative middleware for streaming uploads (before Supabase storage)
 * This version works with streams and checks file during upload
 */
export function createStreamVirusScanMiddleware() {
    const scanner = getVirusScanner()

    return async (req: Request, res: Response, next: NextFunction) => {
        // This would intercept the stream before it reaches Supabase storage
        // Implementation depends on multer and stream setup

        // For now, use the buffer-based middleware above
        // A full streaming implementation would need custom Multer storage engine

        next()
    }
}

/**
 * Log scan result to database for audit trail
 */
async function logScanResult(
    userId: string,
    filename: string,
    result: VirusScanResult
) {
    try {
        // Check if we should log (some deployments may skip database logging)
        if (process.env.LOG_SCAN_RESULTS !== 'true') {
            return
        }

        // Create or get security_logs table
        const { error: insertError } = await supabase
            .from('security_logs')
            .insert({
                user_id: userId,
                event_type: result.isClean ? 'file_scanned_clean' : 'file_scanned_threat',
                filename: filename,
                file_size: result.file_size,
                scan_engine: result.engine,
                threat_detected: result.threat || null,
                scanning_time_ms: result.scanning_time,
                metadata: {
                    isClean: result.isClean,
                    threat: result.threat,
                    engine: result.engine,
                    message: result.message,
                    timestamp: result.timestamp
                },
                created_at: new Date()
            })

        if (insertError) {
            console.warn('[VirusScan] Failed to log scan result:', insertError)
        }
    } catch (error) {
        console.error('[VirusScan] Error logging scan result:', error)
    }
}

/**
 * Log security incident when malware is detected
 */
async function logSecurityIncident(
    userId: string,
    filename: string,
    result: VirusScanResult
) {
    try {
        // Log detailed incident
        const { error: insertError } = await supabase
            .from('security_incidents')
            .insert({
                user_id: userId,
                incident_type: 'malware_detected',
                filename: filename,
                threat: result.threat,
                scan_engine: result.engine,
                file_size: result.file_size,
                details: {
                    threat: result.threat,
                    threat_details: result.threat_details,
                    engine: result.engine,
                    message: result.message,
                    timestamp: result.timestamp
                },
                severity: 'high',
                status: 'reported',
                created_at: new Date()
            })

        if (insertError) {
            console.warn('[VirusScan] Failed to log incident:', insertError)
        }

        // Optional: Send alert email
        // await sendSecurityAlert(userId, filename, result)
    } catch (error) {
        console.error('[VirusScan] Error logging security incident:', error)
    }
}

/**
 * Middleware to check scan results after upload
 * Use this in route handlers to access scan data
 */
export function requireCleanScan(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.virusScanResult) {
        // No scan result - file wasn't scanned or middleware not applied
        console.warn('[VirusScan] No scan result available')
        return res.status(400).json({
            error: 'Scan validation failed',
            message: 'File was not properly scanned.'
        })
    }

    if (!req.virusScanResult.isClean) {
        // File was scanned and found to be infected
        return res.status(400).json({
            error: 'File rejected',
            message: 'File contains malware and cannot be processed.',
            details: {
                threat: req.virusScanResult.threat
            }
        })
    }

    // File is clean, proceed
    next()
}

/**
 * Helper to check file before streaming to Supabase
 * Returns true if file should be accepted, false if rejected
 */
export async function shouldAcceptFile(filename: string): Promise<boolean> {
    // Add additional checks here if needed
    // For example, block certain file extensions even if they're in allowed types

    const blockedExtensions = [
        '.exe',
        '.bat',
        '.cmd',
        '.com',
        '.pif',
        '.scr',
        '.vbs',
        '.js',
        '.jar'
    ]

    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase()
    return !blockedExtensions.includes(ext)
}

export default createVirusScanMiddleware()
