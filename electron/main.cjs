const { app, BrowserWindow, dialog, shell } = require('electron');
const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const { navigationTarget } = require('./navigation.cjs');

// Keep the origin stable so browser storage survives desktop restarts.
const port = 3211;
const origin = `http://127.0.0.1:${port}`;
const appUrl = `${origin}/app`;
let server;
let window;
let quitting = false;
let starting = true;

function stopServer() {
  quitting = true;
  if (server && server.exitCode === null && !server.killed) server.kill();
}

function fail(message) {
  if (quitting) return;
  dialog.showErrorBox('Oh My Picklebot을 시작할 수 없어요', message);
  app.quit();
}

function requireFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', () => reject(new Error(`포트 ${port}을 다른 프로그램이 사용 중입니다. 해당 프로그램을 종료한 후 다시 실행해 주세요.`)));
    probe.listen({ host: '127.0.0.1', port, exclusive: true }, () => probe.close(resolve));
  });
}

function startServer(entry) {
  return new Promise((resolve, reject) => {
    let readyAnnounced = false;
    let output = '';
    let settled = false;
    let request;
    let retry;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      clearTimeout(retry);
      request?.destroy();
      if (error) reject(error);
      else resolve();
    };
    const deadline = setTimeout(() => finish(new Error('로컬 서버가 30초 안에 준비되지 않았습니다. 앱을 닫고 다시 실행해 주세요.')), 30_000);
    const check = () => {
      if (settled) return;
      // Next announces readiness only after its own listener has bound successfully.
      if (!readyAnnounced) {
        retry = setTimeout(check, 100);
        return;
      }
      request = http.get(appUrl, { timeout: 1500 }, (response) => {
        response.resume();
        if (response.statusCode === 200) finish();
        else retry = setTimeout(check, 150);
      });
      request.once('timeout', () => request.destroy());
      request.once('error', () => {
        if (!settled) retry = setTimeout(check, 150);
      });
    };
    server = spawn(process.execPath, [entry], {
      cwd: path.dirname(entry),
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', HOSTNAME: '127.0.0.1', PORT: String(port), NODE_ENV: 'production' },
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    server.stdout.on('data', (chunk) => {
      output = (output + chunk.toString()).slice(-2048);
      if (/Ready in\s+\d/.test(output)) readyAnnounced = true;
    });
    server.stderr.on('data', () => {});
    server.once('error', () => finish(new Error('로컬 서버를 실행하지 못했습니다. 앱 설치 파일을 확인해 주세요.')));
    server.once('exit', (code) => {
      if (!settled) finish(new Error(`로컬 서버가 시작 중 종료되었습니다 (코드 ${code ?? 'signal'}). 개발 환경에서는 npm run build를 먼저 실행해 주세요.`));
      else if (!quitting && !starting) fail('로컬 서버가 종료되었습니다. 앱을 다시 실행해 주세요.');
    });
    check();
  });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (window?.isMinimized()) window.restore();
    window?.show();
    window?.focus();
  });
  app.on('before-quit', stopServer);
  app.on('window-all-closed', () => app.quit());
  process.on('exit', stopServer);
  app.whenReady().then(async () => {
    const entry = app.isPackaged
      ? path.join(process.resourcesPath, 'server', 'server.js')
      : path.join(app.getAppPath(), '.next', 'standalone', 'server.js');
    if (!existsSync(entry)) throw new Error('앱 빌드가 없습니다. 프로젝트 폴더에서 npm run build 후 npm run desktop을 실행해 주세요.');
    await requireFreePort();
    await startServer(entry);
    if (server.exitCode !== null || quitting) throw new Error('로컬 서버가 종료되었습니다. 다시 실행해 주세요.');
    window = new BrowserWindow({
      width: 1180,
      height: 850,
      minWidth: 390,
      minHeight: 600,
      title: 'Oh My Picklebot',
      backgroundColor: '#FFFFFF',
      autoHideMenuBar: true,
      show: false,
      webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true },
    });
    window.webContents.session.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    window.webContents.session.setPermissionCheckHandler(() => false);
    const openExternal = (url) => {
      void shell.openExternal(url).catch(() => dialog.showErrorBox('링크를 열 수 없어요', '기본 브라우저 설정을 확인한 뒤 다시 시도해 주세요.'));
    };
    window.webContents.setWindowOpenHandler(({ url }) => {
      const target = navigationTarget(url, origin);
      if (target?.kind === 'external') openExternal(target.url);
      else if (target?.kind === 'internal') void window.loadURL(target.url).catch(() => dialog.showErrorBox('화면을 열 수 없어요', '앱을 다시 실행해 주세요.'));
      return { action: 'deny' };
    });
    window.webContents.on('will-navigate', (event, url) => {
      const target = navigationTarget(url, origin);
      if (target?.kind === 'internal') return;
      event.preventDefault();
      if (target?.kind === 'external') openExternal(target.url);
    });
    window.webContents.on('will-redirect', (event, url) => {
      if (navigationTarget(url, origin)?.kind !== 'internal') event.preventDefault();
    });
    starting = false;
    await window.loadURL(appUrl);
    window.show();
  }).catch((error) => fail(error.message));
}
