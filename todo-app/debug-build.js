const { spawn } = require('child_process');
const fs = require('fs');

console.log('Starting Next.js build with detailed logging...');

// Create a write stream to capture output
const logStream = fs.createWriteStream('build-debug.log');

const buildProcess = spawn('npx', ['next', 'build'], {
  cwd: __dirname,
  stdio: ['pipe', 'pipe', 'pipe']
});

buildProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('STDOUT:', output);
  logStream.write(`STDOUT: ${output}\n`);
});

buildProcess.stderr.on('data', (data) => {
  const output = data.toString();
  console.error('STDERR:', output);
  logStream.write(`STDERR: ${output}\n`);
});

buildProcess.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
  logStream.write(`Build process exited with code ${code}\n`);
  logStream.end();
});