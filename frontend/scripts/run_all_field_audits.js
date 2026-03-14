const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Audit Runner Script
 * This script runs the field_audit.js on all listed templates in TemplateManager.js
 * and writes the results to a markdown file.
 */

const baseDir = path.resolve(__dirname, '..');
const templateManagerPath = path.join(baseDir, 'app/resume-creator/templates/TemplateManager.js');
const fieldAuditPath = path.join(baseDir, 'scripts/field_audit.js');
const outputPath = path.join(baseDir, 'TEMPLATE_FIELD_AUDIT.md');

// 1. Parse TemplateManager.js to find active template IDs
const templateManagerContent = fs.readFileSync(templateManagerPath, 'utf8');

// Regex to find active template IDs (not in comments)
// This is a bit tricky with JS comments, so we'll look for the templatesConfig array
const configMatch = templateManagerContent.match(/export const templatesConfig = \[([\s\S]*?)\];/);
if (!configMatch) {
    console.error("Could not find templatesConfig in TemplateManager.js");
    process.exit(1);
}

const configContent = configMatch[1];

// Remove multi-line comments
const cleanConfig = configContent.replace(/\/\*[\s\S]*?\*\//g, '');

// Extract IDs from objects that aren't commented out
const templateIdMatches = [...cleanConfig.matchAll(/id:\s*["']([^"']+)["']/g)];
const activeIds = templateIdMatches.map(m => m[1]);

console.log(`Found ${activeIds.length} active templates: ${activeIds.join(', ')}`);

// 2. Map IDs to directory/file naming convention
// Usually it's PascalCase for directory and file
const toPascalCase = (str) => {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
};

const results = [];

// 3. Run audit for each template
activeIds.forEach(id => {
    const folderName = toPascalCase(id);
    const templatePath = path.join(baseDir, `app/resume-creator/templates/${folderName}/${folderName}.jsx`);

    if (!fs.existsSync(templatePath)) {
        console.warn(`⚠️ Template file not found: ${templatePath}`);
        results.push({ id, status: 'File Not Found', score: 'N/A' });
        return;
    }

    console.log(`Auditing ${id}...`);
    try {
        const output = execSync(`node "${fieldAuditPath}" "${templatePath}"`, { encoding: 'utf8' });

        // Extract score from output
        const scoreMatch = output.match(/TOTAL SCORE: (\d+)%.*\((\d+\/\d+)/);
        const score = scoreMatch ? `${scoreMatch[1]}% (${scoreMatch[2]})` : 'Unknown';

        // Extract missing fields
        const lines = output.split('\n');
        const missingFields = lines
            .filter(line => line.includes('❌'))
            .map(line => line.split('❌')[1].split('[')[0].trim());

        results.push({
            id,
            folderName,
            score,
            missingFields,
            fullOutput: output
        });
    } catch (error) {
        console.error(`Error auditing ${id}:`, error.message);
        results.push({ id, status: 'Audit Failed', score: 'Error' });
    }
});

// 4. Generate Markdown Report
let md = `# Template Field Audit Report\n\n`;
md += `Generated on: ${new Date().toLocaleString()}\n\n`;
md += `This report lists the schema field coverage for all active templates listed in \`TemplateManager.js\`.\n\n`;

md += `## Summary Table\n\n`;
md += `| Template ID | Folder Name | Score | Missing Fields Count |\n`;
md += `| :--- | :--- | :--- | :--- |\n`;
results.forEach(r => {
    md += `| \`${r.id}\` | \`${r.folderName || 'N/A'}\` | **${r.score}** | ${r.missingFields ? r.missingFields.length : 'N/A'} |\n`;
});

md += `\n---\n\n`;

md += `## Detailed Results\n\n`;

results.forEach(r => {
    md += `### ${r.folderName || r.id}\n\n`;
    if (r.status === 'File Not Found') {
        md += `⚠️ **File not found at expected path.**\n\n`;
        return;
    }

    md += `**Score:** ${r.score}\n\n`;

    if (r.missingFields && r.missingFields.length > 0) {
        md += `#### ❌ Missing Fields\n`;
        md += r.missingFields.map(f => `- \`${f}\``).join('\n') + `\n\n`;
    } else {
        md += `✅ **100% Coverage!** All schema fields are supported.\n\n`;
    }

    md += `<details>\n<summary>View Full Audit Console Output</summary>\n\n\`\`\`text\n${r.fullOutput}\n\`\`\`\n\n</details>\n\n`;
});

fs.writeFileSync(outputPath, md);
console.log(`\n✅ Audit complete. Report written to: ${outputPath}`);
