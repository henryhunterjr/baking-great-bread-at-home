
const fs = require('fs-extra');
const path = require('path');

async function verifyDeployment() {
  console.log('Verifying deployment requirements...');
  
  // Check for required files
  const requiredFiles = [
    { path: 'vercel.json', name: 'Vercel configuration' },
    { path: 'scripts/copy-pdf-resources.js', name: 'PDF resources script' },
    { path: 'public', name: 'Public directory', isDirectory: true }
  ];
  
  for (const file of requiredFiles) {
    try {
      const filePath = path.resolve(process.cwd(), file.path);
      const exists = await fs.pathExists(filePath);
      const isDir = file.isDirectory || false;
      
      if (!exists) {
        console.error(`❌ Missing ${file.name} at ${file.path}`);
        continue;
      }
      
      if (isDir) {
        console.log(`✅ Found ${file.name}`);
      } else {
        const content = await fs.readFile(filePath, 'utf8');
        console.log(`✅ Found ${file.name} (${content.length} bytes)`);
      }
    } catch (error) {
      console.error(`❌ Error checking ${file.name}:`, error.message);
    }
  }
  
  // Check package.json for required scripts
  try {
    const packageJson = await fs.readJson(path.resolve(process.cwd(), 'package.json'));
    const scripts = packageJson.scripts || {};
    
    if (scripts.prebuild && scripts.prebuild.includes('copy-pdf-resources.js')) {
      console.log('✅ prebuild script configured correctly');
    } else {
      console.error('❌ prebuild script missing or incorrect. Should run copy-pdf-resources.js');
    }
    
    // Check for required dependencies
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const requiredDeps = ['pdfjs-dist', 'fs-extra'];
    for (const dep of requiredDeps) {
      if (dependencies[dep]) {
        console.log(`✅ Found required dependency: ${dep} (${dependencies[dep]})`);
      } else {
        console.error(`❌ Missing required dependency: ${dep}`);
      }
    }
  } catch (error) {
    console.error('❌ Error checking package.json:', error.message);
  }
  
  // Check for environment variables
  const requiredEnvVars = ['OPENAI_API_KEY'];
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ Environment variable found: ${envVar}`);
    } else {
      console.warn(`⚠️ Environment variable not found: ${envVar}`);
      console.warn(`   Remember to add this in your Vercel dashboard`);
    }
  }
  
  console.log('\nVerification complete.');
  console.log('If any issues were found, please fix them before deploying.');
  console.log('For environment variables, make sure they are configured in the Vercel dashboard.');
}

verifyDeployment().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});
