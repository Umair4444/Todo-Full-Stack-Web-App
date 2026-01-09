const { spawn } = require('child_process');
const fs = require('fs');

// Create a log file to capture output
const logStream = fs.createWriteStream('build-log.txt', { flags: 'a' });

console.log = function(msg) {
  process.stdout.write(msg + '\n');
  logStream.write(msg + '\n');
};

console.error = function(msg) {
  process.stderr.write(msg + '\n');
  logStream.write('ERROR: ' + msg + '\n');
};

console.log('Attempting to run Next.js build...');

const buildProcess = spawn('npx', ['next', 'build'], {
  cwd: '.',
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true  // Using shell to ensure proper command execution on Windows
});

let stdout = '';
let stderr = '';

buildProcess.stdout.on('data', (data) => {
  const str = data.toString();
  stdout += str;
  console.log('STDOUT:', str);
});

buildProcess.stderr.on('data', (data) => {
  const str = data.toString();
  stderr += str;
  console.error('STDERR:', str);
});

buildProcess.on('close', (code) => {
  console.log(`Build process exited with code: ${code}`);
  console.log('Full STDOUT:', stdout);
  console.log('Full STDERR:', stderr);
  
  logStream.write(`Build process exited with code: ${code}\n`);
  logStream.write(`Full STDOUT: ${stdout}\n`);
  logStream.write(`Full STDERR: ${stderr}\n`);
  logStream.end();
});