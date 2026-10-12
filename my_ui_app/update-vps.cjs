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
  const commands = `
    cd /root/tuvi
    git fetch --all
    git reset --hard origin/main
    pm2 restart tuvi
  `;
  
  conn.exec(commands, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    });
  });
}).connect(config);
