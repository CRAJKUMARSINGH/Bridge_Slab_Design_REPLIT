const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files from attached_assets/html-sheets
app.use('/sheets', express.static(path.join(__dirname, 'attached_assets', 'html-sheets')));

// Serve static files from root directory
app.use(express.static(__dirname));

// Serve the afflux calculation page
app.get('/', (req, res) => {
  const affluxFilePath = path.join(__dirname, 'attached_assets', 'html-sheets', 'Sheet_02_afflux_calculation.html');
  
  // Check if file exists
  if (fs.existsSync(affluxFilePath)) {
    res.sendFile(affluxFilePath);
  } else {
    res.status(404).send('<h1>Afflux Calculation File Not Found</h1>');
  }
});

// Serve the enhanced afflux calculation viewer
app.get('/viewer', (req, res) => {
  const viewerFilePath = path.join(__dirname, 'afflux_calculation_viewer.html');
  
  // Check if file exists
  if (fs.existsSync(viewerFilePath)) {
    res.sendFile(viewerFilePath);
  } else {
    res.status(404).send('<h1>Afflux Calculation Viewer Not Found</h1>');
  }
});

// Serve index page with links to all HTML sheets
app.get('/index', (req, res) => {
  const sheetsDir = path.join(__dirname, 'attached_assets', 'html-sheets');
  
  // Read all HTML files in the directory
  fs.readdir(sheetsDir, (err, files) => {
    if (err) {
      res.status(500).send('<h1>Error reading sheets directory</h1>');
      return;
    }
    
    // Filter only HTML files
    const htmlFiles = files.filter(file => file.endsWith('.html') && file !== 'index.html');
    
    // Create HTML page with links
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bridge Design HTML Sheets</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
          h1 { color: #2c3e50; text-align: center; }
          .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          ul { list-style-type: none; padding: 0; }
          li { margin: 15px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px; }
          a { text-decoration: none; color: #3498db; font-size: 16px; font-weight: bold; }
          a:hover { text-decoration: underline; }
          .section { margin: 30px 0; }
          .section-title { color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bridge Design HTML Sheets</h1>
          
          <div class="section">
            <h2 class="section-title">Specialized Views</h2>
            <ul>
              <li><a href="/">Original Afflux Calculation</a></li>
              <li><a href="/viewer">Enhanced Afflux Calculation Viewer</a></li>
            </ul>
          </div>
          
          <div class="section">
            <h2 class="section-title">All Design Sheets</h2>
            <ul>
    `;
    
    htmlFiles.forEach(file => {
      const fileName = file.replace('.html', '').replace(/_/g, ' ');
      htmlContent += `<li><a href="/sheets/${file}" target="_blank">${fileName}</a></li>`;
    });
    
    htmlContent += `
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;
    
    res.send(htmlContent);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Original afflux calculation: http://localhost:${PORT}`);
  console.log(`Enhanced afflux viewer: http://localhost:${PORT}/viewer`);
  console.log(`All sheets index: http://localhost:${PORT}/index`);
});