#!/usr/bin/env node
/**
 * generate-photos.js
 * Scans public/photos/ subdirectories and generates public/photos/photos.json
 * Run: node scripts/generate-photos.js
 */

const fs   = require('fs');
const path = require('path');

const PHOTOS_DIR  = path.join(__dirname, '..', 'public', 'photos');
const OUTPUT_FILE = path.join(PHOTOS_DIR, 'photos.json');
const EXTENSIONS  = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function titleCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\.[^.]+$/, '')           // remove extension
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

const result = { generated: new Date().toISOString(), categories: [] };

if (!fs.existsSync(PHOTOS_DIR)) {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  console.log('📁 Created photos directory');
}

const entries = fs.readdirSync(PHOTOS_DIR, { withFileTypes: true });
const folders = entries.filter(e => e.isDirectory());

if (folders.length === 0) {
  // Also scan root photos dir for loose images
  folders.push({ name: 'uncategorized', isDirectory: () => true });
}

for (const folder of folders) {
  const catDir = folder.name === 'uncategorized'
    ? PHOTOS_DIR
    : path.join(PHOTOS_DIR, folder.name);

  if (!fs.existsSync(catDir)) continue;

  const files = fs.readdirSync(catDir)
    .filter(f => EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) continue;

  const photos = files.map(file => {
    const fullPath = path.join(catDir, file);
    const stat     = fs.statSync(fullPath);
    const webPath  = `public/photos/${folder.name}/${file}`;
    return {
      file,
      path:  webPath,
      title: titleCase(file),
      size:  formatBytes(stat.size),
      date:  stat.mtime.toISOString().split('T')[0],
    };
  });

  result.categories.push({
    id:     folder.name,
    name:   titleCase(folder.name),
    count:  photos.length,
    photos,
  });
}

const totalPhotos = result.categories.reduce((s, c) => s + c.count, 0);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

console.log(`✅ Generated photos.json`);
console.log(`   📸 ${totalPhotos} photos across ${result.categories.length} categories`);
result.categories.forEach(c => console.log(`   └─ ${c.name}: ${c.count} photos`));
console.log(`   📄 Output: ${OUTPUT_FILE}`);
