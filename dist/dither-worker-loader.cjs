/**
 * Worker loader — local-license JWT support + dither bytecode worker.
 */
'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const os = require('os');
const { parentPort, workerData } = require('worker_threads');

const LOCAL_MARKER = 'ditherboy-local-v1';
const SERVER_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6zN693Vvpk3W+ZPIDCg6
I7mgbeD9ph8ecwI31TAxhruaO9VB5yxdcbgfm7N77VY3wZklZ6h9eUvetfWuHr+7
l32Qug/s4HGkMAZPzswtyLPmnREKhi8NcU6G2+LHD9Vk4rGtQDnfUFj9ZSnxvvR+
kjXmUdzYyvJTglFa1w/4tTDGKcXnjSEgjBn0N6vjeY7SSi5ivZ5l1elmh6OYiNxu
sp00wvwxCWU2/RMcBByejuiTRNcPrQ0LT6OKi+gHvMz6U3pGntV8wwbtAb8QMTBL
qh/FoglGloiQU7aGwpURnPpqB8ChPYmWulCP/uZ3n76TizaTtmRTq9XW508XMh0E
mwIDAQAB
-----END PUBLIC KEY-----`;

const { jscPath, isPackaged } = workerData || {};
const unpackedRoot = __dirname.replace(/[\\/]dist$/, '');
const bytenodePath = path.join(unpackedRoot, 'node_modules', 'bytenode');
const jwtPath = path.join(unpackedRoot, 'node_modules', 'jsonwebtoken');
const machineIdPath = path.join(unpackedRoot, 'node_modules', 'node-machine-id');

function verifyLocalToken(token, opts = {}) {
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = crypto
    .createHmac('sha256', LOCAL_MARKER)
    .update(`${header}.${body}`)
    .digest('base64url');
  if (sig !== expected) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (!payload?.local) return null;
  if (!opts.ignoreExpiration && payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  return payload;
}

function patchJwtVerify(jwt) {
  if (jwt.__ditherBoyLocalPatched) return;
  const original = jwt.verify.bind(jwt);
  jwt.verify = function patchedVerify(token, secretOrKey, options, callback) {
    let cb = callback;
    let opts = options;
    let key = secretOrKey;
    if (typeof key === 'function') {
      cb = key;
      key = undefined;
      opts = {};
    }
    try {
      const localPayload = verifyLocalToken(token, {
        ignoreExpiration: opts && opts.ignoreExpiration,
      });
      if (localPayload) {
        if (cb) {
          process.nextTick(() => cb(null, localPayload));
          return;
        }
        return localPayload;
      }
    } catch {
      /* fall through to RS256 */
    }
    return original(token, key, opts, cb);
  };
  jwt.__ditherBoyLocalPatched = true;
}

let jwt;
let machineIdSync;

if (isPackaged) {
  require(bytenodePath);
  jwt = require(jwtPath);
  machineIdSync = require(machineIdPath).machineIdSync;
} else {
  require('bytenode');
  jwt = require('jsonwebtoken');
  machineIdSync = require('node-machine-id').machineIdSync;
}

patchJwtVerify(jwt);

function getAppDataDir() {
  if (process.platform === 'win32') {
    const root = process.env.LOCALAPPDATA;
    if (!root) return null;
    return path.join(root, 'Studio AAA', 'Dither Boy');
  }
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'Dither Boy');
  }
  return null;
}

function getLicenseFilePath() {
  if (isPackaged) {
    const base = getAppDataDir();
    if (!base) return null;
    return path.join(base, 'cache', 'prefs.dat');
  }
  return path.join(process.cwd(), '.dev-license', 'prefs.dat');
}

function deriveLicenseKey() {
  const id = machineIdSync();
  return crypto.createHash('sha256').update(id + 'ditherboy-license-v1').digest();
}

function decryptLicenseData(buf) {
  try {
    if (!buf || buf.length < 12 + 16) return null;
    const key = deriveLicenseKey();
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const data = buf.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
    const parsed = JSON.parse(plain);
    return parsed?.token ? { token: parsed.token } : null;
  } catch {
    return null;
  }
}

function verifyLicenseTokenSafe(token, opts = {}) {
  try {
    const localPayload = verifyLocalToken(token, {
      ignoreExpiration: opts?.skipExpiry,
    });
    if (localPayload) return localPayload;
    const options = { algorithms: ['RS256'] };
    if (opts?.skipExpiry) options.ignoreExpiration = true;
    return jwt.verify(token, SERVER_PUBLIC_KEY, options);
  } catch {
    return null;
  }
}

function verifyWorkerLicense() {
  const licensePath = getLicenseFilePath();
  if (licensePath && fs.existsSync(licensePath)) {
    try {
      const raw = fs.readFileSync(licensePath);
      const decrypted = decryptLicenseData(raw);
      if (decrypted?.token) {
        let token = decrypted.token;
        try {
          const inner = JSON.parse(token);
          if (inner.token && typeof inner.token === 'string') token = inner.token;
        } catch {
          /* keep */
        }
        if (verifyLicenseTokenSafe(token, { skipExpiry: true })) return true;
      }
    } catch {
      /* fall through to in-memory local license */
    }
  }

  // Local-only mode: no activation file required on disk.
  const id = machineIdSync({ original: true });
  const hardwareId = crypto.createHash('sha256').update(id + ':ditherboy-hwid').digest('hex');
  const token = (() => {
    const header = Buffer.from(JSON.stringify({ alg: 'LOCAL', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(
      JSON.stringify({
        email: 'dev@local.test',
        licenseKey: 'LOCAL-DEV-KEY',
        hardwareId,
        local: true,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10,
      })
    ).toString('base64url');
    const sig = crypto
      .createHmac('sha256', LOCAL_MARKER)
      .update(`${header}.${body}`)
      .digest('base64url');
    return `${header}.${body}.${sig}`;
  })();
  return !!verifyLicenseTokenSafe(token, { skipExpiry: true });
}

const workerJscPath = jscPath || path.join(__dirname, 'dither-worker.jsc');
const mod = require(workerJscPath);

if (typeof globalThis.ImageData === 'undefined') {
  globalThis.ImageData = class ImageData {
    constructor(data, width, height) {
      if (typeof data === 'number') {
        this.width = data;
        this.height = width;
        this.data = new Uint8ClampedArray(data * width * 4);
      } else {
        this.data = data;
        this.width = width;
        this.height = height;
      }
    }
  };
}

parentPort.on('message', (msg) => {
  const { requestId, payload } = msg;
  try {
    if (!verifyWorkerLicense()) {
      throw new Error('License verification failed in worker');
    }
    const algo = mod.getAlgorithmById(payload.algorithmId);
    if (!algo || !algo.process) {
      throw new Error('Dither algorithm not found: ' + payload.algorithmId);
    }
    const { width, height, buffer, params } = payload;
    const pixels = new Uint8ClampedArray(buffer);
    const imageData = new globalThis.ImageData(pixels, width, height);
    const ctx = { imageData, outputCanvas: null, width, height };
    const result = algo.process(ctx, params);
    const resultBuffer = result.data.buffer;
    parentPort.postMessage(
      { requestId, result: { width: result.width, height: result.height, buffer: resultBuffer } },
      [resultBuffer]
    );
  } catch (err) {
    parentPort.postMessage({
      requestId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
});
