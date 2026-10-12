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
  console.log('SSH connection established');
  
  // Create an SFTP session to upload the .env file first
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('SFTP session started');
    
    // Command sequence to set up the server
    const commands = `
      export DEBIAN_FRONTEND=noninteractive
      apt-get update
      curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
      apt-get install -y nodejs git build-essential nginx
      npm install -g pm2
      
      # Clone the repository
      cd /root
      if [ -d "tuvi" ]; then
        cd tuvi
        git fetch --all
        git reset --hard origin/main
      else
        git clone https://github.com/sybinh200996/tuvi.git
        cd tuvi
      fi
      
      # Install dependencies
      npm install
      
      # Setup Nginx
      cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
      systemctl restart nginx
      
      # Restart via PM2
      pm2 start server.js --name tuvi -f
      pm2 save
      pm2 startup
    `;

    conn.exec(commands, (err, stream) => {
      if (err) throw err;
      stream.on('close', (code, signal) => {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        
        // Upload .env file after folder exists
        const readStream = fs.createReadStream('.env');
        const writeStream = sftp.createWriteStream('/root/tuvi/.env');
        
        writeStream.on('close', () => {
          console.log('.env file uploaded successfully!');
          // Restart pm2 one more time to pick up .env
          conn.exec('cd /root/tuvi && pm2 restart tuvi', (err, s2) => {
            s2.on('close', () => {
              console.log('Deployment completely finished!');
              conn.end();
            }).on('data', d => console.log('RESTART: ' + d));
          });
        });
        
        writeStream.on('error', (err) => {
          console.error('SFTP upload error:', err);
          conn.end();
        });
        
        readStream.pipe(writeStream);
      }).on('data', (data) => {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  });
}).on('error', (err) => {
  console.error('SSH Error:', err);
}).connect(config);
