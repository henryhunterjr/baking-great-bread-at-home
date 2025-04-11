
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function updateEnv() {
  try {
    console.log('Updating environment variables for Vercel...');
    
    // Check if Vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ Vercel CLI is not installed. Please install it with: npm i -g vercel');
      process.exit(1);
    }
    
    // List of environment variables to check
    const requiredEnvVars = [
      { name: 'OPENAI_API_KEY', description: 'OpenAI API key for AI assistant' },
      // Add any other environment variables your app needs
    ];
    
    for (const envVar of requiredEnvVars) {
      let value = process.env[envVar.name];
      
      if (!value) {
        console.log(`\nEnvironment variable ${envVar.name} not found.`);
        console.log(`Description: ${envVar.description}`);
        console.log(`Please set ${envVar.name} in your Vercel dashboard or run:`);
        console.log(`vercel env add ${envVar.name}`);
      } else {
        console.log(`✅ Found ${envVar.name} in your environment`);
      }
    }
    
    console.log('\nTo set environment variables on Vercel, you can use:');
    console.log('vercel env add [name]');
    console.log('\nTo pull environment variables from Vercel to your local environment:');
    console.log('vercel env pull');
    
  } catch (error) {
    console.error('Failed to update environment variables:', error);
    process.exit(1);
  }
}

updateEnv().catch(error => {
  console.error('Script failed:', error);
});
