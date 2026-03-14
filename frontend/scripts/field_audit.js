const fs = require('fs');
const path = require('path');

const targetFile = process.argv[2];

if (!targetFile) {
    console.error('Usage: node field_audit.js <template_path>');
    process.exit(1);
}

const fullPath = path.resolve(targetFile);
const content = fs.readFileSync(fullPath, 'utf8');

// Load BaseComponents to check for delegated fields
const baseComponentsPath = path.resolve(__dirname, '../app/resume-creator/templates/common/BaseComponents.jsx');
const baseComponentsContent = fs.existsSync(baseComponentsPath) ? fs.readFileSync(baseComponentsPath, 'utf8') : '';

// Load SectionRenderer to check for delegated section rendering
const sectionRendererPath = path.resolve(__dirname, '../app/resume-creator/templates/common/SectionRenderer.jsx');
const sectionRendererContent = fs.existsSync(sectionRendererPath) ? fs.readFileSync(sectionRendererPath, 'utf8') : '';

console.log(`\n📋 SCHEMA DATA COMPLETENESS AUDIT: ${path.basename(fullPath)}`);
console.log('================================================================');

const schema = {
    '1. Core Header': [
        { id: 'personal.photo', regex: /\.photo/g },
        { id: 'personal.name', regex: /\.name/g },
        { id: 'personal.profession', regex: /(\.profession|\.title)/g },
        { id: 'personal.city', regex: /\.city/g },
        { id: 'personal.state', regex: /\.state/g },
        { id: 'personal.country', regex: /\.country/g },
        { id: 'personal.zipCode', regex: /\.zipCode/g },
        { id: 'personal.phone', regex: /\.phone/g },
        { id: 'personal.email', regex: /\.email/g },
        { id: 'personal.linkedin', regex: /\.linkedin/g },
        { id: 'personal.github', regex: /\.github/g },
        { id: 'personal.website', regex: /\.website/g },
        { id: 'websites[].addToHeader', regex: /addToHeader/g },
        { id: 'websites[].label', regex: /\.label/g }
    ],
    '2. Personal Details (Extra)': [
        { id: 'personal.dob', regex: /(dob|dateOfBirth|birthDate)/g },
        { id: 'personal.nationality', regex: /nationality/g },
        { id: 'personal.maritalStatus', regex: /(maritalStatus|marital_status)/g },
        { id: 'personal.visaStatus', regex: /(visaStatus|visa_status)/g },
        { id: 'personal.gender', regex: /gender/g },
        { id: 'personal.religion', regex: /religion/g },
        { id: 'personal.passport', regex: /(passport|passportNumber)/g },
        { id: 'personal.placeOfBirth', regex: /placeOfBirth/g },
        { id: 'personal.drivingLicense', regex: /drivingLicense/g },
        { id: 'personal.otherPersonal', regex: /(otherPersonal|otherInformation)/g }
    ],
    '3. Websites & Portfolio': [
        { id: 'websites[].url', regex: /url/g, component: 'WebsiteItem' },
        { id: 'websites[].label', regex: /label/g, component: 'WebsiteItem' },
        { id: 'websites[].addToHeader (section exclusion)', regex: /!w\.addToHeader|!e\.item\.addToHeader|\.addToHeader\)\.filter|filter.*addToHeader/g }
    ],
    '4. Education': [
        { id: 'education[].school', regex: /(school|institution)/g, component: 'EducationItem' },
        { id: 'education[].degree', regex: /degree/g, component: 'EducationItem' },
        { id: 'education[].field', regex: /field/g, component: 'EducationItem' },
        { id: 'education[].city', regex: /\.city/g, component: 'EducationItem' },
        { id: 'education[].grade', regex: /grade/g, component: 'EducationItem' },
        { id: 'education[].date/years', regex: /(year|date|startYear|endYear|startMonth|endMonth)/g, component: 'EducationItem' },
        { id: 'education[].description', regex: /description/g, component: 'EducationItem' }
    ],
    '5. Work Experience': [
        { id: 'experience[].title', regex: /(title|role)/g, component: 'ExperienceItem' },
        { id: 'experience[].company', regex: /company/g, component: 'ExperienceItem' },
        { id: 'experience[].location', regex: /location/g, component: 'ExperienceItem' },
        { id: 'experience[].isRemote', regex: /isRemote/g, component: 'ExperienceItem' },
        { id: 'experience[].isCurrent', regex: /isCurrent/g, component: 'ExperienceItem' },
        { id: 'experience[].date/years', regex: /(year|date|startYear|endYear|startMonth|endMonth)/g, component: 'ExperienceItem' },
        { id: 'experience[].description', regex: /description/g, component: 'ExperienceItem' }
    ],
    '6. Skills & Software': [
        { id: 'skills[].name', regex: /name/g, component: 'SkillItem' },
        { id: 'skills[].level', regex: /(level|rating)/g, component: 'SkillItem' },
        { id: 'strengths[].name', regex: /name/g, component: 'StrengthsItem' },
        { id: 'additionalSkills[].name', regex: /name/g, component: 'AdditionalSkillsItem' },
        { id: 'software[].name', regex: /name/g, component: 'SoftwareItem' },
        { id: 'software[].rating', regex: /(rating|level)/g, component: 'SoftwareItem' }
    ],
    '7. Projects': [
        { id: 'projects[].title', regex: /title/g, component: 'ProjectItem' },
        { id: 'projects[].link', regex: /link/g, component: 'ProjectItem' },
        { id: 'projects[].technologies', regex: /technologies/g, component: 'ProjectItem' },
        { id: 'projects[].date/years', regex: /(year|date|startYear|endYear)/g, component: 'ProjectItem' },
        { id: 'projects[].isCurrent', regex: /isCurrent/g, component: 'ProjectItem' },
        { id: 'projects[].description', regex: /description/g, component: 'ProjectItem' }
    ],
    '8. Certifications': [
        { id: 'certifications[].name', regex: /name/g, component: 'CertificationItem' },
        { id: 'certifications[].issuer', regex: /(issuer|authority)/g, component: 'CertificationItem' },
        { id: 'certifications[].date', regex: /(date|year)/g, component: 'CertificationItem' },
        { id: 'certifications[].description', regex: /description/g, component: 'CertificationItem' }
    ],
    '9. Key Extra Sections': [
        { id: 'summary', regex: /summary/g },
        { id: 'additionalInfo', regex: /additionalInfo/g },
        { id: 'customSection', regex: /customSection/g },
        { id: 'keyAchievements[].name', regex: /(keyAchievements|name)/g },
        { id: 'keyAchievements[].description', regex: /(keyAchievements|description)/g },
        { id: 'accomplishments[].name', regex: /(accomplishments|name)/g },
        { id: 'accomplishments[].description', regex: /(accomplishments|description)/g },
        { id: 'affiliations[].name', regex: /(affiliations|name)/g },
        { id: 'affiliations[].description', regex: /(affiliations|description)/g },
        { id: 'interests[]', regex: /interests/g },
        { id: 'languages[]', regex: /languages/g },
        { id: 'software[]', regex: /software/g }
    ]
};

let totalFields = 0;
let totalSupported = 0;

for (const [groupName, fields] of Object.entries(schema)) {
    console.log(`\n📂 ${groupName}:`);
    fields.forEach(field => {
        totalFields++;
        const inTemplate = content.match(field.regex);
        const usesComp = field.component && (content.includes(field.component) || content.includes('SectionRenderer'));
        const compHasIt = field.component && baseComponentsContent.match(field.regex);

        if (inTemplate) {
            console.log(`  ✅ ${field.id.padEnd(25)} [OK - Direct]`);
            totalSupported++;
        } else if (usesComp && compHasIt) {
            console.log(`  ✅ ${field.id.padEnd(25)} [OK - Delegated to ${field.component}]`);
            totalSupported++;
        } else if (!field.component && content.includes('SectionRenderer') && sectionRendererContent.match(field.regex)) {
            // Template delegates section rendering to SectionRenderer which implements this check
            console.log(`  ✅ ${field.id.padEnd(25)} [OK - Delegated to SectionRenderer]`);
            totalSupported++;
        } else {
            console.log(`  ❌ ${field.id.padEnd(25)} [MISSING]`);
        }
    });
}

const percent = Math.round((totalSupported / totalFields) * 100);
console.log('\n================================================================');
console.log(`📊 TOTAL SCORE: ${percent}% (${totalSupported}/${totalFields} Fields)`);
if (percent < 100) {
    console.log('💡 Note: Missing fields might still render via generic SectionRenderer fallbacks');
}
console.log('================================================================\n');
