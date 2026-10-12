const { Client } = require('ssh2');
const conn = new Client();
const config = {
  host: '104.64.211.29',
  port: 22,
  username: 'root',
  password: '@Tuanbinh13684',
  readyTimeout: 20000
};

conn.on('ready', () => {
  console.log('SSH connection established for debugging');
  
  const commands = `
    echo "--- PM2 LOGS ---"
    pm2 logs tuvi --lines 50 --nostream
    echo "--- NGINX STATUS ---"
    systemctl status nginx --no-pager
    echo "--- CURL LOCALHOST:3000 ---"
    curl -I http://localhost:3000
    echo "--- CURL LOCALHOST:80 ---"
    curl -I http://localhost:80
  `;
  
  conn.exec(commands, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
}).connect(config);
