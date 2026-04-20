const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, 'app', 'api');

function getAllRouteFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllRouteFiles(fullPath));
    } else if (entry.name === 'route.ts') {
      results.push(fullPath);
    }
  }
  return results;
}

let modified = 0;
const files = getAllRouteFiles(API_DIR);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;

  // Fix indentation: "  const { id } = await params;" after "try {" should be "    const..."
  // Pattern: "try {\n  const { X } = await params;" -> "try {\n    const { X } = await params;"
  content = content.replace(
    /try \{\n  (const \{ \w+ \} = await params;)/g,
    'try {\n    $1'
  );

  if (content !== orig) {
    fs.writeFileSync(file, content);
    modified++;
  }
}

console.log(`Fixed indentation in ${modified} files`);
