const { spawn } = require('child_process');
const path = require('path');

console.log('Starting build process...');

const buildProcess = spawn('npx', ['next', 'build'], {
  cwd: path.join(__dirname, 'todo-app'),
  stdio: ['pipe', 'pipe', 'pipe'] // Capture output instead of inheriting
});

buildProcess.stdout.on('data', (data) => {
  console.log(`STDOUT: ${data}`);
});

buildProcess.stderr.on('data', (data) => {
  console.error(`STDERR: ${data}`);
});

buildProcess.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
});