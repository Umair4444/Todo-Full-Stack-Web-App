const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function runBuild() {
  try {
    console.log('Starting build process...');
    const { stdout, stderr } = await execAsync('npm run build', {
      cwd: './todo-app',
      env: { ...process.env, DEBUG: '*' }
    });
    console.log('STDOUT:', stdout);
    if (stderr) {
      console.log('STDERR:', stderr);
    }
  } catch (error) {
    console.log('Build failed with error:', error.message);
    console.log('Error stdout:', error.stdout);
    console.log('Error stderr:', error.stderr);
  }
}

runBuild();