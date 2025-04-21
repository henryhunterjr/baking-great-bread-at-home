
#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

async function copyPdfResources() {
  console.log('🔍 Copying PDF.js resources...');
  
  try {
    // Ensure directories exist
    await fs.ensureDir(path.resolve(__dirname, '../public/cmaps'));
    
    // Copy worker file
    await fs.copy(
      path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js'),
      path.resolve(__dirname, '../public/pdf.worker.min.js')
    );
    console.log('✅ PDF worker file copied successfully');
    
    // Copy cMaps directory
    await fs.copy(
      path.resolve(__dirname, '../node_modules/pdfjs-dist/cmaps'),
      path.resolve(__dirname, '../public/cmaps')
    );
    console.log('✅ PDF cMaps directory copied successfully');
    
    // Create worker-ready.js file
    const readyFileContent = `
    // This file confirms that PDF.js workers are available
    window.pdfWorkerReady = true;
    console.log('PDF.js worker files ready to use');
    `;

    await fs.writeFile(path.join(__dirname, '../public/worker-ready.js'), readyFileContent);
    
    console.log('\n✅ All PDF.js resources copied successfully!\n');
  } catch (error) {
    console.error('❌ Error copying PDF resources:', error);
    
    // Create helpful diagnostic information
    console.log('\n📋 DIAGNOSTIC INFORMATION:');
    
    try {
      const pdfDistExists = fs.existsSync(path.resolve(__dirname, '../node_modules/pdfjs-dist'));
      console.log(`- pdfjs-dist exists in node_modules: ${pdfDistExists ? 'YES' : 'NO'}`);
      
      if (pdfDistExists) {
        const workerExists = fs.existsSync(
          path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js')
        );
        console.log(`- pdf.worker.min.js exists: ${workerExists ? 'YES' : 'NO'}`);
        
        const cmapsExists = fs.existsSync(path.resolve(__dirname, '../node_modules/pdfjs-dist/cmaps'));
        console.log(`- cmaps directory exists: ${cmapsExists ? 'YES' : 'NO'}`);
      }
      
      console.log('\n📋 MANUAL RESOLUTION:');
      console.log('1. If pdfjs-dist is missing, run: npm install pdfjs-dist@3.11.174');
      console.log('2. If resources exist but copy failed, ensure the public directory is writable');
      console.log('3. You can manually copy the files from node_modules/pdfjs-dist to public/');
      console.log('\n');
    } catch (diagError) {
      console.error('Error generating diagnostics:', diagError);
    }
    
    process.exit(1);
  }
}

copyPdfResources();
