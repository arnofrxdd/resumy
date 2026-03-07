import express from 'express';
import { authGuard } from '../middlewares/auth';
import { usageService } from '../services/usageService';
import { supabase } from '../services/supabase';

const router = express.Router();

// Get subscription status and usage
router.get('/subscription-status', authGuard, async (req, res) => {
    try {
        const userId = req.user!.id;

        // Fetch user profile from Supabase
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('plan, subscription_status, subscription_end_date')
            .eq('id', userId)
            .single();

        if (error) {
            // PGRST116 means the row wasn't found - return default 'Free' plan
            if (error.code === 'PGRST116') {
                return res.json({
                    plan: 'Free',
                    status: 'inactive',
                    endDate: null,
                    daysRemaining: 0,
                    isExpiringSoon: false,
                    usage: {
                        resumeBuilds: 0,
                        downloads: 0,
                        aiSuggestions: 0
                    }
                });
            }
            console.error('Error fetching profile:', error);
            return res.status(500).json({ error: 'Failed to fetch profile' });
        }

        const plan = profile?.plan || 'Free';
        const status = profile?.subscription_status || 'inactive';
        const endDate = profile?.subscription_end_date ? new Date(profile.subscription_end_date) : null;

        let daysRemaining = 0;
        let isExpiringSoon = false;

        if (endDate) {
            const now = new Date();
            const diffTime = endDate.getTime() - now.getTime();
            daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (daysRemaining <= 3 && daysRemaining >= 0) {
                isExpiringSoon = true;
            }
        }

        // Get usage counts for current month
        const usage = {
            resumeBuilds: await usageService.getUsageCount(userId, 'resumeBuilds'),
            downloads: await usageService.getUsageCount(userId, 'downloads'),
            aiSuggestions: await usageService.getUsageCount(userId, 'aiSuggestions'),
        };

        res.json({
            plan,
            status,
            endDate,
            daysRemaining,
            isExpiringSoon,
            usage
        });

    } catch (error) {
        console.error('Error in subscription-status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Career DNA
router.get('/career-dna', authGuard, async (req, res) => {
    try {
        const userId = req.user!.id;
        const { data, error } = await supabase
            .from('profiles')
            .select('career_dna, dna_last_synced, master_resume_id')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching Career DNA:', error);
            // If user isn't found or has no DNA, just return null/empty
            return res.json({ career_dna: null });
        }

        return res.json(data);
    } catch (error) {
        console.error('Error in career-dna:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Career Pulse (Stub)
router.get('/career-pulse', authGuard, async (req, res) => {
    try {
        const userId = req.user!.id;

        // Simple mock pulse for Resume Builder context
        return res.json({
            healthScore: 75,
            marketContext: "Growing Market",
            personalizedMessage: "Your profile is looking strong! Consider detailing your technical projects more specifically.",
            missingSkills: ["Team Leadership", "Cloud Infrastructure"],
            trendingSkills: ["Agentic AI", "Vector Databases", "TypeScript 5.0"]
        });
    } catch (error) {
        console.error('Error in career-pulse:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
