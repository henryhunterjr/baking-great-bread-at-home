
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
    
    // Create worker-ready.js file that confirms workers are available
    // instead of modifying package.json
    const readyFileContent = `
    // This file confirms that PDF.js workers are available
    window.pdfWorkerReady = true;
    console.log('PDF.js worker files ready to use');
    `;

    await fs.writeFile(path.join(__dirname, '../public/worker-ready.js'), readyFileContent);
    
    console.log('\n✅ Worker files setup complete!\n');
  } catch (error) {
    console.error('Error copying PDF resources:', error);
    process.exit(1);
  }
}

copyPdfResources();
