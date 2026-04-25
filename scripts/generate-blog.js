#!/usr/bin/env node
/**
 * generate-blog.js
 * Scans public/blog/*.md files, parses frontmatter, generates public/blog/blog.json
 * Run: node scripts/generate-blog.js
 */

const fs   = require('fs');
const path = require('path');

const BLOG_DIR    = path.join(__dirname, '..', 'public', 'blog');
const OUTPUT_FILE = path.join(BLOG_DIR, 'blog.json');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      meta[key.trim()] = rest.join(':').trim().replace(/^['"]|['"]$/g, '');
    }
  });

  return { meta, body: match[2].trim() };
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const mins  = Math.ceil(words / 200);
  return `${mins} min read`;
}

function titleCase(str) {
  return str
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')   // remove date prefix
    .replace(/[-_]/g, ' ')
    .replace(/\.md$/, '')
    .replace(/\b\w/g, c => c.toUpperCase());
}

if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
  console.log('📁 Created blog directory');
}

const files = fs.readdirSync(BLOG_DIR)
  .filter(f => f.endsWith('.md'))
  .sort()
  .reverse(); // newest first

const posts = files.map(file => {
  const raw            = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  const slug           = meta.slug || slugify(file.replace(/\.md$/, ''));

  // Extract date from filename (YYYY-MM-DD-slug.md) or frontmatter
  const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
  const date      = meta.date || (dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]);

  // Auto-excerpt: first 160 chars of body if not set
  const excerpt = meta.excerpt || body.replace(/[#*`\[\]]/g, '').slice(0, 160).trim() + '…';

  return {
    file,
    slug,
    title:       meta.title    || titleCase(file),
    date,
    category:    meta.category || 'General',
    cover:       meta.cover    || null,
    excerpt,
    readingTime: readingTime(body),
    tags:        meta.tags     ? meta.tags.split(',').map(t => t.trim()) : [],
    wordCount:   body.split(/\s+/).length,
  };
});

// Group by category
const categories = [...new Set(posts.map(p => p.category))];

const result = {
  generated:  new Date().toISOString(),
  totalPosts: posts.length,
  categories,
  posts,
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

console.log(`✅ Generated blog.json`);
console.log(`   ✍️  ${posts.length} posts across ${categories.length} categories`);
posts.forEach(p => console.log(`   └─ [${p.date}] ${p.title} (${p.readingTime})`));
console.log(`   📄 Output: ${OUTPUT_FILE}`);
