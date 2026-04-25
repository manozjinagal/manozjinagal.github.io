# Manoz Jinagal — Space Portfolio

A production-grade personal portfolio with space/NASA aesthetics, photography showcase, and blog — deployable to GitHub Pages.

---

## 🚀 Project Structure

```
manoz-portfolio/
├── index.html                  ← Entry point (home + all sections)
├── photography.html            ← Photography showcase page
├── blog.html                   ← Blog listing page
├── blog-post.html              ← Individual blog post reader
│
├── src/
│   ├── styles/
│   │   ├── base.css            ← CSS variables, reset, typography
│   │   ├── components.css      ← Reusable components (cards, buttons, nav)
│   │   └── animations.css      ← All keyframes and transitions
│   ├── utils/
│   │   ├── canvas.js           ← Starfield, black hole, orbit engine
│   │   ├── emailjs.js          ← Visitor notifications + contact form
│   │   └── router.js           ← Hash-based navigation helpers
│   ├── pages/
│   │   ├── home.js             ← Hero, About, Experience, Skills sections
│   │   ├── photography.js      ← Photo gallery engine (reads photos/ folder)
│   │   └── blog.js             ← Blog engine (reads blog/ folder)
│   └── components/
│       ├── nav.js              ← Navigation component
│       ├── orbit.js            ← 3D orbit system
│       └── starfield.js        ← Star canvas renderer
│
├── public/
│   ├── photos/                 ← 📸 DROP YOUR PHOTOS HERE
│   │   ├── nature/             ← Nature photography
│   │   ├── travel/             ← Travel shots
│   │   ├── portrait/           ← Portraits
│   │   └── street/             ← Street photography
│   │   └── photos.json         ← Auto-generated manifest (run: npm run photos)
│   │
│   └── blog/                   ← ✍️ DROP YOUR BLOG POSTS HERE
│       ├── 2024-01-my-post.md  ← Markdown blog posts
│       └── blog.json           ← Auto-generated manifest (run: npm run blog)
│
├── scripts/
│   ├── generate-photos.js      ← Scans photos/ → generates photos.json
│   └── generate-blog.js        ← Scans blog/ → generates blog.json
│
└── package.json
```

---

## 📸 How to Add Photos

1. Drop your `.jpg`, `.jpeg`, `.png`, or `.webp` files into:
   ```
   public/photos/nature/
   public/photos/travel/
   public/photos/portrait/
   public/photos/street/
   ```
   You can also create new sub-folders — they become gallery categories automatically.

2. Run the generator:
   ```bash
   node scripts/generate-photos.js
   ```
   This scans all folders and writes `public/photos/photos.json`.

3. That's it — the site auto-loads from `photos.json`.

**Photo naming tip:** Name files descriptively — the filename becomes the photo title:
- `sunset-over-ganges-varanasi.jpg` → "Sunset Over Ganges Varanasi"
- `nit-campus-winter.jpg` → "Nit Campus Winter"

---

## ✍️ How to Write a Blog Post

1. Create a `.md` file in `public/blog/`:
   ```
   public/blog/2024-03-15-my-first-post.md
   ```

2. Add frontmatter at the top:
   ```markdown
   ---
   title: My First Blog Post
   date: 2024-03-15
   category: Tech
   cover: /photos/travel/some-photo.jpg
   excerpt: A short description shown in the blog listing.
   ---

   Your full blog post content here in **Markdown**.

   ## Headings work
   - Lists work
   - Code blocks work
   ```

3. Run the generator:
   ```bash
   node scripts/generate-blog.js
   ```

4. Post appears on `/blog.html` automatically.

---

## ⚙️ EmailJS Setup (Visitor Notifications)

1. Sign up at https://www.emailjs.com (free)
2. Add Gmail service → copy **Service ID**
3. Create template with variables: `{{to_email}}`, `{{subject}}`, `{{message_type}}`, `{{visitor_ip}}`, `{{visitor_city}}`, `{{visitor_country}}`, `{{visitor_device}}`, `{{visitor_browser}}`, `{{visitor_time}}`, `{{visitor_referrer}}`, `{{from_name}}`, `{{from_email}}`, `{{message}}`
4. Copy **Template ID** and **Public Key**
5. Edit `src/utils/emailjs.js` and fill in your credentials

---

## 🌐 Deploy to GitHub Pages

### Option 1 — GitHub Pages (Recommended)
```bash
# 1. Create repo: manozjinagal.github.io (or any repo name)
git init
git add .
git commit -m "🚀 Launch portfolio"
git remote add origin https://github.com/manozjinagal/manozjinagal.github.io.git
git push -u origin main
```
GitHub Pages will serve `index.html` automatically.

### Option 2 — Custom domain
Add a `CNAME` file with your domain:
```
manoz.dev
```

---

## 🔧 Local Development

No build step needed — open directly in browser:
```bash
# Python (any machine)
python3 -m http.server 3000

# OR Node.js
npx serve .

# Then open: http://localhost:3000
```

---

## 🛠️ Customization

All personal data is in `src/config.js`:
```js
export const CONFIG = {
  name: 'Manoz Jinagal',
  email: 'manozjinagal@gmail.com',
  // ...etc
}
```

Colors, fonts, and animations are all in `src/styles/base.css` via CSS custom properties.
