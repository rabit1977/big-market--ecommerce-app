const fs = require('fs');

try {
    const content = fs.readFileSync('convex/seed.ts', 'utf8');
    const startIdx = content.indexOf('const categoriesData = [');
    if (startIdx === -1) {
        console.error('Could not find start of categoriesData');
        process.exit(1);
    }
    
    // Find the end of the array - search for ]; at the end of a line
    const endIdx = content.lastIndexOf('];');
    if (endIdx === -1 || endIdx < startIdx) {
        console.error('Could not find end of categoriesData');
        process.exit(1);
    }
    
    const data = content.substring(startIdx, endIdx + 2);
    
    // Match each object {} roughly
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

    const cleanedCategories = objects.map(objStr => {
        const nameMatch = objStr.match(/name:\s*['"](.*?)['"]/) || objStr.match(/"name":\s*"(.*?)"/);
        const slugMatch = objStr.match(/slug:\s*['"](.*?)['"]/) || objStr.match(/"slug":\s*"(.*?)"/);
        const parentSlugMatch = objStr.match(/parentSlug:\s*['"](.*?)['"]/) || objStr.match(/"parentSlug":\s*"(.*?)"/);
        const parentSlugNullMatch = objStr.match(/parentSlug:\s*null/) || objStr.match(/"parentSlug":\s*null/);
        
        // Check for fields in template
        const fieldsMatch = objStr.match(/fields:\s*\[([\s\S]*?)\]/);
        let hasFields = false;
        if (fieldsMatch) {
            const inner = fieldsMatch[1].trim();
            // Check if it has any actual content like { keys: ... }
            if (inner.includes('{')) hasFields = true;
        }
        
        return {
            name: nameMatch ? nameMatch[1] : null,
            slug: slugMatch ? slugMatch[1] : null,
            parentSlug: parentSlugMatch ? parentSlugMatch[1] : (parentSlugNullMatch ? null : undefined),
            hasFields
        };
    }).filter(c => c.name);

    // Find children count
    const childrenCount = {};
    cleanedCategories.forEach(c => {
        if (c.parentSlug) {
            childrenCount[c.parentSlug] = (childrenCount[c.parentSlug] || 0) + 1;
        }
    });

    const categoriesWithState = cleanedCategories.map(c => {
        return {
            ...c,
            childCount: childrenCount[c.slug] || 0
        };
    });

    console.log(JSON.stringify(categoriesWithState, null, 2));

} catch (err) {
    console.error(err);
    process.exit(1);
}
