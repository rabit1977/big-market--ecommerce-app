const fs = require('fs');
const c = fs.readFileSync('convex/seed.ts', 'utf8');

const r = /name:\s*'([^']+)',\s*slug:\s*'([^']+)',[\s\S]*?parentSlug:\s*(null|'[^']*'),/g;
let m;
const cats = [];
while ((m = r.exec(c)) !== null) {
  const parent = m[3] === 'null' ? null : m[3].replace(/'/g, '');
  cats.push({ name: m[1], slug: m[2], parent });
}

const lines = [];
lines.push('Total categories: ' + cats.length);
lines.push('');

function showTree(slug, indent) {
  const children = cats.filter(c => c.parent === slug);
  children.forEach(ch => {
    const grandChildren = cats.filter(c => c.parent === ch.slug);
    lines.push(indent + '- ' + ch.name + ' (' + ch.slug + ')' + (grandChildren.length ? ' [' + grandChildren.length + ' children]' : ''));
    showTree(ch.slug, indent + '  ');
  });
}

const roots = cats.filter(c => c.parent === null);
roots.forEach(root => {
  const children = cats.filter(c => c.parent === root.slug);
  lines.push('ROOT: ' + root.name + ' (' + root.slug + ') [' + children.length + ' direct children]');
  showTree(root.slug, '  ');
  lines.push('');
});

fs.writeFileSync('full_tree_out.txt', lines.join('\r\n'), 'utf8');
console.log('Done, wrote ' + lines.length + ' lines');
