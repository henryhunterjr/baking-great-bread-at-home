
/**
 * Script to copy PDF.js worker files to the public directory
 * Run this script before building the application
 */

const fs = require('fs');
const path = require('path');

// Source paths (from node_modules)
const workerSrc = path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js');
const cmapsSrc = path.resolve(__dirname, '../node_modules/pdfjs-dist/cmaps');

// Destination paths (in public folder)
const workerDest = path.resolve(__dirname, '../public/pdf.worker.min.js');
const assetsDirDest = path.resolve(__dirname, '../public/assets');
const assetsWorkerDest = path.resolve(__dirname, '../public/assets/pdf.worker.min.js');
const cmapsDest = path.resolve(__dirname, '../public/cmaps');

console.log('PDF.js worker source path:', workerSrc);
console.log('PDF.js worker destination path:', workerDest);

// Helper function to create directory if it doesn't exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

// Create required directories
ensureDirectoryExists(cmapsDest);
ensureDirectoryExists(assetsDirDest);

// Copy worker file
try {
  if (!fs.existsSync(workerSrc)) {
    console.error('ERROR: PDF.js worker file not found at source path.');
    console.log('Please ensure pdfjs-dist is installed correctly.');
    process.exit(1);
  } else {
    fs.copyFileSync(workerSrc, workerDest);
    console.log('PDF.js worker file copied to public folder');
    
    // Also copy to assets directory for alternative path
    fs.copyFileSync(workerSrc, assetsWorkerDest);
    console.log('PDF.js worker file also copied to public/assets folder');
  }
} catch (error) {
  console.error('Error copying PDF.js worker file:', error);
  process.exit(1);
}

// Copy cmaps files
try {
  if (!fs.existsSync(cmapsSrc)) {
    console.error('ERROR: PDF.js cmaps directory not found.');
    console.log('Please ensure pdfjs-dist is installed correctly.');
  } else {
    // Get list of all files in cmaps directory
    const cmapFiles = fs.readdirSync(cmapsSrc);
    
    // Copy each file
    let copiedCount = 0;
    cmapFiles.forEach(file => {
      const srcFile = path.join(cmapsSrc, file);
      const destFile = path.join(cmapsDest, file);
      
      // Only copy files (not directories)
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
        copiedCount++;
      }
    });
    
    console.log(`${copiedCount} cmap files copied to public folder`);
  }
} catch (error) {
  console.error('Error copying cmap files:', error);
}

// Create a worker-ready.js file that confirms workers are available
const readyFileContent = `
// This file confirms that PDF.js and Tesseract workers are available
window.pdfWorkerReady = true;
console.log('PDF.js worker files ready to use');
`;

fs.writeFileSync(path.join(__dirname, '../public/worker-ready.js'), readyFileContent);

console.log('\n✅ Worker files setup complete!\n');
console.log('📋 Remember to run this script before building for production.');
