const fs = require('fs');
const vm = require('vm');

let cNew = fs.readFileSync('convex/seed.ts', 'utf8');
let cOld = fs.readFileSync('seed.ts.bak', 'utf8');

const s = 'const categoriesData = [';
const e = '];\n\nexport const seedCategories';

let n = vm.runInNewContext('(' + cNew.substring(cNew.indexOf(s) + s.length - 1, cNew.indexOf(e) + 1) + ')');
let o = vm.runInNewContext('(' + cOld.substring(cOld.indexOf(s) + s.length - 1, cOld.indexOf(e) + 1) + ')');

const nSlugs = new Set();
for(let cat of n) { nSlugs.add(cat.slug); }

const m = [];
for(let cat of o) {
  if (!nSlugs.has(cat.slug)) {
     m.push(cat);
  }
}

console.log('Missing count:', m.length);
if (m.length > 0) {
    fs.writeFileSync('missing.json', JSON.stringify(m, null, 2));
    console.log('Saved missing to missing.json');
}
