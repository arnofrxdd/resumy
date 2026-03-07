import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getServiceSupabaseClient(): SupabaseClient {
    if (client) return client

    const url = process.env.SUPABASE_URL
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE

    if (!url) throw new Error('SUPABASE_URL is not set')
    if (!serviceRole) throw new Error('SUPABASE_SERVICE_ROLE is not set')

    client = createClient(url, serviceRole, {
        auth: { autoRefreshToken: false, persistSession: false }
    })

    return client
}

export default getServiceSupabaseClient
