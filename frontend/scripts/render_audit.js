/**
 * render_audit.js — Template Rendering & Pagination Field Audit
 *
 * Usage:
 *   node scripts/render_audit.js <path-to-template.jsx>         # audit one template
 *   node scripts/render_audit.js --all                           # audit every template in templates/
 *
 * Exit codes:
 *   0 = all CRITICAL checks passed
 *   1 = one or more CRITICAL checks failed
 *
 * Checks are rated:
 *   🔴 CRITICAL  — will cause broken pagination, must fix before shipping
 *   🟡 WARNING   — potential issue, verify manually
 *   🟢 INFO      — informational / advisory
 */

const fs = require('fs');
const path = require('path');

// ─── CLI ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const auditAll = args.includes('--all');
const TEMPLATES_DIR = path.resolve(__dirname, '../app/resume-creator/templates');

let filesToAudit = [];

if (auditAll) {
    filesToAudit = fs.readdirSync(TEMPLATES_DIR)
        .filter(name => {
            const dir = path.join(TEMPLATES_DIR, name);
            return fs.statSync(dir).isDirectory() && !name.startsWith('_');
        })
        .map(name => path.join(TEMPLATES_DIR, name, `${name}.jsx`))
        .filter(f => fs.existsSync(f));
} else {
    if (!args[0]) {
        console.error('Usage:');
        console.error('  node render_audit.js <template_path>');
        console.error('  node render_audit.js --all');
        process.exit(1);
    }
    filesToAudit = [path.resolve(args[0])];
}

// ─── AUDIT LOGIC ─────────────────────────────────────────────────────────────
let globalCriticalFailures = 0;

function auditFile(fullPath) {
    const name = path.basename(fullPath);
    const content = fs.readFileSync(fullPath, 'utf8');

    const isTwoCol = (
        content.includes('activeSidebarSections') ||
        content.includes('sidebar-p') ||
        content.includes('activeLeftSections') ||
        content.includes('activeRightSections')
    );

    let fileCriticalFailures = 0;
    const results = [];

    const check = (level, label, passing, detail = '') => {
        const icon = passing
            ? (level === 'CRITICAL' ? '✅' : level === 'WARNING' ? '✅' : '✅')
            : (level === 'CRITICAL' ? '🔴' : level === 'WARNING' ? '🟡' : '🟢');
        if (!passing) {
            if (level === 'CRITICAL') fileCriticalFailures++;
        }
        results.push({ icon, level, label, passing, detail });
    };

    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 1 — PAGINATION CORE (all CRITICAL per guidelines §8)
    // ════════════════════════════════════════════════════════════════════════

    // 1a. page-height-marker — THE most important check (bug report §Root Cause)
    check('CRITICAL', 'page-height-marker div in Measurer',
        content.includes('page-height-marker'),
        'Missing → useAutoPagination falls back to arithmetic A4 constant, DPI-inaccurate');

    // 1b. data-column-id on column wrappers in Measurer
    check('CRITICAL', 'data-column-id on column wrappers',
        /data-column-id=/.test(content),
        'Missing → hook cannot locate columns for budget measurement');

    // 1c. useAutoPagination import + call
    check('CRITICAL', 'useAutoPagination imported & called',
        content.includes('useAutoPagination'),
        'Missing → no pagination at all');

    // 1d. Measurer component rendered
    check('CRITICAL', '<Measurer /> rendered in JSX output',
        /<Measurer\s*\/>/.test(content) || /<Measurer>/.test(content),
        'Missing → hook has nothing to measure from');

    // 1e. containerRef on outermost div (§9)
    check('CRITICAL', 'ref={containerRef} on outermost div',
        content.includes('ref={containerRef}'),
        'Missing → useAutoPagination cannot find the DOM root');

    // 1f. enabled: showPageBreaks — not hardcoded true (§6)
    check('CRITICAL', 'enabled: showPageBreaks (not hardcoded)',
        content.includes('enabled: showPageBreaks') || content.includes('enabled:showPageBreaks'),
        'If hardcoded to true, pagination runs even in free-flow mode');

    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 2 — PAGE HEIGHT SANITY (bug report §SageSplit / §7)
    // ════════════════════════════════════════════════════════════════════════

    // 2a. styles.page must NOT use minHeight as its primary height definition
    const hasMinHeightOnly = /page:\s*\{[^}]*minHeight:\s*['"]297mm['"][^}]*\}/.test(content)
        && !/page:\s*\{[^}]*(?:^|\s)height:\s*['"]297mm['"][^}]*\}/.test(content);
    check('CRITICAL', 'styles.page uses height:"297mm" (not just minHeight)',
        !hasMinHeightOnly,
        'Use of minHeight only causes pages to grow beyond A4 in pagination mode');

    // 2b. styles.page must not use overflow: visible
    const hasOverflowVisible = /page:\s*\{[^}]*overflow:\s*['"]visible['"][^}]*\}/.test(content);
    check('CRITICAL', 'styles.page does NOT use overflow:"visible"',
        !hasOverflowVisible,
        'overflow:visible allows content to bleed beyond the page boundary');

    // 2c. Paginated page divs override height to 297mm
    check('CRITICAL', 'Paginated page div overrides height to "297mm"',
        content.includes('"297mm"') && content.includes('pages.map'),
        'Without explicit override, minHeight from styles.page causes infinite growth');

    // 2d. Free-flow page uses height:"auto"
    check('WARNING', 'Free-flow fallback div uses height:"auto"',
        content.includes('height: "auto"') || content.includes("height: 'auto'"),
        'Free-flow mode needs auto height so content isn\'t clipped');

    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 3 — SECTION CONTINUATION (§10, §11)
    // ════════════════════════════════════════════════════════════════════════

    check('CRITICAL', 'renderZone unpacks sid object (isContinued support)',
        content.includes('typeof sid === \'object\'') || content.includes('typeof sid === "object"'),
        'Without unpacking, continuation sections and split itemIndices are ignored');

    check('CRITICAL', 'useSectionContext() for isContinued label',
        content.includes('useSectionContext'),
        'Missing → "(Cont.)" suffix never shown on continued sections');

    check('CRITICAL', 'isContinued passed to SectionRenderer in renderZone',
        content.includes('isContinued={isContinued}'),
        'Missing → SectionRenderer never gets the continuation flag');

    check('CRITICAL', 'subItemRanges passed to SectionRenderer in renderZone',
        content.includes('subItemRanges={typeof sid'),
        'Missing → text-splitting across pages will not work');

    check('CRITICAL', 'itemIndices passed to SectionRenderer in renderZone',
        content.includes('itemIndices={typeof sid'),
        'Missing → item-level splitting across pages will not work');

    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 4 — data-item-index (§12)
    // ════════════════════════════════════════════════════════════════════════

    check('CRITICAL', 'data-item-index uses originalIdx (not i)',
        content.includes('data-item-index={originalIdx}'),
        'Using bare {i} breaks splitting when itemIndices is a subset');

    const itemIndexCount = (content.match(/data-item-index=/g) || []).length;
    check('WARNING', `data-item-index present on repeatable items (found: ${itemIndexCount})`,
        itemIndexCount >= 3,
        'Should appear on every item in experience, education, skills, etc.');

    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 5 — DRAG & DROP (§5)
    // ════════════════════════════════════════════════════════════════════════

    check('CRITICAL', '<DndContext> wrapper present',
        content.includes('<DndContext'),
        'Without DndContext, drag-and-drop will crash');

    check('CRITICAL', '<SortableContext> present',
        content.includes('<SortableContext'),
        'Required for sortable drag-and-drop');

    check('CRITICAL', '<DroppableZone> used in renderZone',
        content.includes('<DroppableZone') || content.includes('DroppableZone'),
        'Sections won\'t be droppable without this');

    check('CRITICAL', '<DraggableSection> used in renderZone',
        content.includes('DraggableSection'),
        'Sections won\'t be draggable without this');

    check('WARNING', 'DroppableZone fills full height (flex: 1)',
        /renderZone\([^,]+,[^,]+,\s*\{[^}]*flex:\s*(?:1|['"]1['"])/.test(content) ||
        /(?:Gap|Style|Col|STYLE|COL)\s*=\s*\{[^}]*flex:\s*(?:1|['"]1['"])/.test(content) ||
        /DroppableZone[^>]*style={{[^}]*flex:\s*(?:1|['"]1['"])/.test(content),
        'Drop zones with height:auto require precise "wiggling" to drop into. Add flex:1 to the DroppableZone style.');

    check('WARNING', 'StableResumeDragOverlay present',
        content.includes('StableResumeDragOverlay'),
        'Drag preview overlay missing — drag UX will be broken');

    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 6 — CSS VARIABLES (§13)
    // ════════════════════════════════════════════════════════════════════════

    const cssVars = {
        '--theme-color': content.includes('--theme-color'),
        '--theme-font': content.includes('--theme-font'),
        '--theme-font-scale': content.includes('--theme-font-scale'),
        '--theme-line-height': content.includes('--theme-line-height'),
        '--theme-page-margin': content.includes('--theme-page-margin'),
        '--theme-section-margin': content.includes('--theme-section-margin'),
        '--theme-paragraph-margin': content.includes('--theme-paragraph-margin'),
    };
    const passedVars = Object.values(cssVars).filter(Boolean).length;
    const totalVars = Object.keys(cssVars).length;
    check('WARNING', `CSS theme variables supported (${passedVars}/${totalVars})`,
        passedVars >= 5,
        Object.entries(cssVars).filter(([, v]) => !v).map(([k]) => k).join(', ') || 'all present');

    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 7 — SECTION COVERAGE
    // ════════════════════════════════════════════════════════════════════════

    const allSections = [
        'summary', 'contact', 'experience', 'education', 'skills', 'strengths',
        'additionalSkills', 'projects', 'languages', 'certifications', 'software',
        'interests', 'keyAchievements', 'accomplishments', 'affiliations',
        'personalDetails', 'additionalInfo', 'custom', 'websites'
    ];
    const customSections = allSections.filter(s => content.includes(`${s}:`));
    const fallbackSections = allSections.filter(s => !content.includes(`${s}:`));

    check('INFO', `Section coverage: ${customSections.length}/${allSections.length} custom-rendered`,
        customSections.length >= 10,
        `Details:
           ↳ Custom: ${customSections.join(', ') || 'none'}
           ↳ Fallback (generic): ${fallbackSections.join(', ') || 'none'}`);

    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 8 — TEMPLATE ID
    // ════════════════════════════════════════════════════════════════════════

    const idMatch = content.match(/templateId\s*=\s*['"]([^'"]+)['"]/);
    check('WARNING', `templateId defined (${idMatch ? idMatch[1] : 'MISSING'})`,
        !!idMatch,
        'Must match the id field in TemplateManager.js');

    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 9 — HEADER GUARD
    // ════════════════════════════════════════════════════════════════════════

    check('WARNING', 'Header renders only on page 0 (i === 0)',
        content.includes('i === 0') && content.includes('<Header'),
        'Without guard, header appears on every page');

    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 10 — COMPONENT SIGNATURE
    // ════════════════════════════════════════════════════════════════════════

    check('WARNING', 'showPageBreaks prop accepted',
        content.includes('showPageBreaks'),
        'Without this prop, pagination cannot be toggled');

    check('WARNING', 'layoutConfig prop accepted',
        content.includes('layoutConfig'),
        'Required for saved layout persistence');

    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 11 — ADAPTIVE RENDERING
    // ════════════════════════════════════════════════════════════════════════

    if (isTwoCol) {
        const adaptiveSections = [
            'experience', 'education', 'skills', 'strengths', 'additionalSkills',
            'projects', 'languages', 'certifications', 'software', 'keyAchievements',
            'accomplishments', 'affiliations', 'personalDetails', 'summary',
            'interests', 'additionalInfo', 'custom', 'websites'
        ];
        const analyzed = adaptiveSections.map(s => {
            const regex = new RegExp(`${s}:\\s*\\(({[^}]*})\\)\\s*=>`, 'g');
            const match = regex.exec(content);
            if (!match) return { s, hasZoneId: false, usesZoneId: false, present: false };

            const args = match[1];
            const hasZoneId = args.includes('zoneId');

            const startIdx = match.index;
            const blockSnippet = content.substring(startIdx, startIdx + 2000);
            const usesZoneId = blockSnippet.includes('zoneId?.') ||
                blockSnippet.includes('zoneId.includes') ||
                blockSnippet.includes('isSidebar') ||
                blockSnippet.includes('isHeader');

            return { s, hasZoneId, usesZoneId, present: true };
        });

        const presentSections = analyzed.filter(a => a.present);
        const adaptiveCount = presentSections.filter(a => a.hasZoneId && a.usesZoneId).length;
        const adapts = presentSections.filter(a => a.hasZoneId && a.usesZoneId).map(a => a.s);
        const missingAdaptive = presentSections.filter(a => !a.usesZoneId).map(a => a.s);

        check('WARNING', `Adaptive rendering support (${adaptiveCount}/${presentSections.length} active sections)`,
            adaptiveCount === presentSections.length,
            `Details:
           ↳ Adaptive: ${adapts.join(', ') || 'none'}
           ↳ Static (always same): ${missingAdaptive.join(', ') || 'none'}`);
    } else {
        check('INFO', 'Adaptive rendering (1-column template)', true, 'No column adaptation needed for single-column layouts');
    }
    // ════════════════════════════════════════════════════════════════════════
    //  SECTION 12 — MEASUREMENT ALIGNMENT (Prevents Section Cut-off)
    // ════════════════════════════════════════════════════════════════════════

    // 12a. Look for gap in Measurer column
    const measurerBlockMatch = content.match(/<div[^>]*data-column-id=['"]main['"][^>]*style={{([^}]+)}}/s);
    const measurerStyleStr = measurerBlockMatch ? measurerBlockMatch[1] : '';

    // Check if Measurer column spreads variables (like ...styles.bodyPad, ...ZONE_STYLE)
    const measurerSpreads = [...measurerStyleStr.matchAll(/\.\.\.([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)?)/g)].map(m => m[1]);
    let measurerGap = null;

    for (const varPath of measurerSpreads) {
        // Handle both simple 'ZONE_STYLE' and nested 'styles.bodyPad'
        const baseVar = varPath.split('.')[0];
        const property = varPath.includes('.') ? varPath.split('.')[1] : null;

        if (property) {
            // Check for nested property like styles: { bodyPad: { gap: '...' } }
            const nestedRegex = new RegExp(`${baseVar}\\s*=\\s*\\{[^}]*${property}:\\s*\\{[^}]*gap:\\s*['"]([^'"]+)['"]`, 's');
            const nestedMatch = content.match(nestedRegex);
            if (nestedMatch) { measurerGap = nestedMatch[1]; break; }
        } else {
            // Check for simple variable
            const varRegex = new RegExp(`${baseVar}\\s*=\\s*\\{[^}]*gap:\\s*['"]([^'"]+)['"]`, 's');
            const varMatch = content.match(varRegex);
            if (varMatch) { measurerGap = varMatch[1]; break; }
        }
    }

    // Fallback: search for literal gap in the style string itself
    if (!measurerGap) {
        const gapMatch = measurerStyleStr.match(/gap:\s*['"]([^'"]+)['"]/);
        if (gapMatch) measurerGap = gapMatch[1];
    }

    // 12b. Look for gap in renderZone body OR a ZONE_STYLE variable
    const renderZoneVarMatch = content.match(/(?:ZONE_STYLE|columnStyle)\s*=\s*\{[^}]*gap:\s*['"]([^'"]+)['"]/);
    const renderZoneLiteralMatch = content.match(/<DroppableZone[^>]*?style={{[^}]*gap:\s*['"]([^'"]+)['"]/s);

    const renderZoneGap = renderZoneVarMatch ? renderZoneVarMatch[1] : (renderZoneLiteralMatch ? renderZoneLiteralMatch[1] : null);

    check('CRITICAL', 'Measurer column gap matches renderZone gap',
        measurerGap === renderZoneGap,
        `Mismatch: Measurer has "${measurerGap || 'none'}", Render has "${renderZoneGap || 'none'}". Both MUST match to prevent Page 2+ cut-offs.`);

    const hasRedundantMargin = /contentWrapper:\s*\{[^}]*marginBottom:\s*['"][^'"]+['"]/.test(content);
    check('WARNING', 'No redundant marginBottom on section wrappers',
        !(hasRedundantMargin && renderZoneGap),
        'Found marginBottom in styles.contentWrapper while column uses a gap. Use only column gap for precise multi-page measurement.');

    // ════════════════════════════════════════════════════════════════════════
    //  PRINT RESULTS
    // ════════════════════════════════════════════════════════════════════════

    console.log('\n');
    console.log(`╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║  TEMPLATE AUDIT: ${name.padEnd(44)}║`);
    console.log(`║  LAYOUT: ${(isTwoCol ? '2-COLUMN (sidebar + main)' : '1-COLUMN (main only)').padEnd(52)}║`);
    console.log(`╚══════════════════════════════════════════════════════════════╝`);

    const groups = [
        { title: '§1  Pagination Core', items: results.slice(0, 6) },
        { title: '§2  Page Height Sanity', items: results.slice(6, 10) },
        { title: '§3  Section Continuation', items: results.slice(10, 15) },
        { title: '§4  data-item-index', items: results.slice(15, 17) },
        { title: '§5  Drag & Drop', items: results.slice(17, 23) },
        { title: '§6  CSS Variables', items: results.slice(23, 24) },
        { title: '§7  Section Coverage', items: results.slice(24, 25) },
        { title: '§8  Template ID', items: results.slice(25, 26) },
        { title: '§9  Header Guard', items: results.slice(26, 27) },
        { title: '§10 Component Signature', items: results.slice(27, 29) },
        { title: '§11 Adaptive Rendering', items: results.slice(29, 30) },
        { title: '§12 Measurement Alignment', items: results.slice(30, 32) },
    ];

    for (const group of groups) {
        console.log(`\n  ── ${group.title} ${'─'.repeat(Math.max(0, 50 - group.title.length))}`);
        for (const r of group.items) {
            const levelTag = r.level === 'CRITICAL' ? '[CRIT]' : r.level === 'WARNING' ? '[WARN]' : '[INFO]';
            const line = `  ${r.icon}  ${levelTag.padEnd(7)} ${r.label}`;
            console.log(line);

            // Show details for critical failures OR any info/warning (which contains useful metadata)
            if (!r.passing || r.level === 'INFO' || r.level === 'WARNING') {
                if (r.detail) {
                    // Handle multi-line details for cleaner formatting
                    const detailLines = r.detail.split('\n');
                    detailLines.forEach(l => {
                        console.log(`           ${l.trim().startsWith('↳') ? '' : '↳ '}${l.trim()}`);
                    });
                }
            }
        }
    }

    const totalChecks = results.length;
    const passed = results.filter(r => r.passing).length;
    const criticalFail = results.filter(r => !r.passing && r.level === 'CRITICAL').length;
    const warnFail = results.filter(r => !r.passing && r.level === 'WARNING').length;

    console.log('\n  ──────────────────────────────────────────────────────────────');
    console.log(`  SCORE: ${passed}/${totalChecks} checks passed`);
    if (criticalFail > 0) console.log(`  ⛔  ${criticalFail} CRITICAL failure(s) — must fix before shipping`);
    if (warnFail > 0) console.log(`  ⚠️   ${warnFail} warning(s) — verify manually`);
    if (criticalFail === 0 && warnFail === 0) console.log(`  🎉  All checks passed — template is guideline-compliant`);
    console.log('  ──────────────────────────────────────────────────────────────\n');

    globalCriticalFailures += criticalFail;
    return criticalFail;
}

// ─── RUN ─────────────────────────────────────────────────────────────────────
if (auditAll) {
    console.log(`\n🔍 Auditing ${filesToAudit.length} templates in ${TEMPLATES_DIR}\n`);
    const summary = [];

    for (const f of filesToAudit) {
        const critFails = auditFile(f);
        summary.push({ name: path.basename(path.dirname(f)), critFails });
    }

    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  --all SUMMARY                                               ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    for (const r of summary) {
        const icon = r.critFails === 0 ? '✅' : '🔴';
        console.log(`  ${icon}  ${r.name.padEnd(40)} (${r.critFails} critical failure${r.critFails !== 1 ? 's' : ''})`);
    }
    console.log('');
} else {
    auditFile(filesToAudit[0]);
}

process.exit(globalCriticalFailures > 0 ? 1 : 0);
