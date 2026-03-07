/**
 * Field Registry - Centralized source of truth for resume section fields
 * 
 * This prevents fields from being accidentally omitted in template renderers.
 * All templates should reference this registry when rendering sections.
 */

// ==================== EXPERIENCE FIELDS ====================
export const EXPERIENCE_FIELDS = {
    title: {
        required: true,
        label: "Job Title",
        description: "The position/role title",
        examples: ["Software Engineer", "Marketing Manager", "Intern"]
    },
    company: {
        required: true,
        label: "Company/Employer",
        description: "The organization name",
        examples: ["Google", "Acme Corp", "Freelance"]
    },
    location: {
        required: false,
        label: "Location",
        description: "City/region of work",
        examples: ["New York, NY", "San Francisco, CA", "Remote"]
    },
    isRemote: {
        required: false,
        label: "Remote Position",
        type: "boolean",
        description: "Whether this was a remote position"
    },
    startMonth: {
        required: false,
        label: "Start Month",
        description: "Month when started"
    },
    startYear: {
        required: true,
        label: "Start Year",
        description: "Year when started"
    },
    isCurrent: {
        required: false,
        label: "Current Position",
        type: "boolean",
        description: "Whether currently employed in this role"
    },
    endMonth: {
        required: false,
        label: "End Month",
        description: "Month when ended (if not current)"
    },
    endYear: {
        required: false,
        label: "End Year",
        description: "Year when ended (if not current)"
    },
    description: {
        required: false,
        label: "Description",
        richText: true,
        description: "Responsibilities and achievements",
        supportedFormats: ["bold", "italic", "underline", "bulletList", "link"]
    }
};

// ==================== EDUCATION FIELDS ====================
export const EDUCATION_FIELDS = {
    degree: {
        required: true,
        label: "Degree",
        description: "Degree or certification name",
        examples: ["Bachelor of Science", "Master of Arts", "High School Diploma"]
    },
    field: {
        required: false,
        label: "Field of Study",
        description: "Major or specialization",
        examples: ["Computer Science", "Marketing", "Business Administration"]
    },
    institution: {
        required: true,
        label: "Institution/School",
        description: "Name of educational institution",
        examples: ["Stanford University", "MIT", "Lincoln High School"]
    },
    school: {
        required: false,
        label: "School (legacy)",
        description: "Alternative field name for institution",
        deprecated: true,
        useInstead: "institution"
    },
    location: {
        required: false,
        label: "Location",
        description: "City/region of institution",
        examples: ["Cambridge, MA", "Stanford, CA"]
    },
    city: {
        required: false,
        label: "City",
        description: "City of institution"
    },
    startYear: {
        required: false,
        label: "Start Year",
        description: "Year when started"
    },
    endYear: {
        required: false,
        label: "Graduation Year",
        description: "Expected or actual graduation year"
    },
    year: {
        required: false,
        label: "Year (legacy)",
        description: "Alternative field for graduation year",
        deprecated: true,
        useInstead: "endYear"
    },
    date: {
        required: false,
        label: "Date (legacy)",
        description: "Alternative field for graduation date",
        deprecated: true,
        useInstead: "endYear"
    },
    grade: {
        required: false,
        label: "GPA/Grade",
        description: "Grade point average or academic honors",
        examples: ["3.8", "4.0", "First Class Honours"]
    },
    description: {
        required: false,
        label: "Description",
        richText: true,
        description: "Coursework, honors, activities, achievements",
        supportedFormats: ["bold", "italic", "underline", "bulletList", "link"]
    }
};

// ==================== AFFILIATIONS FIELDS ====================
export const AFFILIATIONS_FIELDS = {
    name: {
        required: true,
        label: "Affiliation Name",
        description: "The name of the organization or association",
        examples: ["Rotary International", "IEEE", "American Bar Association"]
    },
    description: {
        required: false,
        label: "Description/Role",
        richText: true,
        description: "Your role or details about the affiliation",
        supportedFormats: ["bold", "italic", "underline", "bulletList", "link"]
    }
};

// ==================== ACCOMPLISHMENTS FIELDS ====================
export const ACCOMPLISHMENTS_FIELDS = {
    name: {
        required: true,
        label: "Accomplishment Title",
        description: "The name of your accomplishment",
        examples: ["Employee of the Year", "increased sales by 20%", "Reduced costs by $10k"]
    },
    description: {
        required: false,
        label: "Description",
        richText: true,
        description: "Details about the accomplishment",
        supportedFormats: ["bold", "italic", "underline", "bulletList", "link"]
    }
};

// ==================== KEY ACHIEVEMENTS FIELDS ====================
export const KEY_ACHIEVEMENTS_FIELDS = {
    name: {
        required: true,
        label: "Achievement Title",
        description: "The name of the award or honor",
        examples: ["Employee of the Month", "Dean's List", "Winner of Hackathon"]
    },
    description: {
        required: false,
        label: "Description",
        richText: true,
        description: "Details about the achievement",
        supportedFormats: ["bold", "italic", "underline", "bulletList", "link"]
    }
};

// ==================== VALIDATION HELPERS ====================

/**
 * Validates that a template renders all required and important fields
 * @param {string} sectionType - 'experience' or 'education'
 * @param {string} templateName - Name of the template (for logging)
 * @param {string[]} renderedFields - Array of field names that are rendered
 * @returns {Object} Validation result with warnings
 */
export const validateTemplateFields = (sectionType, templateName, renderedFields) => {
    const fieldRegistry = sectionType === 'experience' ? EXPERIENCE_FIELDS : EDUCATION_FIELDS;

    const missing = [];
    const deprecated = [];

    for (const [fieldName, config] of Object.entries(fieldRegistry)) {
        if (config.deprecated) {
            if (renderedFields.includes(fieldName)) {
                deprecated.push({ field: fieldName, useInstead: config.useInstead });
            }
            continue;
        }

        if (!renderedFields.includes(fieldName)) {
            missing.push({
                field: fieldName,
                required: config.required,
                impact: config.required ? 'HIGH' : 'MEDIUM'
            });
        }
    }

    // Log warnings in development
    if (process.env.NODE_ENV === 'development') {
        if (missing.length > 0) {
            console.warn(
                `⚠️ Template "${templateName}" - ${sectionType} section missing fields:`,
                missing
            );
        }
        if (deprecated.length > 0) {
            console.warn(
                `⚠️ Template "${templateName}" - ${sectionType} section uses deprecated fields:`,
                deprecated
            );
        }
    }

    return {
        isValid: missing.filter(m => m.required).length === 0,
        missing,
        deprecated,
        warnings: missing.length + deprecated.length
    };
};

/**
 * Get all field names for a section (excluding deprecated)
 * @param {string} sectionType - 'experience' or 'education'
 * @returns {string[]} Array of field names
 */
export const getFieldNames = (sectionType) => {
    const fieldRegistry = sectionType === 'experience' ? EXPERIENCE_FIELDS : EDUCATION_FIELDS;
    return Object.keys(fieldRegistry).filter(
        key => !fieldRegistry[key].deprecated
    );
};

/**
 * Get required fields for a section
 * @param {string} sectionType - 'experience' or 'education'
 * @returns {string[]} Array of required field names
 */
export const getRequiredFields = (sectionType) => {
    const fieldRegistry = sectionType === 'experience' ? EXPERIENCE_FIELDS : EDUCATION_FIELDS;
    return Object.entries(fieldRegistry)
        .filter(([_, config]) => config.required && !config.deprecated)
        .map(([name, _]) => name);
};

// ==================== USAGE EXAMPLE ====================
/*
// In your template renderer:

import { EXPERIENCE_FIELDS, validateTemplateFields } from '../common/FieldRegistry';

// Track what you're rendering
const renderedFields = ['title', 'company', 'location', 'startYear', 'endYear', 'description'];

// Validate (only in development)
if (process.env.NODE_ENV === 'development') {
  validateTemplateFields('experience', 'CreativeMarketing', renderedFields);
}

// Check if a specific field should be rendered
if (EXPERIENCE_FIELDS.isRemote && exp.isRemote) {
  // Render remote indicator
}
*/
