export function generateResumeHTML(parsedJson: any, style: any, template?: string): string {
  const data = parsedJson || {}
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
    body { font-family: ${style?.fontFamily || 'Arial, sans-serif'}; color: ${style?.textColor || '#000'}; background: white; margin: ${style?.margins || 20}px; line-height: 1.4 }
    .header { color: ${style?.primaryColor || '#111827'} }
    .section { margin-bottom: 18px }
    h1 { margin: 0; font-size: 28px }
    h2 { margin-bottom: 6px }
    ul { margin: 0 0 0 18px }
  </style>
</head>
<body>
  <div class="header">
    <h1>${data.name || 'Your Name'}</h1>
    <p>${data.email || ''} ${data.phone ? ' | ' + data.phone : ''}</p>
  </div>

  ${data.summary ? `<div class="section"><h2>Summary</h2><p>${data.summary}</p></div>` : ''}

  ${data.experience?.length ? `<div class="section"><h2>Experience</h2>${data.experience.map((e: any) => `<div><h3>${e.role} — ${e.company}</h3><p>${e.start || ''} - ${e.end || 'Present'}</p><ul>${(e.description || []).map((d: any) => `<li>${d}</li>`).join('')}</ul></div>`).join('')}</div>` : ''}

  ${data.education?.length ? `<div class="section"><h2>Education</h2>${data.education.map((ed: any) => `<div><h3>${ed.degree}</h3><p>${ed.school} ${ed.year ? '(' + ed.year + ')' : ''}</p></div>`).join('')}</div>` : ''}

  ${data.skills?.length ? `<div class="section"><h2>Skills</h2><p>${data.skills.join(', ')}</p></div>` : ''}
</body>
</html>`
}

function generateTemplateXHTML(parsedJson: any, style: any) {
  const d = parsedJson || {}
  const font = style?.fontFamily || 'Inter, Arial, sans-serif'
  const primary = style?.primaryColor || '#0d47a1'
  return `<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Template X Resume</title>
    <style>
        /* prefer link-based font loading for consistent server/pdf rendering */
        </style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
      <style>
        body { font-family: ${font}; background: #ffffff; color: #1f2937; margin: 0; padding: 0; }
        .container { max-width: 860px; margin: 24px auto; background: #fff; padding: 28px; border-radius: 0; box-shadow: none; }
        /* ensure exports use a 5px page edge margin and prevent horizontal overflow */
        @page { margin: 5px; }
        html, body { margin: 0; padding: 0; box-sizing: border-box; overflow-x: hidden; }
        body > .container { margin: 0; padding: 5px !important; max-width: calc(100% - 10px) !important; }

        img { max-width: 100%; height: auto; display: block }
        .header { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap }
        .skills-list { display:flex; flex-wrap:wrap; gap:7px 13px; margin-top:8px; margin-bottom:10px }
        .skills-item { white-space:normal; max-width:100% }
        .header { display:flex; justify-content:space-between; align-items:flex-start; gap:16px }
        .name { font-size: 32px; font-weight: 800; color: ${primary}; letter-spacing: .5px }
        .role { font-size: 16px; font-weight: 700; color: #374151; margin-top: 4px }
        .contact { font-size: 12px; color: #6b7280; margin-top: 8px }
        .section-title { font-weight:700; color:#374151; font-size:14px; border-top:2px solid ${primary}; border-bottom:2px solid ${primary}; padding:6px 0; margin-bottom:10px; margin-top:18px }
        .summary { font-size:13px; color:#374151; line-height:1.45 }
        .experience .job { margin-bottom:12px }
        .job .meta { font-size:12px; color:#6b7280 }
        .job .title { font-weight:700; color:#111827 }
        .bullets { margin-top:6px }
        .bullets li { margin-bottom:6px; font-size:13px; color:#374151 }
        .skills-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; font-size:13px; color:#374151; line-height:1.45 }
        .skill-item { background: #ebf4ff; color: #1e40af; padding: 10px 12px; border-left: 3px solid ${primary}; border-radius: 6px; font-size:13px; display:flex;align-items:center;justify-content:center }
        .edu-row { display:flex; justify-content:space-between; font-size:13px; color:#374151 }
    </style>
</head>

<body>
  <div class="container">
    <div class="header">
        <div style="flex:1">
        <div class="name">${escapeHtml(d.fullName || d.name || d.full_name || '')}</div>
        <div class="role">${escapeHtml(d.jobTitle || d.title || d.personal?.headline || '')}</div>
        <div class="contact">${[d.phone ? `<div><span class="contact-icon">📞</span><span>${escapeHtml(d.phone)}</span></div>` : '', d.email ? `<div><span class="contact-icon">✉️</span><span>${escapeHtml(d.email)}</span></div>` : '', (d.location || d.personal?.location) ? `<div><span class="contact-icon">📍</span><span>${escapeHtml(d.location || d.personal?.location || '')}</span></div>` : ''].filter(Boolean).join('')}</div>
      </div>
      ${d.photo ? `<div class="photo"> <img src="${escapeHtml(d.photo)}" style="width:96px;height:96px;border-radius:50%" /> </div>` : ''}
    </div>

    ${d.summary ? `<div><h2 class="section-title">Summary</h2><div class="summary">${escapeHtml(d.summary || d.personal?.summary || '')}</div></div>` : ''}

    ${d.experience?.length ? `<div><h3 class="section-title">Experience</h3>${d.experience.map((e: any) => {
    // normalize bullets/description (accept bullets array, description array, or string)
    const bulletsArr = (Array.isArray(e?.bullets) && e.bullets.length) ? e.bullets : (Array.isArray(e?.description) ? e.description : (typeof e?.description === 'string' && e.description.trim() ? e.description.split(/\r?\n+/).map((s: string) => s.trim()).filter(Boolean) : []))
    return `<div style="margin-bottom:8px"><div style="font-weight:700">${escapeHtml(e.title || e.role || '')} — ${escapeHtml(e.company || '')}</div><div style="font-size:12px;color:#64748b">${escapeHtml(e.startDate || e.start || '')} - ${escapeHtml(e.endDate || e.end || 'Present')}</div><ul>${(bulletsArr || []).map((b: any) => `<li>${escapeHtml(b)}</li>`).join('')}</ul></div>`
  }).join('')}</div>` : ''}

    ${d.education?.length ? `<div><h3 class="section-title">Education</h3>${d.education.map((ed: any) => `<div style="margin-bottom:6px"><div style="font-weight:700">${escapeHtml(ed.degree || '')}</div><div style="font-size:12px;color:#64748b">${escapeHtml(ed.school || '')} ${ed.graduationDate ? '(' + escapeHtml(ed.graduationDate) + ')' : ''}</div></div>`).join('')}</div>` : ''}

    ${d.skills?.length ? `<div><h3 class="section-title">Skills</h3><div class="skills-content">${d.skills.map((s: any) => `<div class="skill-item">${escapeHtml(s)}</div>`).join('')}</div></div>` : ''}
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
      const bulletsFor = (job: any) => {
        if (!job) return []
        if (Array.isArray(job.bullets) && job.bullets.length) return job.bullets
        if (Array.isArray(job.description) && job.description.length) return job.description
        if (typeof job.description === 'string' && job.description.trim()) return job.description.split(/\r?\n+/).map((s: string) => s.trim()).filter(Boolean)
        return []
      }
      return `<div class="section-title">Experience</div>
    <hr class="hr-section">
    ${d.experience.map((e: any) => `<div><div class="exp-company">${escapeHtml(e.company || '')}<span class="exp-date">${escapeHtml(e.startDate || e.start || '')} - ${escapeHtml(e.endDate || e.end || 'Present')}</span></div><div class="exp-role">${escapeHtml(e.title || e.role || '')}</div><ul class="exp-list">${(bulletsFor(e) || []).map((b: any) => `<li>${escapeHtml(b)}</li>`).join('')}</ul></div>`).join('')}`
    })() : ''}
  </div>
</body>
</html>`
}
