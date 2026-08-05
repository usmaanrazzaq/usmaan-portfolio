const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname);

// Serve static files from the project root
app.use(express.static(ROOT));

// Resolve a candidate path only if it stays inside the project root.
function safeFile(candidate) {
  const resolved = path.resolve(candidate);
  if (!resolved.startsWith(ROOT + path.sep) && resolved !== ROOT) return null;
  try {
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return resolved;
  } catch (_) {
    /* ignore */
  }
  return null;
}

// Mimic Vercel cleanUrls: try path.html before SPA fallback.
// Without this, /…/case-study and /…/otrs-case-study fall through to index.html.
app.get('*', (req, res) => {
  const urlPath = decodeURIComponent(req.path);
  const htmlFile = safeFile(path.join(ROOT, urlPath + '.html'));
  if (htmlFile) {
    return res.sendFile(htmlFile);
  }

  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio running at http://0.0.0.0:${PORT}`);
});
