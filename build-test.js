const { spawn } = require('child_process');
const path = require('path');

console.log('Starting build process...');
const buildProcess = spawn('npx', ['next', 'build'], {
  cwd: path.join(__dirname, 'todo-app'),
  stdio: 'inherit'
});

buildProcess.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
});