// ═══════════════════════════════════════════════════
// markdown.js — Lightweight Markdown to HTML parser
// Supports: headings, bold, italic, code, links,
//           lists, blockquotes, images, hr, pre/code
// No external dependencies.
// ═══════════════════════════════════════════════════

export function parseMarkdown(md) {
  if (!md) return '';

  let html = md
    // Strip frontmatter
    .replace(/^---[\s\S]*?---\n?/, '')

    // Code blocks (must come before inline code)
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code class="lang-${lang}">${escapeHtml(code.trim())}</code></pre>`)

    // Headings
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm,  '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm,   '<h4>$1</h4>')
    .replace(/^### (.+)$/gm,    '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,     '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,      '<h1>$1</h1>')

    // Horizontal rule
    .replace(/^---$/gm, '<hr/>')

    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

    // Unordered lists
    .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)\n(?!<li>)/g, '<ul>$1</ul>\n')
    .replace(/(<li>[\s\S]*?<\/li>)/g, (match) => {
      if (!match.includes('<ul>')) return `<ul>${match}</ul>`;
      return match;
    })

    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li-ol>$1</li-ol>')
    .replace(/(<li-ol>[\s\S]*?<\/li-ol>)/g, m => `<ol>${m.replace(/li-ol/g,'li')}</ol>`)

    // Images (before links)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy"/>')

    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/__(.+?)__/g,     '<strong>$1</strong>')
    .replace(/_(.+?)_/g,       '<em>$1</em>')

    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')

    // Line breaks → paragraphs
    .split(/\n\n+/)
    .map(block => {
      block = block.trim();
      if (!block) return '';
      // Don't wrap block elements in <p>
      if (/^<(h[1-6]|ul|ol|li|pre|blockquote|hr|img)/.test(block)) return block;
      return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');

  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
