
const fs = require('fs-extra');
const path = require('path');

async function copyPdfResources() {
  try {
    // Ensure directory exists
    await fs.ensureDir(path.resolve(__dirname, '../public/cmaps'));
    
    // Copy worker file
    await fs.copy(
      path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js'),
      path.resolve(__dirname, '../public/pdf.worker.min.js')
    );
    
    // Copy cMaps directory
    await fs.copy(
      path.resolve(__dirname, '../node_modules/pdfjs-dist/cmaps'),
      path.resolve(__dirname, '../public/cmaps')
    );
    
    console.log('PDF resources copied successfully');
  } catch (error) {
    console.error('Error copying PDF resources:', error);
    process.exit(1);
  }
}

copyPdfResources();
