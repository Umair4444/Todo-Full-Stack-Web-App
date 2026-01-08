const { spawn } = require('child_process');

console.log('Starting Next.js build...\n');

const buildProcess = spawn('npx', ['next', 'build'], {
  cwd: '.',
  stdio: 'inherit'
});

buildProcess.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
});