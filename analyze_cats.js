const f = require('fs');
const c = f.readFileSync('convex/seed.ts', 'utf8');
const r = /name: '([^']+)',\s*slug: '([^']+)',[\s\S]*?parentSlug: ([^\n,]+),/g;
let m;
const a = [];
while ((m = r.exec(c)) !== null) {
  let p = m[3].trim().replace(/'/g, '');
  a.push({ n: m[1], s: m[2], p });
}

console.log('Total:', a.length);
console.log('');

const roots = a.filter(x => x.p === 'null');
roots.forEach(root => {
  const children = a.filter(x => x.p === root.s);
  console.log('ROOT: ' + root.n + ' (' + root.s + ') [' + children.length + ' children]');
  children.forEach(child => {
    console.log('  - ' + child.n + ' (' + child.s + ')');
  });
  console.log('');
});
