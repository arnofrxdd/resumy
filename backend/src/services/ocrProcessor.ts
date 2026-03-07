import pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import Tesseract from 'tesseract.js'
import { createCanvas } from 'canvas'

/**
 * OCR Processing Result
 */
export interface OCRResult {
    text: string
    pageCount: number
    pageDetails: Array<{
        pageNum: number
        text: string
        confidence: number
        hasImages: boolean
    }>
    engine: 'tesseract-ocr'
    isImageBased: boolean
    processingTime: number
}

/**
 * PDF page analysis result
 */
interface PageAnalysis {
    hasText: boolean
    hasImages: boolean
    textLength: number
}

/**
 * Analyze a PDF page to detect if it contains primarily images (scanned content)
 * Returns true if page appears to be image-based (scanned)
 */
async function analyzePdfPage(page: any): Promise<PageAnalysis> {
    try {
        // Try to extract text content from page
        const content = await page.getTextContent()
        const textItems = content.items || []

        // Calculate total text length
        const textLength = textItems.reduce((sum: number, item: any) => {
            return sum + (item.str ? item.str.length : 0)
        }, 0)

        // Check for images in the page
        const operatorList = await page.getOperatorList()
        const hasImages = operatorList?.fnArray?.includes(pdfjs.OPS.paintImageXObject) ?? false

        return {
            hasText: textLength > 10,
            hasImages,
            textLength
        }
    } catch (e) {
        // If analysis fails, assume it might have images
        return {
            hasText: false,
            hasImages: true,
            textLength: 0
        }
    }
}

/**
 * Check if a PDF is primarily image-based (scanned document)
 * Returns true if majority of pages are images or have very little extractable text
 */
export async function isImageBasedPdf(buffer: Buffer): Promise<boolean> {
    try {
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) })
        const pdf = await loadingTask.promise

        const pageCount = pdf.numPages
        if (pageCount === 0) return false

        let imageBasedPageCount = 0

        // Analyze up to 3 pages to determine if PDF is image-based
        const pagesToCheck = Math.min(3, pageCount)

        for (let i = 1; i <= pagesToCheck; i++) {
            const page = await pdf.getPage(i)
            const analysis = await analyzePdfPage(page)

            // Consider page image-based if it has little text but has images
            if (!analysis.hasText && analysis.hasImages) {
                imageBasedPageCount++
            }
            // Or if text extraction yields very little content
            else if (analysis.textLength < 50) {
                imageBasedPageCount++
            }
        }

        // If majority of checked pages are image-based, consider whole PDF image-based
        return imageBasedPageCount > (pagesToCheck * 0.5)
    } catch (e) {
        // If analysis fails, assume it might need OCR
        return true
    }
}

/**
 * Extract text from a PDF page using OCR with retry logic
 */
async function ocrPageWithRetry(
    imgBuffer: Buffer,
    pageNum: number,
    maxRetries: number = 2
): Promise<{ text: string; confidence: number }> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const res = await Tesseract.recognize(imgBuffer, 'eng', {
                logger: (m: any) => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100)
                        if (progress % 25 === 0) {
                            console.log(`  Page ${pageNum} OCR: ${progress}%`)
                        }
                    }
                }
            })

            const text = (res?.data?.text || '').trim()
            const confidence = res?.data?.confidence ?? 0

            // Validate result
            if (text && text.length > 0) {
                return { text, confidence }
            }

            // If no text extracted, continue to retry or next method
            if (attempt < maxRetries) {
                console.warn(`  Page ${pageNum}: No text from OCR attempt ${attempt + 1}, retrying...`)
                // Small delay before retry
                await new Promise(resolve => setTimeout(resolve, 100))
            }
        } catch (err) {
            lastError = err as Error
            if (attempt < maxRetries) {
                console.warn(`  Page ${pageNum}: OCR error on attempt ${attempt + 1}: ${(err as any)?.message}`)
                // Continue to retry
            }
        }
    }

    // Return empty result if all retries failed
    if (lastError) {
        console.warn(`  Page ${pageNum}: OCR failed after ${maxRetries + 1} attempts: ${lastError.message}`)
    } else {
        console.warn(`  Page ${pageNum}: No text extracted from OCR`)
    }

    return { text: '', confidence: 0 }
}

/**
 * Convert PDF page to image and perform OCR
 * Uses high resolution rendering for better OCR accuracy
 */
async function ocrPdfPage(page: any, pageNum: number): Promise<{ text: string; confidence: number }> {
    try {
        // Render page to image with 2x scale for better OCR accuracy
        const viewport = page.getViewport({ scale: 2.0 })
        const canvas = createCanvas(viewport.width, viewport.height)
        const ctx = canvas.getContext('2d')

        // Render page to canvas
        await page.render({
            canvasContext: ctx,
            viewport: viewport
        }).promise

        // Convert canvas to PNG buffer
        const imgBuffer = canvas.toBuffer('image/png')

        // OCR the image
        return await ocrPageWithRetry(imgBuffer, pageNum)
    } catch (err) {
        console.warn(`Page ${pageNum}: Failed to render page for OCR: ${(err as any)?.message}`)
        return { text: '', confidence: 0 }
    }
}

/**
 * Process a PDF file with OCR to extract text from scanned/image-based documents
 * Returns detailed results including per-page analysis
 */
export async function extractTextWithOcr(buffer: Buffer): Promise<OCRResult> {
    const startTime = Date.now()

    try {
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) })
        const pdf = await loadingTask.promise

        const pageCount = pdf.numPages
        let fullText = ''
        const pageDetails: OCRResult['pageDetails'] = []
        let totalConfidence = 0

        console.log(`Starting OCR extraction from ${pageCount} pages...`)

        for (let i = 1; i <= pageCount; i++) {
            try {
                console.log(`Processing page ${i}/${pageCount}...`)
                const page = await pdf.getPage(i)

                // OCR the page
                const { text, confidence } = await ocrPdfPage(page, i)

                // Add page to results
                pageDetails.push({
                    pageNum: i,
                    text,
                    confidence,
                    hasImages: true // Pages processed with OCR are assumed to be images
                })

                fullText += text + '\n'
                totalConfidence += confidence
            } catch (err) {
                console.warn(`Page ${i}: Failed to process: ${(err as any)?.message}`)
                pageDetails.push({
                    pageNum: i,
                    text: '',
                    confidence: 0,
                    hasImages: true
                })
            }
        }

        const averageConfidence = pageCount > 0 ? totalConfidence / pageCount : 0
        const processingTime = Date.now() - startTime

        console.log(
            `OCR extraction complete: ${fullText.length} chars extracted in ${processingTime}ms` +
            ` (avg confidence: ${(averageConfidence * 100).toFixed(1)}%)`
        )

        return {
            text: fullText.trim(),
            pageCount,
            pageDetails,
            engine: 'tesseract-ocr',
            isImageBased: true,
            processingTime
        }
    } catch (err) {
        console.error('OCR extraction failed:', (err as any)?.message)
        throw new Error(`OCR processing failed: ${(err as any)?.message}`)
    }
}

/**
 * Intelligently process PDF with fallback strategy:
 * 1. First check if PDF is image-based
 * 2. If image-based, use OCR
 * 3. If text-based, return minimal result
 * 4. Handle errors gracefully
 */
export async function processScannedPdf(buffer: Buffer): Promise<{
    text: string
    isScanned: boolean
    meta: Record<string, any>
}> {
    try {
        // First, detect if PDF is image-based
        console.log('Analyzing PDF structure...')
        const isImageBased = await isImageBasedPdf(buffer)

        if (!isImageBased) {
            // PDF has extractable text, return minimal result
            console.log('PDF appears to have text content, skipping OCR')
            return {
                text: '',
                isScanned: false,
                meta: { reason: 'PDF has extractable text' }
            }
        }

        console.log('PDF detected as image-based, starting OCR...')

        // PDF is image-based, perform full OCR
        const ocrResult = await extractTextWithOcr(buffer)

        return {
            text: ocrResult.text,
            isScanned: true,
            meta: {
                engine: ocrResult.engine,
                pageCount: ocrResult.pageCount,
                pageDetails: ocrResult.pageDetails,
                processingTime: ocrResult.processingTime,
                avgConfidence: ocrResult.pageDetails.length > 0
                    ? (ocrResult.pageDetails.reduce((sum, p) => sum + p.confidence, 0) / ocrResult.pageDetails.length)
                    : 0
            }
        }
    } catch (err) {
        console.error('Scanned PDF processing failed:', (err as any)?.message)
        throw err
    }
}

/**
 * Try OCR as fallback when text extraction fails
 * This replaces the simple tryOcr function in parserCore
 */
export async function tryAdvancedOcr(buffer: Buffer): Promise<{
    text: string
    meta: Record<string, any>
} | null> {
    try {
        // Check if tesseract is available
        if (!Tesseract) {
            console.warn('Tesseract.js not available for OCR')
            return null
        }

        const result = await processScannedPdf(buffer)

        if (result.text && result.text.length > 0) {
            return {
                text: result.text,
                meta: {
                    engine: 'tesseract-ocr',
                    isScanned: result.isScanned,
                    ...result.meta
                }
            }
        }

        return null
    } catch (err) {
        console.warn('Advanced OCR processing failed:', (err as any)?.message)
        return null
    }
}

export default {
    isImageBasedPdf,
    extractTextWithOcr,
    processScannedPdf,
    tryAdvancedOcr
}
