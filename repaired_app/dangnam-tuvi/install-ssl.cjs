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
  console.log('SSH connection established for SSL installation');
  const commands = `
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
    
    # Configure Nginx for dangnam.online
    cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name dangnam.online www.dangnam.online;
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
    
    # Run Certbot
    certbot --nginx -d dangnam.online -d www.dangnam.online --non-interactive --agree-tos -m dangnam@gmail.com
    
    systemctl restart nginx
  `;
  
  conn.exec(commands, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('SSL installation completed');
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect(config);
