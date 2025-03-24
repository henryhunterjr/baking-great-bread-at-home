
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
const cmapsDest = path.resolve(__dirname, '../public/cmaps');

// Create cmaps directory if it doesn't exist
if (!fs.existsSync(cmapsDest)) {
  fs.mkdirSync(cmapsDest, { recursive: true });
  console.log('Created cmaps directory in public folder');
}

// Copy worker file
try {
  fs.copyFileSync(workerSrc, workerDest);
  console.log('PDF.js worker file copied to public folder');
} catch (error) {
  console.error('Error copying PDF.js worker file:', error);
}

// Copy cmaps files
try {
  // Get list of all files in cmaps directory
  const cmapFiles = fs.readdirSync(cmapsSrc);
  
  // Copy each file
  cmapFiles.forEach(file => {
    const srcFile = path.join(cmapsSrc, file);
    const destFile = path.join(cmapsDest, file);
    
    // Only copy files (not directories)
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
    }
  });
  
  console.log(`${cmapFiles.length} cmap files copied to public folder`);
} catch (error) {
  console.error('Error copying cmap files:', error);
}

console.log('PDF.js files setup complete!');
