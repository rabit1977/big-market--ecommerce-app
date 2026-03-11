const fs = require('fs');
const content = fs.readFileSync('convex/seed.ts', 'utf8');

// Simple regex to find categories
const catRegex = /{\s*name:\s*['"](.*?)['"]\s*,\s*slug:\s*['"](.*?)['"]\n[\s\S]*?parentSlug:\s*(.*?)\s*,/g;
const cats = [];
let match;
while ((match = catRegex.exec(content)) !== null) {
    cats.push({ name: match[1], slug: match[2], parentSlug: match[3].replace(/['",]/g, '').trim() });
}

const parentSlugs = new Set(cats.map(c => c.parentSlug).filter(s => s && s !== 'null'));
const slugs = new Set(cats.map(c => c.slug));

const emptyTopLevel = cats.filter(c => c.parentSlug === 'null' && !parentSlugs.has(c.slug));

console.log('Empty Top Level Categories:');
emptyTopLevel.forEach(c => console.log(`- ${c.name} (${c.slug})`));
