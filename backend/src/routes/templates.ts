import express from 'express'
import { supabase } from '../services/supabase'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('templates')
            .select('*')
            .eq('is_active', true)
            .order('name')

        if (error) throw error

        res.json(data)
    } catch (error) {
        console.error('Error fetching templates:', error)
        res.status(500).json({ error: 'Failed to fetch templates' })
    }
})

export default router