const fs = require('fs');
const content = fs.readFileSync('convex/seed.ts', 'utf8');

// Rough extraction of categoriesData array content
const match = content.match(/const categoriesData = \[([\s\S]*?)\];/);
if (!match) {
    console.error('Could not find categoriesData');
    process.exit(1);
}

// Very rough "parsing" since it's not valid JSON (has comments, single quotes, etc)
// We'll use a regex to extract objects
const objects = [];
let depth = 0;
let currentObject = '';
let inString = false;
let stringChar = '';

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
            if (depth === 0) {
                objects.push(currentObject);
            }
        }
    }
}

const categories = objects.map(objStr => {
    // Try to extract name, slug, parentSlug using regex
    const nameMatch = objStr.match(/name:\s*['"](.*?)['"]/);
    const slugMatch = objStr.match(/slug:\s*['"](.*?)['"]/);
    const parentSlugMatch = objStr.match(/parentSlug:\s*['"](.*?)['"]/);
    const parentSlugNullMatch = objStr.match(/parentSlug:\s*null/);
    
    return {
        name: nameMatch ? nameMatch[1] : null,
        slug: slugMatch ? slugMatch[1] : null,
        parentSlug: parentSlugMatch ? parentSlugMatch[1] : (parentSlugNullMatch ? null : undefined)
    };
}).filter(c => c.name);

// Build tree
const tree = {};
categories.forEach(c => {
    if (c.parentSlug === null) {
        if (!tree[c.slug]) tree[c.slug] = { name: c.name, children: [] };
        else tree[c.slug].name = c.name;
    }
});

categories.forEach(c => {
    if (c.parentSlug !== null && c.parentSlug !== undefined) {
        if (tree[c.parentSlug]) {
            tree[c.parentSlug].children.push(c);
        } else {
            // Might be a second level child
            // Let's just flat list them for now or do a more thorough search
        }
    }
});

console.log(JSON.stringify(tree, null, 2));
