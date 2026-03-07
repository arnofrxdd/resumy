import prisma from './prisma';
import { supabase } from './supabase';

export interface CareerDna {
    personal?: any;
    summary?: string;
    skills?: { name: string; level: number }[];
    experience?: any[];
    education?: any[];
    projects?: any[];
    languages?: any[];
    certifications?: any[];
}

export class CareerDnaService {
    /**
     * Syncs parsed resume data into the user's Career DNA.
     * This is the "brain" update.
     */
    async syncFromResume(userId: string, resumeId: string, parsedData: any) {
        console.log(`🧬 Syncing Career DNA for user ${userId} from resume ${resumeId}`);

        try {
            // 1. Prepare DNA object
            const dna: CareerDna = {
                personal: parsedData.personal,
                summary: parsedData.summary,
                skills: parsedData.skills,
                experience: parsedData.experience,
                education: parsedData.education,
                projects: parsedData.projects,
                languages: parsedData.languages,
                certifications: parsedData.certifications
            };

            // 2. Update profiles table (via Supabase to be safe with JSONB)
            // Note: We use Supabase here because Prisma's SQLite support for JSON is just a string,
            // while Supabase/Postgres is native JSONB.
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    career_dna: dna,
                    master_resume_id: resumeId,
                    dna_last_synced: new Date().toISOString()
                })
                .eq('id', userId);

            if (profileError) {
                console.error('❌ Failed to update Career DNA in profile:', profileError);
                throw profileError;
            }

            // 3. Sync individual skills to skill_inventory for quick search/verification
            if (Array.isArray(parsedData.skills)) {
                await this.syncSkillInventory(userId, parsedData.skills);
            }

            console.log(`✅ Career DNA synced successfully for ${userId}`);
            return true;
        } catch (err) {
            console.error('❌ CareerDnaService Error:', err);
            return false;
        }
    }

    /**
     * Extracts skills and upserts them into the skill_inventory table.
     */
    private async syncSkillInventory(userId: string, skills: { name: string; level?: number }[]) {
        try {
            // We use a loop or bulk upsert. For consistency, we'll use Supabase.
            for (const skill of skills) {
                if (!skill.name) continue;

                const proficiencyMap: Record<number, string> = {
                    1: 'Beginner',
                    2: 'Elementary',
                    3: 'Intermediate',
                    4: 'Advanced',
                    5: 'Expert'
                };

                const proficiency = proficiencyMap[skill.level || 3] || 'Intermediate';

                const { error: skillError } = await supabase
                    .from('skill_inventory')
                    .upsert({
                        user_id: userId,
                        skill_name: skill.name,
                        proficiency: proficiency,
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id,skill_name'
                    });

                if (skillError) {
                    // Check if it's a constraint issue (likely missing index in DB)
                    if (skillError.message.includes('ON CONFLICT') || skillError.code === '42704' || skillError.code === '42P10') {
                        console.warn(`💡 Skill Inventory: '${skill.name}' sync skipped. (Missing DB Unique Constraint: user_id, skill_name)`);
                    } else {
                        console.warn(`⚠️ Failed to sync skill ${skill.name}:`, skillError.message);
                    }
                }
            }
        } catch (err) {
            console.error('❌ Skill Inventory Sync Error:', err);
        }
    }

    /**
     * Retrieves the current Career DNA for a user.
     */
    async getDna(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('career_dna, master_resume_id, dna_last_synced')
            .eq('id', userId)
            .single();

        if (error) return null;
        return data;
    }
}

export const careerDnaService = new CareerDnaService();
