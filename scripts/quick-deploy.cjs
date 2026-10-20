const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Connected to Linode VPS via SSH');
  conn.exec('cd /root/tuvi && git fetch origin && git reset --hard origin/main && pm2 restart tuvi && pm2 status tuvi', (err, stream) => {
    if (err) {
      console.error('Exec error:', err);
      conn.end();
      process.exit(1);
    }
    stream.on('close', (code) => {
      console.log('Deployment complete with code:', code);
      conn.end();
      process.exit(code || 0);
    }).on('data', d => process.stdout.write(d)).stderr.on('data', d => process.stderr.write(d));
  });
}).on('error', err => {
  console.error('SSH error:', err);
  process.exit(1);
}).connect({
  host: '104.64.211.29',
  port: 22,
  username: 'root',
  password: '@Tuanbinh13684',
  readyTimeout: 25000
});
