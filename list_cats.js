const fs = require('fs');
const content = fs.readFileSync('convex/seed.ts', 'utf8');

const match = content.match(/const categoriesData = \[([\s\S]*?)\];/);
if (!match) {
    console.error('Could not find categoriesData');
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

objects.forEach((obj, idx) => {
    const nameMatch = obj.match(/["']?name["']?:\s*["'](.*?)["']/);
    const slugMatch = obj.match(/["']?slug["']?:\s*["'](.*?)["']/);
    const parentSlugMatch = obj.match(/["']?parentSlug["']?:\s*["'](.*?)["']/);
    const parentIsNull = obj.includes('parentSlug: null') || obj.includes('"parentSlug": null');

    const name = nameMatch ? nameMatch[1] : 'UNKNOWN';
    const slug = slugMatch ? slugMatch[1] : 'UNKNOWN';
    const parent = parentIsNull ? 'TOP' : (parentSlugMatch ? parentSlugMatch[1] : 'NONE');

    console.log(`${idx.toString().padStart(4)} | ${name.padEnd(40)} | ${slug.padEnd(30)} | ${parent}`);
});
