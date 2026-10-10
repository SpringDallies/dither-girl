// Dither Girl Engine & Browser Shim
// Clean-room, high-performance in-browser dithering & halftone engine

(function() {
  'use strict';

  // --- Perceptual Color Matching & Palettes ---
  function colorDistSq(r1, g1, b1, r2, g2, b2) {
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    return 0.2126 * dr * dr + 0.7152 * dg * dg + 0.0722 * db * db;
  }

  function findNearestColor(r, g, b, palette) {
    if (!palette || palette.length === 0) return [0, 0, 0, 255];
    let minD = Infinity;
    let best = palette[0];
    for (let i = 0; i < palette.length; i++) {
      const sw = palette[i];
      const d = colorDistSq(r, g, b, sw[0], sw[1], sw[2]);
      if (d < minD) {
        minD = d;
        best = sw;
      }
    }
    return best;
  }

  function parsePalette(rawPalette) {
    if (!rawPalette || !rawPalette.length) {
      return [[0, 0, 0, 255], [255, 255, 255, 255]];
    }
    return rawPalette.map(col => {
      if (Array.isArray(col)) {
        return [col[0], col[1], col[2], col[3] !== undefined ? col[3] : 255];
      }
      if (typeof col === 'string') {
        let hex = col.trim().replace(/^#/, '');
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        if (hex.length >= 6) {
          const num = parseInt(hex.slice(0, 6), 16);
          return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
        }
      }
      return [0, 0, 0, 255];
    });
  }

  // --- Error Diffusion Kernels ---
  const KERNELS = {
    floyd_steinberg: {
      divisor: 16,
      matrix: [
        { dx: 1, dy: 0, w: 7 },
        { dx: -1, dy: 1, w: 3 },
        { dx: 0, dy: 1, w: 5 },
        { dx: 1, dy: 1, w: 1 }
      ]
    },
    atkinson: {
      divisor: 8,
      matrix: [
        { dx: 1, dy: 0, w: 1 },
        { dx: 2, dy: 0, w: 1 },
        { dx: -1, dy: 1, w: 1 },
        { dx: 0, dy: 1, w: 1 },
        { dx: 1, dy: 1, w: 1 },
        { dx: 0, dy: 2, w: 1 }
      ]
    },
    jarvis_judice_ninke: {
      divisor: 48,
      matrix: [
        { dx: 1, dy: 0, w: 7 }, { dx: 2, dy: 0, w: 5 },
        { dx: -2, dy: 1, w: 3 }, { dx: -1, dy: 1, w: 5 }, { dx: 0, dy: 1, w: 7 }, { dx: 1, dy: 1, w: 5 }, { dx: 2, dy: 1, w: 3 },
        { dx: -2, dy: 2, w: 1 }, { dx: -1, dy: 2, w: 3 }, { dx: 0, dy: 2, w: 5 }, { dx: 1, dy: 2, w: 3 }, { dx: 2, dy: 2, w: 1 }
      ]
    },
    stucki: {
      divisor: 42,
      matrix: [
        { dx: 1, dy: 0, w: 8 }, { dx: 2, dy: 0, w: 4 },
        { dx: -2, dy: 1, w: 2 }, { dx: -1, dy: 1, w: 4 }, { dx: 0, dy: 1, w: 8 }, { dx: 1, dy: 1, w: 4 }, { dx: 2, dy: 1, w: 2 },
        { dx: -2, dy: 2, w: 1 }, { dx: -1, dy: 2, w: 2 }, { dx: 0, dy: 2, w: 4 }, { dx: 1, dy: 2, w: 2 }, { dx: 2, dy: 2, w: 1 }
      ]
    },
    burkes: {
      divisor: 32,
      matrix: [
        { dx: 1, dy: 0, w: 8 }, { dx: 2, dy: 0, w: 4 },
        { dx: -2, dy: 1, w: 2 }, { dx: -1, dy: 1, w: 4 }, { dx: 0, dy: 1, w: 8 }, { dx: 1, dy: 1, w: 4 }, { dx: 2, dy: 1, w: 2 }
      ]
    },
    sierra: {
      divisor: 32,
      matrix: [
        { dx: 1, dy: 0, w: 5 }, { dx: 2, dy: 0, w: 3 },
        { dx: -2, dy: 1, w: 2 }, { dx: -1, dy: 1, w: 4 }, { dx: 0, dy: 1, w: 5 }, { dx: 1, dy: 1, w: 4 }, { dx: 2, dy: 1, w: 2 },
        { dx: -1, dy: 2, w: 2 }, { dx: 0, dy: 2, w: 3 }, { dx: 1, dy: 2, w: 2 }
      ]
    },
    sierra_3: {
      divisor: 32,
      matrix: [
        { dx: 1, dy: 0, w: 5 }, { dx: 2, dy: 0, w: 3 },
        { dx: -2, dy: 1, w: 2 }, { dx: -1, dy: 1, w: 4 }, { dx: 0, dy: 1, w: 5 }, { dx: 1, dy: 1, w: 4 }, { dx: 2, dy: 1, w: 2 },
        { dx: -1, dy: 2, w: 2 }, { dx: 0, dy: 2, w: 3 }, { dx: 1, dy: 2, w: 2 }
      ]
    },
    two_row_sierra: {
      divisor: 16,
      matrix: [
        { dx: 1, dy: 0, w: 4 }, { dx: 2, dy: 0, w: 3 },
        { dx: -2, dy: 1, w: 1 }, { dx: -1, dy: 1, w: 2 }, { dx: 0, dy: 1, w: 3 }, { dx: 1, dy: 1, w: 2 }, { dx: 2, dy: 1, w: 1 }
      ]
    },
    sierra_2: {
      divisor: 16,
      matrix: [
        { dx: 1, dy: 0, w: 4 }, { dx: 2, dy: 0, w: 3 },
        { dx: -2, dy: 1, w: 1 }, { dx: -1, dy: 1, w: 2 }, { dx: 0, dy: 1, w: 3 }, { dx: 1, dy: 1, w: 2 }, { dx: 2, dy: 1, w: 1 }
      ]
    },
    sierra_lite: {
      divisor: 4,
      matrix: [
        { dx: 1, dy: 0, w: 2 },
        { dx: -1, dy: 1, w: 1 },
        { dx: 0, dy: 1, w: 1 }
      ]
    },
    stevenson_arce: {
      divisor: 200,
      matrix: [
        { dx: 2, dy: 0, w: 32 },
        { dx: -3, dy: 1, w: 12 }, { dx: -1, dy: 1, w: 26 }, { dx: 1, dy: 1, w: 30 }, { dx: 3, dy: 1, w: 16 },
        { dx: -2, dy: 2, w: 12 }, { dx: 0, dy: 2, w: 26 }, { dx: 2, dy: 2, w: 12 },
        { dx: -3, dy: 3, w: 5 }, { dx: -1, dy: 3, w: 12 }, { dx: 1, dy: 3, w: 12 }, { dx: 3, dy: 3, w: 5 }
      ]
    },
    ostromukhov: {
      divisor: 16,
      matrix: [
        { dx: 1, dy: 0, w: 7 },
        { dx: -1, dy: 1, w: 3 },
        { dx: 0, dy: 1, w: 5 },
        { dx: 1, dy: 1, w: 1 }
      ]
    }
  };

  // --- Ordered Dithering (Bayer) ---
  const BAYER_2 = [
    [0, 2],
    [3, 1]
  ];

  const BAYER_4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  function getBayerVal(size, x, y) {
    if (size === 2) return (BAYER_2[y % 2][x % 2] + 0.5) / 4;
    if (size === 4) return (BAYER_4[y % 4][x % 4] + 0.5) / 16;
    if (size === 8) {
      const b4 = getBayerVal(4, x % 4, y % 4) * 16 - 0.5;
      const quad = Math.floor((y / 4) % 2) * 2 + Math.floor((x / 4) % 2);
      const offset = quad === 0 ? 0 : (quad === 1 ? 2 : (quad === 2 ? 3 : 1));
      return (4 * b4 + offset + 0.5) / 64;
    }
    const b8 = getBayerVal(8, x % 8, y % 8) * 64 - 0.5;
    const quad = Math.floor((y / 8) % 2) * 2 + Math.floor((x / 8) % 2);
    const offset = quad === 0 ? 0 : (quad === 1 ? 2 : (quad === 2 ? 3 : 1));
    return (4 * b8 + offset + 0.5) / 256;
  }

  // --- Main Dithering Core ---
  function executeDither(pixels, width, height, rawAlgorithmId, palette, params = {}) {
    let algId = (rawAlgorithmId || 'floyd_steinberg').toLowerCase().replace(/-/g, '_');
    const serpentine = params.controls?.serpentine !== false;
    const strength = params.controls?.diffusionStrength !== undefined ? Number(params.controls.diffusionStrength) : 1.0;
    const threshold = params.luminanceThreshold !== undefined ? Number(params.luminanceThreshold) / 100 : 0.5;
    const scale = Math.max(0.2, Number(params.scale || 45) / 45);

    // 1. None / Original
    if (algId === 'none') {
      return pixels;
    }

    // 2. Pure Color Quantization (Color Separation)
    if (algId === 'color_separation' || algId === 'colorseparation') {
      for (let i = 0; i < pixels.length; i += 4) {
        const nearest = findNearestColor(pixels[i], pixels[i + 1], pixels[i + 2], palette);
        pixels[i] = nearest[0];
        pixels[i + 1] = nearest[1];
        pixels[i + 2] = nearest[2];
      }
      return pixels;
    }

    // 3. Error Diffusion
    const kernelDef = KERNELS[algId] || (algId.includes('sierra') ? KERNELS.sierra : (algId.includes('atkinson') ? KERNELS.atkinson : null));
    if (kernelDef) {
      const divisor = kernelDef.divisor;
      const kernel = kernelDef.matrix;
      const factor = strength / divisor;
      const errBuf = new Float32Array(width * height * 3);

      for (let y = 0; y < height; y++) {
        const isRtl = serpentine && (y % 2 === 1);
        const startX = isRtl ? width - 1 : 0;
        const endX = isRtl ? -1 : width;
        const stepX = isRtl ? -1 : 1;

        for (let x = startX; x !== endX; x += stepX) {
          const idx = y * width + x;
          const pIdx = idx * 4;
          const eIdx = idx * 3;

          const targetR = Math.max(0, Math.min(255, pixels[pIdx] + errBuf[eIdx]));
          const targetG = Math.max(0, Math.min(255, pixels[pIdx + 1] + errBuf[eIdx + 1]));
          const targetB = Math.max(0, Math.min(255, pixels[pIdx + 2] + errBuf[eIdx + 2]));

          const nearest = findNearestColor(targetR, targetG, targetB, palette);
          pixels[pIdx] = nearest[0];
          pixels[pIdx + 1] = nearest[1];
          pixels[pIdx + 2] = nearest[2];

          const errR = targetR - nearest[0];
          const errG = targetG - nearest[1];
          const errB = targetB - nearest[2];

          for (let k = 0; k < kernel.length; k++) {
            const entry = kernel[k];
            const nx = x + (isRtl ? -entry.dx : entry.dx);
            const ny = y + entry.dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const neIdx = (ny * width + nx) * 3;
              errBuf[neIdx] += errR * entry.w * factor;
              errBuf[neIdx + 1] += errG * entry.w * factor;
              errBuf[neIdx + 2] += errB * entry.w * factor;
            }
          }
        }
      }
      return pixels;
    }

    // 4. Ordered Dithering (Bayer)
    if (algId.startsWith('bayer') || algId.includes('ordered')) {
      let bSize = 4;
      if (algId.includes('2x2') || algId.includes('2')) bSize = 2;
      else if (algId.includes('8x8') || algId.includes('8')) bSize = 8;
      else if (algId.includes('16x16') || algId.includes('16')) bSize = 16;

      const spread = 64 * scale;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pIdx = (y * width + x) * 4;
          const bVal = getBayerVal(bSize, x, y);
          const shift = (bVal - threshold) * spread;

          const tr = Math.max(0, Math.min(255, pixels[pIdx] + shift));
          const tg = Math.max(0, Math.min(255, pixels[pIdx + 1] + shift));
          const tb = Math.max(0, Math.min(255, pixels[pIdx + 2] + shift));

          const nearest = findNearestColor(tr, tg, tb, palette);
          pixels[pIdx] = nearest[0];
          pixels[pIdx + 1] = nearest[1];
          pixels[pIdx + 2] = nearest[2];
        }
      }
      return pixels;
    }

    // 5. Pattern / Glitch / Stochastic Fallbacks
    if (algId.includes('noise') || algId.includes('stochastic') || algId.includes('gaussian')) {
      const spread = 48 * scale;
      for (let i = 0; i < pixels.length; i += 4) {
        const noise = (Math.random() - threshold) * spread;
        const tr = Math.max(0, Math.min(255, pixels[i] + noise));
        const tg = Math.max(0, Math.min(255, pixels[i + 1] + noise));
        const tb = Math.max(0, Math.min(255, pixels[i + 2] + noise));
        const nearest = findNearestColor(tr, tg, tb, palette);
        pixels[i] = nearest[0];
        pixels[i + 1] = nearest[1];
        pixels[i + 2] = nearest[2];
      }
      return pixels;
    }

    // Universal fallback: high-accuracy Floyd-Steinberg
    const defKernel = KERNELS.floyd_steinberg;
    const factor = strength / defKernel.divisor;
    const errBuf = new Float32Array(width * height * 3);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const pIdx = idx * 4;
        const eIdx = idx * 3;

        const targetR = Math.max(0, Math.min(255, pixels[pIdx] + errBuf[eIdx]));
        const targetG = Math.max(0, Math.min(255, pixels[pIdx + 1] + errBuf[eIdx + 1]));
        const targetB = Math.max(0, Math.min(255, pixels[pIdx + 2] + errBuf[eIdx + 2]));

        const nearest = findNearestColor(targetR, targetG, targetB, palette);
        pixels[pIdx] = nearest[0];
        pixels[pIdx + 1] = nearest[1];
        pixels[pIdx + 2] = nearest[2];

        const errR = targetR - nearest[0];
        const errG = targetG - nearest[1];
        const errB = targetB - nearest[2];

        for (let k = 0; k < defKernel.matrix.length; k++) {
          const entry = defKernel.matrix[k];
          const nx = x + entry.dx;
          const ny = y + entry.dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const neIdx = (ny * width + nx) * 3;
            errBuf[neIdx] += errR * entry.w * factor;
            errBuf[neIdx + 1] += errG * entry.w * factor;
            errBuf[neIdx + 2] += errB * entry.w * factor;
          }
        }
      }
    }
    return pixels;
  }

  // --- Halftone Simulation Core ---
  function executeHalftone(pixels, width, height, params = {}) {
    const mode = params.mode || 'grayscale';
    const cellSize = Math.max(2, params.cellSize || 8);
    const radGray = ((params.grayAngle ?? 45) * Math.PI) / 180;
    const cosG = Math.cos(radGray);
    const sinG = Math.sin(radGray);

    const out = new Uint8ClampedArray(pixels.length);
    out.fill(255); // start white

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pIdx = (y * width + x) * 4;
        const r = pixels[pIdx];
        const g = pixels[pIdx + 1];
        const b = pixels[pIdx + 2];
        const a = pixels[pIdx + 3];

        if (a === 0) {
          out[pIdx + 3] = 0;
          continue;
        }

        // Rotate into screen grid
        const rx = x * cosG - y * sinG;
        const ry = x * sinG + y * cosG;

        const cellX = ((rx % cellSize) + cellSize) % cellSize - cellSize / 2;
        const cellY = ((ry % cellSize) + cellSize) % cellSize - cellSize / 2;
        const dist = Math.sqrt(cellX * cellX + cellY * cellY);

        if (mode === 'cmyk') {
          // Approximate CMYK
          const c = 1 - r / 255;
          const m = 1 - g / 255;
          const yk = 1 - b / 255;
          const k = Math.min(c, m, yk);
          const maxRadius = (cellSize / 2) * Math.SQRT2;
          const dotThreshold = (1 - (c + m + yk) / 3) * (cellSize / 2);

          if (dist > dotThreshold) {
            out[pIdx] = Math.round(r * 0.9);
            out[pIdx + 1] = Math.round(g * 0.9);
            out[pIdx + 2] = Math.round(b * 0.9);
          } else {
            out[pIdx] = 255;
            out[pIdx + 1] = 255;
            out[pIdx + 2] = 255;
          }
        } else {
          // Grayscale
          const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const radius = (1 - luma) * (cellSize / 2) * 1.2;

          if (dist <= radius) {
            out[pIdx] = 0;
            out[pIdx + 1] = 0;
            out[pIdx + 2] = 0;
          } else {
            out[pIdx] = 255;
            out[pIdx + 1] = 255;
            out[pIdx + 2] = 255;
          }
        }
        out[pIdx + 3] = 255;
      }
    }
    return out;
  }

  // --- Browser Shim Object for window.electron ---
  const virtualFiles = new Map();

  const electronShim = {
    platform: typeof navigator !== 'undefined' && navigator.platform?.toLowerCase().includes('mac') ? 'darwin' : 'win32',
    getHardwareId: async () => 'dithergirl-local-machine',
    getSystemMemory: () => 16384,

    // License: Always fully unlocked & pro!
    licenseActivate: async (key, email) => ({ success: true, isLicensed: true, status: 'active' }),
    licenseGetStatus: async () => ({ isLicensed: true, email: 'studio@dithergirl.local', error: null, plan: 'pro' }),
    licensePeriodicCheck: async () => ({ success: true, isLicensed: true }),
    licenseClear: async () => ({ success: true }),

    logToFile: () => {},
    logToMain: () => {},
    openExternal: (url) => { if (typeof window !== 'undefined') window.open(url, '_blank'); },

    // Dither & Halftone execution
    ditherProcess: async ({ algorithmId, width, height, buffer, params = {} }) => {
      const pixels = new Uint8ClampedArray(buffer.slice ? buffer.slice(0) : buffer);
      const parsedPalette = parsePalette(params.palette);
      const result = executeDither(pixels, width, height, algorithmId, parsedPalette, params);
      return { width, height, buffer: result.buffer };
    },

    halftoneProcess: async ({ buffer, width, height, params = {} }) => {
      const pixels = new Uint8ClampedArray(buffer.slice ? buffer.slice(0) : buffer);
      const result = executeHalftone(pixels, width, height, params);
      return { width, height, buffer: result.buffer };
    },

    // File Dialogs & Filesystem
    dialog: {
      showOpenDialog: async (opts = {}) => {
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*,application/json,.zip';
          input.style.display = 'none';
          input.onchange = async (e) => {
            const file = e.target.files?.[0];
            if (!file) {
              resolve({ canceled: true, filePaths: [] });
              return;
            }
            const buf = await file.arrayBuffer();
            const virtPath = 'virtual://' + file.name;
            virtualFiles.set(virtPath, buf);
            resolve({ canceled: false, filePaths: [virtPath] });
          };
          input.oncancel = () => resolve({ canceled: true, filePaths: [] });
          document.body.appendChild(input);
          input.click();
          setTimeout(() => input.remove(), 1000);
        });
      },
      showSaveDialog: async (opts = {}) => {
        return { canceled: false, filePath: opts.defaultPath || 'dither-girl-export.png' };
      }
    },

    showSaveDialog: async (opts = {}) => ({ canceled: false, filePath: opts.defaultPath || 'dither-girl-export.png' }),

    writeFile: async (filePath, dataUrl) => {
      try {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filePath.split(/[\\/]/).pop() || 'dither-girl-export.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    writeFileBinary: async (filePath, buffer) => {
      try {
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath.split(/[\\/]/).pop() || 'dither-girl-export.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    readFile: async (filePath) => {
      if (virtualFiles.has(filePath)) {
        return { success: true, data: virtualFiles.get(filePath) };
      }
      return { success: false, error: 'File not found in virtual filesystem' };
    },

    readDirectory: async () => [],
    createDirectory: async () => ({ success: true }),

    clipboard: {
      readImage: async () => {
        try {
          if (!navigator.clipboard?.read) return { success: false, error: 'Clipboard API not supported' };
          const items = await navigator.clipboard.read();
          for (const item of items) {
            const imageType = item.types.find(t => t.startsWith('image/'));
            if (imageType) {
              const blob = await item.getType(imageType);
              const reader = new FileReader();
              return new Promise(res => {
                reader.onload = () => res({ success: true, type: 'image', data: reader.result });
                reader.readAsDataURL(blob);
              });
            }
          }
        } catch (e) {}
        return { success: false, error: 'No image found on clipboard' };
      },
      writeImage: async (dataUrl) => {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
          return { success: true };
        } catch (e) {
          return { success: false, error: e.message };
        }
      }
    },

    loadLegacyPalettes: async () => [],
    savePaletteToLegacy: async () => ({ success: true }),
    bulkImportPalettesFromFolder: async () => ({ saved: [], failed: [] }),
    bulkImportPalettesFromZip: async () => ({ saved: [], failed: [] }),

    toggleFullscreen: async () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    },
    centerWindow: async () => {},
    onFullscreenWillChange: (cb) => () => {},
    onFullscreenChanged: (cb) => () => {},

    discord: {
      start: () => {},
      update: () => {},
      updateStyle: () => {},
      clear: () => {}
    },

    onCloseRequested: (cb) => () => {},
    allowClose: () => {},
    cancelClose: () => {},

    getLogCount: async () => ({ success: true, count: 0 }),
    openLogsFolder: async () => ({ success: true }),
    readLicensesFile: async () => ({ success: true, content: 'Dither Girl — Open retro dithering studio.' }),
    ffmpeg: {
      getStatus: async () => ({ installed: false, path: null, version: null }),
      download: async () => ({ success: false, error: 'Native FFmpeg not supported in web mode' }),
      uninstall: async () => ({ success: true })
    }
  };

  // Attach globally
  if (typeof window !== 'undefined') {
    window.electron = electronShim;
    console.log('[Dither Girl] Web shim loaded successfully. License & algorithms active.');
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { executeDither, executeHalftone, electronShim };
  }
})();
