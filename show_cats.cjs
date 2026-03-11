const fs = require('fs');
const content = fs.readFileSync('convex/seed.ts', 'utf8');

// The regex now matches double or single quotes. 
const regex = /name:\s*['\"]([^'\"]+)['\"],\s*slug:\s*['\"]([^'\"]+)['\"],[\s\S]*?parentSlug:\s*(null|['\"][^'\"]+['\"])/g;
let match;
const cats = [];
while ((match = regex.exec(content)) !== null) {
  const parent = match[3] === 'null' ? null : match[3].replace(/['\"]/g, '');
  cats.push({ name: match[1], slug: match[2], parent });
}

// Eliminate dupes just in case (the previous script should already do this)
const uniqueMap = {};
for (const c of cats) uniqueMap[c.slug] = c;
const uniqueCats = Object.values(uniqueMap);

const roots = uniqueCats.filter(c => c.parent === null);
const allOutput = [];
roots.forEach(root => {
  const children = uniqueCats.filter(c => c.parent === root.slug);
  allOutput.push('ROOT: ' + root.name + ' (' + root.slug + ') - ' + children.length + ' children');
  children.forEach(ch => {
    allOutput.push('  - ' + ch.name + ' (' + ch.slug + ')');
    const grand = uniqueCats.filter(c => c.parent === ch.slug);
    grand.forEach(g => allOutput.push('    - ' + g.name + ' (' + g.slug + ')'));
  });
  allOutput.push('');
});

fs.writeFileSync('cats_structure.txt', allOutput.join('\n'));
console.log('Written to cats_structure.txt, total unique cats:', uniqueCats.length, ', roots:', roots.length);
