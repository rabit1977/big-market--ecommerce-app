const fs = require('fs');

try {
    const content = fs.readFileSync('convex/seed.ts', 'utf8');
    const match = content.match(/const categoriesData = \[([\s\S]*?)\];/);
    if (!match) throw new Error('categoriesData not found');

    const data = match[1];
    const objects = [];
    let depth = 0;
    let currentObject = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < data.length; i++) {
        const char = data[i];
        if ((char === '"' || char === "'") && data[i-1] !== '\\') {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (char === stringChar) {
                inString = false;
            }
        }
        if (!inString) {
            if (char === '{') {
                if (depth === 0) currentObject = '';
                depth++;
            }
        }
        currentObject += char;
        if (!inString) {
            if (char === '}') {
                depth--;
                if (depth === 0) objects.push(currentObject);
            }
        }
    }

    const categories = objects.map(objStr => {
        const nameMatch = objStr.match(/name:\s*['"](.*?)['"]/) || objStr.match(/"name":\s*"(.*?)"/);
        const slugMatch = objStr.match(/slug:\s*['"](.*?)['"]/) || objStr.match(/"slug":\s*"(.*?)"/);
        const parentSlugMatch = objStr.match(/parentSlug:\s*['"](.*?)['"]/) || objStr.match(/"parentSlug":\s*"(.*?)"/);
        const parentSlugNullMatch = objStr.match(/parentSlug:\s*null/) || objStr.match(/"parentSlug":\s*null/);
        
        const fieldsMatch = objStr.match(/fields:\s*\[([\s\S]*?)\]/);
        let hasFields = false;
        if (fieldsMatch) {
            const inner = fieldsMatch[1].trim();
            if (inner.includes('{')) hasFields = true;
        }

        return {
            name: nameMatch ? nameMatch[1] : null,
            slug: slugMatch ? slugMatch[1] : null,
            parentSlug: parentSlugMatch ? parentSlugMatch[1] : (parentSlugNullMatch ? null : undefined),
            hasFields
        };
    }).filter(c => c.name);

    const childrenCount = {};
    categories.forEach(c => {
        if (c.parentSlug) {
            childrenCount[c.parentSlug] = (childrenCount[c.parentSlug] || 0) + 1;
        }
    });

    const empty = categories.filter(c => !c.hasFields && !childrenCount[c.slug]);
    
    fs.writeFileSync('empty_cats.json', JSON.stringify(empty, null, 2));
    console.log(`Found ${empty.length} empty categories. Saved to empty_cats.json`);

} catch (err) {
    console.error(err);
    process.exit(1);
}
