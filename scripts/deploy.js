
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

async function deploy() {
  try {
    console.log('Starting deployment preparation...');
    
    // Ensure we're in the right directory
    const packageJsonExists = await fs.pathExists(path.resolve(process.cwd(), 'package.json'));
    if (!packageJsonExists) {
      console.error('Error: package.json not found. Make sure you are in the project root directory.');
      process.exit(1);
    }
    
    // Run prepare-for-vercel script
    console.log('Running preparation script...');
    execSync('node scripts/prepare-for-vercel.js', { stdio: 'inherit' });
    
    // Verify deployment readiness
    console.log('Verifying deployment readiness...');
    execSync('node scripts/verify-deployment.js', { stdio: 'inherit' });
    
    // Deploy with Vercel CLI using --cwd flag to ensure correct directory
    console.log('Deploying to Vercel...');
    execSync('vercel --confirm --prod --cwd .', { stdio: 'inherit' });
    
    console.log('Deployment complete!');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy().catch(error => {
  console.error('Deployment script failed:', error);
});
