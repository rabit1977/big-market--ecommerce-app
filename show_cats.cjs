const fs = require('fs');
const content = fs.readFileSync('convex/seed.ts', 'utf8');

// Extract all category entries
const regex = /name:\s*'([^']+)',\s*slug:\s*'([^']+)',[\s\S]*?parentSlug:\s*(null|'[^']*'),/g;
let match;
const cats = [];
while ((match = regex.exec(content)) !== null) {
  const parent = match[3] === 'null' ? null : match[3].replace(/'/g, '');
  cats.push({ name: match[1], slug: match[2], parent });
}

const roots = cats.filter(c => c.parent === null);
const allOutput = [];
roots.forEach(root => {
  const children = cats.filter(c => c.parent === root.slug);
  allOutput.push('ROOT: ' + root.name + ' (' + root.slug + ') - ' + children.length + ' children');
  children.forEach(ch => allOutput.push('  - ' + ch.name + ' (' + ch.slug + ')'));
  allOutput.push('');
});

fs.writeFileSync('cats_structure.txt', allOutput.join('\n'));
console.log('Written to cats_structure.txt, total cats:', cats.length, ', roots:', roots.length);
