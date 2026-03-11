const fs = require('fs');
const content = fs.readFileSync('convex/seed.ts', 'utf8');
const regex = /\{\s*\n\s*name: '([^']+)',\s*\n\s*slug: '([^']+)',\s*\n\s*description[^,]*,\s*\n\s*image[^,]*,\s*\n\s*isActive[^,]*,\s*\n\s*isFeatured[^,]*,\s*\n\s*parentSlug: ([^,\n]+),/g;
let m;
const cats = [];
while ((m = regex.exec(content)) !== null) {
  cats.push({name: m[1], slug: m[2], parentSlug: m[3].trim()});
}

console.log('Total categories:', cats.length);
console.log('\n=== ALL CATEGORIES ===');
cats.forEach(c => console.log(`  [${c.parentSlug}] -> "${c.name}" (${c.slug})`));

console.log('\n=== DUPLICATE SLUGS ===');
const slugMap = {};
cats.forEach(c => {
  if (!slugMap[c.slug]) slugMap[c.slug] = [];
  slugMap[c.slug].push(c.name);
});
Object.entries(slugMap).forEach(([slug, names]) => {
  if (names.length > 1) console.log(`  DUPLICATE slug "${slug}": ${names.join(', ')}`);
});

console.log('\n=== DUPLICATE NAMES ===');
const nameMap = {};
cats.forEach(c => {
  if (!nameMap[c.name]) nameMap[c.name] = [];
  nameMap[c.name].push(c.slug);
});
Object.entries(nameMap).forEach(([name, slugs]) => {
  if (slugs.length > 1) console.log(`  DUPLICATE name "${name}": ${slugs.join(', ')}`);
});

console.log('\n=== TOP-LEVEL CATEGORIES ===');
cats.filter(c => c.parentSlug === 'null').forEach(c => console.log(`  "${c.name}" (${c.slug})`));
