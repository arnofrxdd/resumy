import { generateResumeHTML } from '../renderResume'

describe('template-x renderer', () => {
    test('outputs contact icons, section borders, and skills grid', () => {
        const parsed = {
            fullName: 'Jane Doe',
            jobTitle: 'Engineer',
            phone: '+1-555-1234',
            email: 'jane@example.com',
            location: 'NYC',
            skills: ['JavaScript', 'TypeScript', 'React'],
            summary: 'Experienced engineer'
        }

        const html = generateResumeHTML(parsed, {}, 'template-x')
        expect(html).toContain('📞')
        expect(html).toContain('✉️')
        expect(html).toContain('📍')
        expect(html).toMatch(/section-title[\s\S]*border-top/)
        expect(html).toContain('skills-content')
        expect(html).toContain('skill-item')
    })
})
