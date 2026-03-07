
import { Request, Response } from 'express';
import { PuppeteerService } from '../services/PuppeteerService';

export const generatePdf = async (req: Request, res: Response) => {
    try {
        let { html, options, score } = req.body;
        console.log('PDF Generation Requested: HTML length =', html?.length, 'Score =', score);

        if (!html) {
            return res.status(400).json({ error: 'HTML content is required' });
        }

        // Inject Stealth Watermark (Deeply Obfuscated)
        if (score !== undefined) {
            const bakedScore = parseInt(score);
            if (!isNaN(bakedScore)) {
                // Secret logic: XOR score with 0x7A and wrap in a generic "Document Reference" string
                const secret = 0x7A;
                const encrypted = (bakedScore ^ secret).toString(16).toUpperCase().padStart(2, '0');
                const salt = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
                const watermark = `REF-${salt}-${encrypted}-B0`;

                // Keep HTML clean
                if (html.includes('<head>')) {
                    html = html.replace(/<title>.*?<\/title>/gi, '');
                    html = html.replace('<head>', '<head><title>Resume</title>');
                }

                let pdfBuffer = await PuppeteerService.generatePdf(html, options);

                // --- STEALTH METADATA INJECTION WITH PDF-LIB ---
                try {
                    const { PDFDocument } = require('pdf-lib');
                    const pdfDoc = await PDFDocument.load(pdfBuffer);

                    pdfDoc.setTitle('Resume');
                    pdfDoc.setAuthor(watermark);
                    pdfDoc.setKeywords([watermark, 'Gaplytiq-Verified']);
                    pdfDoc.setSubject(watermark);
                    pdfDoc.setProducer('Gaplytiq PDF Engine');

                    const modifiedPdfBytes = await pdfDoc.save();
                    pdfBuffer = Buffer.from(modifiedPdfBytes);
                    console.log(`✅ [STEALTH] Deep Metadata Injected: ${watermark}`);
                } catch (metaError) {
                    console.error('❌ Failed to inject deep metadata:', metaError);
                }

                res.set({
                    'Content-Type': 'application/pdf',
                    'Content-Length': pdfBuffer.length,
                    'Content-Disposition': 'attachment; filename="resume.pdf"',
                });
                return res.send(pdfBuffer);
            }
        }

        const pdfBuffer = await PuppeteerService.generatePdf(html, options);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': 'attachment; filename="resume.pdf"',
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};
