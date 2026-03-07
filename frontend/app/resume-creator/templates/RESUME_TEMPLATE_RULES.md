# 📋 Resume Template Development Rules

This document contains the **non-negotiable** rules for developing and maintaining resume templates in this project. All new templates and modifications to existing ones MUST follow these standards to ensure features like **Hover-to-Edit**, **Spell Check**, and **Drag & Drop** work correctly.

---

## 1. Interactivity & "Hover-to-Edit"
Every section in a template must be interactive so users can click it to jump to the relevant form.
- ✅ **RULE**: Every rendered section (whether default or custom) **MUST** be wrapped in a `<SectionWrapper>`.
- ✅ **RULE**: The `SectionWrapper` must receive the `onSectionClick` prop and the correct `sectionId`.
- ✅ **RULE**: Set `isInteractive={!!onSectionClick && !isSpellCheckActive}`. Interactivity should be disabled during Spell Check mode to prevent accidental navigation.

```javascript
<SectionWrapper 
    sectionId="summary" 
    onSectionClick={onSectionClick} 
    isInteractive={isInteractive} 
    label="Summary"
>
    {/* Section Content */}
</SectionWrapper>
```

---

## 2. Spell Check Compatibility
Spell check relies on specific components to highlight and replace text.
- ✅ **RULE**: Use `<SpellCheckText>` for plain strings (names, dates, locations).
- ✅ **RULE**: Use `<RichTextSpellCheck>` for HTML content (descriptions, summaries).
- ✅ **RULE**: Always pass `isActive={isSpellCheckActive}`, `onIgnore={onSpellCheckIgnore}`, and `onReplace={onSpellCheckReplace}` to these components.
- ✅ **RULE**: If using `customRenderers` in `SectionRenderer`, ensure they correctly call the `onSpellCheckReplace(sectionId, index, newValue, field)` callback.

---

## 3. Styling & Customization (CSS Variables)
Templates must be customizable via the sidebar design controls.
- ✅ **RULE**: Use **CSS Variables** for all theme-able properties.
    - `var(--theme-color)`: Primary color.
    - `var(--theme-font)`: Primary font.
    - `var(--theme-section-margin)`: Margin between sections.
    - `var(--theme-page-margin)`: Padding for the whole page.
- ✅ **RULE**: For template-specific font styles (e.g., Serif for headings), set the variables at the root of your template component.

---

## 4. Drag and Drop Persistence
Layouts must be isolated so reordering one template doesn't mess up another.
- ✅ **RULE**: Always use `templateLayouts` to store and retrieve section orders.
- ✅ **RULE**: When calling `useResumeDragAndDrop`, pass the `scale` prop so the "ghost" element matches the zoomed preview accurately.
- ✅ **RULE**: Ensure all draggable containers are wrapped in `<DroppableZone>` and `<SortableContext>`.

---

## 5. Standardized Components
- ✅ **RULE**: Use `<SectionTitle>` for all headings. It supports custom overrides via CSS variables (e.g., `--section-title-font: serif`).
- ✅ **RULE**: Use `<ExperienceItem>`, `<EducationItem>`, and `<ProjectItem>` where possible to maintain consistency across templates.

---

---

## 6. Zero Margin & Full-Width Layouts
When creating templates with no default margins (like "Modern Sky"):
- ✅ **RULE**: Set `pageMargin: 0.1` in the template's `defaults` (in `TemplateManager.js`). A tiny non-zero value is safer than `0` for some browser/UI calculations, though `ResumeRenderer` now supports `0` explicitly.
- ✅ **RULE**: Do NOT hardcode margins inside your template wrapper. Rely on `var(--theme-page-margin)` so users can adjust it later.

---

## 7. Onboarding & High-Fidelity Previews
The "Choose Your Template" screen uses the `ResumeRenderer` directly.
- ✅ **RULE**: You **MUST** define a `defaults` object for your template in `TemplateManager.js`.
- ✅ **RULE**: This object should include `fontSize`, `fontFamily`, `sectionSpacing`, and `pageMargin`.
- ✅ **CRITICAL**: Without `defaults`, the Onboarding preview will use the system fallback (40px margins), making full-width templates look broken in the selection grid.

---

## 8. Checklist for New Templates
Before considering a template "Done", verify:
1. [ ] **Hover-to-Edit**: Can I hover and click every section?
2. [ ] **Spell Check**: Do red underlines appear in the Spell Check tab? Can I replace words?
3. [ ] **Drag & Drop**: Can I move sections between columns without them disappearing?
4. [ ] **Scaling**: Does the cursor/ghost align correctly at 50% vs 100% zoom?
5. [ ] **Onboarding Preview**: Does the template look correct in the "Choose Template" selection grid? (Check margins!)

---

**Last Updated**: Feb 14, 2026
**Reason**: Added Zero-Margin handling rules and Onboarding Preview documentation.
