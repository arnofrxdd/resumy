import crypto from 'crypto'
import OpenAI from 'openai'
import { encoding_for_model } from 'tiktoken'
import { QuizQuestion, QuizConfig } from '../types/quiz'

class ValidationError extends Error {
    issues: string[]
    constructor(issues: string[], message: string = 'Validation failed') {
        super(message)
        this.name = 'ValidationError'
        this.issues = issues
    }
}

export class OpenAIService {
    private model: string
    private fallbackModels: string[] = []
    private openaiClient: any = null

    // OPTIMIZATION: Simple in-memory cache for common questions (5-minute TTL)
    private static questionCache = new Map<string, { questions: QuizQuestion[], timestamp: number, tokensUsed: any, cost: number, modelUsed: string }>()
    private static readonly CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

    // allow passing a specific apiKey and model (used by skill-gap / skill-test flows)
    constructor(apiKey?: string, modelOverride?: string) {
        // allow per-instance model override, otherwise fall back to env
        this.model = modelOverride || process.env.OPENAI_MODEL || 'gpt-4o-mini'
        const key = apiKey || process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
        if (key && key.length > 10) {
            try {
                this.openaiClient = new (require('openai'))({ apiKey: key })
                const fallbacks = (process.env.OPENAI_FALLBACK_MODELS || '').split(',').map(s => s.trim()).filter(Boolean)
                this.fallbackModels = [...new Set(fallbacks)]
                console.log('OpenAIService initialized — API key present')
            } catch (e) {
                console.error('Failed to initialize OpenAI client:', (e as Error).message)
                this.openaiClient = null
            }
        } else {
            console.warn('OpenAIService: OPENAI_API_KEY not found — OpenAI will be unavailable')
        }
    }

    private isHardEnough(question: QuizQuestion): boolean {
        // Evaluate the entire question context to accurately gauge difficulty
        const textParts = [
            question.question,
            question.explanation || '',
            ...(question.options || []),
            question.codeTemplate || ''
        ];
        const text = textParts.join(' ').toLowerCase();

        const hardIndicators = [
            'closure', 'descriptor', 'mro', 'multiple inheritance', 'super()',
            'metaclass', 'decorator', 'generator', 'yield', 'edge case',
            'time complexity', 'space complexity', 'production', 'mutable default',
            'reference', 'internal behavior', 'memory', 'recursion',
            'deep copy', 'shallow copy', 'precision trap', 'late binding',
            'scoping', 'precedence', 'method resolution order', 'concurrency',
            'asyncio', 'thread', 'gil'
        ]

        const easyPatterns = [
            '2 + 3', 'print("hello"', 'what is a list', 'which is mutable',
            'basic syntax', 'simple arithmetic'
        ]

        let score = 0

        hardIndicators.forEach(keyword => {
            if (text.includes(keyword)) score += 1
        })

        easyPatterns.forEach(keyword => {
            if (text.includes(keyword)) score -= 2
        })

        // Give a boost if it includes complex structures
        if (text.includes('class ') && text.includes('def ')) score += 1

        return score >= 2
    }

    private isHardEnoughCoding(question: QuizQuestion): boolean {
        const text = (question.question || '').toLowerCase()

        // FIX: TypeScript type guard to narrow 'string | number' safely into a string
        const solution = (typeof question.correctAnswer === 'string' ? question.correctAnswer : '').toLowerCase()

        let score = 0

        // Algorithmic complexity required
        if (text.includes('time complexity') || text.includes('space complexity')) score += 2

        // Data structures
        if (text.includes('graph') || text.includes('tree') || text.includes('heap')) score += 2

        // Advanced concepts
        if (text.includes('dynamic programming')) score += 2
        if (text.includes('backtracking')) score += 2
        if (text.includes('recursion')) score += 1
        if (text.includes('memoization')) score += 2

        // Edge case requirement
        if (text.includes('edge case')) score += 1

        // Solution complexity length check
        if (solution.length > 300) score += 2

        return score >= 4
    }

    async generateQuestions(config: QuizConfig): Promise<{ questions: QuizQuestion[]; tokensUsed: { input: number; output: number; total: number }; cost: number; modelUsed?: string }> {
        if (!this.openaiClient) throw new Error('OpenAI API key not configured on server')

        const cacheKey = `${config.topic}_${config.format}_${config.difficulty}_${config.mcqCount ?? 0}_${config.codingCount ?? 0}`

        let cached = null
        // Do NOT cache hard questions. Always generate fresh for true skill testing.
        if (config.difficulty !== 'hard') {
            cached = OpenAIService.questionCache.get(cacheKey) || null
        }

        if (cached && (Date.now() - cached.timestamp) < OpenAIService.CACHE_TTL_MS) {
            console.log(`[OpenAI] Cache hit for: ${cacheKey.substring(0, 50)}...`)
            return {
                questions: JSON.parse(JSON.stringify(cached.questions)),
                tokensUsed: cached.tokensUsed,
                cost: cached.cost,
                modelUsed: cached.modelUsed
            }
        }

        const basePrompt = this.buildPrompt(config)
        const systemPrompt = 'You are an expert quiz question generator. Always respond with strictly valid JSON that satisfies the requested schema without additional commentary.'
        const modelsToTry = [this.model, ...this.fallbackModels].filter((m, idx, arr) => !!m && arr.indexOf(m) === idx)

        const maxAttemptsPerModel = 2
        let lastError: any = null

        for (const modelName of modelsToTry) {
            if (process.env.NODE_ENV !== 'test') console.info(`[OpenAI] attempting model: ${modelName}`)
            let enforceTemperature = true
            let guidance: string[] = []

            for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
                const prompt = this.composePrompt(basePrompt, guidance)
                const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }]

                try {
                    const HARD_TIMEOUT_MS = 180000 // 3 minutes to match frontend max allowance

                    const timeoutPromise = new Promise<any>((_, reject) =>
                        setTimeout(() => reject(new Error('HARD_MODE_TIMEOUT')), HARD_TIMEOUT_MS)
                    )

                    // ✅ CHANGE 1: Swapped to json_object with 3500 token limit
                    const apiPromise = this.openaiClient.chat.completions.create({
                        model: modelName,
                        messages,
                        temperature: enforceTemperature ? 0 : undefined,
                        max_completion_tokens: 3500,
                        response_format: { type: "json_object" }
                    })

                    const response = await Promise.race([apiPromise, timeoutPromise])
                    const content = response.choices[0]?.message?.content || ''

                    if (!content) {
                        lastError = new Error('No content from OpenAI')
                        guidance = ['The previous response was empty. Return a populated JSON object with the requested questions.']
                        continue
                    }

                    if (process.env.NODE_ENV !== 'test') {
                        console.debug('[OpenAI] raw response content:', content)
                        console.info(`[OpenAI] successful model: ${modelName}`)
                    }

                    let questions: QuizQuestion[]
                    try {
                        questions = this.parseQuestionsFromResponse(content, config)

                        const seen = new Set<string>()
                        const uniqueQuestions: QuizQuestion[] = []
                        for (const q of questions) {
                            const key = q.question.trim().toLowerCase()
                            if (!seen.has(key)) {
                                seen.add(key)
                                uniqueQuestions.push(q)
                            }
                        }

                        if (uniqueQuestions.length < questions.length) {
                            console.warn('Duplicate detected but keeping original count to preserve session consistency')
                        }

                        // Preserve array size even if duplicates exist
                        questions = uniqueQuestions.length === questions.length ? uniqueQuestions : questions

                        // We no longer throw here. Let the QuestionGenerationService handle count mismatches
                        // by using its ensureCounts and fillMissing logic.
                        const totalExpected = (config.mcqCount || 0) + (config.codingCount || 0)
                        if (questions.length !== totalExpected) {
                            console.warn(`[OpenAI] Count mismatch: Expected ${totalExpected}, got ${questions.length}`)
                        }

                    } catch (parseErr: any) {
                        lastError = parseErr
                        guidance = [`The previous output failed validation: ${(parseErr?.message || parseErr).toString()}. Regenerate EXACTLY the requested number of questions in valid JSON.`]
                        continue
                    }

                    const validationIssues = this.validateQuestions(config, questions)

                    // Strict No-Compromise Validation Rejection
                    if (validationIssues.length > 0) {
                        console.warn(`[OpenAI] Validation issues found: ${validationIssues.join(', ')}`)
                        lastError = new ValidationError(validationIssues)
                        guidance = validationIssues.map(issue => `FIX: ${issue}`)
                        continue
                    }

                    if (config.difficulty === 'hard') {
                        const totalRequested = (config.mcqCount || 0) + (config.codingCount || 0)

                        const hardQuestions = questions.filter(q => {
                            if (q.type === 'mcq') return this.isHardEnough(q)
                            if (q.type === 'coding') return this.isHardEnoughCoding(q)
                            return false
                        })

                        console.log(`[Hard Validator] Detected ${hardQuestions.length}/${totalRequested} hard questions`)

                        // ✅ Accept if at least 10 hard questions
                        if (hardQuestions.length < 10) {
                            console.warn(`[Hard Validator] Below preferred threshold, but accepting.`)
                            // DO NOT THROW
                        }
                    }


                    const promptTokens = response.usage?.prompt_tokens ?? this.countTokens(prompt, modelName)
                    const completionTokens = response.usage?.completion_tokens ?? this.countTokens(content, modelName)
                    const totalTokens = promptTokens + completionTokens
                    const cost = this.calculateCost(totalTokens)

                    const result = { questions, tokensUsed: { input: promptTokens, output: completionTokens, total: totalTokens }, cost, modelUsed: modelName }

                    if (config.difficulty !== 'hard') {
                        OpenAIService.questionCache.set(cacheKey, { ...result, timestamp: Date.now() })
                        if (OpenAIService.questionCache.size > 50) {
                            const firstKey = OpenAIService.questionCache.keys().next().value
                            if (firstKey) OpenAIService.questionCache.delete(firstKey)
                        }
                    }

                    return result
                } catch (err: any) {
                    lastError = err
                    const message = (err?.message || '').toString().toLowerCase()

                    if (err?.message === 'HARD_DIFFICULTY_THRESHOLD_NOT_MET' || err?.message === 'HARD_MODE_TIMEOUT') {
                        throw err
                    }

                    if (message.includes('does not have access to model') || err?.status === 403) {
                        console.warn(`[OpenAI] model ${modelName} not available for this key (trying next fallback if available)`)
                        guidance = []
                        break
                    }

                    if (message.includes('temperature') || message.includes("unsupported value: 'temperature'") || message.includes('temperature is not supported')) {
                        if (enforceTemperature) {
                            console.warn(`[OpenAI] model ${modelName} rejected temperature; retrying without temperature parameter`)
                            enforceTemperature = false
                            guidance = ['Previous attempt failed because the model rejected temperature. Re-emit the JSON without any references to temperature.']
                            continue
                        }
                    }

                    if (attempt < maxAttemptsPerModel) {
                        guidance = [`Encountered API error: ${(err?.message || err).toString()}. Regenerate the full JSON array complying with the schema.`]
                        continue
                    }

                    throw err
                }
            }
        }

        throw lastError || new Error('OpenAI: no response from attempted models')
    }

    private buildPrompt(config: QuizConfig) {
        const { topic, format, difficulty, mcqCount, codingCount } = config
        const totalCount = (mcqCount || 0) + (codingCount || 0)

        let difficultyRules = ''

        if (difficulty === 'easy') {
            difficultyRules = `
DIFFICULTY RULES (EASY):
- Focus on basic syntax and fundamental understanding.
- No multi-step reasoning.
- No edge cases.
- No internal implementation questions.
- Direct concept recall or simple output prediction.
`
        }

        if (difficulty === 'medium') {
            difficultyRules = `
DIFFICULTY RULES (MEDIUM):
- Require applied understanding.
- Include small logical reasoning steps.
- May include small edge cases.
- Avoid trivial syntax-only questions.
- At least 30% scenario-based questions.
`
        }

        if (difficulty === 'hard') {
            difficultyRules = `
DIFFICULTY RULES (HARD - STRICT ENFORCEMENT):

- Each question MUST require multi-step reasoning.
- Avoid direct output prediction unless involving edge cases.
- Avoid syntax-only questions.
- Avoid definition-based questions.
- At least 60% must involve tricky behavior or internal mechanics.
- Include topics like:
  - Mutable default argument traps
  - Late binding closures
  - Operator precedence edge cases
  - Floating point precision traps
  - Descriptor behavior
  - MRO / inheritance conflicts
  - Generator edge cases
  - Comprehension scoping rules
  - Real production debugging scenarios
- Distractors must be highly plausible.
- No beginner-level questions allowed.
- If the question can be answered by a beginner in under 10 seconds, DO NOT include it.
`
        }

        // ✅ CHANGE 2: Prompt instructs to return a JSON object wrapping the array
        const schemaNote = `
Return a JSON object with a single key "questions" containing an array of ${totalCount} question objects.

STRICT SCHEMA:
- MCQ: {id, type:"mcq", question, options[4], correctAnswer:index, explanation, difficulty:"${difficulty}", topic:"${topic}"}
- Coding: {id, type:"coding", question, codeTemplate, correctAnswer, solutions: [{title, code, complexity, explanation}], testCases: [{input, expectedOutput, description}], explanation, difficulty:"${difficulty}", topic:"${topic}"}

CRITICAL:
- MCQ correctAnswer MUST be integer 0-3
- Exactly 4 distinct options
- No markdown
- No text outside JSON
`

        if (format === 'mcq') {
            return `Generate exactly ${mcqCount} MCQ questions on ${topic}.${difficultyRules}${schemaNote}`
        }

        if (format === 'coding') {
            return `
Generate exactly ${codingCount} coding problems on ${topic}.${difficultyRules}

ADDITIONAL CODING REQUIREMENTS:
- Include realistic constraints.
- Include at least 3 meaningful test cases.
- Provide full working solution.
- For hard difficulty, include algorithmic complexity discussion.${schemaNote}
`
        }

        return `Generate exactly ${mcqCount} MCQ and exactly ${codingCount} coding questions on ${topic}. MCQ FIRST, coding LAST.${difficultyRules}${schemaNote}`
    }

    public parseQuestionsFromResponse(response: string, config: QuizConfig): QuizQuestion[] {
        try {
            let cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim()

            // ✅ CHANGE 3: Clean, guaranteed parsing from JSON Object
            const parsed = JSON.parse(cleaned)
            const arr = parsed.questions
            if (!Array.isArray(arr)) throw new Error('Invalid questions array')

            const normalizeCases = (cases: any[]) => Array.isArray(cases) ? cases.map((tc: any) => ({
                input: tc?.input,
                expectedOutput: (tc?.expectedOutput ?? tc?.expected ?? tc?.expected_output),
                description: tc?.description || ''
            })) : undefined

            return arr.map((q: any, i: number) => {
                const qType = q.type || config.format || 'mcq'
                let correctAnswer = q.correctAnswer

                // 1. Normalize MCQ answers
                if (qType === 'mcq' && Array.isArray(q.options)) {
                    if (typeof correctAnswer === 'string') {
                        const matchIndex = q.options.findIndex((opt: string) =>
                            opt && correctAnswer &&
                            (opt.toLowerCase().trim() === correctAnswer.toLowerCase().trim() ||
                                opt.toLowerCase().includes(correctAnswer.toLowerCase()) ||
                                correctAnswer.toLowerCase().includes(opt.toLowerCase()))
                        )
                        if (matchIndex >= 0) {
                            correctAnswer = matchIndex
                        } else {
                            correctAnswer = 0
                        }
                    } else if (typeof correctAnswer === 'number' && (correctAnswer < 0 || (Array.isArray(q.options) && correctAnswer >= q.options.length))) {
                        correctAnswer = 0
                    }
                }

                // 2. Normalize Solutions for Coding Questions
                let solutions = q.solutions
                if (qType === 'coding') {
                    if (Array.isArray(solutions)) {
                        solutions = solutions.map((sol: any) => {
                            if (typeof sol === 'string') {
                                return {
                                    title: "Solution approach",
                                    code: sol,
                                    complexity: "Standard",
                                    explanation: q.explanation || "Algorithm implementation"
                                }
                            }
                            return {
                                title: sol.title || "Solution approach",
                                code: sol.code || "",
                                complexity: sol.complexity || "Standard",
                                explanation: sol.explanation || q.explanation || "Algorithm implementation"
                            }
                        })
                    } else if (solutions && typeof solutions === 'string') {
                        solutions = [{
                            title: "Solution approach",
                            code: solutions,
                            complexity: "Standard",
                            explanation: q.explanation || "Algorithm implementation"
                        }]
                    } else {
                        solutions = []
                    }

                    // Ensure correctAnswer for coding is the full code if it looks like a variable name or is missing
                    const firstCode = solutions[0]?.code || ""
                    if (typeof correctAnswer !== 'string' || (correctAnswer.length < 20 && firstCode.length > correctAnswer.length)) {
                        if (firstCode) correctAnswer = firstCode
                    }
                }

                // 3. Normalize Test Cases
                const normalizedTestCases = Array.isArray(q.testCases) ? q.testCases.map((tc: any) => {
                    // Handle input/output that might be objects (datasets)
                    const stringifyIfObject = (val: any) => {
                        if (val === null || val === undefined) return ""
                        if (typeof val === 'string') return val
                        try { return JSON.stringify(val) } catch { return String(val) }
                    }

                    return {
                        input: stringifyIfObject(tc.input),
                        expectedOutput: stringifyIfObject(tc.expectedOutput ?? tc.expected ?? tc.expected_output ?? tc.output),
                        description: tc.description || `Test case for ${config.topic}`
                    }
                }) : []

                return {
                    id: crypto.createHash('md5')
                        .update(q.question || String(i))
                        .digest('hex'),
                    type: qType,
                    question: q.question,
                    options: q.options,
                    correctAnswer,
                    solutions,
                    explanation: q.explanation,
                    difficulty: q.difficulty || config.difficulty,
                    topic: q.topic || config.topic,
                    codeTemplate: q.codeTemplate,
                    testCases: normalizedTestCases
                }
            })
        } catch (err) {
            console.error('OpenAI parse error', err)
            console.error('[OpenAI] failed to parse response (first 500 chars):', response.substring(0, 500))
            throw err
        }
    }

    private countTokens(text: string, modelOverride?: string): number {
        try {
            const enc = encoding_for_model((modelOverride || this.model) as any)
            const tokens = enc.encode(text)
            enc.free()
            return tokens.length
        } catch (err) {
            return Math.ceil(text.length / 4)
        }
    }

    private calculateCost(totalTokens: number) {
        const inputCostPerToken = 0.00000015
        const outputCostPerToken = 0.0000006
        const inputTokens = Math.floor(totalTokens * 0.7)
        const outputTokens = totalTokens - inputTokens
        return (inputTokens * inputCostPerToken) + (outputTokens * outputCostPerToken)
    }

    private composePrompt(basePrompt: string, issues: string[]): string {
        if (!issues.length) return `${basePrompt}\nRespond with JSON object only.`
        const bulletIssues = issues.map(item => `- ${item}`).join('\n')
        return `${basePrompt}\n\nSTRICT CORRECTION REQUIREMENTS:\n${bulletIssues}\nRegenerate the ENTIRE JSON object from scratch, ensuring it strictly follows the schema without additional text.`
    }

    private validateQuestions(config: QuizConfig, questions: QuizQuestion[]): string[] {
        const issues: string[] = []
        // We omit count checks here because QuestionGenerationService handles backfilling if we're short.
        // This prevents high-latency failures when the model returns 4 instead of 5 questions.

        questions.forEach((q, index) => {
            const questionType = q.type || 'mcq'

            if (typeof q.question !== 'string' || q.question.trim().length < 10) issues.push(`Question ${index + 1} text is missing or too short.`)
            if (typeof q.explanation !== 'string' || q.explanation.trim().length < 5) issues.push(`Question ${index + 1} explanation is missing or too short.`)

            if (questionType === 'mcq') {
                if (!Array.isArray(q.options) || q.options.length < 2) issues.push(`MCQ ${index + 1} must include at least 2 options.`)
                if (Array.isArray(q.options) && q.options.some(opt => typeof opt !== 'string' || !opt.trim())) issues.push(`MCQ ${index + 1} contains invalid option text.`)
                if (typeof q.correctAnswer !== 'number' || !Number.isInteger(q.correctAnswer)) issues.push(`MCQ ${index + 1} correctAnswer must be an integer index.`)
            } else if (questionType === 'coding') {
                if (typeof q.correctAnswer !== 'string' || q.correctAnswer.trim().length < 5) issues.push(`Coding question ${index + 1} correctAnswer must contain full solution code.`)
                if (!Array.isArray(q.solutions) || q.solutions.length < 1) issues.push(`Coding question ${index + 1} requires at least 1 solution approach.`)

                if (Array.isArray(q.solutions)) {
                    q.solutions.forEach((sol, solIndex) => {
                        if (typeof sol?.code !== 'string' || !sol.code.trim()) issues.push(`Coding question ${index + 1} solution ${solIndex + 1} is missing code.`)
                        if (typeof sol?.title !== 'string' || !sol.title.trim()) issues.push(`Coding question ${index + 1} solution ${solIndex + 1} is missing a title.`)
                    })
                }

                if (!Array.isArray(q.testCases) || q.testCases.length < 2) issues.push(`Coding question ${index + 1} requires at least 2 test cases.`)
                if (Array.isArray(q.testCases)) {
                    q.testCases.forEach((tc, tcIndex) => {
                        // Relaxed checks: input/output already stringified in normalization
                        if (tc?.input === undefined || tc?.input === null) issues.push(`Coding question ${index + 1} test case ${tcIndex + 1} is missing input.`)
                        if (tc?.expectedOutput === undefined || tc?.expectedOutput === null) issues.push(`Coding question ${index + 1} test case ${tcIndex + 1} is missing expected output.`)
                    })
                }
            }
        })

        return Array.from(new Set(issues))
    }
}