# GaplytIQ Template Engine v2.0: Deep Technical Specification

This document serves as the single source of truth for the GaplytIQ Resume Template Engine. It details the mechanics of our "Kernel Architecture" and the "Surgical Pagination" system.

---

## 1. The Kernel Architecture
GaplytIQ templates are not static views; they are **Rendering Kernels**. A template is divided into two distinct execution phases:

### A. The Measurement Phase (The "Measurer")
The engine renders a hidden, unconstrained version of the resume (`.resume-measurer`). 
- **Identity Tags**: Every section must have `data-section-id`. Every list item (job, skill, degree) must have `data-item-index`.
- **Visibility**: Rendered at `position: absolute; top: -10000px` to ensure the user doesn't see it, but the browser still calculates layout and heights.
- **Goal**: Provide the `useAutoPagination` hook with raw pixel heights for every content block.

### B. The Display Phase (Paginated View)
The engine processes the measurements and returns an array of `pages`. The template then maps over these pages, rendering only the specific content assigned to each page.
- **Context Injection**: The engine passes `itemIndices`, `subItemRanges`, `isContinued`, and `zoneId` to the `SectionRenderer`.

---

## 2. Surgical Pagination & Section Slicing
Standard pagination "clips" content at page borders. Surgical Pagination **slices** it.

### I. Section Continuation
When a section (e.g., Experience) is too long for one page, the engine splits it.
- **`isContinued` Prop**: The second half of the section receives `isContinued: true`.
- **Dynamic Titles**: The template uses this to render "Experience (Continued)" or "Projects (Cont.)".

### II. Item-Level Slicing
If a section contains multiple items (e.g., 5 jobs), the engine calculates how many jobs fit. 
- **Indexing**: Instead of rendering all jobs, we use `itemIndices`. If Page 1 can fit Job 0 and Job 1, `itemIndices` will be `[0, 1]`. 
- **Avoid Duplication**: By mapping only over the provided indices, we ensure Job 2 only appears on Page 2.

### III. Paragraph-Level Splitting (`SplittableRichText`)
For extremely long job descriptions or summaries, we use **Surgical Splitting**.
- **Block Parsing**: The HTML is parsed into atomic blocks (paragraphs or bullets).
- **Ranges**: The engine provides `subItemRanges` (e.g., `{ start: 0, end: 3 }`). 
- **Result**: Bullets 1-4 appear on Page 1, while Bullets 5-8 flow seamlessly to Page 2.

---

## 3. Avoiding the "Cutting Off" Issue
Web browsers present unique challenges for pagination that we solve with specific stability hacks:

### I. The Margin Collapse Trap
In CSS, adjacent vertical margins "collapse" into one. When we split content into separate A4 containers, this collapse breaks, causing content to "jump" or be partially hidden.
- **Solution**: Every `DraggableSection` in the template is wrapped in a `div` with `padding-bottom: 1px`. This creates a "stiff" boundary that prevents margin collapse and ensures pixel-perfect alignment at the bottom of the page.

### II. Scale Invariance
Users view resumes at different zoom levels (50% to 200%). If heights were measured in raw pixels, pagination would break as the user zooms.
- **Solution**: All measurements in `useAutoPagination.js` are normalized: `(rect.height / scale)`. This ensures that "Page 1" always contains the exact same text, regardless of the user's screen resolution or zoom.

---

## 4. Design Panel & Dynamic Variables
The engine is 100% theme-aware. It does not use fixed units like `px` for spacing or sizing.

- **Dynamic Tokenization**: All spacing is calculated using CSS Variables provided by the Design Panel:
    - `calc(18px * var(--theme-font-scale))` for font sizes.
    - `calc(35px * var(--theme-section-margin))` for section gaps.
- **Inheritance**: These variables are injected at the root of the template, allowing components deep in the tree (like `BaseComponents.jsx`) to react instantly to slider adjustments.

---

## 5. Zone Awareness & Column Logic
For multi-column templates (like `ExecutiveSidebar` or `CreativeMarketing`), sections must adapt to their "Zone".

- **The `zoneId` Prop**: The `SectionRenderer` delivers the `zoneId` (e.g., `left-p0`).
- **Adaptive UI**:
    - If `zoneId` contains `left`, the template might switch to **Right-aligned** text and flip timeline dots to the right edge.
    - This ensures that dragged sections always "face" the center spine of the resume, creating a premium, symmetrical look.

---

## 6. Building Off Existing Templates
Templates are built using a **Kernel + Override** strategy:
1.  **Base Layout**: Start with a standard `renderZone` logic (Sidebar vs Main).
2.  **Custom Renderers**: Use the `customRenderers` object to override specific sections (e.g., making the `Skills` section look like progress bars in `Marketing` while keeping them as tags in `Modern`).
3.  **Atomic Styling**: Use `BaseComponents.jsx` (ExperienceItem, EducationItem) to ensure that hover-to-edit and spell-check functionality remain functional without rewriting complex logic.

---
*GaplytIQ Engineering Specification - "Perfect Pixels, Every Page."*
