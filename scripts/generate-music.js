#!/usr/bin/env node
/**
 * generate-music.js
 * Scans public/audio/ for music files and generates public/audio/music.json
 * Run: node scripts/generate-music.js
 *
 * Supported formats: .mp3 .ogg .wav .m4a .flac .aac .webm
 *
 * Naming tip — filename becomes the track title + artist:
 *   "Interstellar Theme - Hans Zimmer.mp3"  →  Title: "Interstellar Theme", Artist: "Hans Zimmer"
 *   "Space Ambient.mp3"                      →  Title: "Space Ambient", Artist: "Unknown"
 *   "01 - Cosmic Drift - Stellardream.mp3"  →  Title: "Cosmic Drift", Artist: "Stellardream"
 */

const fs   = require('fs');
const path = require('path');

const AUDIO_DIR   = path.join(__dirname, '..', 'public', 'audio');
const OUTPUT_FILE = path.join(AUDIO_DIR, 'music.json');
const EXTENSIONS  = new Set(['.mp3', '.ogg', '.wav', '.m4a', '.flac', '.aac', '.webm']);

function formatBytes(bytes) {
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function parseName(filename) {
  // Remove extension
  let name = filename.replace(/\.[^.]+$/, '');
  // Remove leading track number like "01 - " or "01. "
  name = name.replace(/^\d+[\s\-\.]+/, '');
  // Split on " - " to get title and artist
  const parts = name.split(/\s+-\s+/);
  if (parts.length >= 2) {
    return {
      title:  parts.slice(0, parts.length - 1).join(' - ').trim(),
      artist: parts[parts.length - 1].trim(),
    };
  }
  return { title: name.trim(), artist: 'Unknown' };
}

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  console.log('📁 Created public/audio/ directory');
}

const files = fs.readdirSync(AUDIO_DIR)
  .filter(f => EXTENSIONS.has(path.extname(f).toLowerCase()))
  .sort();

const tracks = files.map((file, idx) => {
  const fullPath = path.join(AUDIO_DIR, file);
  const stat     = fs.statSync(fullPath);
  const { title, artist } = parseName(file);
  return {
    id:     idx + 1,
    file,
    path:   `public/audio/${file}`,
    title,
    artist,
    size:   formatBytes(stat.size),
    added:  stat.mtime.toISOString().split('T')[0],
  };
});

const result = {
  generated: new Date().toISOString(),
  count:     tracks.length,
  tracks,
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

console.log(`✅ Generated music.json`);
console.log(`   🎵 ${tracks.length} track${tracks.length !== 1 ? 's' : ''} found`);
tracks.forEach(t => console.log(`   └─ ${t.title} — ${t.artist} (${t.size})`));
if (tracks.length === 0) {
  console.log(`\n   ℹ️  Drop your music files into public/audio/ and run this script again.`);
  console.log(`   Supported: .mp3 .ogg .wav .m4a .flac .aac .webm`);
  console.log(`   Naming:    "Song Title - Artist Name.mp3"`);
}
console.log(`   📄 Output: ${OUTPUT_FILE}`);
