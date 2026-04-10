const fs = require("fs");
const path = require("path");

let baseDir = __dirname;

let result = {
    html: [],
    js: [],
    programming: []
};

// Function to extract number from filename for natural sorting
function extractNumber(filename) {
    const match = filename.match(/\d+/);
    if (match) {
        return parseInt(match[0]);
    }
    return Infinity;
}

// Function to extract number from path for sorting
function getSortKey(filePath) {
    const fileName = path.basename(filePath);
    const number = extractNumber(fileName);
    return number;
}

// Natural sort function for HTML and JS files
function sortByNumber(a, b) {
    const numA = getSortKey(a);
    const numB = getSortKey(b);
    
    if (numA !== numB) {
        return numA - numB;
    }
    // If numbers are same, sort alphabetically
    return a.localeCompare(b);
}

// Sort function for programming files by name
function sortProgrammingByName(a, b) {
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
}

function scanFolder(folderPath) {
    let items = fs.readdirSync(folderPath);

    items.forEach(item => {
        let fullPath = path.join(folderPath, item);
        let stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanFolder(fullPath);
        } else {
            let relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

            if (relativePath.includes("HTML Assignments") && item.endsWith(".html")) {
                result.html.push(relativePath);
            }
            else if (relativePath.includes("Javascript assignments") && item.endsWith(".html")) {
                result.js.push(relativePath);
            }
            else if (relativePath.includes("Progarmming Assignment")) {
                result.programming.push({
                    name: item,
                    path: relativePath
                });
            }
        }
    });
}

// Scan all folders
scanFolder(baseDir);

// Sort HTML assignments in ascending order by number
result.html.sort(sortByNumber);

// Sort JavaScript assignments in ascending order by number
result.js.sort(sortByNumber);

// Sort Programming assignments alphabetically with numeric awareness
result.programming.sort(sortProgrammingByName);

// Write to data.json
fs.writeFileSync("data.json", JSON.stringify(result, null, 2));

console.log("✅ data.json generated successfully!");
console.log(`📊 Statistics:`);
console.log(`   - HTML Assignments: ${result.html.length} files`);
console.log(`   - JavaScript Tasks: ${result.js.length} files`);
console.log(`   - Programming Files: ${result.programming.length} files`);
console.log(`\n📝 Files are sorted in ascending order!`);