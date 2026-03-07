type ParseResult = {
    text: string
    meta: Record<string, any>
}

async function tryPdfParse(buffer: Buffer): Promise<ParseResult | null> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const m: any = require('pdf-parse')
        if (typeof m === 'function') {
            const out = await m(buffer)
            if (out && out.text) return { text: out.text || '', meta: { engine: 'pdf-parse', info: out.info, metadata: out.metadata } }
        }
        if (m && typeof m.default === 'function') {
            const out = await m.default(buffer)
            if (out && out.text) return { text: out.text || '', meta: { engine: 'pdf-parse', info: out.info, metadata: out.metadata } }
        }
        if (m && typeof m.parse === 'function') {
            const out = await m.parse(buffer)
            if (out && out.text) return { text: out.text || '', meta: { engine: 'pdf-parse', info: out.info, metadata: out.metadata } }
        }
        if (m && typeof m.PDFParse === 'function') {
            try {
                const inst = new m.PDFParse(buffer)
                if (inst && typeof inst.parse === 'function') {
                    const out = await inst.parse()
                    if (out && out.text) return { text: out.text || '', meta: { engine: 'pdf-parse' } }
                }
            } catch (e) {
                // ignore and fallthrough
            }
        }
    } catch (err) {
        // continue to next method
    }
    return null
}

async function tryPdfjs(buffer: Buffer): Promise<ParseResult | null> {
    try {
        let pdfjs: any = null
        try {
            // Try dynamic import for the legacy build (ESM)
            pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
        } catch (e1) {
            try {
                // Fallback to standard build
                pdfjs = await import('pdfjs-dist')
            } catch (e3) {
                throw new Error('pdfjs-dist not available')
            }
        }
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) })
        const pdf = await loadingTask.promise
        let text = ''
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const content = await page.getTextContent()
            const strings = content.items.map((item: any) => item.str || '')
            text += strings.join(' ') + '\n'
        }
        return { text, meta: { engine: 'pdfjs-dist' } }
    } catch (err) {
        return null
    }
}

async function tryOcr(buffer: Buffer): Promise<ParseResult | null> {
    try {
        // Import the enhanced OCR processor
        const { tryAdvancedOcr } = await import('./ocrProcessor')
        const result = await tryAdvancedOcr(buffer)
        if (result) {
            return result
        }
        return null
    } catch (err) {
        console.warn('Enhanced OCR fallback failed:', (err as any)?.message)
        return null
    }
}

export async function parseFileBuffer(buffer: Buffer, mimeType?: string): Promise<ParseResult> {
    const result = await (async () => {
        if (mimeType && (mimeType.includes('word') || mimeType.includes('officedocument'))) {
            try {
                const mammothModule: any = await import('mammoth')
                const mammoth = mammothModule.default || mammothModule

                if (typeof mammoth.extractRawText !== 'function') {
                    throw new Error('mammoth.extractRawText is not a function. Check module export.')
                }

                const out = await mammoth.extractRawText({ buffer })
                if (out && out.value) {
                    return { text: out.value, meta: { engine: 'mammoth', messages: out.messages } }
                }

                console.warn('⚠️ Mammoth extracted empty text from docx.');
            } catch (e) {
                console.error('❌ Mammoth parsing failed:', (e as any)?.message || e);
                // fall through to other parsers
            }
        }
        const p1 = await tryPdfParse(buffer)
        if (p1) return p1
        const p2 = await tryPdfjs(buffer)
        if (p2) return p2
        const p3 = await tryOcr(buffer)
        if (p3) return p3
        return null
    })()

    if (!result || !result.text) {
        console.error(`❌ Text extraction failed for mimeType: ${mimeType}`);
        const err: any = new Error('No parser succeeded')
        err.code = 'NO_EXTRACTOR'
        throw err
    }

    console.log(`📄 TEXT EXTRACTION SUCCESSFUL: Engine: ${result.meta.engine}, Length: ${result.text.length} characters.`);
    return result
}

export default {
    parseFileBuffer
}
