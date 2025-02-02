const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the docs directory
app.use(express.static(path.join(__dirname, '../docs')));

// Handle all routes
app.get('*', (req, res) => {
    // Remove leading slash and add .html
    const page = req.path === '/' ? 'index.html' : `${req.path.slice(1)}.html`;
    const filePath = path.join(__dirname, '../docs', page);

    // Check if file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // If file doesn't exist, try serving index.html from that directory
        const indexPath = path.join(__dirname, '../docs', req.path.slice(1), 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).sendFile(path.join(__dirname, '../docs/404.html'));
        }
    }
});

// Watch for file changes
function watchFiles() {
    console.log('Watching for file changes...');
    exec('node scripts/build.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        console.log(`Build output: ${stdout}`);
    });
}

// Initial build
watchFiles();

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
        app.listen(PORT + 1);
    } else {
        console.error(err);
    }
}); 