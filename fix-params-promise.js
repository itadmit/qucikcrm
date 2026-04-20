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

  // Match pattern: { params }: { params: { id: string } }
  // Replace with: { params }: { params: Promise<{ id: string }> }
  // And add "const { id } = await params;" at start of function body

  // Pattern for any param name (id, token, userId)
  const funcRegex = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)\s*\(\s*([\w]+)\s*(?::\s*\w+)?\s*,\s*\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*\{\s*(\w+)\s*:\s*string\s*;?\s*\}\s*\}\s*\)/g;

  let match;
  const replacements = [];

  while ((match = funcRegex.exec(content)) !== null) {
    const [fullMatch, method, reqParam, paramName] = match;
    const newSig = `export async function ${method}(${reqParam}${reqParam.includes(':') ? '' : ': NextRequest'}, { params }: { params: Promise<{ ${paramName}: string }> })`;
    replacements.push({
      start: match.index,
      end: match.index + fullMatch.length,
      newSig,
      paramName,
    });
  }

  if (replacements.length === 0) continue;

  // Apply replacements in reverse order to maintain indices
  for (let i = replacements.length - 1; i >= 0; i--) {
    const r = replacements[i];
    content = content.slice(0, r.start) + r.newSig + content.slice(r.end);
  }

  // Now replace all uses of params.id (or params.token, etc.) with awaited version
  // We need to add "const { paramName } = await params;" after the opening brace of the function

  // For each function, find the opening { after the signature and add the await
  for (const r of replacements) {
    const paramName = r.paramName;
    const awaitLine = `  const { ${paramName} } = await params;`;

    // Find all instances of "params.paramName" and check if we already have the await
    if (!content.includes(awaitLine)) {
      // Find the function signature and its opening brace
      const sigPattern = new RegExp(
        `export\\s+async\\s+function\\s+\\w+\\([^)]*params\\s*:\\s*Promise<\\{\\s*${paramName}\\s*:\\s*string\\s*\\}>\\s*\\}\\s*\\)\\s*\\{`,
        'g'
      );
      let sigMatch;
      while ((sigMatch = sigPattern.exec(content)) !== null) {
        const insertPos = sigMatch.index + sigMatch[0].length;
        // Check if there's already a try { right after
        const afterSig = content.slice(insertPos, insertPos + 50);
        if (afterSig.trim().startsWith('try {')) {
          // Insert after try {
          const tryPos = content.indexOf('try {', insertPos);
          const insertAfterTry = tryPos + 5;
          content = content.slice(0, insertAfterTry) + '\n' + awaitLine + content.slice(insertAfterTry);
        } else {
          content = content.slice(0, insertPos) + '\n' + awaitLine + content.slice(insertPos);
        }
      }
    }
  }

  // Now replace params.X with just X (since we destructured)
  for (const r of replacements) {
    const p = r.paramName;
    // Replace params.id with id, params.token with token etc
    // But be careful not to replace in the destructuring line itself
    const lines = content.split('\n');
    const newLines = lines.map(line => {
      if (line.includes(`const { ${p} } = await params`)) return line;
      return line.replace(new RegExp(`params\\.${p}\\b`, 'g'), p);
    });
    content = newLines.join('\n');
  }

  // Clean up duplicate blank lines
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== orig) {
    fs.writeFileSync(file, content);
    modified++;
    console.log('FIXED:', path.relative(__dirname, file));
  }
}

console.log(`\nDone: ${modified} files fixed`);
