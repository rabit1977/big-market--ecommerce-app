const fs = require('fs');
const content = fs.readFileSync('convex/seed.ts', 'utf8');

// Extract all objects from the categoriesData array
const objects = [];
let depth = 0;
let currentObject = '';
let inString = false;
let stringChar = '';

const match = content.match(/const categoriesData = \[([\s\S]*?)\];/);
if (!match) process.exit(1);

const data = match[1];
for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if ((char === '"' || char === "'") && data[i-1] !== '\\') {
        if (!inString) {
            inString = true;
            stringChar = char;
        } else if (char === stringChar) {
            inString = false;
        }
    }
    if (!inString) {
        if (char === '{') {
            if (depth === 0) currentObject = '';
            depth++;
        }
    }
    currentObject += char;
    if (!inString) {
        if (char === '}') {
            depth--;
            if (depth === 0) objects.push(currentObject);
        }
    }
}

const cleanedCategories = objects.map(objStr => {
    const nameMatch = objStr.match(/name:\s*['"](.*?)['"]/) || objStr.match(/"name":\s*"(.*?)"/);
    const slugMatch = objStr.match(/slug:\s*['"](.*?)['"]/) || objStr.match(/"slug":\s*"(.*?)"/);
    const parentSlugMatch = objStr.match(/parentSlug:\s*['"](.*?)['"]/) || objStr.match(/"parentSlug":\s*"(.*?)"/);
    const parentSlugNullMatch = objStr.match(/parentSlug:\s*null/) || objStr.match(/"parentSlug":\s*null/);
    const fieldsMatch = objStr.match(/fields:\s*\[([\s\S]*?)\]/);
    
    const fieldsText = fieldsMatch ? fieldsMatch[1].trim() : '';
    const hasFields = fieldsText.length > 0;
    
    return {
        name: nameMatch ? nameMatch[1] : null,
        slug: slugMatch ? slugMatch[1] : null,
        parentSlug: parentSlugMatch ? parentSlugMatch[1] : (parentSlugNullMatch ? null : undefined),
        hasFields
    };
}).filter(c => c.name);

// Find children count
const childrenCount = {};
cleanedCategories.forEach(c => {
    if (c.parentSlug) {
        childrenCount[c.parentSlug] = (childrenCount[c.parentSlug] || 0) + 1;
    }
});

const emptyCategories = cleanedCategories.filter(c => {
    return !c.hasFields && !childrenCount[c.slug];
});

console.log(JSON.stringify(emptyCategories, null, 2));
