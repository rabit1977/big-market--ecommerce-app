const fs = require('fs');
const content = fs.readFileSync('convex/seed.ts', 'utf8');

const match = content.match(/const categoriesData = \[([\s\S]*?)\];/);
if (!match) {
    console.log("Not found");
    process.exit(1);
}

const data = match[1];
const objects = [];
let depth = 0;
let currentObject = '';
let inString = false;
let stringChar = '';

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

const cats = objects.map(obj => {
    const nameMatch = obj.match(/name:\s*['"](.*?)['"]/) || obj.match(/"name":\s*"(.*?)"/);
    const slugMatch = obj.match(/slug:\s*['"](.*?)['"]/) || obj.match(/"slug":\s*"(.*?)"/);
    const parentSlugMatch = obj.match(/parentSlug:\s*['"](.*?)['"]/) || obj.match(/"parentSlug":\s*"(.*?)"/);
    const parentIsNull = obj.includes('parentSlug: null') || obj.includes('"parentSlug": null');

    return {
        name: nameMatch ? nameMatch[1] : '?',
        slug: slugMatch ? slugMatch[1] : '?',
        parent: parentIsNull ? 'TOP' : (parentSlugMatch ? parentSlugMatch[1] : 'UNKNOWN')
    };
});

const topLevel = cats.filter(c => c.parent === 'TOP');
const childrenCount = {};
cats.forEach(c => {
    if (c.parent !== 'TOP' && c.parent !== 'UNKNOWN') {
        childrenCount[c.parent] = (childrenCount[c.parent] || 0) + 1;
    }
});

topLevel.forEach(r => {
    const count = childrenCount[r.slug] || 0;
    console.log(`[${count}] ${r.slug} | ${r.name}`);
});
