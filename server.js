const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const root = path.join(__dirname);

function isInsideRoot(filePath) {
  const resolved = path.resolve(filePath);
  return resolved === root || resolved.startsWith(root + path.sep);
}

function existingFile(filePath) {
  if (!isInsideRoot(filePath)) return null;
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return filePath;
  } catch (err) {
    return null;
  }
  return null;
}

// Serve static files from the project root
app.use(express.static(root));

// Clean URLs: /path/to/page → path/to/page.html (same as Vercel cleanUrls / .htaccess)
app.get('*', (req, res) => {
  const urlPath = decodeURIComponent(req.path);
  const relative = urlPath.replace(/^\/+|\/+$/g, '');

  if (relative && !path.extname(relative)) {
    const htmlFile = existingFile(path.join(root, relative + '.html'));
    if (htmlFile) return res.sendFile(htmlFile);

    const indexFile = existingFile(path.join(root, relative, 'index.html'));
    if (indexFile) return res.sendFile(indexFile);
  }

  res.sendFile(path.join(root, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio running at http://0.0.0.0:${PORT}`);
});
