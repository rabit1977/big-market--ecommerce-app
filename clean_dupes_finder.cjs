const fs = require('fs');
const content = fs.readFileSync('convex/seed.ts', 'utf8');

const regex = /name:\s*['"]([^'"]+)['"],\s*slug:\s*['"]([^'"]+)['"],[\s\S]*?parentSlug:\s*(null|['"][^'"]+['"])/g;
let match;
const cats = [];
while ((match = regex.exec(content)) !== null) {
  const p = match[3] === 'null' ? null : match[3].replace(/['"]/g, '');
  cats.push({ name: match[1], slug: match[2], parent: p });
}

// Map slugs to full structures avoiding dupes array reference
const bySlug = {};
cats.forEach(c => bySlug[c.slug] = c);
const uniqueCats = Object.values(bySlug);

const roots = uniqueCats.filter(c => c.parent === null);
roots.forEach(r => {
  r.children = uniqueCats.filter(c => c.parent === r.slug);
  r.children.forEach(ch => {
    ch.children = uniqueCats.filter(c => c.parent === ch.slug);
  });
});

let out = '=== EMPTY ROOTS ===\n';
roots.filter(r => r.children.length === 0).forEach(r => {
  out += `- ${r.name} (${r.slug})\n`;
});

out += '\n=== DUPLICATE SUB-CATEGORIES ACROSS ENTIRE DB ===\n';
const nameMap = {};
uniqueCats.forEach(c => {
  const n = c.name.toLowerCase();
  if (!nameMap[n]) nameMap[n] = [];
  nameMap[n].push(`${c.name} (slug: ${c.slug}, parent: ${c.parent})`);
});
Object.keys(nameMap).forEach(n => {
  if (nameMap[n].length > 1) {
    out += `\nName: ${n}\n`;
    nameMap[n].forEach(item => {
      out += `  - ${item}\n`;
    });
  }
});

out += `\nTotal unique categories parsed: ${uniqueCats.length}\n`;

fs.writeFileSync('clean_dupes_out.txt', out);
console.log('Saved to clean_dupes_out.txt');
