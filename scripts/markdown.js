const fs = require('fs');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');

function convertDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function convertMarkdownToHtml(markdownPath, templatePath, outputPath) {
    // Read files
    const markdown = fs.readFileSync(markdownPath, 'utf8');
    const template = fs.readFileSync(templatePath, 'utf8');

    // Parse front matter and markdown
    const { attributes, body } = frontMatter(markdown);
    const htmlContent = marked.parse(body);

    // Replace template placeholders
    let html = template
        .replace('{{title}}', attributes.title)
        .replace('{{title}}', attributes.title) // Replace twice for title in <head> and <body>
        .replace('{{date}}', attributes.date)
        .replace('{{dateFormatted}}', convertDate(attributes.date))
        .replace('{{author}}', attributes.author)
        .replace('{{content}}', htmlContent);

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the output file
    fs.writeFileSync(outputPath, html);
    console.log(`Converted ${markdownPath} to ${outputPath}`);
}

module.exports = { convertMarkdownToHtml }; 