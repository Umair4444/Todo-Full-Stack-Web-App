// Script to run Next.js build with detailed logging
const { spawn } = require('child_process');
const fs = require('fs');

// Create a log file to capture output
const logStream = fs.createWriteStream('detailed-build-log.txt', { flags: 'w' });

const logMessage = (msg) => {
  console.log(msg);
  logStream.write(msg + '\n');
};

logMessage('Starting Next.js build process...');

// Log environment information
logMessage(`Current directory: ${process.cwd()}`);
logMessage(`Node version: ${process.version}`);

// Check if package.json exists
try {
  const pkg = require('./package.json');
  logMessage(`Project name: ${pkg.name}`);
  logMessage(`Next.js version: ${pkg.dependencies.next || 'not found'}`);
} catch (err) {
  logMessage(`Error reading package.json: ${err.message}`);
}

// Spawn the next build process
const buildProcess = spawn('npx', ['next', 'build'], {
  cwd: '.',
  env: {
    ...process.env,
    // Enable more verbose logging
    DEBUG: '*',
    NEXT_DEBUG: '1',
    VERBOSE: '1'
  },
  stdio: ['pipe', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';

buildProcess.stdout.on('data', (data) => {
  const str = data.toString();
  stdout += str;
  logMessage(`STDOUT: ${str}`);
});

buildProcess.stderr.on('data', (data) => {
  const str = data.toString();
  stderr += str;
  logMessage(`STDERR: ${str}`);
});

buildProcess.on('close', (code) => {
  logMessage(`Build process exited with code: ${code}`);
  logMessage(`Full STDOUT captured: ${stdout.length} characters`);
  logMessage(`Full STDERR captured: ${stderr.length} characters`);
  
  logStream.end();
  
  // Exit with the same code as the build process
  process.exit(code);
});

// Set a timeout to prevent hanging
setTimeout(() => {
  logMessage('Build process timed out after 60 seconds');
  buildProcess.kill();
  process.exit(1);
}, 60000);