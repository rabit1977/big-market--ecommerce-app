const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\rabit\\OneDrive\\Desktop\\Nextjs Projects\\Full Stack ecommerce app -2\\classifieds-platform\\convex\\seed.ts';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// We want to delete lines 7112 to 7879 (inclusive, 1-indexed)
// In 0-indexed: 7111 to 7878
const start = 7111;
const end = 7878;

lines.splice(start, end - start + 1);

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log(`Successfully deleted lines ${start + 1} to ${end + 1}`);
