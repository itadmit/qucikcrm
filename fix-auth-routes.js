const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, 'app', 'api');

// Routes that should NOT be modified (public/webhook/cron/special auth)
const SKIP_DIRS = [
  'auth',
  'webhooks',
  'cron',
];

const SKIP_FILES = [
  'app/api/quotes/[id]/approve/route.ts',
  'app/api/quotes/[id]/payment/route.ts',
  'app/api/quotes/[id]/generate-payment-link/route.ts',
  'app/api/payments/payplus/callback/route.ts',
  'app/api/integrations/invoice4u/test/route.ts',
  'app/api/integrations/invoice4u/clearing/callback/route.ts',
  'app/api/invitations/[token]/route.ts',
  'app/api/users/push-token/route.ts', // already uses getAuthUser
];

function shouldSkip(filePath) {
  const rel = path.relative(__dirname, filePath).replace(/\\/g, '/');
  for (const dir of SKIP_DIRS) {
    if (rel.includes(`app/api/${dir}/`)) return true;
  }
  for (const skip of SKIP_FILES) {
    if (rel.endsWith(skip)) return true;
  }
  return false;
}

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
let skipped = 0;
let errors = [];

const files = getAllRouteFiles(API_DIR);

for (const file of files) {
  if (shouldSkip(file)) {
    skipped++;
    continue;
  }

  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('getServerSession(authOptions)')) {
    skipped++;
    continue;
  }
  
  const origContent = content;
  
  // Step 1: Replace import statements
  // Remove: import { getServerSession } from "next-auth"
  // Remove: import { authOptions } from "@/lib/auth"
  // Add: import { getAuthUser } from "@/lib/mobile-auth"
  
  const hasGetAuthUser = content.includes('getAuthUser');
  
  // Remove getServerSession import
  content = content.replace(/import\s*\{\s*getServerSession\s*\}\s*from\s*["']next-auth["']\s*\n?/g, '');
  
  // Remove authOptions import  
  content = content.replace(/import\s*\{\s*authOptions\s*\}\s*from\s*["']@\/lib\/auth["']\s*\n?/g, '');
  
  // Add getAuthUser import if not already present
  if (!hasGetAuthUser) {
    // Add after the first import line
    const firstImportEnd = content.indexOf('\n', content.indexOf('import '));
    if (firstImportEnd !== -1) {
      // Find position after all imports
      let lastImportEnd = 0;
      const importRegex = /^import\s+.+$/gm;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        lastImportEnd = match.index + match[0].length;
      }
      content = content.slice(0, lastImportEnd) + '\nimport { getAuthUser } from "@/lib/mobile-auth"' + content.slice(lastImportEnd);
    }
  }
  
  // Step 2: Replace Pattern A - session?.user as cast
  // "const session = await getServerSession(authOptions)\n    const user = session?.user as { ... } | null"
  // -> "const user = await getAuthUser(req)"
  content = content.replace(
    /const session = await getServerSession\(authOptions\)\s*\n\s*const user = session\?\.user as \{[^}]*\}\s*\|\s*null;?/g,
    'const user = await getAuthUser(req)'
  );
  
  // Step 3: Replace Pattern B - direct session check
  // "const session = await getServerSession(authOptions)\n    if (!session..." 
  // -> "const user = await getAuthUser(req)\n    if (!user..."
  content = content.replace(
    /const session = await getServerSession\(authOptions\)\s*\n(\s*)if \(!session\b/g,
    'const user = await getAuthUser(req)\n$1if (!user'
  );
  
  // Replace remaining session.user.companyId with user.companyId
  content = content.replace(/session\.user\.companyId/g, 'user.companyId');
  content = content.replace(/session\.user\.id/g, 'user.id');
  content = content.replace(/session\.user\.email/g, 'user.email');
  content = content.replace(/session\.user\.name/g, 'user.name');
  content = content.replace(/session\.user\.role/g, 'user.role');
  content = content.replace(/session\.user/g, 'user');
  
  // Replace !session?.user?.companyId with !user?.companyId
  content = content.replace(/!session\?\.user\?\.companyId/g, '!user?.companyId');
  
  // Replace user?.companyId (when user was already from session?.user) - no change needed
  // Replace remaining "!session" checks
  content = content.replace(/if \(!session\)/g, 'if (!user)');
  content = content.replace(/if \(!session /g, 'if (!user ');
  
  // Clean up any remaining session references
  content = content.replace(/session\?\.user/g, 'user');
  
  // Fix: ensure functions that don't take req parameter now do
  // Check for GET/POST/PATCH/PUT/DELETE functions that don't accept req
  // Most already have req: NextRequest, but some might not
  
  // Remove duplicate empty lines from import cleanup
  content = content.replace(/\n{3,}/g, '\n\n');
  
  if (content !== origContent) {
    fs.writeFileSync(file, content);
    modified++;
    console.log('MODIFIED:', path.relative(__dirname, file));
  } else {
    skipped++;
  }
}

console.log(`\nDone: ${modified} modified, ${skipped} skipped, ${errors.length} errors`);
if (errors.length) console.log('Errors:', errors);
