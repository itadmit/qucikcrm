const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, 'app', 'api');

const SKIP_DIRS = ['auth', 'webhooks', 'cron'];
const SKIP_FILES = [
  'quotes/[id]/approve/route.ts',
  'quotes/[id]/payment/route.ts',
  'quotes/[id]/generate-payment-link/route.ts',
  'payments/payplus/callback/route.ts',
  'integrations/invoice4u/test/route.ts',
  'integrations/invoice4u/clearing/callback/route.ts',
  'invitations/[token]/route.ts',
  'users/push-token/route.ts',
];

function shouldSkip(filePath) {
  const rel = path.relative(path.join(__dirname, 'app', 'api'), filePath).replace(/\\/g, '/');
  for (const dir of SKIP_DIRS) {
    if (rel.startsWith(dir + '/')) return true;
  }
  for (const skip of SKIP_FILES) {
    if (rel === skip) return true;
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
const files = getAllRouteFiles(API_DIR);

for (const file of files) {
  if (shouldSkip(file)) continue;
  
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('getServerSession')) continue;
  
  const orig = content;

  // Remove old imports
  content = content.replace(/import\s*\{\s*getServerSession\s*\}\s*from\s*["']next-auth["'];?\s*\n/g, '');
  content = content.replace(/import\s*\{\s*authOptions\s*\}\s*from\s*["']@\/lib\/auth["'];?\s*\n/g, '');

  // Add getAuthUser import if not present
  if (!content.includes('getAuthUser')) {
    const firstImportMatch = content.match(/^import\s+.+$/m);
    if (firstImportMatch) {
      let lastImportEnd = 0;
      const importRegex = /^import\s+.+$/gm;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        lastImportEnd = match.index + match[0].length;
      }
      content = content.slice(0, lastImportEnd) + '\nimport { getAuthUser } from "@/lib/mobile-auth"' + content.slice(lastImportEnd);
    }
  }

  // Handle ExtendedSession pattern:
  // "const session = (await getServerSession(authOptions)) as ExtendedSession | null"
  // followed by "if (!session?.user?.companyId)" or "if (!session)"
  // Then usage: session.user.companyId, session.user.id, etc.
  content = content.replace(
    /const session = \(await getServerSession\(authOptions\)\) as ExtendedSession \| null;?/g,
    'const user = await getAuthUser(req)'
  );
  
  // Handle plain pattern:
  // "const session = await getServerSession(authOptions);"
  content = content.replace(
    /const session = await getServerSession\(authOptions\);?/g,
    'const user = await getAuthUser(req)'
  );

  // Fix session references
  content = content.replace(/!session\?\.user\?\.companyId/g, '!user?.companyId');
  content = content.replace(/!session\?\.user\?\.id/g, '!user?.id');
  content = content.replace(/!session\?\.user/g, '!user');
  content = content.replace(/!session\)/g, '!user)');
  content = content.replace(/session\?\.user\?\.companyId/g, 'user?.companyId');
  content = content.replace(/session\?\.user\?\.id/g, 'user?.id');
  content = content.replace(/session\.user\.companyId/g, 'user.companyId');
  content = content.replace(/session\.user\.id/g, 'user.id');
  content = content.replace(/session\.user\.email/g, 'user.email');
  content = content.replace(/session\.user\.name/g, 'user.name');
  content = content.replace(/session\.user\.role/g, 'user.role');
  content = content.replace(/session\.user/g, 'user');
  content = content.replace(/session\?\.user/g, 'user');

  // Remove ExtendedSession interface/type if now unused
  // Check if ExtendedSession is still used
  if (!content.includes('ExtendedSession')) {
    // No further action needed
  }
  
  // Remove "const user = session?.user as {companyId...}" since getAuthUser already returns that
  content = content.replace(/\s*const user = user as \{[^}]*\}[^;\n]*;?\n/g, '\n');

  // Remove stale import of authOptions if still present
  content = content.replace(/import\s*\{\s*authOptions\s*\}\s*from\s*["']@\/lib\/auth["'];?\s*\n/g, '');
  
  // Clean up double blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  if (content !== orig) {
    fs.writeFileSync(file, content);
    modified++;
    console.log('FIXED:', path.relative(__dirname, file));
  }
}

console.log(`\nDone: ${modified} files fixed`);
