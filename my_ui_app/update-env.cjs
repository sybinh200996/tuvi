const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();
const config = {
  host: '104.64.211.29',
  port: 22,
  username: 'root',
  password: '@Tuanbinh13684',
  readyTimeout: 20000
};

conn.on('ready', () => {
  console.log('SSH connection established for update');
  
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP session started');
    
    const readStream = fs.createReadStream('.env');
    const writeStream = sftp.createWriteStream('/root/tuvi/.env');
    
    writeStream.on('close', () => {
      console.log('.env updated successfully on VPS!');
      
      conn.exec('cd /root/tuvi && pm2 restart tuvi --update-env', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log('PM2 restarted successfully.');
          conn.end();
        }).on('data', (data) => {
          console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
          console.log('STDERR: ' + data);
        });
      });
    });
    
    writeStream.on('error', (err) => {
      console.error('SFTP upload error:', err);
      conn.end();
    });
    
    readStream.pipe(writeStream);
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
}).connect(config);
