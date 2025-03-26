
#!/usr/bin/env node

/**
 * Script to generate a comprehensive test coverage report
 * Usage: node generate-coverage-report.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const jestBin = path.resolve(__dirname, '../../../../node_modules/.bin/jest');
const configPath = path.resolve(__dirname, '../../../../jest.config.js');
const coverageDir = path.resolve(__dirname, '../../../../coverage');
const lcovInfoPath = path.resolve(coverageDir, 'lcov.info');
const summaryPath = path.resolve(coverageDir, 'coverage-summary.json');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

console.log(`${colors.bright}${colors.blue}=== Generating Comprehensive Test Coverage Report ===${colors.reset}\n`);

// Run Jest with coverage
try {
  console.log(`${colors.bright}Running tests with coverage...${colors.reset}`);
  execSync(`${jestBin} --config=${configPath} --coverage --coverageReporters=text-summary,lcov,json-summary`, { 
    stdio: 'inherit'
  });
  
  // Check if coverage files were generated
  if (!fs.existsSync(summaryPath)) {
    throw new Error('Coverage summary file not generated. There might be an issue with the test run.');
  }
  
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  const total = summary.total;
  
  // Generate enhanced report
  console.log(`\n${colors.bright}${colors.green}=== Test Coverage Summary ===${colors.reset}`);
  console.log(`${colors.bright}Statements:${colors.reset} ${formatCoverage(total.statements.pct)}%`);
  console.log(`${colors.bright}Branches:${colors.reset}   ${formatCoverage(total.branches.pct)}%`);
  console.log(`${colors.bright}Functions:${colors.reset}  ${formatCoverage(total.functions.pct)}%`);
  console.log(`${colors.bright}Lines:${colors.reset}      ${formatCoverage(total.lines.pct)}%`);
  
  // Display module breakdown
  console.log(`\n${colors.bright}${colors.green}=== Coverage by Module ===${colors.reset}`);
  
  // Sort modules by coverage (lowest first)
  const modules = Object.keys(summary)
    .filter(key => key !== 'total')
    .map(key => ({
      name: key,
      coverage: summary[key].statements.pct
    }))
    .sort((a, b) => a.coverage - b.coverage);
  
  modules.forEach(module => {
    const moduleData = summary[module.name];
    const coverage = moduleData.statements.pct;
    const color = coverage < 50 ? colors.red : (coverage < 80 ? colors.yellow : colors.green);
    
    console.log(`${colors.bright}${module.name}:${colors.reset} ${color}${coverage}%${colors.reset}`);
  });
  
  // Identify low coverage areas
  const lowCoverageModules = modules.filter(m => m.coverage < 70);
  
  if (lowCoverageModules.length > 0) {
    console.log(`\n${colors.bright}${colors.yellow}=== Areas with Low Coverage ===${colors.reset}`);
    lowCoverageModules.forEach(module => {
      console.log(`${colors.bright}${module.name}:${colors.reset} ${colors.red}${module.coverage}%${colors.reset}`);
    });
  }
  
  console.log(`\n${colors.bright}${colors.blue}=== Report Generation Complete ===${colors.reset}`);
  console.log(`Detailed HTML report available at: ${colors.bright}file://${path.resolve(coverageDir, 'lcov-report/index.html')}${colors.reset}`);
  
  // Provide recommendations
  console.log(`\n${colors.bright}${colors.magenta}=== Test Enhancement Recommendations ===${colors.reset}`);
  if (lowCoverageModules.length > 0) {
    console.log(`1. Focus on improving coverage for these modules: ${lowCoverageModules.map(m => m.name).join(', ')}`);
  }
  console.log(`2. Add edge case tests for error handling scenarios`);
  console.log(`3. Consider adding more integration tests between modules`);
  
} catch (error) {
  console.error(`${colors.red}Error generating coverage report:${colors.reset}`, error.message);
  process.exit(1);
}

function formatCoverage(value) {
  if (value === undefined) return 'N/A';
  
  const color = value < 50 ? colors.red : (value < 80 ? colors.yellow : colors.green);
  return `${color}${value.toFixed(2)}${colors.reset}`;
}
