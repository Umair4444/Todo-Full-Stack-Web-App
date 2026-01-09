// Simple test to check if basic Node.js functionality works
console.log('Testing basic Node.js functionality...');

// Test basic imports that are used in the app
try {
  const path = require('path');
  console.log('✓ Path module loaded successfully');
  
  // Check if we can access the package.json
  const packageJson = require('./package.json');
  console.log('✓ Package.json loaded successfully');
  console.log('Package name:', packageJson.name);
  
  console.log('Environment test completed successfully');
} catch (error) {
  console.error('Environment test failed:', error.message);
}