export function generateResumeHTML(parsedJson: any, style: any, template?: string): string {
  const d = parsedJson || {}
  const font = style?.fontFamily || 'Inter, Arial, sans-serif'
  const textColor = style?.textColor || '#111827'
  const primary = style?.primaryColor || '#0f172a'
  if (template === 'template-x') {
    return generateTemplateXHTML(parsedJson, style)
  }
  if (template === 'template-y') {
    return generateTemplateYHTML(parsedJson, style)
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume</title>
  <style>
    html,body { height: 100%; }
    body { font-family: ${font}; color: ${textColor}; background: white; margin: 0; padding: 28px; line-height: 1.35; }
    .page { width: 800px; max-width: 100%; background: #fff; padding: 28px; box-sizing: border-box; }
    .header { color: ${primary}; margin-bottom: 10px }
    .section { margin-bottom: 14px }
    h1 { margin: 0; font-size: 28px; }
    h2 { margin: 0 0 6px 0; font-size: 13px; color: ${primary}; letter-spacing: 0.06em; }
    p { margin: 0; }
    ul { margin: 6px 0 0 18px }
    .meta { font-size: 12px; color: #475569 }
    .project-item { margin-bottom: 10px }
    .project-header { display:flex; justify-content:space-between; align-items:flex-start }
    .project-title { font-weight: 700 }
    .project-url { color: #2562b3 }
    .project-tech, .project-desc { color: #374151; margin-top: 6px }
  </style>
</head>
<body>
  <div class="page">
        <div class="header">
      <h1>${d.fullName || 'Your Name'}</h1>
      <div class="meta">${d.jobTitle || ''} ${d.email ? ' • ' + d.email : ''} ${d.phone ? ' • ' + d.phone : ''}</div>
      ${d.photo ? `<div style="float:right"><img src="${d.photo}" style="width:96px;height:96px;border-radius:50%"/></div>` : ''}
    </div>

    ${d.summary ? `<div class="section"><h2>Summary</h2><p>${d.summary}</p></div>` : ''}

    ${d.experience?.length ? (() => {
      const getBullets = (job: any) => {
        if (!job) return []
        if (Array.isArray(job.bullets) && job.bullets.length) return job.bullets
        if (Array.isArray(job.description) && job.description.length) return job.description
        if (typeof job.description === 'string' && job.description.trim()) return job.description.split(/\r?\n+/).map((s: string) => s.trim()).filter(Boolean)
        if (typeof job.summary === 'string' && job.summary.trim()) return job.summary.split(/\r?\n+/).map((s: string) => s.trim()).filter(Boolean)
        return []
      }
      return `<div class="section"><h2>Experience</h2>${d.experience.map((e: any) => `<div style="margin-bottom:8px"><div style="font-weight:600">${escapeHtml(e.title || '')} — ${escapeHtml(e.company || '')}</div><div style="font-size:12px;color:#64748b">${escapeHtml(e.startDate || e.start || '')} - ${escapeHtml(e.endDate || e.end || 'Present')}</div><ul>${(getBullets(e) || []).map((b: any) => `<li>${escapeHtml(b)}</li>`).join('')}</ul></div>`).join('')}</div>`
    })() : ''}

    ${d.education?.length ? `<div class="section"><h2>Education</h2>${d.education.map((ed: any) => `<div style="margin-bottom:6px"><div style="font-weight:600">${ed.degree}</div><div style="font-size:12px;color:#64748b">${ed.school} ${ed.graduationDate ? '(' + ed.graduationDate + ')' : ''}</div></div>`).join('')}</div>` : ''}

    ${d.skills?.length ? `<div class="section"><h2>Skills</h2><p>${d.skills.join(', ')}</p></div>` : ''}
    ${d.projects?.length ? `<div class="section"><h2>Projects</h2>${d.projects.map((p: any) => `<div class="project-item"><div class="project-header"><div class="project-title">${escapeHtml(p.name || '')}${p.url ? ' <span class="project-url"><a href="' + escapeHtml(p.url) + '">' + escapeHtml(p.url) + '</a></span>' : ''}</div></div>${p.technologies && p.technologies.length ? '<div class="project-tech">Technologies: ' + escapeHtml((Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) || '') + '</div>' : ''}${p.description ? '<div class="project-desc">' + escapeHtml(p.description) + '</div>' : ''}</div>`).join('')}</div>` : ''}
  </div>
</body>
</html>`
}

function generateTemplateXHTML(parsedJson: any, style: any) {
  const d = parsedJson || {}
  const font = style?.fontFamily || 'Inter, Arial, sans-serif'
  const primary = style?.primaryColor || '#0d47a1'
  // Use the same HTML/CSS used by the frontend template-x so exported PDFs match the visual preview
  return `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Template X Resume</title>
  <style>
    /* prefer link-based font loading for consistent PDF rendering */
    
    /* font loaded via link tag below (keeps the CSS import out of inline styles) */
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <style>
    body {
      font-family: ${font};
      background: #ffffff;
      color: #1f2937;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 860px;
      /* allow content to flow — don't hard cap height so exported PDFs show full descriptions */
      margin: 24px auto;
      background: #fff;
      padding: 28px;
      border-radius: 0;
      box-shadow: none;
    }

    /* export/print override to ensure a consistent 5px page edge margin and prevent horizontal overflow */
    @page { margin: 5px; }
    html, body { margin: 0; padding: 0; box-sizing: border-box; overflow-x: hidden; }
    body > .container, body > .resume-blue, body > main { margin: 0; padding: 5px !important; max-width: calc(100% - 10px) !important; }

    /* make images responsive */
    img { max-width: 100%; height: auto; display: block; }

    /* allow header to wrap instead of causing horizontal scroll */
    .header { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap }

    /* skills chips: wrap and allow multi-line content */
    .skills-list { display:flex; flex-wrap:wrap; gap:7px 13px; margin-top:8px; margin-bottom:10px }
    .skills-item { white-space:normal; max-width:100% }


    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .name {
      font-size: 32px;
      font-weight: 800;
      color: ${primary};
      letter-spacing: 0.5px
    }

    .role {
      font-size: 16px;
      font-weight: 700;
      color: #374151;
      margin-top: 4px
    }

    .contact {
      font-size: 12px;
      color: #6b7280;
      margin-top: 8px
    }
    .contact > div { display:inline-block; margin-right:10px; vertical-align:middle }
    .contact-icon { margin-right:6px; font-size:12px }

    .section-title {
      font-weight: 700;
      color: #374151;
      font-size: 14px;
      border-top: 2px solid ${primary};
      border-bottom: 2px solid ${primary};
      padding: 6px 0;
      margin-bottom: 10px;
      margin-top: 18px
    }

    .summary {
      font-size: 13px;
      color: #374151;
      line-height: 1.45
    }

    .experience .job {
      margin-bottom: 12px
    }

    .job .meta {
      font-size: 12px;
      color: #6b7280
    }

    .job .title {
      font-weight: 700;
      color: #111827
    }

    .bullets {
      margin-top: 6px
    }

    .bullets li {
      margin-bottom: 6px;
      font-size: 13px;
      color: #374151
    }

    /* Projects — rely on template typography (no explicit font sizes) */
    .project-item { margin-bottom: 10px }
    .project-header { display:flex; justify-content:space-between; align-items:flex-start }
    .project-title { font-weight: 700 }
    .project-url { color: #2562b3 }
    .project-tech, .project-desc { color: #374151; margin-top: 6px }


    .skills {
      display: block;
      margin-top: 6px;
    }

    .skills-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 10px;
      font-size: 13px;
      color: #374151;
      line-height: 1.45;
    }

    .skill-item {
      background: #ebf4ff;
      color: #1e40af;
      padding: 10px 12px;
      border-left: 3px solid ${primary};
      border-radius: 6px;
      font-size: 13px;
      display:flex;align-items:center;justify-content:center;
    }

    .container .summary:empty,
    .container .skills-list:empty,
    .container .experience:empty,
    .container .education:empty,
    .container .additional:empty,
    .container .name:empty,
    .container .role:empty,
    .container .contact:empty {
      color: #9ca3af;
      opacity: 0.75;
      min-height: 1em;
    }

    .skill {
      background: #ebf4ff;
      color: #1e40af;
      padding: 6px 8px;
      border-radius: 999px;
      font-size: 13px;
    }

    .edu-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #374151
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <div class="left">
        <div class="name">${escapeHtml(d.fullName || d.full_name || d.name || '')}</div>
        <div class="role">${escapeHtml(d.jobTitle || d.title || d.personal?.headline || '')}</div>
        <div class="contact">${[d.phone ? `<div><span class="contact-icon">📞</span><span>${escapeHtml(d.phone)}</span></div>` : '', d.email ? `<div><span class="contact-icon">✉️</span><span>${escapeHtml(d.email)}</span></div>` : '', (d.location || d.personal?.location) ? `<div><span class="contact-icon">📍</span><span>${escapeHtml(d.location || d.personal?.location || '')}</span></div>` : ''].filter(Boolean).join('')}</div>
      </div>
      <div class="photo">
        ${d.photo ? `<img src="${d.photo}" style="width:96px;height:96px;border-radius:50%" />` : ''}
      </div>
    </div>

    <section class="summary-section">
      <div class="section-title">Summary</div>
      <div class="summary">${escapeHtml(d.summary || d.personal?.summary || '')}</div>
    </section>

    <section class="experience">
      <div class="section-title">Professional Experience</div>
      ${Array.isArray(d.experience) ? d.experience.map((job: any) => {
    // helper to normalize bullets/description to an array
    const getBullets = (job: any) => {
      if (!job) return []
      if (Array.isArray(job.bullets) && job.bullets.length) return job.bullets
      if (Array.isArray(job.description) && job.description.length) return job.description
      if (typeof job.description === 'string' && job.description.trim()) return job.description.split(/\r?\n+/).map((s: string) => s.trim()).filter(Boolean)
      if (typeof job.summary === 'string' && job.summary.trim()) return job.summary.split(/\r?\n+/).map((s: string) => s.trim()).filter(Boolean)
      return []
    }

    const bullets = (getBullets(job) || []).map((b: any) => `<li>${escapeHtml(b)}</li>`).join('')
    return `<div class="job"><div class="meta"><div class="title">${escapeHtml(job.title || job.role || '')}</div><div class="meta">${escapeHtml(job.company || '')} • ${escapeHtml(job.startDate || job.start || '')} ${job.endDate ? ' – ' + escapeHtml(job.endDate) : '– Present'}</div></div><ul class="bullets">${bullets}</ul></div>`
  }).join('') : ''}
    </section>

    <section class="education">
      <div class="section-title">Education</div>
      ${Array.isArray(d.education) ? d.education.map((ed: any) => `<div class="edu-row"><div>${escapeHtml(ed.degree || '')} — ${escapeHtml(ed.school || '')}</div><div>${escapeHtml(ed.graduationDate || ed.year || '')}</div></div>`).join('') : ''}
    </section>

    <section class="skills">
      <div class="section-title">Technical Skills</div>
      <div class="skills-content">${Array.isArray(d.skills) ? d.skills.map((s: any) => `<div class="skill-item">${escapeHtml(s)}</div>`).join('') : `<div class="skill-item">${escapeHtml(d.skills || '')}</div>`}</div>
    </section>

    <section class="projects">
      <div class="section-title">Projects</div>
      ${Array.isArray(d.projects) ? d.projects.map((p: any) => `
        <div class="project-item">
          <div class="project-header"><div class="project-title">${escapeHtml(p.name || '')}</div>${p.url ? `<div class="project-url"><a href="${escapeHtml(p.url)}" target="_blank">${escapeHtml(p.url)}</a></div>` : ''}</div>
          ${p.technologies && p.technologies.length ? `<div class="project-tech"><strong>Technologies:</strong> ${escapeHtml(Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies || '')}</div>` : ''}
          ${p.description ? `<div class="project-desc">${escapeHtml(p.description)}</div>` : ''}
        </div>
      `).join('') : ''}
    </section>

    <section class="additional">
      <div class="section-title">Additional Information</div>
      <div class="summary">${escapeHtml(d.additional || '')}</div>
    </section>
  </div>
</body>

</html>`
}

function escapeHtml(input: string) {
  if (!input) return ''
  return String(input).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function generateTemplateYHTML(parsedJson: any, style: any) {
  const d = parsedJson || {}
  const font = style?.fontFamily || 'Segoe UI, Arial, sans-serif'
  const primary = style?.primaryColor || '#2562b3'
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Resume Template - Blue Modern</title>
  <style>
    body {
      font-family: '${font}';
      background: #ffffff;
      margin: 0;
      padding: 0;
      color: #191a1d;
    }

    .resume-blue {
      background: #ffffff;
      max-width: 850px;
      margin: 0 auto;
      border-radius: 0;
      box-shadow: none;
      padding: 44px 48px 42px 48px;
    }

    .header-name {
      color: ${primary};
      font-size: 2.35em;
      font-weight: 700;
      margin: 0 0 14px 0;
      letter-spacing: 1.2px;
    }

    .header-bar {
      background: #eaf3fb;
      border-radius: 7px;
      margin-bottom: 15px;
      padding: 8px 18px 8px 14px;
      display: flex;
      align-items: center;
      gap: 18px;
      font-size: 1.06em;
    }

    .header-bar i {
      margin-right: 7px;
      color: ${primary};
      font-size: 1em;
    }

    .header-bar span {
      margin-right: 11px;
      color: #285fa9;
      font-size: 1em;
    }

    .section-title {
      color: #236ebe;
      font-size: 1.18em;
      margin-top: 24px;
      margin-bottom: 4px;
      font-weight: 600;
      letter-spacing: .03em;
      border-bottom: 2px solid #e7effa;
      padding-bottom: 2px;
    }

    .hr-section {
      border: none;
      border-top: 2px solid #236ebe;
      margin: 17px 0 11px 0;
    }

    .summary {
      font-size: 1.07em;
      color: #232323;
      margin-bottom: 9px;
      margin-top: 8px;
      line-height: 1.54;
    }

    /* Projects styling (inherit template sizes) */
    .project-item { margin-bottom: 10px }
    .project-header { display:flex; justify-content:space-between; align-items:flex-start }
    .project-title { font-weight: 600 }
    .project-url { color: #285fa9 }
    .project-tech, .project-desc { margin-top: 6px; color: #232323 }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 7px 13px;
      margin-top: 8px;
      margin-bottom: 10px;
    }

    .skills-item {
      background: #f8fbfd;
      border: 2px solid #236ebe;
      border-radius: 12px;
      color: #2562b3;
      padding: 4px 14px;
      font-size: 1em;
      font-weight: 500;
      white-space: nowrap;
      margin-bottom: 4px;
      letter-spacing: .01em;
    }

    .edu-head {
      font-weight: bold;
      font-size: 1.07em;
      margin-bottom: 0;
    }

    .edu-detail {
      color: #2562b3;
      font-style: italic;
      font-size: 0.97em;
      margin-bottom: 6px;
      display: block;
    }

    .edu-date {
      float: right;
      display: inline-block;
      background: #236ebe;
      color: #fff;
      border-radius: 15px;
      font-size: 0.98em;
      padding: 2.5px 18px;
      margin-left: 15px;
      margin-bottom: 7px;
    }

    .exp-company {
      font-weight: bold;
      font-size: 1.04em;
      margin-top: 18px;
      margin-bottom: 2px;
    }

    .exp-role {
      font-size: 0.99em;
      color: #3c5172;
      font-weight: 500;
      margin-bottom: 2px;
    }

    .exp-location {
      color: #338edb;
      font-style: italic;
      font-size: 0.96em;
      margin-bottom: 3px;
    }

    .exp-date {
      float: right;
      display: inline-block;
      background: #2562b3;
      color: #fff;
      border-radius: 14px;
      font-size: 0.97em;
      padding: 2.5px 16px;
      margin-left: 14px;
    }

    .exp-list {
      margin: 2px 0 9px 0;
      padding-left: 23px;
    }

    .exp-list li {
      margin-bottom: 4px;
      font-size: 1.01em;
      line-height: 1.54;
    }
  </style>
</head>
<body>
  <div class="resume-blue">
    <div class="header-name">${escapeHtml(d.fullName || d.name || d.full_name || '')}</div>
    <div class="header-bar">
      <i>📞</i><span>${escapeHtml(d.phone || '')}</span>
      <i>✉️</i><span>${escapeHtml(d.email || '')}</span>
      <i>📍</i><span>${escapeHtml(d.location || d.personal?.location || '')}</span>
    </div>
    
    ${d.summary ? `<div class="section-title">Professional Summary</div>
    <hr class="hr-section">
    <div class="summary">${escapeHtml(d.summary || d.personal?.summary || '')}</div>` : ''}

    ${d.skills?.length ? `<div class="section-title">Skills</div>
    <hr class="hr-section">
    <div class="skills-list">${d.skills.map((s: any) => `<span class="skills-item">${escapeHtml(s)}</span>`).join('')}</div>` : ''}

    ${d.education?.length ? `<div class="section-title">Education</div>
    <hr class="hr-section">
    ${d.education.map((ed: any) => `<div><div class="edu-head">${escapeHtml(ed.school || '')}<span class="edu-date">${escapeHtml(ed.graduationDate || '')}</span></div><span class="edu-detail">${escapeHtml(ed.degree || '')}</span></div>`).join('')}` : ''}

    ${d.experience?.length ? (() => {
      const getBullets = (job: any) => {
        if (!job) return []
        if (Array.isArray(job.bullets) && job.bullets.length) return job.bullets
        if (Array.isArray(job.description) && job.description.length) return job.description
        if (typeof job.description === 'string' && job.description.trim()) return job.description.split(/\r?\n+/).map((s: string) => s.trim()).filter(Boolean)
        if (typeof job.summary === 'string' && job.summary.trim()) return job.summary.split(/\r?\n+/).map((s: string) => s.trim()).filter(Boolean)
        return []
      }
      return `<div class="section-title">Experience</div>
    <hr class="hr-section">
    ${d.experience.map((e: any) => `<div><div class="exp-company">${escapeHtml(e.company || '')}<span class="exp-date">${escapeHtml(e.startDate || e.start || '')} - ${escapeHtml(e.endDate || e.end || 'Present')}</span></div><div class="exp-role">${escapeHtml(e.title || e.role || '')}</div><ul class="exp-list">${(getBullets(e) || []).map((b: any) => `<li>${escapeHtml(b)}</li>`).join('')}</ul></div>`).join('')}`
    })() : ''}
  </div>
</body>
</html>`
}
