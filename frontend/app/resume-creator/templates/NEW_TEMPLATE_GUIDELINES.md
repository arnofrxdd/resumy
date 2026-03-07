# 📋 New Template Creation Guidelines

**Last updated:** 2026-03-02 (updated with bottom-gap root-cause fix)
**Reference templates:** `SilverSerif` (single-column) · `LavenderLuxe` / `SageSplit` (two-column)
**Pagination hook:** `hooks/useAutoPagination.js`

> These rules are derived from debugging the full template library. Follow them exactly to avoid pagination, section-breaking, and continuation issues.

---

## 1. File & Folder Structure

```
templates/
└── YourTemplateName/
    └── YourTemplateName.jsx    ← single file, named exactly like the folder
```

- Folder name must be **PascalCase** and match the component name exactly.
- No subfolders, no separate CSS files — all styles go inline as JS objects.

---

## 2. Required Imports (minimum viable set)

```jsx
import React, { useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { useSectionContext } from "../common/SectionContext";
import { useAutoPagination } from "../../hooks/useAutoPagination";   // ← MANDATORY
import { SpellCheckText, SplittableRichText, RichTextSpellCheck, ResumeLink } from "../common/BaseComponents";
import { getCompleteLayout, getSavedLayout } from "../common/TemplateUtils";
```

---

## 3. Component Signature

Every template must accept exactly these props — no more, no fewer:

```jsx
const YourTemplate = ({
    data,
    onSectionClick,
    onReorder,
    scale = 1,
    isSpellCheckActive,
    onSpellCheckIgnore,
    onSpellCheckReplace,
    layoutConfig,
    showPageBreaks,
}) => {
    const containerRef = useRef(null);
    if (!data) return null;
    ...
```

---

## 4. Layout Engine Setup

### Single-column template
```jsx
const templateId = "your-template-id"; // kebab-case, must match TemplateManager.js entry
const initialLayout = getSavedLayout(data, templateId, {
    main: ["summary", "experience", "education", "skills", /* ... */],
});
const completeLayout = getCompleteLayout(data, initialLayout, "main");
const activeSections = completeLayout.main || [];
```

### Two-column template
```jsx
const templateId = "your-template-id";
const initialLayout = getSavedLayout(data, templateId, {
    sidebar: ["contact", "education", "languages", /* ... */],
    main:    ["summary", "experience", "skills", /* ... */],
});
const completeLayout = getCompleteLayout(data, initialLayout, "main");
const activeMainSections    = completeLayout.main    || [];
const activeSidebarSections = completeLayout.sidebar || [];
```

---

## 5. Drag-and-Drop Setup

### Single-column
```jsx
const { dndContextProps, activeId } = useResumeDragAndDrop({
    data, onReorder, scale,
    containers: { main: activeSections },
});
```

### Two-column
```jsx
const { dndContextProps, activeId } = useResumeDragAndDrop({
    data, onReorder, scale,
    containers: { sidebar: activeSidebarSections, main: activeMainSections },
});
```

---

## 6. Pagination Setup — CRITICAL RULES

```jsx
// Single-column
const pages = useAutoPagination({
    columns: { main: activeSections },
    data,
    enabled: showPageBreaks,
    containerRef,
    scale,
});

// Two-column
const pages = useAutoPagination({
    columns: { sidebar: activeSidebarSections, main: activeMainSections },
    data,
    enabled: showPageBreaks,
    containerRef,
    scale,
});
```

> **Never** pass `enabled: true` always — it must be `enabled: showPageBreaks` so the hook only runs when the user activates page breaks.

---

## 7. `styles.page` — CRITICAL RULES

This is the most common source of bugs across the template library.

### ✅ Correct
```jsx
page: {
    width: "210mm",
    height: "297mm",       // ← FIXED height, not minHeight
    background: "white",
    boxSizing: "border-box",
    position: "relative",
    margin: "0 auto 30px auto",
    overflow: "hidden",    // ← MUST be hidden so content clips at A4 boundary
    display: "flex",
    flexDirection: "column",
},
```

### ❌ Wrong — causes pages to grow infinitely
```jsx
page: {
    minHeight: "297mm",   // ← NEVER use minHeight for paginated pages
    overflow: "visible",  // ← NEVER use visible in paginated mode
}
```

---

## 8. The `Measurer` Component — CRITICAL RULES

The `Measurer` is a hidden off-screen DOM tree that `useAutoPagination` reads to measure content heights before laying out pages. **Without it, or when it's missing the `page-height-marker`, pagination will be wrong or completely broken.**

### ✅ Single-column Measurer (correct)
```jsx
const Measurer = () => (
    <div
        className="resume-measurer"
        style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}
    >
        {/* THIS LINE IS MANDATORY — DO NOT REMOVE */}
        <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />

        {/* Page rendered at auto height so all content is visible for measurement */}
        <div style={{ ...styles.page, height: "auto", overflow: "visible" }}>
            <Header />
            <div data-column-id="main" style={styles.mainColumn}>
                {activeSections.map(sid => (
                    <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                ))}
            </div>
        </div>
    </div>
);
```

### ✅ Two-column Measurer (correct)
```jsx
const Measurer = () => (
    <div
        className="resume-measurer"
        style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}
    >
        {/* THIS LINE IS MANDATORY — DO NOT REMOVE */}
        <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />

        <div style={{ ...styles.page, height: "auto", overflow: "visible" }}>
            <Header />
            <div style={styles.bodyRow}>
                <div data-column-id="sidebar" style={styles.sidebarCol}>
                    {activeSidebarSections.map(sid => (
                        <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="sidebar" />
                    ))}
                </div>
                <div data-column-id="main" style={styles.mainCol}>
                    {activeMainSections.map(sid => (
                        <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);
```

### Rules summary for `Measurer`
| Rule | Detail |
|---|---|
| `page-height-marker` div | **Always required** — `height: 297mm`, `width: 1px`, `position: absolute` |
| Inner page div | Must use `height: "auto"` and `overflow: "visible"` so all content is exposed |
| `data-column-id` | Every column wrapper must have this attribute matching the column key in `useAutoPagination` |
| Section items | Use `SectionRenderer` without `onSectionClick` (it's a measurement clone, not interactive) |

---

## 9. The Main Render — CRITICAL RULES

### ✅ Correct render structure
```jsx
return (
    <div ref={containerRef} className="your-template-root">
        <Measurer />
        <DndContext {...dndContextProps}>
            <SortableContext items={activeSections} strategy={verticalListSortingStrategy}>

                {showPageBreaks && pages ? (
                    // ── PAGINATED MODE ───────────────────────────────────────────
                    pages.map((page, i) => (
                        <div key={i} style={{ ...styles.page, height: "297mm", minHeight: "unset", overflow: "hidden" }}>
                            {i === 0 && <Header />}
                            {/* render columns using renderZone() */}
                        </div>
                    ))
                ) : (
                    // ── FREE-FLOW MODE (no page breaks) ──────────────────────────
                    <div style={{ ...styles.page, height: "auto", minHeight: "297mm" }}>
                        <Header />
                        {/* render columns using renderZone() */}
                    </div>
                )}

            </SortableContext>
            <StableResumeDragOverlay activeId={activeId} scale={scale} renderSection={(id) => (
                <div style={{ background: "white", padding: "10px", border: "1px solid #ddd" }}>
                    <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                </div>
            )} />
        </DndContext>
    </div>
);
```

### Key rules for the render
| Rule | Detail |
|---|---|
| Paginated page div | Always `height: "297mm"`, `minHeight: "unset"`, `overflow: "hidden"` |
| Free-flow page div | Use `height: "auto"`, `minHeight: "297mm"` so it grows naturally |
| `ref={containerRef}` | Must be on the **outermost** div — `useAutoPagination` uses this as the root |
| `<Measurer />` | Must be **first child** inside the ref div, before `DndContext` |
| Header | Only render `<Header />` on **page index 0** (`i === 0`) |

---

## 10. `renderZone` — Zone Renderer Pattern

Every template needs a `renderZone` function that accepts a `columnStyle` and passes it into `DroppableZone`. This is what controls section spacing AND enables the paginator to measure accurately.

```jsx
// Define gap style once, outside the render function
const ZONE_STYLE = {
    display: "flex",
    flexDirection: "column",
    gap: "calc(20px * var(--theme-section-margin, 1))"
};

// renderZone accepts columnStyle and passes it to DroppableZone
const renderZone = (id, items, columnStyle = {}) => (
    <DroppableZone id={id} style={{ ...columnStyle }}>
        {items.map((sid, idx) => {
            const isContinued = typeof sid === "object" && sid.isContinued;
            const sectionId   = typeof sid === "string" ? sid : sid.id;
            const dragId      = isContinued ? `${id}-cont-${sectionId}-${idx}` : sectionId;
            return (
                <DraggableSection key={dragId} id={dragId} isEnabled={canReorder && !isContinued}>
                    <SectionRenderer
                        sectionId={sectionId}
                        data={data}
                        onSectionClick={onSectionClick}
                        isContinued={isContinued}
                        itemIndices={typeof sid === "object" ? sid.itemIndices : undefined}
                        subItemRanges={typeof sid === "object" ? sid.subItemRanges : undefined}
                        customRenderers={customRenderers}
                        zoneId={id}
                    />
                </DraggableSection>
            );
        })}
    </DroppableZone>
);
```

Then call it consistently with the zone style in both paginated and free-flow modes:

```jsx
// ✅ Paginated
{renderZone(`main-p${i}`, page.main, ZONE_STYLE)}

// ✅ Free-flow
{renderZone("main", activeSections, ZONE_STYLE)}
```

> **Never** render `items.map(sid => <SectionRenderer sectionId={sid} ... />)` directly — you must unpack the `sid` object for continuation support.

---

## 11. Section Continuation — `isContinued` Pattern

Every section component must display a "(Cont.)" suffix when it is a continuation from the previous page. Use `useSectionContext()` for this:

```jsx
const SectionTitle = ({ title }) => {
    const { isContinued } = useSectionContext();
    return (
        <div style={styles.sectionTitle}>
            {isContinued ? `${title} (Cont.)` : title}
        </div>
    );
};
```

- All section title sub-components must call `useSectionContext()`.
- Never pass `isContinued` as a manual prop to the title — always read it from context.

---

## 12. `data-item-index` Attribute — CRITICAL

Every item in a repeatable section (experience, education, skills, etc.) **must** have `data-item-index` set to its original array index. Without this, `useAutoPagination` cannot split sections across pages.

```jsx
// ✅ Correct — uses original array index, not the enumeration index i
items.map((exp, i) => {
    const originalIdx = itemIndices ? itemIndices[i] : i;
    return (
        <div key={i} data-item-index={originalIdx} style={...}>
            ...
        </div>
    );
})
```

```jsx
// ❌ Wrong — uses enumeration index which breaks when itemIndices is a subset
items.map((exp, i) => (
    <div key={i} data-item-index={i}>   {/* i !== originalIdx when paginated */}
```

---

## 13. CSS Variables — Required Support

All templates must respect these CSS variables for user customization:

| Variable | What it controls | Typical fallback |
|---|---|---|
| `--theme-color` | Accent / brand color | `#your-default` |
| `--theme-font` | Font family | `'Inter', sans-serif` |
| `--theme-font-scale` | Font size multiplier | `1` |
| `--theme-line-height` | Line height | `1.5` |
| `--theme-page-margin` | Page padding | `32px` |
| `--theme-section-margin` | Gap between sections | `1` (multiplier) |
| `--theme-paragraph-margin` | Gap between items | `1` (multiplier) |
| `--theme-letter-spacing` | Letter spacing | `0em` |

Usage pattern:
```jsx
fontSize: "calc(13px * var(--theme-font-scale, 1))",
lineHeight: "var(--theme-line-height, 1.5)",
gap: "calc(20px * var(--theme-section-margin, 1))",
padding: "var(--theme-page-margin, 32px)",
```

---

## 14. Register in `TemplateManager.js`

After creating the template file, register it in `TemplateManager.js`:

```js
{
    id: "your-template-id",     // kebab-case, matches templateId in the component
    name: "Your Template Name",
    component: "YourTemplateName",  // must match the folder/file name exactly
    category: "professional",       // or "creative", "modern", etc.
    columns: 1,                     // or 2
    defaultTheme: {
        color: "#yourColor",
        font: "Inter",
        pageMargin: 32,
    }
}
```

---

---

## 16. ⚠️ Section Spacing: `gap` vs `marginBottom` — CRITICAL

**Discovered:** 2026-03-02 · Caused large bottom whitespace gaps in SilverSerif and AzureSkyline.

### The Problem

`useAutoPagination` measures section heights using `getBoundingClientRect()`. This call returns an element's **border-box height, which excludes CSS `margin-bottom`**. 

If you use `marginBottom` on a section wrapper (e.g. `sectionWrap: { marginBottom: "16px" }`), the paginator's running `cursor` never accounts for the trailing margin of the **last section on a page**. The cursor says content ends at pixel 900, but the DOM actually renders to pixel 916 (900 + 16px margin). This leaves a phantom **16px gap** at the bottom of every page — before a section continues.

### The Rule

> **Always use CSS `gap` on the column container for section spacing. Never use `marginBottom` on individual section wrappers.**

### ✅ Correct — gap on the column container

```jsx
// In the Measurer's data-column-id div:
<div
    data-column-id="main"
    style={{ display: "flex", flexDirection: "column", gap: "calc(16px * var(--theme-section-margin, 1))" }}
>
    {sections}
</div>

// And the same gap passed to DroppableZone in the render:
const ZONE_STYLE = { display: "flex", flexDirection: "column", gap: "calc(16px * var(--theme-section-margin, 1))" };
{renderZone(`main-p${i}`, page.main, ZONE_STYLE)}
```

CSS `gap` only applies **between** items, not after the last one. So the paginator's cursor is always exact — no trailing phantom space.

### ❌ Wrong — marginBottom on section wrapper

```jsx
// ❌ Do NOT do this:
sectionWrap: {
    marginBottom: "calc(16px * var(--theme-section-margin, 1))",  // NOT included in getBoundingClientRect()
},
```

The issue grows with every additional section — each split point accumulates one uncounted `marginBottom`.

### Also ensure the Measurer's column gap MATCHES the rendered gap

Both the Measurer and the real rendered pages must use the **same gap value**. If they differ, the paginator's budget will be calibrated for a different layout than what's rendered.

---

## 17. ⚠️ `DroppableZone` Anti-Pattern: `height: '100%'` — CRITICAL

**Discovered:** 2026-03-02 · Was the root cause of the massive bottom gap in single-column templates.

### The Problem

`DroppableZone` is defined in `hooks/useResumeDragAndDrop.js`. It previously had `height: '100%'` hardcoded in its style. Here's why this breaks pagination:

In the **Measurer**, the page div has `height: auto` (grows to fit content). The `DroppableZone` inside it with `height: '100%'` expands to try to match the parent's height. In a flex-column layout with `height: auto`, the browser's computed height of the DroppableZone becomes the full content height — which means the column element (`data-column-id`) measured by the paginator includes the entire auto-expanding page height, not just the natural section content height.

Result: `page1_columnStartY` gets a wildly inflated value → `page1Budget` becomes tiny → sections break after just a few items → massive white gap at the bottom of every page.

### The Fix (already applied globally)

`height: '100%'` has been **removed** from `DroppableZone` in `useResumeDragAndDrop.js`. Do not add it back.

```jsx
// ✅ Correct (current state of DroppableZone):
export const DroppableZone = ({ id, children, style = {} }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} style={{ minHeight: '100px', ...style }}>
            {children}
        </div>
    );
};
```

```jsx
// ❌ Never add this back:
style={{ minHeight: '100px', height: '100%', ...style }}  // height:100% corrupts Measurer measurements
```

### Related: Never wrap renderZone in an extra flex container

Do not add an intermediate `<div style={{ flex: 1, display: "flex", ... }}>` between the page div and `renderZone`. The gap styling must live **on the DroppableZone itself** (via the `columnStyle` param), not on a wrapper around it.

```jsx
// ❌ Wrong — gap on a wrapper div, not on DroppableZone:
<div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
    {renderZone(`main-p${i}`, page.main)}  {/* DroppableZone inside has no gap */}
</div>

// ✅ Correct — gap passed directly into DroppableZone:
{renderZone(`main-p${i}`, page.main, ZONE_STYLE)}  {/* ZONE_STYLE has display/flex/gap */}
```

---

## 15. Quick Checklist Before Shipping

Before submitting a new template, verify every item:

- [ ] `page-height-marker` div is present in `Measurer`
- [ ] `data-column-id` is on every column wrapper in `Measurer`
- [ ] `data-column-id` column wrapper in Measurer has `display:flex, flexDirection:column, gap:Xpx` — **NOT `marginBottom` on children**
- [ ] Section wrappers (`sectionWrap` etc.) have **NO `marginBottom`** — spacing comes from column `gap` only
- [ ] `styles.page` uses `height: "297mm"` (not `minHeight`)
- [ ] `styles.page` uses `overflow: "hidden"` (not `visible`)
- [ ] Paginated page divs override to `height: "297mm", minHeight: "unset", overflow: "hidden"`
- [ ] Free-flow page div uses `height: "auto", minHeight: "297mm"`
- [ ] `ref={containerRef}` is on the outermost div
- [ ] `<Measurer />` is the first child inside the ref div
- [ ] `<Header />` only renders on `i === 0` in paginated mode
- [ ] All section title components use `useSectionContext()` for `isContinued`
- [ ] All repeatable items use `data-item-index={originalIdx}` (not `i`)
- [ ] `renderZone` accepts a `columnStyle` param and passes it to `DroppableZone`
- [ ] `renderZone` is called with `ZONE_STYLE` (flex+column+gap) in both paginated AND free-flow renders
- [ ] No intermediate `<div style={{ flex:1, display:"flex", gap:... }}>` wrapper around `renderZone` calls
- [ ] All font/spacing values use the `--theme-*` CSS variables
- [ ] Template is registered in `TemplateManager.js`
