import { v4 as uuidv4 } from 'uuid'

export interface TokenUsage {
    id: string
    userId: string
    service: 'openai' | 'gemini'
    inputTokens: number
    outputTokens: number
    totalTokens: number
    cost: number
    timestamp: Date
    endpoint: string
    success: boolean
    error?: string
}

export interface DailyUsage {
    date: string
    userId: string
    totalTokens: number
    totalCost: number
    services: {
        openai: { tokens: number; cost: number; requests: number }
        gemini: { tokens: number; cost: number; requests: number }
    }
}

export class TokenTracker {
    private usageStore: TokenUsage[] = []
    private dailyUsage: Map<string, DailyUsage> = new Map()

    async recordUsage(
        service: 'openai' | 'gemini',
        tokens: { input: number; output: number; total: number },
        cost: number,
        userId: string = 'anonymous',
        endpoint: string = 'generate-questions',
        success: boolean = true,
        error?: string
    ): Promise<TokenUsage> {
        const usage: TokenUsage = {
            id: uuidv4(),
            userId,
            service,
            inputTokens: tokens.input,
            outputTokens: tokens.output,
            totalTokens: tokens.total,
            cost,
            timestamp: new Date(),
            endpoint,
            success,
            error
        }

        this.usageStore.push(usage)
        this.updateDailyUsage(usage)

        console.log(`Token usage recorded: ${service} - ${tokens.total} tokens - $${cost.toFixed(6)} - User: ${userId}`)

        return usage
    }

    private updateDailyUsage(usage: TokenUsage): void {
        const dateKey = usage.timestamp.toISOString().split('T')[0]
        const userDateKey = `${usage.userId}_${dateKey}`

        let daily = this.dailyUsage.get(userDateKey)
        if (!daily) {
            daily = {
                date: dateKey,
                userId: usage.userId,
                totalTokens: 0,
                totalCost: 0,
                services: {
                    openai: { tokens: 0, cost: 0, requests: 0 },
                    gemini: { tokens: 0, cost: 0, requests: 0 }
                }
            }
            this.dailyUsage.set(userDateKey, daily)
        }

        daily.totalTokens += usage.totalTokens
        daily.totalCost += usage.cost
        daily.services[usage.service].tokens += usage.totalTokens
        daily.services[usage.service].cost += usage.cost
        daily.services[usage.service].requests += 1
    }

    getUserDailyUsage(userId: string, date?: string) {
        const dateKey = date || new Date().toISOString().split('T')[0]
        const userDateKey = `${userId}_${dateKey}`
        return this.dailyUsage.get(userDateKey) || null
    }

    getUserTotalUsage(userId: string, days: number = 30) {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)

        const userUsages = this.usageStore.filter(usage => usage.userId === userId && usage.timestamp >= cutoffDate)

        const totalTokens = userUsages.reduce((sum, usage) => sum + usage.totalTokens, 0)
        const totalCost = userUsages.reduce((sum, usage) => sum + usage.cost, 0)

        const services = {
            openai: { tokens: 0, cost: 0, requests: 0 },
            gemini: { tokens: 0, cost: 0, requests: 0 }
        }

        userUsages.forEach(usage => {
            services[usage.service].tokens += usage.totalTokens
            services[usage.service].cost += usage.cost
            services[usage.service].requests += 1
        })

        return { totalTokens, totalCost, averageDailyTokens: Math.round(totalTokens / days), services }
    }

    checkTokenLimit(userId: string, dailyLimit: number = 100000) {
        const today = new Date().toISOString().split('T')[0]
        const daily = this.getUserDailyUsage(userId, today)

        const currentUsage = daily?.totalTokens || 0
        const canProceed = currentUsage < dailyLimit
        const remainingTokens = Math.max(0, dailyLimit - currentUsage)

        const resetTime = new Date()
        resetTime.setHours(23, 59, 59, 999)

        return { canProceed, currentUsage, remainingTokens, dailyLimit, resetTime }
    }

    getUsageStats() {
        const totalRequests = this.usageStore.length
        const totalTokens = this.usageStore.reduce((sum, usage) => sum + usage.totalTokens, 0)
        const totalCost = this.usageStore.reduce((sum, usage) => sum + usage.cost, 0)
        const averageCostPerToken = totalTokens > 0 ? totalCost / totalTokens : 0

        const serviceBreakdown = {
            openai: { requests: 0, tokens: 0, cost: 0 },
            gemini: { requests: 0, tokens: 0, cost: 0 }
        }

        this.usageStore.forEach(usage => {
            serviceBreakdown[usage.service].requests += 1
            serviceBreakdown[usage.service].tokens += usage.totalTokens
            serviceBreakdown[usage.service].cost += usage.cost
        })

        return { totalRequests, totalTokens, totalCost, averageCostPerToken, serviceBreakdown }
    }

    exportUsageData(startDate?: Date, endDate?: Date) {
        let filtered = this.usageStore
        if (startDate) filtered = filtered.filter(usage => usage.timestamp >= startDate)
        if (endDate) filtered = filtered.filter(usage => usage.timestamp <= endDate)
        return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }

    cleanupOldData(): void {
        const cutoffDate = new Date(); cutoffDate.setDate(cutoffDate.getDate() - 90)
        const initialCount = this.usageStore.length
        this.usageStore = this.usageStore.filter(usage => usage.timestamp >= cutoffDate)
        const toDelete: string[] = []
        this.dailyUsage.forEach((usage, key) => { if (usage.date < cutoffDate.toISOString().split('T')[0]) toDelete.push(key) })
        toDelete.forEach(k => this.dailyUsage.delete(k))
        console.log(`Cleaned up ${initialCount - this.usageStore.length} old usage records`)
    }
}
