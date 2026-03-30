/**
 * generate-docs.js
 *
 * Parses the Putting Tracker source files (index.html, style.css, script.js)
 * and generates Markdown documentation in the docs/ directory.
 *
 * Run: node .github/scripts/generate-docs.js
 *
 * What it extracts:
 *   HTML  — element IDs, class names, section structure, asset references
 *   CSS   — custom properties, selectors with their comments, media queries
 *   JS    — functions, event listeners, state variables, JSDoc comments
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', '..');
const DOCS_DIR = path.join(SRC_DIR, 'docs');

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
}

const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

/* ==========================================================================
   HTML DOCUMENTATION GENERATOR
   ========================================================================== */

function generateHtmlDocs() {
    const filePath = path.join(SRC_DIR, 'index.html');
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Extract all element IDs with their line numbers and tag types
    const ids = [];
    const classes = new Set();
    const assets = [];

    lines.forEach((line, idx) => {
        const lineNum = idx + 1;

        // Find IDs
        const idMatches = line.matchAll(/id="([^"]+)"/g);
        for (const match of idMatches) {
            const tagMatch = line.match(/<(\w+)/);
            const tag = tagMatch ? tagMatch[1] : 'unknown';
            ids.push({ id: match[1], tag, line: lineNum });
        }

        // Find classes (excluding common utility classes)
        const classMatches = line.matchAll(/class="([^"]+)"/g);
        for (const match of classMatches) {
            match[1].split(/\s+/).forEach(cls => {
                if (cls && cls !== 'd-none') classes.add(cls);
            });
        }

        // Find asset references (src, href to local files)
        const srcMatches = line.matchAll(/(?:src|href)="([^"]+\.(png|jpg|ico|css|js|json))"/g);
        for (const match of srcMatches) {
            assets.push({ path: match[1], line: lineNum });
        }
    });

    // Extract HTML comments (multi-line aware)
    const commentBlocks = [];
    const commentRegex = /<!--([\s\S]*?)-->/g;
    let match;
    while ((match = commentRegex.exec(content)) !== null) {
        const beforeMatch = content.slice(0, match.index);
        const lineNum = beforeMatch.split('\n').length;
        const text = match[1].trim().replace(/\s+/g, ' ');
        if (text.length > 5) { // Skip trivial comments
            commentBlocks.push({ text, line: lineNum });
        }
    }

    // Count sections (modals, major divs)
    const modals = ids.filter(i => i.id.includes('modal'));
    const buttons = ids.filter(i => i.tag === 'button' || i.id.startsWith('btn'));
    const inputs = ids.filter(i => i.tag === 'input');

    let md = `# index.html — Auto-Generated Documentation\n\n`;
    md += `> Generated on ${timestamp}\n\n`;
    md += `## Summary\n\n`;
    md += `| Metric | Count |\n|---|---|\n`;
    md += `| Total lines | ${lines.length} |\n`;
    md += `| Element IDs | ${ids.length} |\n`;
    md += `| CSS classes used | ${classes.size} |\n`;
    md += `| Modals | ${modals.length} |\n`;
    md += `| Buttons | ${buttons.length} |\n`;
    md += `| Inputs | ${inputs.length} |\n`;
    md += `| Asset references | ${assets.length} |\n\n`;

    md += `## Element IDs\n\n`;
    md += `| ID | Tag | Line |\n|---|---|---|\n`;
    ids.forEach(i => {
        md += `| \`${i.id}\` | \`<${i.tag}>\` | ${i.line} |\n`;
    });

    md += `\n## Asset References\n\n`;
    md += `| Path | Line |\n|---|---|\n`;
    assets.forEach(a => {
        md += `| \`${a.path}\` | ${a.line} |\n`;
    });

    md += `\n## HTML Comments (Section Markers)\n\n`;
    if (commentBlocks.length === 0) {
        md += `_No comments found._\n`;
    } else {
        commentBlocks.forEach(c => {
            // Truncate long comments
            const display = c.text.length > 120 ? c.text.slice(0, 120) + '...' : c.text;
            md += `- **Line ${c.line}:** ${display}\n`;
        });
    }

    md += `\n## CSS Classes Used\n\n`;
    const sortedClasses = [...classes].sort();
    md += sortedClasses.map(c => `\`${c}\``).join(', ') + '\n';

    fs.writeFileSync(path.join(DOCS_DIR, 'index.html.md'), md);
    console.log('Generated: docs/index.html.md');
}


/* ==========================================================================
   CSS DOCUMENTATION GENERATOR
   ========================================================================== */

function generateCssDocs() {
    const filePath = path.join(SRC_DIR, 'style.css');
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Extract CSS custom properties from :root
    const customProps = [];
    let inRoot = false;
    lines.forEach((line, idx) => {
        if (line.includes(':root')) inRoot = true;
        if (inRoot) {
            const propMatch = line.match(/--([\w-]+):\s*([^;]+);/);
            if (propMatch) {
                // Check for inline comment
                const commentMatch = line.match(/\/\*\s*(.+?)\s*\*\//);
                customProps.push({
                    name: `--${propMatch[1]}`,
                    value: propMatch[2].trim(),
                    comment: commentMatch ? commentMatch[1] : '',
                    line: idx + 1
                });
            }
            if (line.includes('}')) inRoot = false;
        }
    });

    // Extract section comments (lines starting with /* ── or /* === )
    const sections = [];
    lines.forEach((line, idx) => {
        const sectionMatch = line.match(/\/\*\s*(?:──|={3,})\s*(.+?)(?:\s*(?:──|={3,}))?\s*\*?\/?$/);
        if (sectionMatch) {
            sections.push({ title: sectionMatch[1].trim(), line: idx + 1 });
        }
    });

    // Extract all selectors with their line numbers
    const selectors = [];
    lines.forEach((line, idx) => {
        // Match CSS selectors (lines ending with {, not inside comments)
        const trimmed = line.trim();
        if (trimmed.endsWith('{') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) {
            const selector = trimmed.replace(/\s*\{$/, '').trim();
            if (selector && selector !== '' && !selector.startsWith('@')) {
                selectors.push({ selector, line: idx + 1 });
            }
        }
    });

    // Extract media queries
    const mediaQueries = [];
    lines.forEach((line, idx) => {
        const mqMatch = line.match(/@media\s*\(([^)]+)\)/);
        if (mqMatch) {
            mediaQueries.push({ query: mqMatch[1], line: idx + 1 });
        }
    });

    let md = `# style.css — Auto-Generated Documentation\n\n`;
    md += `> Generated on ${timestamp}\n\n`;
    md += `## Summary\n\n`;
    md += `| Metric | Count |\n|---|---|\n`;
    md += `| Total lines | ${lines.length} |\n`;
    md += `| Custom properties | ${customProps.length} |\n`;
    md += `| Selectors | ${selectors.length} |\n`;
    md += `| Section comments | ${sections.length} |\n`;
    md += `| Media queries | ${mediaQueries.length} |\n\n`;

    md += `## CSS Custom Properties (Theme)\n\n`;
    md += `| Variable | Value | Description |\n|---|---|---|\n`;
    customProps.forEach(p => {
        md += `| \`${p.name}\` | \`${p.value}\` | ${p.comment} |\n`;
    });

    md += `\n## Sections\n\n`;
    sections.forEach(s => {
        md += `- **Line ${s.line}:** ${s.title}\n`;
    });

    md += `\n## Selectors\n\n`;
    md += `| Selector | Line |\n|---|---|\n`;
    selectors.forEach(s => {
        md += `| \`${s.selector}\` | ${s.line} |\n`;
    });

    md += `\n## Media Queries\n\n`;
    if (mediaQueries.length === 0) {
        md += `_No media queries found._\n`;
    } else {
        mediaQueries.forEach(mq => {
            md += `- **Line ${mq.line}:** \`@media (${mq.query})\`\n`;
        });
    }

    fs.writeFileSync(path.join(DOCS_DIR, 'style.css.md'), md);
    console.log('Generated: docs/style.css.md');
}


/* ==========================================================================
   JAVASCRIPT DOCUMENTATION GENERATOR
   ========================================================================== */

function generateJsDocs() {
    const filePath = path.join(SRC_DIR, 'script.js');
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Extract function declarations (named functions)
    const functions = [];
    lines.forEach((line, idx) => {
        const funcMatch = line.match(/^function\s+(\w+)\s*\(([^)]*)\)/);
        if (funcMatch) {
            // Look backward for JSDoc or block comment
            let description = '';
            for (let i = idx - 1; i >= Math.max(0, idx - 15); i--) {
                if (lines[i].trim().startsWith('/**') || lines[i].trim().startsWith('/*')) {
                    // Found start of comment block — collect lines until we reach this function
                    const commentLines = [];
                    for (let j = i; j < idx; j++) {
                        const cleaned = lines[j].replace(/^\s*\/?\*+\/?/, '').trim();
                        if (cleaned && !cleaned.startsWith('@')) commentLines.push(cleaned);
                    }
                    description = commentLines.join(' ').slice(0, 150);
                    break;
                }
                if (lines[i].trim() !== '' && !lines[i].trim().startsWith('*') && !lines[i].trim().startsWith('//')) break;
            }
            functions.push({
                name: funcMatch[1],
                params: funcMatch[2],
                line: idx + 1,
                description
            });
        }
    });

    // Extract variable declarations (let, const at top level)
    const variables = [];
    lines.forEach((line, idx) => {
        const varMatch = line.match(/^(let|const)\s+(\w+)\s*=/);
        if (varMatch) {
            // Get inline comment if present
            const commentMatch = line.match(/\/\/\s*(.+)$/);
            variables.push({
                kind: varMatch[1],
                name: varMatch[2],
                line: idx + 1,
                comment: commentMatch ? commentMatch[1] : ''
            });
        }
    });

    // Extract event listeners
    const listeners = [];
    lines.forEach((line, idx) => {
        const listenerMatch = line.match(/(?:getElementById\(['"]([^'"]+)['"]\)|(\w+))\.addEventListener\(['"](\w+)['"]/);
        if (listenerMatch) {
            const target = listenerMatch[1] || listenerMatch[2];
            const event = listenerMatch[3];
            listeners.push({ target, event, line: idx + 1 });
        }
    });

    // Extract section comments (block comments with === or ---)
    const sections = [];
    lines.forEach((line, idx) => {
        const sectionMatch = line.match(/\/\*\s*={3,}\s*$/);
        if (sectionMatch) {
            // Next non-empty, non-comment line is the title
            for (let i = idx + 1; i < Math.min(idx + 5, lines.length); i++) {
                const titleLine = lines[i].replace(/^\s*\*?\s*/, '').trim();
                if (titleLine && !titleLine.startsWith('=') && !titleLine.startsWith('*')) {
                    sections.push({ title: titleLine, line: idx + 1 });
                    break;
                }
            }
        }
    });

    let md = `# script.js — Auto-Generated Documentation\n\n`;
    md += `> Generated on ${timestamp}\n\n`;
    md += `## Summary\n\n`;
    md += `| Metric | Count |\n|---|---|\n`;
    md += `| Total lines | ${lines.length} |\n`;
    md += `| Functions | ${functions.length} |\n`;
    md += `| Variables (top-level) | ${variables.length} |\n`;
    md += `| Event listeners | ${listeners.length} |\n`;
    md += `| Section comments | ${sections.length} |\n\n`;

    md += `## Sections\n\n`;
    if (sections.length === 0) {
        md += `_No section comments found._\n`;
    } else {
        sections.forEach(s => {
            md += `- **Line ${s.line}:** ${s.title}\n`;
        });
    }

    md += `\n## Functions\n\n`;
    md += `| Function | Parameters | Line | Description |\n|---|---|---|---|\n`;
    functions.forEach(f => {
        const params = f.params || '_none_';
        const desc = f.description || '';
        md += `| \`${f.name}\` | \`${params}\` | ${f.line} | ${desc} |\n`;
    });

    md += `\n## Top-Level Variables\n\n`;
    md += `| Kind | Name | Line | Comment |\n|---|---|---|---|\n`;
    variables.forEach(v => {
        md += `| \`${v.kind}\` | \`${v.name}\` | ${v.line} | ${v.comment} |\n`;
    });

    md += `\n## Event Listeners\n\n`;
    md += `| Target | Event | Line |\n|---|---|---|\n`;
    listeners.forEach(l => {
        md += `| \`${l.target}\` | \`${l.event}\` | ${l.line} |\n`;
    });

    fs.writeFileSync(path.join(DOCS_DIR, 'script.js.md'), md);
    console.log('Generated: docs/script.js.md');
}


/* ==========================================================================
   MAIN
   ========================================================================== */

console.log('Generating documentation for Putting Tracker...\n');

generateHtmlDocs();
generateCssDocs();
generateJsDocs();

console.log('\nDone! Documentation written to docs/');
