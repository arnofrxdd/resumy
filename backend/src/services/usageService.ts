import { supabase } from './supabase';
import prisma from './prisma';
import { PLAN_LIMITS, PlanType, FeatureType } from '../config/limits';

export const usageService = {
    async getUserPlan(userId: string): Promise<PlanType> {
        // Try to get plan from Supabase profiles first
        const { data, error } = await supabase
            .from('profiles')
            .select('plan, subscription_end_date')
            .eq('id', userId)
            .single();

        if (data) {
            // Check expiry
            if (data.subscription_end_date) {
                const expiry = new Date(data.subscription_end_date);
                if (expiry < new Date()) {
                    return 'Free'; // Expired
                }
            }

            const plan = data.plan || 'Free';
            if (plan.toLowerCase().includes('pro')) return 'Pro';
            if (plan.toLowerCase().includes('basic')) return 'Basic';
            return 'Free';
        }

        // Fallback to Prisma User if not found in Supabase (or if synced there)
        try {
            const localUser = await prisma.user.findUnique({
                where: { id: userId },
                select: { plan: true, subscriptionEndDate: true }
            });

            if (localUser) {
                // Check expiry
                if (localUser.subscriptionEndDate) {
                    const expiry = new Date(localUser.subscriptionEndDate);
                    if (expiry < new Date()) {
                        return 'Free'; // Expired
                    }
                }

                const plan = localUser.plan || 'Free';
                if (plan.toLowerCase().includes('pro')) return 'Pro';
                if (plan.toLowerCase().includes('basic')) return 'Basic';
                return 'Free';
            }
        } catch (prismaErr) {
            // If Prisma / local DB isn't available or the table doesn't exist, log and fallback to Free
            console.warn('Prisma lookup failed in usageService.getUserPlan, falling back to Free plan:', (prismaErr as any)?.message || prismaErr)
            return 'Free'
        }

        return 'Free';
    },

    async getUsageCount(userId: string, feature: FeatureType): Promise<number> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfMonthISO = startOfMonth.toISOString();

        switch (feature) {
            case 'resumeBuilds': {
                const { count, error } = await supabase
                    .from('resumes')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', userId)
                    .gte('created_at', startOfMonthISO);
                return count || 0;
            }
            case 'aiSuggestions': {
                const { count, error } = await supabase
                    .from('ai_jobs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', userId)
                    .eq('type', 'review_resume')
                    .gte('created_at', startOfMonthISO);
                return count || 0;
            }
            case 'downloads': {
                try {
                    // Try to query pdf_downloads from Supabase since standardizing
                    const { count, error } = await supabase
                        .from('pdf_downloads')
                        .select('id', { count: 'exact', head: true })
                        .eq('user_id', userId)
                        .gte('created_at', startOfMonthISO);

                    if (error) {
                        // Fallback to Prisma local count
                        const pCount = await prisma.pdfDownload.count({
                            where: {
                                userId: userId,
                                downloadedAt: {
                                    gte: startOfMonth
                                }
                            }
                        });
                        return pCount;
                    }
                    return count || 0;
                } catch (e) {
                    console.warn('Usage check for downloads failed, returning 0', (e as any)?.message || e)
                    return 0
                }
            }
        }
        return 0;
    },

    async checkLimit(userId: string, feature: FeatureType): Promise<{ allowed: boolean; limit: number; usage: number; plan: PlanType }> {
        const plan = await this.getUserPlan(userId);
        const limit = PLAN_LIMITS[plan][feature];

        if (limit === Infinity) {
            return { allowed: true, limit, usage: 0, plan };
        }

        const usage = await this.getUsageCount(userId, feature);

        return {
            allowed: usage < limit,
            limit,
            usage,
            plan
        };
    }
};
