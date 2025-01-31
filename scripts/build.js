const fs = require('fs');
const path = require('path');
const { convertMarkdownToHtml } = require('./markdown');

// Configuration
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Ensure required directories exist
['styles', 'scripts', 'blog'].forEach(dir => {
    const dirPath = path.join(DIST_DIR, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
});

// Copy function
function copyFile(src, dest) {
    console.log(`Copying ${src} to ${dest}`);
    fs.copyFileSync(src, dest);
}

// Copy static files
copyFile(
    path.join(SRC_DIR, 'index.html'),
    path.join(DIST_DIR, 'index.html')
);
copyFile(
    path.join(SRC_DIR, 'styles/main.css'),
    path.join(DIST_DIR, 'styles/main.css')
);
copyFile(
    path.join(SRC_DIR, 'styles/blog.css'),
    path.join(DIST_DIR, 'styles/blog.css')
);
copyFile(
    path.join(SRC_DIR, 'contact.html'),
    path.join(DIST_DIR, 'contact.html')
);
copyFile(
    path.join(SRC_DIR, 'scripts/contact.js'),
    path.join(DIST_DIR, 'scripts/contact.js')
);

// Process blog posts
const blogDir = path.join(SRC_DIR, 'blog');
const templatePath = path.join(blogDir, 'template.html');

fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.md'))
    .forEach(file => {
        const markdownPath = path.join(blogDir, file);
        const outputPath = path.join(
            DIST_DIR, 
            'blog', 
            file.replace('.md', '.html')
        );
        convertMarkdownToHtml(markdownPath, templatePath, outputPath);
    });

// Generate blog index
const blogPosts = fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
        const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
        const { attributes } = require('front-matter')(content);
        return {
            title: attributes.title,
            date: attributes.date,
            url: `/blog/${file.replace('.md', '.html')}`
        };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

// Create blog index page
const blogIndexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - My Website</title>
    <link rel="stylesheet" href="/styles/main.css">
    <link rel="stylesheet" href="/styles/blog.css">
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
            <a href="/blog">Blog</a>
            <a href="/contact">Contact</a>
        </nav>
    </header>
    
    <main>
        <h1>Blog Posts</h1>
        <div class="blog-list">
            ${blogPosts.map(post => `
                <article class="blog-preview">
                    <h2><a href="${post.url}">${post.title}</a></h2>
                    <time datetime="${post.date}">${new Date(post.date).toLocaleDateString()}</time>
                </article>
            `).join('\n')}
        </div>
    </main>
    
    <footer>
        <p>&copy; 2024 My Blog</p>
    </footer>
</body>
</html>
`;

fs.writeFileSync(path.join(DIST_DIR, 'blog/index.html'), blogIndexHtml);

console.log('Build complete!'); 