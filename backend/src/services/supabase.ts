import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE

if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not set')
}
if (!supabaseServiceRole) {
    throw new Error('SUPABASE_SERVICE_ROLE is not set')
}

export const supabase = createClient(supabaseUrl, supabaseServiceRole, {
    auth: { autoRefreshToken: false, persistSession: false }
})

export default supabase