const fs = require('fs');
let content = fs.readFileSync('convex/seed.ts', 'utf8');

// Find line numbers of specific slugs
const lines = content.split('\n');

function findSlugLine(slug) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`slug: '${slug}'`)) return i + 1;
  }
  return -1;
}

const toCheck = [
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
  'napravete-sami',
  'fashion-clothing',
  'sports-hobbies',
  'animals-pets',
  'jobs-services',
  'food-agriculture',
  'business-equipment',
  'womens-clothing',
  'mens-clothing',
  'childrens-clothing',
];

toCheck.forEach(slug => {
  const line = findSlugLine(slug);
  console.log(slug + ': line ' + line);
});
