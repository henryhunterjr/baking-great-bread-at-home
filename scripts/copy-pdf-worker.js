
/**
 * Script to copy PDF.js worker files to the public directory
 * Run this script before building the application
 */

const fs = require('fs');
const path = require('path');

// Source paths (from node_modules)
const workerSrc = path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js');
const cmapsSrc = path.resolve(__dirname, '../node_modules/pdfjs-dist/cmaps');

// Tesseract source paths
const tesseractCoreSrc = path.resolve(__dirname, '../node_modules/tesseract.js-core/tesseract-core.wasm.js');
const tesseractWorkerSrc = path.resolve(__dirname, '../node_modules/tesseract.js/dist/worker.min.js');
const tesseractLangSrc = path.resolve(__dirname, '../node_modules/tesseract.js/lang');

// Destination paths (in public folder)
const workerDest = path.resolve(__dirname, '../public/pdf.worker.min.js');
const cmapsDest = path.resolve(__dirname, '../public/cmaps');
const tesseractDest = path.resolve(__dirname, '../public/tesseract');
const tesseractLangDest = path.resolve(__dirname, '../public/tesseract/lang-data');

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
ensureDirectoryExists(tesseractDest);
ensureDirectoryExists(tesseractLangDest);

// Copy worker file
try {
  if (!fs.existsSync(workerSrc)) {
    console.error('ERROR: PDF.js worker file not found at source path.');
    console.log('Please ensure pdfjs-dist is installed correctly.');
    process.exit(1);
  } else {
    fs.copyFileSync(workerSrc, workerDest);
    console.log('PDF.js worker file copied to public folder');
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

// Copy Tesseract files
try {
  // Copy Tesseract worker
  if (fs.existsSync(tesseractWorkerSrc)) {
    fs.copyFileSync(tesseractWorkerSrc, path.join(tesseractDest, 'worker.min.js'));
    console.log('Tesseract worker file copied to public folder');
  } else {
    console.warn('Tesseract worker file not found at', tesseractWorkerSrc);
  }
  
  // Copy Tesseract core
  if (fs.existsSync(tesseractCoreSrc)) {
    fs.copyFileSync(tesseractCoreSrc, path.join(tesseractDest, 'tesseract-core.wasm.js'));
    console.log('Tesseract core file copied to public folder');
  } else {
    console.warn('Tesseract core file not found at', tesseractCoreSrc);
  }
  
  // Copy language data if available
  if (fs.existsSync(tesseractLangSrc)) {
    const langFiles = fs.readdirSync(tesseractLangSrc);
    let copiedCount = 0;
    
    langFiles.forEach(file => {
      const srcFile = path.join(tesseractLangSrc, file);
      const destFile = path.join(tesseractLangDest, file);
      
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
        copiedCount++;
      }
    });
    
    console.log(`${copiedCount} Tesseract language files copied to public folder`);
  } else {
    console.warn('Tesseract language files not found');
  }
} catch (error) {
  console.error('Error copying Tesseract files:', error);
}

console.log('PDF.js and Tesseract files setup complete!');

// Create a basic script that redirects users to run this script
const reminderContent = `
// This file is a placeholder that reminds you to run the copy-pdf-worker.js script
// Please run 'node scripts/copy-pdf-worker.js' before building or running the app

console.error("⚠️ Worker files not properly installed. Please run 'node scripts/copy-pdf-worker.js' to set up required worker files.");
`;

// Write a reminder file to the public directory to help users
fs.writeFileSync(path.join(__dirname, '../public/worker-reminder.js'), reminderContent);

console.log('\n✅ Setup complete!\n');
console.log('📋 Remember to run this script again if you update pdfjs-dist or tesseract.js packages.');
