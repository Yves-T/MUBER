const { exec } = require('child_process');

exec('clear', (error, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  if (error !== null) {
    console.log(`exec error: ${error}`);
  }
  global.run();
});
