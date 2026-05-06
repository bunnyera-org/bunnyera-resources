import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

const folders = {
  momo: [
    'momo',
    'rabbit',
    'bunny',
    'mascot',
    'character',
    'happy',
    'wink',
    'thinking',
    'surprised',
    'sleeping',
    'working'
  ],
  icons: [
    'icon',
    'app-icon',
    'system',
    'dashboard',
    'settings',
    'security',
    '2fa',
    'agent',
    'browser',
    'cloud',
    'database',
    'api',
    'notification'
  ],
  logos: [
    'logo',
    'wordmark',
    'brand',
    'bunnyera'
  ]
};

const allowedExtensions = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.svg'
]);

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const results = [];

  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (
        item === 'node_modules' ||
        item === '.git' ||
        item === 'generated'
      ) {
        continue;
      }

      results.push(...walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

function detectCategory(filePath) {
  const name = path.basename(filePath).toLowerCase();

  for (const [category, keywords] of Object.entries(folders)) {
    if (keywords.some((keyword) => name.includes(keyword))) {
      return category;
    }
  }

  return 'public-assets';
}

function main() {
  const files = walk(rootDir).filter((filePath) => {
    return allowedExtensions.has(path.extname(filePath).toLowerCase());
  });

  console.log('🐰 BunnyEra Asset Classifier');
  console.log(`Scanned files: ${files.length}`);
  console.log('');

  const grouped = {};

  for (const filePath of files) {
    const category = detectCategory(filePath);
    const relativePath = path.relative(rootDir, filePath);

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(relativePath);
  }

  for (const [category, items] of Object.entries(grouped)) {
    console.log(`## ${category}`);

    for (const item of items) {
      console.log(`- ${item}`);
    }

    console.log('');
  }

  if (files.length === 0) {
    console.log('No image assets found yet.');
  }
}

main();