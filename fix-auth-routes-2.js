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
  
  // Fix 1: "user?.user" -> "user" (getAuthUser already returns user directly)
  content = content.replace(/user\?\.user\?\.companyId/g, 'user?.companyId');
  content = content.replace(/user\?\.user\?\.id/g, 'user?.id');
  content = content.replace(/user\?\.user\?\.email/g, 'user?.email');
  content = content.replace(/user\?\.user\?\.name/g, 'user?.name');
  content = content.replace(/user\?\.user\?\.role/g, 'user?.role');
  content = content.replace(/!user\?\.user\b/g, '!user');
  content = content.replace(/user\?\.user\b/g, 'user');
  
  // Fix 2: Remove "const user = user as {...}" lines (redundant self-assignment)
  content = content.replace(/\s*const user = user as \{[^}]*\}[^;\n]*;?\n/g, '\n');
  
  // Fix 3: "if (!user?.user || !('companyId' in user) || !user.companyId)" -> "if (!user?.companyId)"
  content = content.replace(
    /if \(!user \|\| !\('companyId' in user\) \|\| !user\.companyId\)/g,
    'if (!user?.companyId)'
  );
  
  // Fix 4: remaining "if (!user) {" that may need companyId check
  // Already fine - those routes check session not user props
  
  // Clean up double blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  if (content !== orig) {
    fs.writeFileSync(file, content);
    modified++;
    console.log('FIXED:', path.relative(__dirname, file));
  }
}

console.log(`\nDone: ${modified} files fixed`);
