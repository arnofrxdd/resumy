# 🐛 Template Pagination Inconsistency — Root Cause Report

**Date:** 2026-03-02
**Status:** ✅ Diagnosed and Fixed (see Section 3 below for the bottom-gap root cause discovered 2026-03-02)

---

## Problem

Two classes of issues were discovered and fixed:

**Issue A (original):** Some templates paginate correctly while others completely fail. Root cause: missing `page-height-marker`.

**Issue B (2026-03-02):** Single-column templates (SilverSerif, AzureSkyline) show a **large empty bottom gap** before section continues/breaks, while two-column templates (LavenderLuxe, SageSplit) do not. Root cause: `DroppableZone` had `height:'100%'` hardcoded, and section spacing used `marginBottom` instead of CSS `gap`.

---

## Issue B Root Cause — Large Bottom Gap (Fixed 2026-03-02)

### Root Cause 1: `DroppableZone` had `height: '100%'`

In `hooks/useResumeDragAndDrop.js`, the `DroppableZone` component had:
```jsx
style={{ minHeight: '100px', height: '100%', ...style }}
```

In the **Measurer** (hidden off-screen), the page wrapper has `height: auto`. A child with `height: 100%` inside a flex-column with `height: auto` causes the browser to compute a bloated column height — stretching to match the entire auto-height page, not just the natural section content. This inflated the `page1_columnStartY` value read by the paginator, shrinking the `page1Budget` to a tiny fraction of the real available space. Sections broke far too early, leaving a massive white gap.

**Fix:** Removed `height: '100%'` from `DroppableZone` globally.

### Root Cause 2: Section spacing via `marginBottom` instead of CSS `gap`

`useAutoPagination` measures heights via `getBoundingClientRect()`, which returns the **border-box height** — CSS `margin-bottom` is excluded. Templates that used `marginBottom` on their `sectionWrap` div left an uncounted trailing margin after the last section on every page split point. This added a small but cumulative phantom gap.

**Fix:** All single-column templates now use CSS `gap` on the `data-column-id` column container (and via `ZONE_STYLE` on `DroppableZone`) instead of `marginBottom` on section wrappers. CSS `gap` only applies *between* items — never after the last one.

### Files changed
| File | Change |
|---|---|
| `hooks/useResumeDragAndDrop.js` | Removed `height:'100%'` from DroppableZone |
| `SilverSerif/SilverSerif.jsx` | Removed `sectionWrap.marginBottom`; added `gap` to Measurer column; updated `renderZone` to accept `columnStyle` |
| `AzureSkyline/AzureSkyline.jsx` | Same as SilverSerif + added missing `page-height-marker` |

> See `NEW_TEMPLATE_GUIDELINES.md` Sections 16 and 17 for the rules that prevent this class of bug in future templates.

---

## Issue A — Original: Missing `page-height-marker`

Some templates paginate correctly (page-breaking sections and continuing them across pages), while others completely fail to do so. The working templates are:

- ✅ Amber Graphite
- ✅ Silver Serif
- ✅ Lavender Luxe
- ✅ (Amber Elite, and any template based on the reference implementation)

All other templates are broken to varying degrees.

---

## Root Cause

### The Missing `page-height-marker`

Every template renders a hidden **`Measurer`** component — a `position: absolute; top: -10000px` div that `useAutoPagination` uses to measure content heights before laying out pages.

**Working templates** include a critical child element inside their Measurer:

```jsx
// ✅ AmberGraphite.jsx — Measurer (line 1285)
const Measurer = () => (
    <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
        <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
        <div style={{ ...styles.page, height: "auto" }}>
            ...sections...
        </div>
    </div>
);
```

**Broken templates** are missing this element entirely:

```jsx
// ❌ ObsidianEdge.jsx — Measurer (line 756)
const Measurer = () => (
    <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
        <div style={{ ...styles.page, height: "auto" }}>   {/* ← NO page-height-marker! */}
            ...sections...
        </div>
    </div>
);
```

Same problem confirmed in: **EmeraldElite**, and likely all other non-working templates.

---

## Why This Breaks Pagination

In `useAutoPagination.js` (line 93–96):

```js
// Step 1: Measure A4 height
const marker = root.querySelector('.page-height-marker');
const A4_HEIGHT = marker
    ? (marker.getBoundingClientRect().height / scale)  // ← accurate, DPI-aware
    : (A4_MM * MM_TO_PX);                             // ← fallback: 297 × 3.7795 ≈ 1122.8px
```

When the marker is **absent**, the hook falls back to a **pure arithmetic constant** (`297 × 3.7795275591 ≈ 1122.8px`).

**Why the fallback is wrong:**  
The actual rendered pixel height of a `297mm` element depends on:
- The browser's current DPI / device pixel ratio
- Whether the resume is scaled via CSS `transform: scale()`
- Sub-pixel rounding the browser applies to `mm` → `px` conversions

The working templates provide an **actual DOM-measured** `297mm` div, so `getBoundingClientRect().height / scale` reflects the **true pixel height** at runtime — DPI-aware and scale-aware. The hardcoded fallback constant is not, so the page budget drifts and sections either overflow or break too early.

---

## Secondary Issue — Wrong Page 1 Budget

At `useAutoPagination.js` lines 182–185:

```js
const pageContainer = root.querySelector('[style*="height: auto"]') ||
    root.querySelector('.resume-page') || root.firstChild;
const pageRect = unscaledRect(pageContainer);
const page1_columnStartY = columnRect.top - pageRect.top;
```

Without the marker present, the hook also has trouble reliably finding the page container's top position (especially in templates with different structural nesting), making the **Page 1 budget wrong** — content overflows or cuts too soon on the very first page.

---

## The Fix (when ready to implement)

Add the `page-height-marker` div to the `Measurer` component in every broken template:

```jsx
const Measurer = () => (
    <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
        {/* ← ADD THIS LINE */}
        <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
        <div style={{ ...styles.page, height: "auto" }}>
            ...
        </div>
    </div>
);
```

This single one-liner fix is required in every template that is currently broken.

---

## Affected Files (confirmed broken)

| Template | File | Has `page-height-marker`? |
|---|---|---|
| AmberGraphite | `templates/AmberGraphite/AmberGraphite.jsx` | ✅ Yes |
| SilverSerif | `templates/SilverSerif/SilverSerif.jsx` | ✅ Yes |
| LavenderLuxe | `templates/LavenderLuxe/LavenderLuxe.jsx` | ✅ Yes (assumed) |
| ObsidianEdge | `templates/ObsidianEdge/ObsidianEdge.jsx` | ❌ **No** |
| EmeraldElite | `templates/EmeraldElite/EmeraldElite.jsx` | ❌ **No** |
| SageSplit | `templates/SageSplit/SageSplit.jsx` | ✅ Yes — but has **separate bugs** (see below) |
| All others | `templates/*/` | ❓ Needs verification |

---

## Pagination Hook Reference

- **Hook:** `frontend/app/resume-creator/hooks/useAutoPagination.js`
- **Key lines:** 93–96 (A4 height measurement), 182–185 (page container detection)
- **Marker CSS class:** `page-height-marker`
- **Marker style:** `height: 297mm; width: 1px; position: absolute; left: 0; top: 0`

---

## SageSplit — Separate Bug Class (Page Grows Infinitely)

**Symptom:** The A4 page isn't a fixed height — it keeps growing with the content instead of capping at 297mm. Splitting sometimes works (the hook logic is partially correct) but the rendered page frames stretch beyond A4.

> Note: SageSplit **does** have the `page-height-marker` in its Measurer (line 1113), so the A4 measurement itself is correct. The bugs here are in how paginated pages are **rendered**, not measured.

### Bug 1 — `styles.page` uses `minHeight` instead of `height` (Line 93)

```jsx
// ❌ WRONG — minHeight lets the page box grow indefinitely
page: {
    width: "210mm",
    minHeight: "297mm",   // ← this is the culprit
    overflow: "visible",  // ← makes it even worse, no clipping
    ...
}
```

When paginated pages are rendered (line 1145), `styles.page` is applied as-is to every page `<div>`. Because `minHeight: 297mm` only sets a *floor* — not a ceiling — if column content is even slightly taller than the budget, the div just stretches to fit it instead of staying at A4 size.

`overflow: "visible"` compounds the problem: even if the height were capped, content would visually bleed out without clipping.

### Bug 2 — Paginated page render doesn't override to fixed height (Line 1145)

```jsx
// ❌ Paginated pages — no height override, minHeight from styles.page still active
pages.map((page, i) => (
    <div key={i} style={styles.page}>   {/* minHeight: 297mm, no fixed height */}
        ...
    </div>
))
```

The non-paginated fallback (line 1161) correctly sets `height: "auto"`, but the **paginated** branch never sets a fixed `height: "297mm"`. Since `styles.page` only has `minHeight`, each page div is unconstrained.

### The Fix (when ready to implement)

Two changes needed in `SageSplit.jsx`:

**1. Fix `styles.page`** — change `minHeight` to `height` and `overflow` to `hidden`:
```jsx
page: {
    width: "210mm",
    height: "297mm",      // ← fixed, not min
    overflow: "hidden",   // ← clip content at A4 boundary
    ...
}
```

**2. Fix paginated page render** — add explicit height override and `overflow: hidden`:
```jsx
pages.map((page, i) => (
    <div key={i} style={{ ...styles.page, height: "297mm", minHeight: "unset", overflow: "hidden" }}>
        ...
    </div>
))
```

And keep the non-paginated fallback as `height: "auto", minHeight: "297mm"` so it still grows freely when page breaks are off.
