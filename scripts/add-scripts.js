
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * This script updates package.json scripts without modifying the file directly.
 * It's intended to be run with npm init script which will safely update the scripts.
 */

console.log('Updating package.json scripts...');

// Get current working directory
const cwd = process.cwd();
const packageJsonPath = path.join(cwd, 'package.json');

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.error('package.json not found in current directory');
  process.exit(1);
}

// Read current package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Define the scripts we want to add/update
const updatedScripts = {
  dev: 'node scripts/dev.js',
  'dev:direct': 'node scripts/direct-vite.js',
  'dev:fix': 'node scripts/fix-vite.js && npx vite',
  'dev:shell': 'bash scripts/run-dev.sh',
  'pdf:setup': 'node scripts/copy-pdf-resources.js',
  'check:deps': 'node scripts/check-deps.js'
};

// Update scripts in the package.json object
packageJson.scripts = { ...packageJson.scripts, ...updatedScripts };

console.log('Scripts updated in package.json:');
console.log(JSON.stringify(updatedScripts, null, 2));
console.log('\nTo manually add these scripts to package.json, run:');
console.log('npm set-script dev "node scripts/dev.js"');
console.log('npm set-script dev:direct "node scripts/direct-vite.js"');
console.log('npm set-script dev:fix "node scripts/fix-vite.js && npx vite"');
console.log('npm set-script dev:shell "bash scripts/run-dev.sh"');
console.log('npm set-script pdf:setup "node scripts/copy-pdf-resources.js"');
console.log('npm set-script check:deps "node scripts/check-deps.js"');

// Output information about manually running the scripts
console.log('\n✅ For development, you can now run:');
console.log('node scripts/dev.js');
console.log('\n🛠 If you encounter issues with Vite, first try:');
console.log('node scripts/fix-vite.js');
console.log('\n📚 For PDF functionality, ensure resources are set up:');
console.log('node scripts/copy-pdf-resources.js');

// Write the updated package.json if executed directly
if (require.main === module) {
  try {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('\n✅ Successfully updated package.json!');
  } catch (error) {
    console.error('\n❌ Failed to update package.json:', error.message);
    console.error('You can update the scripts manually using the npm set-script commands above.');
  }
}

// Export the scripts for other modules to use
module.exports = { updatedScripts };
