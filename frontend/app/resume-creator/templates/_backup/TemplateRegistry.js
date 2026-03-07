import { lazy } from "react";

// --- Lazy Load Your Template Components ---
const ResumeTemplate4 = lazy(() => import("./ResumeTemplate4/ResumeTemplate4"));
const ResumeTemplate5 = lazy(() => import("./ResumeTemplate5/ResumeTemplate5"));
const ResumeTemplate6 = lazy(() => import("./ResumeTemplate6/ResumeTemplate6"));
const ResumeTemplate7 = lazy(() => import("./ResumeTemplate7/ResumeTemplate7"));
const ResumeTemplate8 = lazy(() => import("./ResumeTemplate8/ResumeTemplate8"));
const ResumeTemplate9 = lazy(() => import("./ResumeTemplate9/ResumeTemplate9"));

/**
 * Registry mapping template IDs to React components.
 * Keys here must match 'id' in TemplateManager.js EXACTLY.
 */
export const TEMPLATE_COMPONENTS = {
  // Matches id: 'template4'
  template4: ResumeTemplate4,
  
  // Matches id: 'template5'
  template5: ResumeTemplate5,
  
  // Matches id: 'template6'
  template6: ResumeTemplate6,
  
  // Matches id: 'template7'
  template7: ResumeTemplate7,
  
  // Matches id: 'template8'
  template8: ResumeTemplate8,
  
  // Matches id: 'template9'
  template9: ResumeTemplate9
};