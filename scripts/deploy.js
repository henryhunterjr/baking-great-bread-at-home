
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
    
    // Check if vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      console.log('✅ Vercel CLI is installed');
    } catch (error) {
      console.error('❌ Vercel CLI is not installed globally. Installing it now...');
      execSync('npm install --global vercel@latest', { stdio: 'inherit' });
      console.log('✅ Vercel CLI has been installed globally');
    }
    
    // Deploy with Vercel CLI with explicit path handling
    console.log('\n=== DEPLOYING TO VERCEL ===');
    console.log('Make sure you are logged in to Vercel. If not, the process will prompt you to log in.');
    
    // Get absolute path to ensure we're working with the correct directory
    const projectDir = process.cwd();
    console.log(`Project directory: ${projectDir}`);
    
    console.log('\nRunning deployment command: vercel --confirm --prod');
    console.log('This will deploy to production without prompts...');
    
    // Run vercel command with explicit directory
    // Do not include projectDir as an argument to avoid EISDIR error
    execSync('vercel --confirm --prod', { 
      stdio: 'inherit',
      cwd: projectDir
    });
    
    console.log('\n✅ Deployment complete!');
    console.log('Your app should now be available on the Vercel domain.');
    console.log('Check your Vercel dashboard for details: https://vercel.com/dashboard');
  } catch (error) {
    console.error('Deployment failed:', error);
    
    // Provide more helpful error information
    if (error.message && error.message.includes('EISDIR')) {
      console.error('\nError explanation: The EISDIR error occurs when Vercel tries to treat a directory as a file.');
      console.error('Make sure you are running the deploy script from the project root directory.');
      console.error('Try running: cd /path/to/your/project && node scripts/deploy.js');
    } else if (error.message && error.message.includes('Not authorized')) {
      console.error('\nError explanation: You are not logged in to Vercel.');
      console.error('Please log in first by running: vercel login');
    }
    
    process.exit(1);
  }
}

deploy().catch(error => {
  console.error('Deployment script failed:', error);
});
