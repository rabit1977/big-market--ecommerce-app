const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'convex', 'nul');
console.log(`Targeting: ${target}`);

try {
    // Attempting to delete using the Windows extended path syntax in Node
    const extendedPath = '\\\\?\\' + target;
    fs.unlinkSync(extendedPath);
    console.log('Successfully deleted nul file using extended path.');
} catch (err) {
    console.error('Failed to delete via unlinkSync:', err.message);
    try {
        fs.rmSync(target, { force: true });
        console.log('Successfully deleted using rmSync.');
    } catch (err2) {
        console.error('Final attempt failed:', err2.message);
    }
}
