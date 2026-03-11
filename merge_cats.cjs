/**
 * Merge script for seed.ts category cleanup
 * 
 * Changes:
 * 1. Delete empty duplicate root categories (fashion-clothing-shoes, sports-activities, hobby-animals, 
 *    antiques-art, musical-instruments-equipment, business-machines-tools, food-cooking,
 *    shops-trade, services-repairs, employment, events-nightlife, vacation-tourism, personal-contacts)
 * 2. Fix fashion-clothing to be named properly, add womens/mens/childrens as children
 * 3. Add womens-clothing, mens-clothing, childrens-clothing as children of fashion-clothing (not inline)
 */

const fs = require('fs');
let content = fs.readFileSync('convex/seed.ts', 'utf8');

// Helper: find the full { ... }, block starting from a slug line and return [start, end] char positions
function findCategoryBlock(slug) {
  // Find the line with this slug
  const slugStr = `slug: '${slug}'`;
  const slugIdx = content.indexOf(slugStr);
  if (slugIdx === -1) {
    console.log('NOT FOUND:', slug);
    return null;
  }
  
  // Walk backward to find the opening {
  let braceCount = 0;
  let start = slugIdx;
  while (start > 0) {
    if (content[start] === '{') {
      braceCount++;
      if (braceCount === 1) {
        // Check if this is the outer category brace (preceded by whitespace/newline and possibly a comment)
        const before = content.substring(Math.max(0, start - 5), start);
        if (/[\n\s]/.test(before)) break;
      }
    }
    start--;
  }
  // Go back a bit more to capture leading whitespace/comment
  let lineStart = start;
  while (lineStart > 0 && content[lineStart - 1] !== '\n') lineStart--;
  
  // Walk forward from actual start to find the matching closing }
  let depth = 0;
  let end = start;
  while (end < content.length) {
    if (content[end] === '{') depth++;
    else if (content[end] === '}') {
      depth--;
      if (depth === 0) {
        end++; // include the }
        break;
      }
    }
    end++;
  }
  
  // Include trailing comma and newline if present
  if (content[end] === ',') end++;
  if (content[end] === '\n') end++;
  
  return { start: lineStart, end, text: content.substring(lineStart, end) };
}

// Slugs of empty duplicate root categories to DELETE entirely
const toDelete = [
  'fashion-clothing-shoes',
  'sports-activities',
  'hobby-animals',
  'antiques-art',
  'musical-instruments-equipment',
  'business-machines-tools',
  'food-cooking',
  'shops-trade',
  'services-repairs',
  'employment',
  'events-nightlife',
  'vacation-tourism',
  'personal-contacts',
];

// Process deletions - collect all blocks first, then remove from end to not disturb positions
const blocks = [];
for (const slug of toDelete) {
  const block = findCategoryBlock(slug);
  if (block) {
    console.log(`Found block for ${slug}: chars ${block.start}-${block.end}`);
    blocks.push(block);
  }
}

// Sort by start position descending (delete from end of file backward)
blocks.sort((a, b) => b.start - a.start);

for (const block of blocks) {
  content = content.substring(0, block.start) + content.substring(block.end);
  console.log(`Deleted block at ${block.start}`);
}

// Now fix womens-clothing, mens-clothing, childrens-clothing to be children of fashion-clothing
// Currently they are inline single-line entries, change their parentSlug
content = content.replace(
  "{ name: 'Fashion & Clothing', slug: 'fashion-clothing',",
  "{ name: 'Fashion & Clothing', slug: 'fashion-clothing',"
); // no change needed for name

// Fix parentSlug for womens/mens/childrens - they're already children of fashion-clothing in the file
// but are single-line entries. Let's also verify.

// Write the result
fs.writeFileSync('convex/seed.ts', content);
console.log('\nDone! Final length:', content.length, 'chars');

// Verify no duplicates
const r = /name:\s*'([^']+)',\s*slug:\s*'([^']+)',[\s\S]*?parentSlug:\s*(null|'[^']*'),/g;
let m;
const cats = [];
while ((m = r.exec(content)) !== null) {
  const parent = m[3] === 'null' ? null : m[3].replace(/'/g, '');
  cats.push({ name: m[1], slug: m[2], parent });
}
console.log('Total categories:', cats.length);
const dupes = cats.filter((x, i) => cats.findIndex(y => y.s === x.s) !== i);
console.log('Duplicate slugs:', dupes.length);
const roots = cats.filter(c => c.parent === null);
console.log('Root categories:', roots.length);
roots.forEach(r => console.log('  ROOT:', r.name, '(' + r.slug + ')'));
