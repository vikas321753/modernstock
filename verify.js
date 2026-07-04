const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'app.js');
const indexHtmlPath = path.join(__dirname, 'index.html');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Regex to find document.getElementById('...')
const getElementByIdRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const queriedIds = new Set();

while ((match = getElementByIdRegex.exec(appJs)) !== null) {
    queriedIds.add(match[1]);
}

console.log(`Found ${queriedIds.size} unique IDs queried via getElementById in app.js:`);
console.log(Array.from(queriedIds));

console.log('\nChecking index.html for queried IDs...');
let missingCount = 0;
queriedIds.forEach(id => {
    const exists = indexHtml.includes(`id="${id}"`) || indexHtml.includes(`id='${id}'`);
    if (!exists) {
        console.error(`❌ MISSING ID: "${id}"`);
        missingCount++;
    } else {
        console.log(`✅ Found ID: "${id}"`);
    }
});

if (missingCount === 0) {
    console.log('\n🎉 ALL QUERIED IDs ARE PRESENT IN index.html!');
} else {
    console.error(`\n⚠️  WARNING: ${missingCount} IDs are missing from index.html!`);
}
