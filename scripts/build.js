const fs = require('fs');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');

// Configuration - Changed dist to docs for GitHub Pages
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../docs');  // Changed from dist to docs

// Create directory structure
const dirs = [
    'docs',  // Changed from dist to docs
    'docs/blog',
    'docs/css',
    'docs/pages',
    'src',
    'src/content/blog',
    'src/content/pages',
    'src/css',
    'src/templates'
].map(dir => path.join(__dirname, '..', dir));

// Initialize directories
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Process markdown files
function processMarkdown(filePath, outputPath) {
    console.log(`Processing markdown file: ${filePath}`);
    
    if (!filePath || !outputPath) {
        console.error('Invalid file paths:', { filePath, outputPath });
        return;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { attributes, body } = frontMatter(content);
        
        if (!attributes.template) {
            console.error(`No template specified in ${filePath}`);
            return;
        }

        const htmlContent = marked.parse(body);
        
        // Read template
        const templatePath = path.join(SRC_DIR, 'templates', attributes.template);
        console.log(`Using template: ${templatePath}`);
        
        if (!fs.existsSync(templatePath)) {
            console.error(`Template not found: ${templatePath}`);
            return;
        }

        let template = fs.readFileSync(templatePath, 'utf8');
        
        // Replace template variables
        const html = template
            .replace('{{title}}', attributes.title || '')
            .replace('{{content}}', htmlContent || '');
        
        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, html);
        console.log(`Successfully processed: ${filePath} -> ${outputPath}`);
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

// Copy static assets
function copyDir(src, dest) {
    console.log(`Copying directory: ${src} -> ${dest}`);
    
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${srcPath} -> ${destPath}`);
        }
    }
}

// Generate blog index
function generateBlogIndex() {
    console.log('Generating blog index...');
    const blogDir = path.join(SRC_DIR, 'content/blog');
    const posts = [];

    if (fs.existsSync(blogDir)) {
        fs.readdirSync(blogDir)
            .filter(file => file.endsWith('.md'))
            .forEach(file => {
                const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
                const { attributes } = frontMatter(content);
                posts.push({
                    title: attributes.title,
                    date: attributes.date,
                    url: `/website1/blog/${file.replace('.md', '.html')}` // Updated for GitHub Pages
                });
            });
    }

    // Sort posts by date
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Generate HTML for posts
    const postsHtml = posts.map(post => `
        <article class="blog-preview">
            <h2><a href="${post.url}">${post.title}</a></h2>
            <time datetime="${post.date}">${new Date(post.date).toLocaleDateString()}</time>
        </article>
    `).join('\n');

    // Read blog index template
    const templatePath = path.join(SRC_DIR, 'templates/blog-index.html');
    let template = fs.readFileSync(templatePath, 'utf8');

    // Replace template variables
    const html = template.replace('{{blog_posts}}', postsHtml);

    // Write the blog index
    const outputPath = path.join(DIST_DIR, 'blog/index.html');
    fs.writeFileSync(outputPath, html);
    console.log('Blog index generated:', outputPath);

    return posts;
}

// Build site
console.log('Building site...');

// Copy CSS
copyDir(
    path.join(SRC_DIR, 'css'),
    path.join(DIST_DIR, 'css')
);

// Process pages
console.log('\nProcessing pages...');
const pagesDir = path.join(SRC_DIR, 'content/pages');
if (fs.existsSync(pagesDir)) {
    fs.readdirSync(pagesDir)
        .filter(file => file.endsWith('.md'))
        .forEach(file => {
            const srcPath = path.join(pagesDir, file);
            const destPath = path.join(DIST_DIR, file.replace('.md', '.html'));
            processMarkdown(srcPath, destPath);
        });
} else {
    console.error(`Pages directory not found: ${pagesDir}`);
}

// Process blog posts
console.log('\nProcessing blog posts...');
const blogDir = path.join(SRC_DIR, 'content/blog');
if (fs.existsSync(blogDir)) {
    fs.readdirSync(blogDir)
        .filter(file => file.endsWith('.md'))
        .forEach(file => {
            const srcPath = path.join(blogDir, file);
            const destPath = path.join(DIST_DIR, 'blog', file.replace('.md', '.html'));
            processMarkdown(srcPath, destPath);
        });
} else {
    console.error(`Blog directory not found: ${blogDir}`);
}

// Generate blog index and update homepage
const posts = generateBlogIndex();

// Update homepage with latest posts if needed
const homepagePath = path.join(DIST_DIR, 'index.html');
if (fs.existsSync(homepagePath)) {
    let homepage = fs.readFileSync(homepagePath, 'utf8');
    const latestPosts = posts.slice(0, 3).map(post => `
        <li><a href="${post.url}">${post.title}</a> - ${new Date(post.date).toLocaleDateString()}</li>
    `).join('\n');
    homepage = homepage.replace('{{latest_posts}}', `<ul>${latestPosts}</ul>`);
    fs.writeFileSync(homepagePath, homepage);
    console.log('Homepage updated with latest posts');
}

// Create simple favicon
const faviconContent = Buffer.from('0000010001001010000001002000680400001600000028000000100000002000000001002000000000000004000000000000000000000000000000000000000000', 'hex');
fs.writeFileSync(path.join(DIST_DIR, 'favicon.ico'), faviconContent);

console.log('Build complete!'); 