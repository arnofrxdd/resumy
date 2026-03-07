export const PLAN_LIMITS = {
    Free: {
        resumeBuilds: Infinity, // DEV MODE: Unlimited
        aiSuggestions: Infinity,
        downloads: Infinity,
    },
    Basic: {
        resumeBuilds: 5,
        aiSuggestions: 5,
        downloads: 5,
    },
    Pro: {
        resumeBuilds: Infinity,
        aiSuggestions: Infinity,
        downloads: Infinity,
    }
};

export type PlanType = keyof typeof PLAN_LIMITS;
export type FeatureType = keyof typeof PLAN_LIMITS.Free;
