const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Renderer Audit Runner Script
 * This script runs the render_audit.js on all listed templates in TemplateManager.js
 * and writes the results to a markdown file.
 */

const baseDir = path.resolve(__dirname, '..');
const templateManagerPath = path.join(baseDir, 'app/resume-creator/templates/TemplateManager.js');
const renderAuditPath = path.join(baseDir, 'scripts/render_audit.js');
const outputPath = path.join(baseDir, 'TEMPLATE_RENDERER_AUDIT.md');

// 1. Parse TemplateManager.js to find active template IDs
const templateManagerContent = fs.readFileSync(templateManagerPath, 'utf8');

const configMatch = templateManagerContent.match(/export const templatesConfig = \[([\s\S]*?)\];/);
if (!configMatch) {
    console.error("Could not find templatesConfig in TemplateManager.js");
    process.exit(1);
}

const configContent = configMatch[1];
const cleanConfig = configContent.replace(/\/\*[\s\S]*?\*\//g, '');
const templateIdMatches = [...cleanConfig.matchAll(/id:\s*["']([^"']+)["']/g)];
const activeIds = templateIdMatches.map(m => m[1]);

console.log(`Found ${activeIds.length} active templates for Renderer Audit.`);

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
        results.push({ id, status: 'File Not Found', score: 'N/A' });
        return;
    }

    console.log(`Auditing Rendering for ${id}...`);
    try {
        const output = execSync(`node "${renderAuditPath}" "${templatePath}"`, { encoding: 'utf8' });

        // Extract score and counts
        const scoreMatch = output.match(/SCORE: (\d+\/\d+) checks passed/);
        const critMatch = output.match(/⛔\s+(\d+) CRITICAL failure/);
        const warnMatch = output.match(/⚠️\s+(\d+) warning/);

        const score = scoreMatch ? scoreMatch[1] : 'Unknown';
        const criticals = critMatch ? parseInt(critMatch[1]) : 0;
        const warnings = warnMatch ? parseInt(warnMatch[1]) : 0;

        results.push({
            id,
            folderName,
            score,
            criticals,
            warnings,
            fullOutput: output
        });
    } catch (error) {
        // Audit script exits with 1 if critical failures found, so we catch it
        const output = error.stdout || error.message;
        const scoreMatch = output.match(/SCORE: (\d+\/\d+) checks passed/);
        const critMatch = output.match(/⛔\s+(\d+) CRITICAL failure/);
        const warnMatch = output.match(/⚠️\s+(\d+) warning/);

        const score = scoreMatch ? scoreMatch[1] : 'Fail';
        const criticals = critMatch ? parseInt(critMatch[1]) : 'Error';
        const warnings = warnMatch ? parseInt(warnMatch[1]) : 'Error';

        results.push({
            id,
            folderName,
            score,
            criticals,
            warnings,
            fullOutput: output
        });
    }
});

// 4. Generate Markdown Report
let md = `# Template Renderer Audit Report\n\n`;
md += `Generated on: ${new Date().toLocaleString()}\n\n`;
md += `This report evaluates the rendering and pagination logic for all active templates.\n\n`;

md += `## Summary Table\n\n`;
md += `| Template ID | Folder Name | Score | Critical Failures | Warnings |\n`;
md += `| :--- | :--- | :--- | :--- | :--- |\n`;
results.forEach(r => {
    const critIcon = r.criticals > 0 ? '🔴 ' : (r.criticals === 0 ? '✅ ' : '❓ ');
    md += `| \`${r.id}\` | \`${r.folderName || 'N/A'}\` | ${r.score} | ${critIcon}${r.criticals} | ${r.warnings} |\n`;
});

md += `\n---\n\n`;

md += `## Detailed Results\n\n`;

results.forEach(r => {
    md += `### ${r.folderName || r.id}\n\n`;
    if (r.status === 'File Not Found') {
        md += `⚠️ **File not found at expected path.**\n\n`;
        return;
    }

    md += `**Score:** ${r.score}\n`;
    md += `**Critical Failures:** ${r.criticals}\n`;
    md += `**Warnings:** ${r.warnings}\n\n`;

    md += `<details>\n<summary>View Full Renderer Audit Output</summary>\n\n\`\`\`text\n${r.fullOutput}\n\`\`\`\n\n</details>\n\n`;
});

fs.writeFileSync(outputPath, md);
console.log(`\n✅ Renderer Audit complete. Report written to: ${outputPath}`);
