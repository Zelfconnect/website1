const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = 3002;
const DIST_DIR = path.join(__dirname, '../dist');
const SRC_DIR = path.join(__dirname, '../src');

// Basic MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.md': 'text/markdown'
};

// Create basic server
const server = http.createServer((req, res) => {
    console.log('Received request for:', req.url);
    
    // Default to index.html for root path
    const filePath = path.join(DIST_DIR, 
        req.url === '/' ? 'index.html' : req.url);
    
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';
    
    // Simple file serving
    fs.readFile(filePath, (err, content) => {
        if (err) {
            console.error('Error serving file:', err);
            res.writeHead(404);
            res.end('Not found');
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Serving files from: ${DIST_DIR}`);
}); 