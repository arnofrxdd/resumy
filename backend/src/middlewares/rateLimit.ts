import { Request, Response, NextFunction } from 'express'

export function rateLimit(maxRequests: number = 10, windowMs: number = 60 * 60 * 1000) { // 1 hour default
    const requests = new Map<string, { count: number; resetTime: number }>()

    return (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id || req.ip || 'unknown'
        const now = Date.now()

        let userRequests = requests.get(userId)

        // Start new window
        if (!userRequests || now > userRequests.resetTime) {
            const resetTime = now + windowMs
            requests.set(userId, { count: 1, resetTime })

            // Provide standard rate-limit response headers for clients to consume
            res.setHeader('X-RateLimit-Limit', String(maxRequests))
            res.setHeader('X-RateLimit-Remaining', String(maxRequests - 1))
            res.setHeader('X-RateLimit-Reset', String(Math.floor(resetTime / 1000)))

            return next()
        }

        // Remaining allowance
        const remaining = Math.max(0, maxRequests - userRequests.count)

        // Set headers on each response path so clients can inspect remaining quota
        res.setHeader('X-RateLimit-Limit', String(maxRequests))
        res.setHeader('X-RateLimit-Remaining', String(remaining))
        res.setHeader('X-RateLimit-Reset', String(Math.floor(userRequests.resetTime / 1000)))

        if (userRequests.count >= maxRequests) {
            // how long until window resets (seconds)
            const retryAfterSec = Math.ceil((userRequests.resetTime - now) / 1000)
            res.setHeader('Retry-After', String(retryAfterSec))

            return res.status(429).json({
                error: 'Too many requests. Please try again later.',
                retryAfter: retryAfterSec,
                limit: maxRequests,
                remaining: 0,
                resetAt: Math.floor(userRequests.resetTime / 1000)
            })
        }

        // consume one request
        userRequests.count++
        next()
    }
}