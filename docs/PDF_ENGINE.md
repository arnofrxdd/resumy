# PDF Generation Engine

Resumy uses a custom-built PDF engine designed for pixel-perfect accuracy and high fidelity across all devices.

## 🚀 How it Works
The engine uses **Puppeteer** to run a headless instance of Chromium on the server. Unlike local browser print-to-pdf, our server-side engine ensures:
- Consistent fonts and layouts regardless of the user's OS.
- Precise pagination and margin control.
- Deep metadata injection for document verification.

## 🛠️ Components
- **Template Service**: Combines React-based HTML templates with user data to generate the raw HTML source.
- **CSS Inlining**: Ensures all styles (Tailwind, custom fonts) are correctly applied to the headless document.
- **Stealth Watermarking**: Injects an obfuscated "Score Reference" into the PDF metadata (Author, Producer fields) for internal verification and "Verified" status.

## 📦 Deployment Requirements
### Local (Windows/Mac)
Puppeteer will automatically download the correct Chrome binary.

### VPS / Linux (ARM/x86)
The engine is optimized for Linux deployments. Ensure the following are set in the environment:
- `PUPPETEER_EXECUTABLE_PATH`: Points to the system's `chromium` binary (e.g., `/usr/bin/chromium`).
- System dependencies (libnss3, libatk, libgbm1, etc.) must be installed. Our [backend Dockerfile](../backend/Dockerfile) handles this automatically.

## ⚙️ Advanced Options
- **Auto-height**: Used for generating "single-page long" previews.
- **Paper Formats**: Supports A4 and US Letter natively through CSS media rules.
- **Print Background**: Enabled by default to ensure all design colors and icons are preserved.
