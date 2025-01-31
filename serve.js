const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Handle /blog route
    if (req.url === '/blog') {
        req.url = '/blog/index.html';
    }
    
    // Convert URL to filesystem path
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // Add .html extension if no extension exists
    if (!path.extname(filePath)) {
        filePath += '.html';
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // Handle favicon.ico request gracefully
            if (req.url === '/favicon.ico') {
                res.writeHead(204); // No Content
                res.end();
                return;
            }
            
            console.error(`Error: ${err}`);
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Serving files from: ${DIST_DIR}`);
}); 