// Script to run TypeScript compiler and capture output
const { spawn } = require('child_process');
const fs = require('fs');

const logStream = fs.createWriteStream('ts-error-log.txt', { flags: 'w' });

const logMessage = (msg) => {
  console.log(msg);
  logStream.write(msg + '\n');
};

logMessage('Starting TypeScript compilation check...');

const tscProcess = spawn('npx', ['tsc', '--noEmit'], {
  cwd: '.',
  stdio: ['pipe', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';

tscProcess.stdout.on('data', (data) => {
  const str = data.toString();
  stdout += str;
  logMessage(`STDOUT: ${str}`);
});

tscProcess.stderr.on('data', (data) => {
  const str = data.toString();
  stderr += str;
  logMessage(`STDERR: ${str}`);
});

tscProcess.on('close', (code) => {
  logMessage(`TypeScript check exited with code: ${code}`);
  logMessage(`Full STDOUT: ${stdout}`);
  logMessage(`Full STDERR: ${stderr}`);
  
  logStream.end();
});