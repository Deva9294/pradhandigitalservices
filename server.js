/**
 * Pradhan Digital Services - Root Production Server
 * 
 * Supports:
 * 1. Single-Service All-in-One Root Deployment (Render/Railway/Heroku/VPS):
 *    Spawns backend and frontend on isolated internal ports and proxies requests
 *    via a unified gateway listening on process.env.PORT.
 * 2. Dedicated Backend Service (APP_TYPE=backend or SERVICE_TYPE=backend)
 * 3. Dedicated Frontend Service (APP_TYPE=frontend or SERVICE_TYPE=frontend)
 */

import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawMode = (process.env.SERVICE_TYPE || process.env.APP_TYPE || '').toLowerCase();
const serviceName = (process.env.RENDER_SERVICE_NAME || process.env.SERVICE_NAME || '').toLowerCase();
const hasFrontendBuild = fs.existsSync(path.join(__dirname, 'frontend', '.next'));

let mode = rawMode;
if (!mode) {
  if (serviceName.includes('backend') || !hasFrontendBuild) {
    mode = 'backend';
  } else if (serviceName.includes('frontend')) {
    mode = 'frontend';
  } else {
    mode = 'all';
  }
}

const publicPort = parseInt(process.env.PORT || '10000', 10);

console.log('----------------------------------------------------');
console.log('🚀 Pradhan Digital Services Server Bootloader');
console.log(`🌐 Mode: ${mode.toUpperCase()} (detected) | Target Public Port: ${publicPort}`);
console.log(`📦 Frontend Build Exists: ${hasFrontendBuild}`);
console.log('----------------------------------------------------');

if (mode === 'backend') {
  console.log(`[PDS] Launching dedicated Express API on port ${publicPort}...`);
  process.env.PORT = String(publicPort);
  await import('./backend/src/index.js');
} else if (mode === 'frontend') {
  console.log(`[PDS] Launching dedicated Next.js Frontend on port ${publicPort}...`);
  const frontend = spawn('npx', ['next', 'start', '-p', String(publicPort)], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true,
  });
  frontend.on('exit', (code) => process.exit(code || 0));
} else {
  // All-in-One Unified Gateway
  const internalBackendPort = publicPort === 8000 ? 8080 : 8000;
  const internalFrontendPort = publicPort === 3000 ? 3030 : 3000;

  console.log(`[PDS Gateway] Routing /api, /uploads, /health -> internal port ${internalBackendPort}`);
  console.log(`[PDS Gateway] Routing UI & SSR routes -> internal port ${internalFrontendPort}`);

  // 1. Start Backend
  const backend = spawn('node', ['src/index.js'], {
    cwd: path.join(__dirname, 'backend'),
    env: {
      ...process.env,
      PORT: String(internalBackendPort),
      BACKEND_PORT: String(internalBackendPort),
    },
    stdio: 'inherit',
    shell: true,
  });

  // 2. Start Frontend
  const frontend = spawn('npx', ['next', 'start', '-p', String(internalFrontendPort)], {
    cwd: path.join(__dirname, 'frontend'),
    env: {
      ...process.env,
      PORT: String(internalFrontendPort),
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    },
    stdio: 'inherit',
    shell: true,
  });

  const forward = (targetPort, req, res) => {
    const options = {
      hostname: '127.0.0.1',
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: req.headers.host || `localhost:${publicPort}`,
        'x-forwarded-for': req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        'x-forwarded-proto': req.headers['x-forwarded-proto'] || 'https',
      },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Bad Gateway',
          message: 'The upstream service is warming up or temporarily unavailable.',
          detail: err.message,
        }));
      }
    });

    req.pipe(proxyReq, { end: true });
  };

  const server = http.createServer((req, res) => {
    const url = req.url || '/';
    if (
      url.startsWith('/api') ||
      url.startsWith('/uploads') ||
      url === '/health'
    ) {
      forward(internalBackendPort, req, res);
    } else {
      forward(internalFrontendPort, req, res);
    }
  });

  server.listen(publicPort, () => {
    console.log(`✅ [PDS Gateway] Listening on http://0.0.0.0:${publicPort}`);
  });

  const cleanup = () => {
    console.log('\n🛑 Shutting down backend and frontend services...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}
