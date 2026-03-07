export function safeJSONParse<T = any>(input: string, fallback: T): T {
    try {
        // strip code fences and surrounding text
        const cleaned = input.replace(/```\w*\n?/g, '').replace(/```$/, '').trim()
        // extract first JSON object or array
        const first = cleaned.indexOf('{')
        const firstArr = cleaned.indexOf('[')
        let candidate = cleaned
        if (first !== -1) {
            const last = cleaned.lastIndexOf('}')
            if (last !== -1 && last > first) candidate = cleaned.substring(first, last + 1)
        } else if (firstArr !== -1) {
            const lastArr = cleaned.lastIndexOf(']')
            if (lastArr !== -1 && lastArr > firstArr) candidate = cleaned.substring(firstArr, lastArr + 1)
        }
        return JSON.parse(candidate) as T
    } catch (e) {
        return fallback
    }
}

export function maskSecret(s?: string) {
    if (!s) return 'NOT SET'
    return s.length > 6 ? `${s.slice(0, 3)}...${s.slice(-3)}` : 'SET'
}
