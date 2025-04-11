
const fs = require('fs-extra');
const path = require('path');

async function prepareForVercel() {
  try {
    console.log('Preparing project for Vercel deployment...');
    
    // Ensure we're in the right directory
    const packageJsonExists = await fs.pathExists(path.resolve(process.cwd(), 'package.json'));
    if (!packageJsonExists) {
      console.error('Error: package.json not found. Make sure you are in the project root directory.');
      process.exit(1);
    }
    
    // Ensure public directory exists
    const publicDir = path.resolve(process.cwd(), 'public');
    await fs.ensureDir(publicDir);
    
    // Create a placeholder for the PDF worker file
    const pdfWorkerPlaceholder = path.resolve(publicDir, 'pdf.worker.min.js');
    if (!await fs.pathExists(pdfWorkerPlaceholder)) {
      await fs.writeFile(
        pdfWorkerPlaceholder,
        '// This is a placeholder for the PDF.js worker file.\n' +
        '// The actual file will be copied from node_modules/pdfjs-dist/build/pdf.worker.min.js\n' +
        '// to this location (public/pdf.worker.min.js) using the copy-pdf-resources.js script.\n' +
        'console.error("PDF.js worker file not loaded correctly. Please run the copy-pdf-resources.js script.");'
      );
      console.log('✅ Created PDF worker placeholder');
    }
    
    // Ensure cmaps directory exists
    const cmapsDir = path.resolve(publicDir, 'cmaps');
    await fs.ensureDir(cmapsDir);
    console.log('✅ Created cmaps directory');
    
    // Create a fallback HTML for direct navigation
    const fallbackHtml = path.resolve(publicDir, '404.html');
    await fs.writeFile(
      fallbackHtml,
      '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '  <meta charset="UTF-8">\n' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '  <title>Baking Great Bread with Henry</title>\n' +
      '  <script>\n' +
      '    // Redirect to the main application\n' +
      '    window.location.href = "/";\n' +
      '  </script>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <p>Redirecting to the main application...</p>\n' +
      '</body>\n' +
      '</html>'
    );
    console.log('✅ Created fallback HTML for direct navigation');
    
    // Create _redirects file for Netlify compatibility
    const redirectsFile = path.resolve(publicDir, '_redirects');
    await fs.writeFile(
      redirectsFile,
      '/* /index.html 200'
    );
    console.log('✅ Created _redirects file for Netlify compatibility');
    
    // Create .vercel directory if it doesn't exist
    const vercelDir = path.resolve(process.cwd(), '.vercel');
    await fs.ensureDir(vercelDir);
    
    // Create project.json if it doesn't exist
    const projectJsonPath = path.resolve(vercelDir, 'project.json');
    if (!await fs.pathExists(projectJsonPath)) {
      await fs.writeJson(projectJsonPath, {
        "projectId": "baking-great-bread-at-home",
        "orgId": "henryhunterjr"
      }, { spaces: 2 });
      console.log('✅ Created Vercel project configuration');
    }
    
    // Update package.json if needed
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
    let modified = false;
    
    // Ensure prebuild script is present
    if (!packageJson.scripts || !packageJson.scripts.prebuild || !packageJson.scripts.prebuild.includes('copy-pdf-resources.js')) {
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.prebuild = "node scripts/copy-pdf-resources.js";
      modified = true;
      console.log('✅ Added prebuild script to package.json');
    }
    
    // Add deploy script
    if (!packageJson.scripts || !packageJson.scripts.deploy) {
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.deploy = "node scripts/deploy.js";
      modified = true;
      console.log('✅ Added deploy script to package.json');
    }
    
    // Add test-build script
    if (!packageJson.scripts || !packageJson.scripts['test-build']) {
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts['test-build'] = "npm run build && npm run preview";
      modified = true;
      console.log('✅ Added test-build script to package.json');
    }
    
    // Add update-env script
    if (!packageJson.scripts || !packageJson.scripts['update-env']) {
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts['update-env'] = "node scripts/update-env.js";
      modified = true;
      console.log('✅ Added update-env script to package.json');
    }
    
    // Save modified package.json
    if (modified) {
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      console.log('✅ Updated package.json');
    }
    
    console.log('\nPreparation complete. You can now deploy to Vercel with confidence.');
    console.log('Run `node scripts/deploy.js` to verify and deploy your application.');
  } catch (error) {
    console.error('Preparation failed:', error);
    process.exit(1);
  }
}

prepareForVercel().catch(error => {
  console.error('Preparation script failed:', error);
});
