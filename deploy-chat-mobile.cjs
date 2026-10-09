#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const FILES = [
  'public/index.html',
  'public/style.css',
  'public/app.js',
  'public/service-worker.js',
  'public/mobile-style.css',
  'public/mobile-app.js',
  'public/mobile-app.compiled.js',
  'public/assets/chat-bg-moon-small-final.png'
];
const SW_REFRESH = `// SYNAM_SW_REFRESH: immediate update check for the installed mobile app.
function synamRefreshServiceWorker() {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  let didReload = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (didReload) return;
    didReload = true;
    window.location.reload();
  }, { once: true });
  navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' })
    .then(async registration => {
      await registration.update();
      if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        installing?.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }).catch(error => console.warn('Service Worker update check failed:', error));
}
window.addEventListener('load', synamRefreshServiceWorker, { once: true });`;

function fail(message) {
  console.error(`\nDeploy dừng: ${message}`);
  process.exit(1);
}
function run(command, args, options = {}) {
  console.log(`\n> ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit', ...options });
  if (result.error) fail(`${command}: ${result.error.message}`);
  if (result.status !== 0) fail(`${command} kết thúc với mã ${result.status}`);
}
function validEnv(name, value, pattern) {
  if (!value || !pattern.test(value)) fail(`${name} chưa có hoặc không hợp lệ.`);
  return value;
}

const host = validEnv('DEPLOY_HOST', process.env.DEPLOY_HOST || '104.64.211.29', /^[A-Za-z0-9.-]+$/);
const user = validEnv('DEPLOY_USER', process.env.DEPLOY_USER || 'root', /^[A-Za-z_][A-Za-z0-9_-]*$/);
const remoteDir = validEnv('DEPLOY_DIR', process.env.DEPLOY_DIR || '/root/tuvi', /^\/[A-Za-z0-9_./-]+$/);
if (remoteDir.split('/').includes('..')) fail('DEPLOY_DIR không được chứa ..');
const portText = process.env.DEPLOY_PORT || '22';
if (!/^\d{1,5}$/.test(portText) || Number(portText) < 1 || Number(portText) > 65535) fail('DEPLOY_PORT không hợp lệ.');
const port = Number(portText);
const pm2App = process.env.DEPLOY_PM2_APP || '';
if (pm2App && !/^[A-Za-z0-9_.-]+$/.test(pm2App)) fail('DEPLOY_PM2_APP không hợp lệ.');
const identity = process.env.DEPLOY_IDENTITY ? path.resolve(process.env.DEPLOY_IDENTITY) : '';
if (identity && !fs.existsSync(identity)) fail('Không tìm thấy tệp SSH key tại DEPLOY_IDENTITY.');
const target = `${user}@${host}`;
const sshBase = ['-p', String(port), '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', '-o', 'StrictHostKeyChecking=yes'];
const scpBase = ['-P', String(port), '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', '-o', 'StrictHostKeyChecking=yes'];
if (identity) {
  sshBase.push('-i', identity, '-o', 'IdentitiesOnly=yes');
  scpBase.push('-i', identity, '-o', 'IdentitiesOnly=yes');
}

for (const rel of FILES) {
  if (!fs.existsSync(path.join(ROOT, rel))) fail(`Thiếu tệp cần deploy: ${rel}`);
}

// Verify key-based access before spending time building. Password authentication is not used.
run('ssh', [...sshBase, target, 'true']);

// Install pinned dependencies only when Babel (the mobile build dependency) is not present.
try {
  require.resolve('@babel/core', { paths: [ROOT] });
} catch {
  run('npm', ['ci']);
}

// Rebuild the compiled React mobile bundle from its source without editing mobile-app.js.
run(process.execPath, ['compile.cjs']);
const compiledPath = path.join(PUBLIC, 'mobile-app.compiled.js');
let compiled = fs.readFileSync(compiledPath, 'utf8');
if (!compiled.includes('SYNAM_SW_REFRESH')) {
  const oldRegistration = /if\s*\(\s*['"]serviceWorker['"]\s+in\s+navigator\s*\)\s*\{[\s\S]*?^\s*\}/m;
  if (!oldRegistration.test(compiled)) fail('Không tìm thấy khối đăng ký Service Worker sau khi build mobile.');
  compiled = compiled.replace(oldRegistration, SW_REFRESH);
  fs.writeFileSync(compiledPath, compiled, 'utf8');
}

// Give the Service Worker a fresh cache name for this deployment.
const workerPath = path.join(PUBLIC, 'service-worker.js');
let worker = fs.readFileSync(workerPath, 'utf8');
const cacheMatch = worker.match(/^const\s+CACHE\s*=\s*(["'])(.*?)\1\s*;/m);
if (!cacheMatch) fail('Không đọc được hằng CACHE trong service-worker.js.');
const shellMatch = worker.match(/const\s+APP_SHELL\s*=\s*\[([\s\S]*?)\];/);
if (!shellMatch) fail('Không đọc được danh sách APP_SHELL trong service-worker.js.');
let shellItems = shellMatch[1];
shellItems = shellItems.split(/\r?\n/).map(line => /^\s*["'][^"']+["']\s*$/.test(line) ? `${line},` : line).join('\n').trimEnd();
if (shellItems && !shellItems.endsWith(',')) shellItems += ',';
for (const asset of ['./mobile-style.css', './mobile-app.compiled.js', './assets/chat-bg-moon-small-final.png']) {
  if (!shellItems.includes(`"${asset}"`) && !shellItems.includes(`'${asset}'`)) shellItems += `\n  "${asset}",`;
}
worker = worker.replace(shellMatch[0], `const APP_SHELL = [${shellItems}\n];`);
const buildId = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
worker = worker.replace(cacheMatch[0], `const CACHE = "${cacheMatch[2]}-deploy-${buildId}";`);
fs.writeFileSync(workerPath, worker, 'utf8');

// Package only approved public assets. Never archive .env, data, node_modules, or the legacy deploy script.
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'synam-chat-deploy-'));
const packageRoot = path.join(workDir, 'package');
for (const rel of FILES) {
  const destination = path.join(packageRoot, rel);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(ROOT, rel), destination);
}
const archive = path.join(workDir, 'chat-mobile-update.tgz');
run('tar', ['-czf', archive, '-C', packageRoot, 'public']);

const deployId = `${buildId}-${crypto.randomBytes(3).toString('hex')}`;
const remoteUpload = `/tmp/synam-chat-${deployId}.tgz`;
const remoteStage = `${remoteDir}/.deploy-stage-${deployId}`;
const remoteBackup = `${remoteDir}/.deploy-backups/${deployId}`;
run('scp', [...scpBase, archive, `${target}:${remoteUpload}`]);

const quotedPath = value => `'${value}'`; // Remote paths and identifiers are restricted above.
const filesShell = FILES.map(f => `'${f}'`).join(' ');
const remoteScript = [
  'set -eu',
  `DEPLOY_DIR=${quotedPath(remoteDir)}`,
  `STAGE=${quotedPath(remoteStage)}`,
  `BACKUP=${quotedPath(remoteBackup)}`,
  `UPLOAD=${quotedPath(remoteUpload)}`,
  'mkdir -p "$STAGE" "$BACKUP" "$DEPLOY_DIR"',
  'tar -xzf "$UPLOAD" -C "$STAGE"',
  `for f in ${filesShell}; do`,
  '  if [ -f "$DEPLOY_DIR/$f" ]; then mkdir -p "$BACKUP/$(dirname "$f")"; cp -p "$DEPLOY_DIR/$f" "$BACKUP/$f"; fi',
  '  install -D -m 0644 "$STAGE/$f" "$DEPLOY_DIR/$f"',
  'done',
  'rm -rf "$STAGE" "$UPLOAD"',
  `echo "Updated public assets in $DEPLOY_DIR (backup: $BACKUP)"`,
  ...(pm2App ? [`command -v pm2 >/dev/null 2>&1`, `pm2 restart '${pm2App}' --update-env`] : ['echo "Static assets deployed; Node process restart skipped."'])
].join('\n');
run('ssh', [...sshBase, target, remoteScript]);

if (process.env.DEPLOY_HEALTH_URL) {
  run('curl', ['-fsS', '--max-time', '20', process.env.DEPLOY_HEALTH_URL]);
}
fs.rmSync(workDir, { recursive: true, force: true });
console.log('\nDeploy hoàn tất. Cache Service Worker đã được bump; backup file cũ được giữ trên server.');
if (!process.env.DEPLOY_HEALTH_URL) console.log('Đặt DEPLOY_HEALTH_URL nếu muốn script kiểm tra health endpoint sau deploy.');
