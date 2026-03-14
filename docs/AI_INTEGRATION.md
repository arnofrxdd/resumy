# AI Integration Guide

Resumy utilizes multiple AI models to provide the best possible parsing and content generation experience.

## 🧠 AI Models Used
- **GPT-4o / GPT-4o-mini**: Primary models for high-precision resume parsing and creative writing suggestions.
- **Gemini 1.5 Flash/Pro**: Used as a secondary or fallback engine for specific processing tasks.
- **Tesseract.js**: Local OCR engine used to extract text from image-based PDF or JPG uploads before sending them to the LLMs.

## 🔄 The Parsing Pipeline
When a user uploads a resume, it follows this automated pipeline:

1. **Extraction**: `mammoth` (for docx) or `pdf-parse` (for pdf) extracts raw text.
2. **Refinement**: If the text is empty or garbled, the system triggers the OCR service.
3. **Structuring**: The raw text is sent to the `extractStructuredResume` service, which uses a strictly defined JSON schema to transform text into structured resume sections (Personal, Education, Experience, Skills, etc.).
4. **Validation**: The structured JSON is validated against internal schemas before being saved to the `resumes` and `builder_resumes` tables.

## 💡 Smart Suggestions
The AI providing real-time feedback in the editor:
- **Experience Enhancer**: Rewrites bullet points to be more impact-oriented (using the Action-Result framework).
- **Summary Generator**: Crafts a professional summary based on the provided skills and experience history.
- **Skills Expansion**: Suggests relevant skills based on the user's role and experience content.

## ⚙️ Configuration
AI services are configured via the backend `.env` file using the following keys:
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `AI_PROVIDER` (Default: 'openai')

## 📊 Token Management
To maintain performance and reliability, the system tracks token usage per user and enforces daily AI upload limits for free plans.
