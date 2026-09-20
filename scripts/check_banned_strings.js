import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BANNED_STRINGS = [
  'Oliver', 'Ruby', 'biscuit', 'bakery', 'regroup', 'Hundreds', 'toy shop',
  '476', '357', '833', 'Ethan', 'Ramp Rally', 'skate', 'straight line rule',
  'Apple Orchard', 'Sticker Studio', 'Toy Town', 'Puppy Park', 'Pencil Palace',
  'Group Galaxy', 'Basket Bay', 'Number Nest', 'Rainbow Groups', 'Division Castle',
  'Wei Ming', 'Priya', 'Bintang'
];

function scanDir(dir, violations = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.gemini'].includes(entry.name)) continue;
      scanDir(fullPath, violations);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx') || entry.name.endsWith('.html') || entry.name.endsWith('.css')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const banned of BANNED_STRINGS) {
          // Case-sensitive check
          if (content.includes(banned)) {
            // Exclude this script itself
            if (entry.name === 'check_banned_strings.js') continue;
            violations.push({ file: fullPath, banned });
          }
        }
      }
    }
  }
  return violations;
}

const rootDir = path.join(__dirname, '..');
console.log('Running Content Isolation (Banned Strings) Check on src/ and public/ ...');

const violations = scanDir(path.join(rootDir, 'src')).concat(scanDir(path.join(rootDir, 'public')));

if (violations.length > 0) {
  console.error(`❌ FAILED! Found ${violations.length} banned string violations:`);
  violations.forEach(v => console.error(`  - In ${v.file}: "${v.banned}"`));
  process.exit(1);
} else {
  console.log(`✅ PASSED! Zero banned strings found. Full content isolation verified.`);
}
