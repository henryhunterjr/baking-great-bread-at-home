
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function verifyDeployment() {
  console.log('Verifying deployment requirements...');
  
  // Check for required files
  const requiredFiles = [
    { path: 'vercel.json', name: 'Vercel configuration' },
    { path: 'scripts/copy-pdf-resources.js', name: 'PDF resources script' },
    { path: 'public', name: 'Public directory', isDirectory: true },
    { path: '.vercel/project.json', name: 'Vercel project configuration' }
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
    
    // Check for deploy script
    if (scripts.deploy && scripts.deploy.includes('scripts/deploy.js')) {
      console.log('✅ deploy script configured correctly');
    } else {
      console.warn('⚠️ deploy script should use the deploy.js script for best results');
    }
    
    // Check for required dependencies
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const requiredDeps = ['pdfjs-dist', 'fs-extra', 'vercel'];
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
  
  // Check Vercel login status
  try {
    console.log('\nChecking Vercel login status...');
    const result = execSync('vercel whoami', { stdio: 'pipe' }).toString().trim();
    console.log(`✅ Logged in to Vercel as: ${result}`);
  } catch (error) {
    console.warn('⚠️ Not logged in to Vercel. You will be prompted to login during deployment.');
    console.warn('   You can login manually by running: vercel login');
  }
  
  console.log('\nVerification complete.');
  console.log('If any issues were found, please fix them before deploying.');
  console.log('For environment variables, make sure they are configured in the Vercel dashboard.');
}

verifyDeployment().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});
