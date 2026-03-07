# Skills Inconsistency Audit Report

## Overview

This report audits how `skills`, `strengths`, and `additionalSkills` are rendered across all 14 active resume templates, comparing each template's custom renderers against the **canonical default** in `SectionRenderer.jsx`.

---

## Data Schema (Reference)

```
skills[]:           { name: String, level: Number (1-5) }
strengths[]:        { name: String, level: Number (1-5) }
additionalSkills[]: { name: String, level: Number (1-5) }
skillsDescription:  HTML String (rich text fallback)
```

---

## Canonical Behavior (SectionRenderer.jsx Defaults)

| Section | Renderer | Component | Level Display | Fallback | Variant | navigationId |
|---|---|---|---|---|---|---|
| `skills` | Uses `SkillItem` | Yes | ✅ Dots (1-5) | `skillsDescription` via `SplittableRichText` | `tags` or `list` (via `variants.skills`) | — |
| `strengths` | Uses `SkillItem` | Yes | ✅ Dots (1-5) | — | `minimal` (always) | `skills` |
| `additionalSkills` | Uses `SkillItem` | Yes | ✅ Dots (1-5) | — | `minimal` (always) | `skills` |

**Key Design Decisions in Default:**
- Skills prioritize structured data over `skillsDescription` (good)
- `SkillItem` renders with `RichTextSpellCheck` for names
- Each item has `data-item-index` for pagination
- Level dots use `var(--theme-color)` theming
- `SectionWrapper` with correct `sectionId` and `navigationId="skills"` for strengths/additionalSkills

---

## Template-by-Template Audit

### Legend
- ✅ = Consistent with canonical behavior
- ⚠️ = Partial inconsistency (functional but differs from standard)
- ❌ = Missing or broken behavior
- 🔇 = Not in layout (relies on `getCompleteLayout` fallback)

---

### 1. ClassicExecutive

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ main | ✅ Custom | ❌ No levels shown | ⚠️ `SpellCheckText` (not `RichTextSpellCheck`) | — | **Levels lost, wrong spell-check component** |
| `strengths` | ✅ main | ✅ Custom | ❌ No levels shown | ✅ `RichTextSpellCheck` | ✅ `skills` | **Levels lost** |
| `additionalSkills` | ❌ Not in layout | ⚠️ Merged into `strengths` renderer | ❌ No levels shown | ✅ `RichTextSpellCheck` | N/A (lives inside strengths wrapper) | **Not independently draggable/reorderable, levels lost, pagination issues** |

**Issues:**
1. **❌ `skills` uses `SpellCheckText` instead of `RichTextSpellCheck`** — breaks rich text formatting (bold/italic)
2. **❌ Skill levels are never displayed** — the `level` property is completely ignored for all three sections
3. **❌ `additionalSkills` is merged inside the `strengths` renderer** — it's not a separate `SectionWrapper`, so it can't be independently dragged, reordered, or paginated. Also, `getCompleteLayout` won't detect it as "assigned" since it's not in the layout array, causing potential duplication.
4. **⚠️ `additionalSkills` always renders from `data.additionalSkills` directly** (bypasses `itemIndices`), so pagination splitting won't work for it.

---

### 2. StrategicLeader

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ main | ✅ Custom | ❌ No levels shown | ✅ `RichTextSpellCheck` | — | **Levels lost** |
| `strengths` | ✅ main | ✅ Custom | ❌ No levels shown | ✅ `RichTextSpellCheck` | ✅ `skills` | **Levels lost** |
| `additionalSkills` | 🔇 Not in layout | ✅ Custom (line ~780) | ❌ No levels shown | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout, levels lost — will fall to fallback zone** |

**Issues:**
1. **❌ Skill levels are never displayed** — all three sections show name-only bullets
2. **⚠️ `additionalSkills` is not in the initial layout array** — it relies on `getCompleteLayout` to add it to the fallback zone, which means it appears at the end rather than near the skills section

---

### 3. CorporateTimeline

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ main | ✅ Custom | ❌ No levels shown | ⚠️ `SpellCheckText` (not `RichTextSpellCheck`) | — | **Levels lost, wrong spell-check, renders as inline semicolon-separated text** |
| `strengths` | ✅ main | ✅ Custom | ❌ No levels shown | ✅ `RichTextSpellCheck` | ✅ `skills` | **Levels lost** |
| `additionalSkills` | 🔇 Not in layout | ✅ Custom | ❌ No levels shown | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout, levels lost** |

**Issues:**
1. **❌ `skills` uses `SpellCheckText`** — breaks rich text formatting
2. **❌ `skills` renders as inline comma/semicolon list** — fundamentally different from all other templates' grid/flex/tag layouts. This makes each skill NOT individually splittable for pagination (all skills are in one `<div>`)
3. **❌ Skill levels completely ignored** — a user who set levels will see them disappear when switching to this template
4. **⚠️ `additionalSkills` not in layout** — falls to `getCompleteLayout` fallback

---

### 4. ObsidianEdge

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ main | ✅ Custom | ❌ No levels shown | ✅ `RichTextSpellCheck` | — | **Levels lost** |
| `strengths` | ✅ main | ✅ Custom | ❌ No levels shown | ✅ `RichTextSpellCheck` | ✅ `skills` | **Levels lost** |
| `additionalSkills` | 🔇 Not in layout | ✅ Custom | ❌ No levels shown | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout, levels lost** |

**Issues:**
1. **❌ Skill levels completely ignored across all three sections**
2. **⚠️ `additionalSkills` not in initial layout**

---

### 5. IconicTimeline

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ left | ✅ Custom | ❌ No levels shown | ✅ `RichTextSpellCheck` | — | **Levels lost** |
| `strengths` | 🔇 Not in layout | ✅ Custom | ❌ No levels shown | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout, levels lost** |
| `additionalSkills` | 🔇 Not in layout | ✅ Custom | ❌ No levels shown | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout, levels lost** |

**Issues:**
1. **❌ Skill levels completely ignored**
2. **⚠️ Neither `strengths` nor `additionalSkills` in layout**

---

### 6. ExecutiveSidebar

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ left | ✅ Custom (`ExecutiveTagList`) | ✅ Renders level text ("Expert", etc.) | ✅ `RichTextSpellCheck` | — | Minor: no `skillsDescription` fallback |
| `strengths` | 🔇 Not in layout | ✅ Custom (`ExecutiveTagList`) | ✅ Renders level text | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout** |
| `additionalSkills` | ✅ left | ✅ Custom (`ExecutiveTagList`) | ✅ Renders level text | ✅ `RichTextSpellCheck` | ✅ `skills` | Minor: no `skillsDescription` fallback |

**Issues:**
1. **⚠️ `strengths` not in initial layout** — falls to `getCompleteLayout` fallback zone
2. **⚠️ No `skillsDescription` fallback** — if no structured skills exist, nothing renders (silently discards rich text)
3. ✅ Levels ARE displayed via `ExecutiveTagList` component (shows text labels like "Expert", "Advanced")

---

### 7. CreativeMarketing

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ left | ✅ Custom (`MarketingSkills`) | ✅ Renders skill bars with width based on level | ✅ `RichTextSpellCheck` | — | Minor: no `skillsDescription` fallback |
| `strengths` | 🔇 Not in layout | ✅ Custom (`MarketingSkills`) | ✅ Renders skill bars | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout** |
| `additionalSkills` | 🔇 Not in layout | ✅ Custom (`MarketingSkills`) | ✅ Renders skill bars | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout** |

**Issues:**
1. **⚠️ `strengths` and `additionalSkills` not in initial layout** — falls to fallback zone
2. **⚠️ No `skillsDescription` fallback**
3. ✅ Levels ARE displayed via `MarketingSkills` component (horizontal bars proportional to level)

---

### 8. AzureModern

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ sidebar | ✅ Custom | ✅ Visual level indicators (list items) | ✅ `RichTextSpellCheck` | — | Minor: no `skillsDescription` fallback |
| `strengths` | 🔇 Not in layout | ✅ Custom | ✅ Visual level indicators | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout** |
| `additionalSkills` | 🔇 Not in layout | ✅ Custom | ✅ Visual level indicators | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout** |

**Issues:**
1. **⚠️ `strengths` and `additionalSkills` not in initial layout**
2. **⚠️ No `skillsDescription` fallback**
3. ✅ Levels ARE displayed via custom level indicator rendering

---

### 9. AuraPastel

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ sidebar | ✅ Custom | ✅ 5-dot indicators (themed color) | ✅ `RichTextSpellCheck` | — | **No `skillsDescription` fallback** |
| `strengths` | 🔇 Not in layout | ✅ Custom | ✅ 5-dot indicators | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout** |
| `additionalSkills` | 🔇 Not in layout | ✅ Custom | ✅ 5-dot indicators | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout** |

**Issues:**
1. **⚠️ `strengths` and `additionalSkills` not in initial layout** (initial: sidebar=['contact','websites','summary','skills'], main=['experience','education','projects','custom'])
2. **❌ No `skillsDescription` fallback** — uniquely problematic since other templates at this quality level have it
3. ✅ Levels ARE correctly displayed as 5-dot indicators with `themeColor`

---

### 10. SapphireGrid

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ main | ✅ Custom (LateralSection) | ✅ 5-dot indicators in 2-col grid | ✅ `RichTextSpellCheck` | — | ✅ Has `skillsDescription` fallback |
| `strengths` | 🔇 Not in layout | ✅ Custom (LateralSection) | ✅ 5-dot indicators | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout** |
| `additionalSkills` | 🔇 Not in layout | ✅ Custom (LateralSection) | ✅ 5-dot indicators | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout** |

**Issues:**
1. **⚠️ `strengths` and `additionalSkills` not in initial layout** (initial: main=['summary','skills','experience','education','projects','custom'])
2. ✅ Levels ARE correctly displayed as 5-dot indicators with `var(--theme-color, #635bff)`
3. ✅ `skillsDescription` fallback IS implemented (lines 418-436) — renders via `SplittableRichText` when no structured skills

---

### 11. OnyxModern

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ main | ✅ Custom | ✅ 5-dot indicators in 2-col grid | ✅ `RichTextSpellCheck` | — | ✅ Has `skillsDescription` fallback |
| `strengths` | 🔇 Not in layout | ✅ Custom | ✅ 5-dot indicators | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout** |
| `additionalSkills` | 🔇 Not in layout | ✅ Custom | ✅ 5-dot indicators | ✅ `RichTextSpellCheck` | ✅ `skills` | **Not in layout** |

**Issues:**
1. **⚠️ `strengths` and `additionalSkills` not in initial layout** (initial: sidebar=['websites','education','languages','certifications'], main=['summary','skills','experience','projects','custom'])
2. ✅ Levels ARE correctly displayed as 5-dot indicators with `var(--theme-color, #635bff)`
3. ✅ `skillsDescription` fallback IS implemented (lines 557-573)
4. ✅ Supports zone-aware grid columns (1col sidebar vs 2col main)

---

### 12. ModernMinimalist (No Custom Renderers)

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ main | ❌ Default | ✅ Via `SkillItem` | ✅ `RichTextSpellCheck` | — | ✅ Correct |
| `strengths` | ✅ main | ❌ Default | ✅ Via `SkillItem` | ✅ `RichTextSpellCheck` | ✅ `skills` | ✅ Correct |
| `additionalSkills` | ✅ main | ❌ Default | ✅ Via `SkillItem` | ✅ `RichTextSpellCheck` | ✅ `skills` | ✅ Correct |

**✅ GOLD STANDARD** — This template uses all defaults and works perfectly.

---

### 13. ModernSidebar (No Custom Renderers)

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ sidebar | ❌ Default | ✅ Via `SkillItem` | ✅ | — | ✅ Correct |
| `strengths` | ✅ sidebar | ❌ Default | ✅ Via `SkillItem` | ✅ | ✅ `skills` | ✅ Correct |
| `additionalSkills` | ✅ sidebar | ❌ Default | ✅ Via `SkillItem` | ✅ | ✅ `skills` | ✅ Correct |

**✅ GOLD STANDARD** — All three sections in layout, all using defaults.

---

### 14. ModernThreeColumn (No Custom Renderers)

| Section | In Layout? | Custom Renderer? | Level Display | Spell Check | NavigationId | Issues |
|---|---|---|---|---|---|---|
| `skills` | ✅ left | ❌ Default | ✅ Via `SkillItem` | ✅ | — | ✅ Correct |
| `strengths` | ✅ left | ❌ Default | ✅ Via `SkillItem` | ✅ | ✅ `skills` | ✅ Correct |
| `additionalSkills` | ✅ right | ❌ Default | ✅ Via `SkillItem` | ✅ | ✅ `skills` | ✅ Correct |

**✅ GOLD STANDARD** — All three sections in layout across two columns.

---

## Summary of Critical Issues

### Issue #1: Skill Levels Never Displayed (CRITICAL)

**Affected Templates:** ClassicExecutive, StrategicLeader, CorporateTimeline, ObsidianEdge, IconicTimeline (5 of 14 templates)

**NOT Affected (levels work):** ExecutiveSidebar (text labels), CreativeMarketing (skill bars), AzureModern (visual indicators), AuraPastel (5-dot), SapphireGrid (5-dot), OnyxModern (5-dot), ModernMinimalist/ModernSidebar/ModernThreeColumn (default `SkillItem`)

**Problem:** Custom renderers only display `skill.name` — the `skill.level` (1-5 dots) is completely ignored. When users set skill proficiency levels in the editor, they are invisible on the resume.

**Fix:** Either use the `SkillItem` component (which handles levels) or manually render levels using the dot pattern from `SkillItem.renderLevel()`.

---

### Issue #2: Wrong Spell Check Component (MODERATE)

**Affected Templates:** ClassicExecutive (skills), CorporateTimeline (skills)

**Problem:** These use `SpellCheckText` instead of `RichTextSpellCheck` for skill names. `SpellCheckText` strips all HTML formatting (bold, italic, underline), while `RichTextSpellCheck` preserves it.

**Fix:** Replace `SpellCheckText` with `RichTextSpellCheck` for skill name rendering.

---

### Issue #3: `additionalSkills` Merged Into `strengths` (HIGH)

**Affected Templates:** ClassicExecutive

**Problem:** `additionalSkills` items are rendered inside the `strengths` section wrapper. This means:
- They cannot be independently dragged/reordered
- `getCompleteLayout` doesn't see them as "assigned", potentially causing duplication
- `itemIndices` (pagination) is bypassed for additional skills
- No separate `SectionWrapper` = no independent click-to-edit

**Fix:** Separate `additionalSkills` into its own renderer with its own `SectionWrapper`.

---

### Issue #4: `strengths`/`additionalSkills` Missing from Layout (MODERATE)

**Affected Templates:** StrategicLeader, CorporateTimeline, ObsidianEdge, IconicTimeline, CreativeMarketing, AzureModern, AuraPastel, SapphireGrid, OnyxModern (plus `additionalSkills` in ClassicExecutive)

**Problem:** These sections are not explicitly listed in the template's initial layout. They rely on `getCompleteLayout()` to add them to a fallback zone. While this technically works, it means:
- They appear at the end of the fallback zone (poor placement)
- They're not positioned near related skills sections
- User experience is inconsistent across templates

**Fix:** Add `strengths` and `additionalSkills` to initial layout arrays near the `skills` section.

---

### Issue #5: CorporateTimeline Inline Skills (LOW)

**Affected Template:** CorporateTimeline

**Problem:** Skills are rendered as a single inline paragraph (`"Skill 1; Skill 2; Skill 3"`) rather than as individually measurable items. This:
- Prevents per-item pagination splitting
- Doesn't support per-item `data-item-index` properly (wraps each name in a `<span>` with the attribute, but the parent div is one block)
- Is visually inconsistent with all other templates

---

### Issue #6: `skillsDescription` Fallback Not Implemented in Custom Renderers

**Affected Templates:** ClassicExecutive, StrategicLeader, CorporateTimeline, ObsidianEdge, IconicTimeline, ExecutiveSidebar, CreativeMarketing, AzureModern, AuraPastel (9 of 11 custom renderer templates)

**NOT Affected (fallback works):** SapphireGrid ✅, OnyxModern ✅ — these two correctly implement the `skillsDescription` fallback via `SplittableRichText` when no structured skills exist.

**Problem:** The default `SectionRenderer` has fallback logic: if no structured `skills[]` exist, it renders `skillsDescription` (the rich text editor). 9 custom renderers check only `data.skills` and return `null` if empty, silently discarding the `skillsDescription` content.

**Fix:** Add the same fallback logic from the default renderer to custom renderers, or consider removing the custom renderer and using the default when it's functionally equivalent.

---

## Recommendations

### Short-Term (Quick Fixes)

1. **Add `strengths` and `additionalSkills` to all template layouts** near the `skills` entry
2. **Replace `SpellCheckText` with `RichTextSpellCheck`** in ClassicExecutive and CorporateTimeline skills renderers  
3. **Separate `additionalSkills` from `strengths`** in ClassicExecutive into its own `SectionWrapper`

### Medium-Term (Standardization)

4. **Evaluate whether custom renderers are actually needed** — Many custom `skills`/`strengths`/`additionalSkills` renderers are functionally identical to the default but with visual tweaks that could be achieved via CSS. Consider removing unnecessary custom renderers and using the default with appropriate `variants`.
5. **Add level display to all custom renderers** — Either embed level dots or delegate to `SkillItem` component.

### Long-Term (Architecture)

6. **Create a `SkillSection` higher-order component** that handles levels, spell-check, pagination, and `skillsDescription` fallback in one place, parameterized by visual variant (grid, flex, bullets, inline).
7. **Add the `skillsDescription` fallback** to all custom renderers that don't have it.

---

## Full Template Matrix

| Template | skills | strengths | additionalSkills | Levels? | Spell Check | Layout Coverage | skillsDescription Fallback |
|---|---|---|---|---|---|---|---|
| ModernMinimalist | ✅ Default | ✅ Default | ✅ Default | ✅ | ✅ | ✅ Full | ✅ Default |
| ModernSidebar | ✅ Default | ✅ Default | ✅ Default | ✅ | ✅ | ✅ Full | ✅ Default |
| ModernThreeColumn | ✅ Default | ✅ Default | ✅ Default | ✅ | ✅ | ✅ Full | ✅ Default |
| ClassicExecutive | ⚠️ Custom | ⚠️ Custom | ❌ Merged | ❌ | ⚠️ Mixed | ❌ Partial | ❌ Missing |
| StrategicLeader | ⚠️ Custom | ⚠️ Custom | ⚠️ Custom | ❌ | ✅ | ⚠️ Missing additionalSkills | ❌ Missing |
| CorporateTimeline | ❌ Inline | ⚠️ Custom | ⚠️ Custom | ❌ | ⚠️ Mixed | ⚠️ Missing additionalSkills | ❌ Missing |
| ObsidianEdge | ⚠️ Custom | ⚠️ Custom | ⚠️ Custom | ❌ | ✅ | ⚠️ Missing both | ❌ Missing |
| IconicTimeline | ⚠️ Custom | ⚠️ Custom | ⚠️ Custom | ❌ | ✅ | ⚠️ Missing both | ❌ Missing |
| ExecutiveSidebar | ✅ Custom (tags) | ⚠️ Custom | ✅ Custom (tags) | ✅ Text labels | ✅ | ⚠️ Missing strengths | ❌ Missing |
| CreativeMarketing | ✅ Custom (bars) | ⚠️ Custom | ⚠️ Custom | ✅ Skill bars | ✅ | ⚠️ Missing both | ❌ Missing |
| AzureModern | ✅ Custom (visual) | ⚠️ Custom | ⚠️ Custom | ✅ Visual indicators | ✅ | ⚠️ Missing both | ❌ Missing |
| AuraPastel | ✅ Custom (dots) | ⚠️ Custom | ⚠️ Custom | ✅ 5-dot | ✅ | ⚠️ Missing both | ❌ Missing |
| SapphireGrid | ✅ Custom (dots) | ⚠️ Custom | ⚠️ Custom | ✅ 5-dot | ✅ | ⚠️ Missing both | ✅ Implemented |
| OnyxModern | ✅ Custom (dots) | ⚠️ Custom | ⚠️ Custom | ✅ 5-dot | ✅ | ⚠️ Missing both | ✅ Implemented |
