# How to Add a New Resume Template

Adding a template to Gaplytiq is designed to be modular and configuration-driven. We use a **Template-First** architecture, which means templates have full control over how any section is rendered while maintaining standardized spell-check and drag-and-drop functionality.

## 1. Create the Component
1.  Copy the folder `templates/UnifiedTemplate` and rename it (e.g., `templates/MyNewTemplate`).
2.  Rename the file inside to `MyNewTemplate.jsx`.
3.  **STRICT RULE:** Use CSS variables for ALL styling. This allows the user to customize fonts, colors, and margins via the visual editor.

### Required CSS Variables
Your template should inherit these variables from the `ResumeRenderer` provider:
- `var(--theme-color)`: Primary brand color.
- `var(--theme-font)`: Primary font family.
- `var(--theme-font-scale)`: Global font size multiplier.
- `var(--theme-section-margin)`: Spacing between sections.
- `var(--theme-page-margin)`: Padding around the resume.
- `var(--theme-background)`: Document background color.
- `var(--theme-text)`: Primary text color.

## 2. Implementing Drag and Drop
Our system uses a custom `useResumeDragAndDrop` hook and a `StableResumeDragOverlay` to ensure smooth, drift-free reordering.

### Setup the Hook
Destructure the necessary props from the hook. You must pass `scale` to ensure the ghost matches the scaled preview accurately.

```javascript
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";

const MyTemplate = ({ data, onReorder, scale = 1, ...props }) => {
    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: {
            main: activeMainSections,
            sidebar: activeSidebarSections
        }
    });

    return (
        <DndContext {...dndContextProps}>
            {/* ... layout ... */}
            
            <StableResumeDragOverlay 
                activeId={activeId}
                dragStartContainerId={dragStartContainerId}
                scale={scale}
                renderSection={(id, startContainer) => (
                    <div className="my-ghost-style">
                        <SectionRenderer sectionId={id} data={data} />
                    </div>
                )}
            />
        </DndContext>
    );
};
```

## 3. Template-First Architecture

### Custom Section Renderers
If you want a section (like Projects or Summary) to have a unique look in your template, you can override the default rendering logic by passing a `customRenderers` prop to the `SectionRenderer`.

**Example: Unique Headings**
You can change the title of a section for your specific template while keeping the underlying logic (and spell-check) the same:

```javascript
const customRenderers = {
    experience: () => data.experience?.length > 0 && (
        <SectionWrapper sectionId="experience" ...>
            {/* Unique Heading for this template */}
            <SectionTitle title="The Professional Journey" />
            
            {/* Standard Logic & Spell-Check maintained */}
            {data.experience.map((exp, index) => (
                <ExperienceItem 
                    key={index} 
                    item={exp} 
                    {...props} 
                />
            ))}
        </SectionWrapper>
    )
};
```

### Atomic Building Blocks
To keep spell-check working in your custom designs, use the building blocks from `common/BaseComponents`:

```javascript
import { SpellCheckText, RichTextSpellCheck } from "../common/BaseComponents";

const MyLocalProjectItem = ({ item }) => (
    <div>
        {/* Use SpellCheckText for strings */}
        <h4><SpellCheckText text={item.title} /></h4>
        
        {/* Use RichTextSpellCheck for HTML strings */}
        <div className="rich-text">
            <RichTextSpellCheck html={item.description} />
        </div>
    </div>
);
```

## 4. Spell-Check Integration

Spell-check works by wrapping text nodes in a `SpellCheckHighlighter`. When adding a new template:
1.  **Always pass props**: Ensure `isSpellCheckActive`, `onSpellCheckIgnore`, and `onSpellCheckReplace` are passed from your template to `SectionRenderer`.
2.  **Use `SectionRenderer`**: It handles the complexities of mapping fields to the specific draft state during edit mode.
3.  **Support Arrays**: For simple string arrays (like `interests`), ensure your `onSpellCheckReplace` handler can handle index-based updates without an object field key.

## 5. Best Practices & Standards

### Standardized Section Titles
To maintain a professional look, the following section IDs have been unified with standard titles in `SectionRenderer.jsx`:
- `summary` → **"Summary"**
- `experience` → **"Experience"** (formerly "Work History")

### Data Persistence
When creating internal form components (like the AI Editor in `Experience.jsx`):
- **Save before exit**: Always call `setData` (e.g., via `handleSaveExperience`) BEFORE calling `onReturnToDashboard`. This prevents losing state when returning from a "Quick Edit" mode.

### Mandatory: Support All Sections
> [!IMPORTANT]
> A template **MUST** support all known resume sections. If a user has entered data for "Affiliations" or "Custom Sections", your template must render them. Never hide user data because it wasn't in your design.

### Mandatory: Support Template-Specific Ordering
To ensure that reordering sections in one template doesn't break another, you MUST use the `templateLayouts` state logic.

**Pattern for your template component:**
```javascript
const templateId = 'your-template-id';
const templateSpecificLayout = data.templateLayouts?.[templateId] || {};

// Use template-specific order first, then global (legacy), then defaults
let mainOrder = [...(templateSpecificLayout.mainSectionsOrder || data.mainSectionsOrder || defaultOrder)];
```

## 6. Register the Component
Open `templates/TemplateRegistry.js` and add your import:

```javascript
import MyNewTemplate from "./MyNewTemplate/MyNewTemplate";

const TEMPLATE_COMPONENTS = {
  "unified-template": UnifiedTemplate,
  "my-new-template": MyNewTemplate,
};
```

## 7. Add Configuration
Open `templates/TemplateManager.js` and add the metadata.

```javascript
{
  id: "my-new-template",
  name: "My New Template",
  thumbnail: "/templates/new-thumb.png",
  layout: {
      main: ["{{SORTABLE}}"],    // Everything in main is draggable
      sidebar: ["personal", "{{SORTABLE}}"] // Personal info is FIXED at top
  },
  defaults: {
      fontSize: 1,
      fontFamily: "Inter",
      sectionSpacing: 1.2,
      pageMargin: 40, // Mandatory for Onboarding Preview
      lineHeight: 1.6
  }
}
```

### Why Defaults Matter
The `defaults` object is used by the `ResumeRenderer` to render the template in the **Onboarding selection grid**. If these are missing, the template will fall back to hardcoded global defaults (like 40px margins), which might not match your intended "vibe".

## 8. Verification
Check your template in:
1.  **Onboarding**: Verify it appears in the selection grid.
2.  **Live Editor**: Verify that changing colors/fonts updates your template instantly.
3.  **Spell Check Tab**: Verify that misspelled words are underlined correctly.
4.  **Drag and Drop**: Open the **Stress Tester** template to verify cross-container logic is handled correctly.
