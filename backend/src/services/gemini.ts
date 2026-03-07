import { GoogleGenerativeAI } from '@google/generative-ai'
import { QuizQuestion, QuizConfig } from '../types/quiz'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export class GeminiService {
    private model: any
    constructor() { this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) }

    async generateQuestions(config: QuizConfig): Promise<QuizQuestion[]> {
        const prompt = this.buildPrompt(config)
        // retry with backoff
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const result = await this.model.generateContent(prompt)
                const response = await result.response
                const text = response.text()
                // log raw Gemini output for debugging — helps track malformed outputs
                if (process.env.NODE_ENV !== 'test') console.debug('[Gemini] raw response text:', text)
                return this.parseQuestionsFromResponse(text, config)
            } catch (err: any) {
                if (attempt >= 3) return this.getFallbackQuestions(config)
                await new Promise(r => setTimeout(r, 1000 * attempt))
            }
        }
        return this.getFallbackQuestions(config)
    }

    private buildPrompt(config: QuizConfig): string { const { topic, format, difficulty, questionCount, mcqCount, codingCount } = config; const schemaNote = `Output a valid JSON array only. Each item must have fields: type ("mcq" or "coding"), question (string), options (array, for mcq), correctAnswer (index for mcq, FULL SOLUTION CODE STRING for coding), solutions (for coding, array of objects with {title, code, complexity, explanation}), explanation, difficulty, topic, codeTemplate (for coding), testCases (for coding). IMPORTANT: For coding questions, 'correctAnswer' MUST contain the complete working solution code. 'solutions' MUST contain at least 2 different approaches. Respond only with the JSON array and nothing else.`; return `Generate ${mcqCount} MCQ and ${codingCount} coding problems about ${topic} at ${difficulty} level in JSON array. ${schemaNote}` }

    // make parse method public for testing and debugging
    public parseQuestionsFromResponse(response: string, config: QuizConfig): QuizQuestion[] {
        try {
            let cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim()
            cleaned = cleaned.replace(/,\s*\]/g, ']')
            const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
            if (!jsonMatch) throw new Error('No JSON')
            const arr = JSON.parse(jsonMatch[0])
            const normalizeCases = (cases: any[]) => Array.isArray(cases) ? cases.map((tc: any) => ({
                input: tc?.input,
                expectedOutput: (tc?.expectedOutput ?? tc?.expected ?? tc?.expected_output),
                description: tc?.description || ''
            })) : undefined
            return arr.map((q: any, i: number) => ({ id: `gemini_${Date.now()}_${i}`, type: config.format === 'mixed' ? (q.type || 'mcq') : config.format, question: q.question, options: q.options, correctAnswer: q.correctAnswer, solutions: q.solutions, explanation: q.explanation, difficulty: q.difficulty || config.difficulty, topic: q.topic || config.topic, codeTemplate: q.codeTemplate, testCases: normalizeCases(q.testCases) }))
        } catch (err) {
            console.error('Gemini parse error', err)
            console.error('[Gemini] failed to parse response:', response)
            return this.getFallbackQuestions(config)
        }
    }

    getFallbackQuestions(config: QuizConfig): QuizQuestion[] {
        const items: QuizQuestion[] = []
        const mcqCount = config.mcqCount || 0
        for (let i = 0; i < mcqCount; i++) items.push({ id: `practice_mcq_${i}`, type: 'mcq', question: `Practice question ${i + 1} on ${config.topic}`, options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], correctAnswer: 0, explanation: `Basic concept check for ${config.topic}.`, difficulty: config.difficulty, topic: config.topic })
        for (let i = 0; i < (config.codingCount || 0); i++) items.push({ id: `practice_code_${i}`, type: 'coding', question: `Implement solve(input) — echo the input (topic: ${config.topic})`, codeTemplate: '// implement solve(input) { }', testCases: [{ input: 'hi', expectedOutput: 'hi', description: 'echo' }], correctAnswer: 'function solve(input){ return String(input) }', explanation: `Simple IO warm-up for ${config.topic}.`, difficulty: config.difficulty, topic: config.topic })
        return items
    }
}
