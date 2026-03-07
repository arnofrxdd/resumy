import fs from 'fs'

type ParseResult = {
    text: string
    meta: Record<string, any>
}

async function tryPdfParse(buffer: Buffer): Promise<ParseResult | null> {
    const errors: string[] = []
    try {
        // try common shapes
        // require first
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const m: any = require('pdf-parse')
        // function shape
        if (typeof m === 'function') {
            const out = await m(buffer)
            if (out && out.text) return { text: out.text || '', meta: { engine: 'pdf-parse' } }
        }
        // default export
        if (m && typeof m.default === 'function') {
            const out = await m.default(buffer)
            if (out && out.text) return { text: out.text || '', meta: { engine: 'pdf-parse' } }
        }
        // parse method
        if (m && typeof m.parse === 'function') {
            const out = await m.parse(buffer)
            if (out && out.text) return { text: out.text || '', meta: { engine: 'pdf-parse' } }
        }
        // PDFParse constructor/class
        if (m && typeof m.PDFParse === 'function') {
            try {
                const inst = new m.PDFParse(buffer)
                if (inst && typeof inst.parse === 'function') {
                    const out = await inst.parse()
                    if (out && out.text) return { text: out.text || '', meta: { engine: 'pdf-parse' } }
                }
            } catch (e) {
                errors.push('PDFParse constructor failed: ' + ((e as any)?.message || String(e)))
            }
        }
        errors.push('pdf-parse did not return usable text')
    } catch (err) {
        errors.push('require(pdf-parse) failed: ' + ((err as any)?.message || String(err)))
    }
    // no success
    return null
}

async function tryPdfjs(buffer: Buffer): Promise<ParseResult | null> {
    try {
        // try known entry points
        let pdfjs: any = null
        try {
            // prefer legacy build
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            pdfjs = require('pdfjs-dist/legacy/build/pdf')
        } catch (e1) {
            try {
                // try .js path
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                pdfjs = require('pdfjs-dist/legacy/build/pdf.js')
            } catch (e2) {
                try {
                    // fallback to main package
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    pdfjs = require('pdfjs-dist')
                } catch (e3) {
                    throw new Error('pdfjs-dist not available')
                }
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
        // dynamic require to avoid hard dependency
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pdfjs: any = (() => {
            try { return require('pdfjs-dist/legacy/build/pdf') } catch (e) { }
            try { return require('pdfjs-dist/legacy/build/pdf.js') } catch (e) { }
            try { return require('pdfjs-dist') } catch (e) { }
            return null
        })()
        if (!pdfjs) return null

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { createCanvas } = require('canvas')
        const { default: Tesseract } = await import('tesseract.js')

        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) })
        const pdf = await loadingTask.promise
        let ocrText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const viewport = page.getViewport({ scale: 2.0 })
            const canvas = createCanvas(viewport.width, viewport.height)
            const ctx = canvas.getContext('2d')
            await page.render({ canvasContext: ctx, viewport }).promise
            const imgBuffer = canvas.toBuffer('image/png')
            const res = await (Tesseract as any).recognize(imgBuffer, 'eng')
            if (res && res.data && res.data.text) ocrText += res.data.text + '\n'
        }
        return { text: ocrText, meta: { engine: 'tesseract-ocr' } }
    } catch (err) {
        return null
    }
}

export async function parseFileBuffer(buffer: Buffer, mimeType?: string, filename?: string): Promise<ParseResult> {
    // Try pdf-parse first, then pdfjs, then OCR. Always return {text, meta} or throw an error
    // Only throw after all extraction methods fail
    const results: { method: string; ok: boolean }[] = []

    // Quick heuristic: if mimeType indicates docx, use mammoth
    if (mimeType && mimeType.includes('word')) {
        try {
            const { default: mammoth } = await import('mammoth')
            const out = await (mammoth as any).extractRawText({ buffer })
            return { text: out?.value || '', meta: { engine: 'mammoth' } }
        } catch (e) {
            // fall through to other methods
        }
    }

    const p1 = await tryPdfParse(buffer)
    if (p1) return p1

    const p2 = await tryPdfjs(buffer)
    if (p2) return p2

    const p3 = await tryOcr(buffer)
    if (p3) return p3

    // If everything fails, throw structured error for caller to handle
    const err: any = new Error('No parser succeeded')
    err.code = 'NO_EXTRACTOR'
    throw err
}

export default {
    parseFileBuffer
}
