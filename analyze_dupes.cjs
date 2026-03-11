const fs = require('fs');
const content = fs.readFileSync('convex/seed.ts', 'utf8');

const regex = /name:\s*['"]([^'"]+)['"],\s*slug:\s*['"]([^'"]+)['"],[\s\S]*?parentSlug:\s*(null|['"][^'"]+['"])/g;
let match;
const cats = [];
while ((match = regex.exec(content)) !== null) {
  const parent = match[3] === 'null' ? null : match[3].replace(/['"]/g, '');
  cats.push({ name: match[1], slug: match[2], parent });
}

// Ensure unique by slug (in case of dupes in regex parse)
const uniqueMap = {};
for (const c of cats) uniqueMap[c.slug] = c;
const uniqueCats = Object.values(uniqueMap);

const roots = uniqueCats.filter(c => c.parent === null);
roots.forEach(r => {
  r.children = uniqueCats.filter(c => c.parent === r.slug);
  r.children.forEach(ch => {
    ch.children = uniqueCats.filter(c => c.parent === ch.slug);
  });
});

let output = "=== EMPTY ROOTS ===\n";
roots.filter(r => r.children.length === 0).forEach(r => output += `- ${r.name} (${r.slug})\n`);

output += "\n=== DUPLICATE NAMES ===\n";
const nameMap = {};
uniqueCats.forEach(c => {
  const n = c.name.toLowerCase();
  if (!nameMap[n]) nameMap[n] = [];
  nameMap[n].push(`${c.name} (${c.slug}, parent: ${c.parent})`);
});
Object.keys(nameMap).forEach(n => {
  if (nameMap[n].length > 1) {
    output += `\nName: ${n}\n`;
    nameMap[n].forEach(item => output += `  - ${item}\n`);
  }
});

fs.writeFileSync('analyze_dupes_out.txt', output);
console.log('Done writing analyze_dupes_out.txt');
