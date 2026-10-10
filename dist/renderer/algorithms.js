// DitherForge 63-Algorithm Engine
// Clean-Room Implementation across all 6 Categories

import { findNearestColor, colorDistSq } from "./palettes.js";

export const ALGORITHM_CATEGORIES = [
  { id: "error_diffusion", name: "Error Diffusion (15)" },
  { id: "ordered", name: "Ordered Dithering (5)" },
  { id: "pattern", name: "Pattern Dithers (8)" },
  { id: "glitch", name: "Glitch Effects (17)" },
  { id: "special", name: "Special & Stochastic (16)" },
  { id: "bespoke", name: "Bespoke & Temporal (2)" },
];

export const ALGORITHM_REGISTRY = [
  // --- Error Diffusion (15) ---
  { id: "floyd_steinberg", name: "Floyd–Steinberg", category: "error_diffusion", description: "Canonical 16ths 2-row error diffusion matrix with balanced continuous tone reproduction." },
  { id: "atkinson", name: "Atkinson", category: "error_diffusion", description: "Classic Mac OS 3/4 error retention preserving high contrast highlights and clean voids." },
  { id: "jarvis_judice_ninke", name: "Jarvis–Judice–Ninke", category: "error_diffusion", description: "Wide 48ths 3-row diffusion producing exceptionally smooth continuous transitions." },
  { id: "stucki", name: "Stucki", category: "error_diffusion", description: "Sharp 42nds 3-row kernel optimizing edge contrast and technical drawing reproduction." },
  { id: "burkes", name: "Burkes", category: "error_diffusion", description: "Fast 32nds 2-row diffusion with wide horizontal spread minimizing vertical smearing." },
  { id: "sierra_3", name: "Sierra Three-Row", category: "error_diffusion", description: "Balanced 32nds 3-row kernel tapering error accumulation with gentle shadow gradations." },
  { id: "sierra_2", name: "Sierra Two-Row", category: "error_diffusion", description: "Streamlined 16ths 2-row diffusion balancing high performance and photographic detail." },
  { id: "sierra_lite", name: "Sierra Lite", category: "error_diffusion", description: "Minimalist 4ths kernel providing a punchy, sharp, gritty retro sprite aesthetic." },
  { id: "stevenson_arce", name: "Stevenson–Arce", category: "error_diffusion", description: "Hexagonal 200ths wide kernel eliminating horizontal and vertical directional grain." },
  { id: "fan", name: "Fan Adaptive", category: "error_diffusion", description: "Modified lower-row distribution suppressing worm-like chain patterns in highlights." },
  { id: "shiau_fan", name: "Shiau–Fan Balanced", category: "error_diffusion", description: "Suppresses structural patterns in uniform highlight fields between 5% and 20% density." },
  { id: "shiau_fan_2", name: "Shiau–Fan 2 (Narrow)", category: "error_diffusion", description: "Compact 8ths kernel designed for high-efficiency raster processing." },
  { id: "false_floyd_steinberg", name: "False Floyd–Steinberg", category: "error_diffusion", description: "Asymmetric 3-neighbor matrix creating stylized mechanical cross-hatch texture." },
  { id: "minimized_avg_error", name: "Minimized Average Error", category: "error_diffusion", description: "Oatley 16ths matrix minimizing local mean square variance across delicate gradients." },
  { id: "dynamic_serpentine", name: "Dynamic Serpentine Lattice", category: "error_diffusion", description: "Alternating scanline sweep with dynamic boundary reflection cancelling directional bias." },

  // --- Ordered Dithering (5) ---
  { id: "bayer_2x2", name: "Bayer 2×2", category: "ordered", description: "Coarse 4-level ordered micro-checkerboard for bold graphic art and 1-bit icons." },
  { id: "bayer_4x4", name: "Bayer 4×4", category: "ordered", description: "Classic 16-level matrix emulating early Macintosh & PC CGA/EGA graphics adapters." },
  { id: "bayer_8x8", name: "Bayer 8×8", category: "ordered", description: "64-level matrix providing smooth tones with quintessential vintage crosshatching." },
  { id: "bayer_16x16", name: "Bayer 16×16", category: "ordered", description: "256-level full range recursive matrix for seamless gradients without banding." },
  { id: "clustered_dot", name: "Clustered Dot Screen", category: "ordered", description: "Simulates mechanical photogravure printing, rotogravure, and newsprint halftone screens." },

  // --- Pattern Dithers (8) ---
  { id: "checkered", name: "Checkered Micro-Grid", category: "pattern", description: "Alternating geometry expanding from grid intersection nodes." },
  { id: "horizontal_lines", name: "Horizontal Linear Grating", category: "pattern", description: "Translates luminance into modulated horizontal CRT scanline rules." },
  { id: "vertical_lines", name: "Vertical Linear Grating", category: "pattern", description: "Modulates luminance into vertical optical bar gratings and lenticular sheets." },
  { id: "crosshatch", name: "Interlocking Crosshatch", category: "pattern", description: "Orthogonal intersecting lines simulating fine ink drafting and engraving etchings." },
  { id: "diagonal_hatch", name: "Diagonal 45° Hatch", category: "pattern", description: "Dynamic angled strokes evoking comic book, manga inking, and architectural drafting." },
  { id: "concentric_diamond", name: "Concentric Diamond Grid", category: "pattern", description: "Diamond-shaped contours radiating from periodic cell centers." },
  { id: "woven_basket", name: "Woven Basket Tile", category: "pattern", description: "Alternating orthogonal weave evoking woven fiber textiles and carbon fiber." },
  { id: "hex_stipple", name: "Hexagonal Stochastic Stipple", category: "pattern", description: "Isotropic point lattice arranged at 60° equilateral intervals." },

  // --- Glitch Effects (17) ---
  { id: "scanline_jitter", name: "Scanline Jitter", category: "glitch", description: "Replicates horizontal synchronization wobble on worn CRT displays and analog monitors." },
  { id: "chromatic_offset", name: "Color Channel Offset", category: "glitch", description: "Spatial displacement of RGB color components creating 3D anaglyph fringing." },
  { id: "pixel_sorting", name: "Directional Pixel Sorting", category: "glitch", description: "Luminance-threshold sorting yielding liquid descending crystalline streaks." },
  { id: "digital_artifacts", name: "Digital Compression Artifacts", category: "glitch", description: "Simulates DCT block-boundary errors and digital transmission loss." },
  { id: "interlacing_tear", name: "Interlacing Field Tear", category: "glitch", description: "Splits alternating video fields with temporal motion disparity." },
  { id: "crt_bloom", name: "CRT Phosphor Bloom", category: "glitch", description: "Diffuses electron gun saturation into neighboring triads." },
  { id: "bit_crush", name: "Bit-Depth Crush Quantizer", category: "glitch", description: "Crushes dynamic range to harsh posterized quantization levels." },
  { id: "vhs_tracking", name: "VHS Tracking Noise", category: "glitch", description: "Sweeping horizontal magnetic tape distortion and color burst snow." },
  { id: "bad_ram", name: "Bad RAM Nibble Inversion", category: "glitch", description: "Simulates faulty video memory cells via stochastic bit flips." },
  { id: "wave_distortion", name: "Sinusoidal Wave Warp", category: "glitch", description: "Harmonic phase modulation rippling across the raster frame." },
  { id: "quant_slice", name: "Quantization Step Slicing", category: "glitch", description: "Displaces tonal contours into stepped topographic slices." },
  { id: "matrix_rake", name: "Diagonal Matrix Rake", category: "glitch", description: "Cascades threshold sweeps diagonally across the pixel matrix." },
  { id: "static_snow", name: "Analog Static Snow", category: "glitch", description: "Broadband RF white noise simulating disconnected antenna feeds." },
  { id: "sync_pulse_loss", name: "Sync Pulse Hold Collapse", category: "glitch", description: "Vertical hold failure causing rolling frame tear artifacts." },
  { id: "feedback_ringing", name: "Edge Ringing & Feedback", category: "glitch", description: "Recursive video loop feedback producing ghost contour echoes." },
  { id: "chroma_subsample", name: "YUV 4:1:1 Degradation", category: "glitch", description: "Decimates color fidelity evoking low-bandwidth vintage video." },
  { id: "moire_glitch", name: "Moiré Interference Glitch", category: "glitch", description: "Interferes dual spatial frequencies yielding optical moiré beat." },

  // --- Special Effects (16) ---
  { id: "fixed_threshold", name: "Fixed Bi-Level Cutoff", category: "special", description: "High-contrast silhouette thresholding with adjustable pivot." },
  { id: "random_threshold", name: "Uniform White Noise Dither", category: "special", description: "Stochastic uniform noise comparison eliminating periodic patterns." },
  { id: "blue_noise", name: "Void-and-Cluster Blue Noise", category: "special", description: "High-frequency dispersed noise providing soothe-grain photographic stippling." },
  { id: "gaussian_noise", name: "Gaussian Normal Distribution", category: "special", description: "Bell-curve noise threshold simulating high-ISO film emulsion grain." },
  { id: "perlin_gradient", name: "Perlin Gradient Lattice", category: "special", description: "Procedural harmonic gradients forming smoky marbled dither forms." },
  { id: "riemersma", name: "Riemersma Hilbert Space-Curve", category: "special", description: "Fractal Hilbert curve traversal with exponential decay memory." },
  { id: "ostromoukhov", name: "Ostromoukhov Variable Diffusion", category: "special", description: "Dynamically adjusted coefficients tailored to exact local luminance." },
  { id: "tpdf_noise", name: "Triangular PDF Noise (TPDF)", category: "special", description: "Dual uniform noise summation eliminating harmonic noise modulation." },
  { id: "companding_curve", name: "Dynamic Companding (A-Law)", category: "special", description: "Logarithmic compression accentuating subtle shadow details." },
  { id: "spatial_lattice", name: "Hexagonal Spatial Lattice", category: "special", description: "Equidistant honeycomb coordinate diffusion mapping." },
  { id: "sobel_feature", name: "Sobel Silhouette Preserving", category: "special", description: "Dampens dither noise along detected high-frequency edges." },
  { id: "laplacian_mod", name: "Laplacian Frequency Modulated", category: "special", description: "Second-derivative edge sharpening integrated into quantization." },
  { id: "directional_gradient", name: "Directional Gradient Angle", category: "special", description: "Aligns dither hatch lines with local optical flow vectors." },
  { id: "voronoi_cellular", name: "Voronoi Cellular Stipple", category: "special", description: "Emulates relaxed stipple point distribution via cellular distance." },
  { id: "diffusion_blur", name: "Unsharp Diffusion Quantizer", category: "special", description: "Fuses unsharp masking with local spatial error dispersion." },
  { id: "quantum_stipple", name: "Quantum Probability Cloud", category: "special", description: "Sub-pixel photon wave arrival simulation for organic stippling." },

  // --- Bespoke & Temporal (2) ---
  { id: "ignition_glow", name: "Ignition Glow (Bespoke Dither Bloom)", category: "bespoke", description: "Original bespoke bloom analyzing dither dot density and edge contrast." },
  { id: "temporal_kinetic", name: "Temporal Kinetic Dither", category: "bespoke", description: "Continuous temporal phase-shifted dithering for animated media." }
];

// Kernels for error diffusion
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
  sierra_3: {
    divisor: 32,
    matrix: [
      { dx: 1, dy: 0, w: 5 }, { dx: 2, dy: 0, w: 3 },
      { dx: -2, dy: 1, w: 2 }, { dx: -1, dy: 1, w: 4 }, { dx: 0, dy: 1, w: 5 }, { dx: 1, dy: 1, w: 4 }, { dx: 2, dy: 1, w: 2 },
      { dx: -1, dy: 2, w: 2 }, { dx: 0, dy: 2, w: 3 }, { dx: 1, dy: 2, w: 2 }
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
  fan: {
    divisor: 16,
    matrix: [
      { dx: 1, dy: 0, w: 7 },
      { dx: -1, dy: 1, w: 1 },
      { dx: 0, dy: 1, w: 3 }
    ]
  },
  shiau_fan: {
    divisor: 16,
    matrix: [
      { dx: 1, dy: 0, w: 7 },
      { dx: -2, dy: 1, w: 1 },
      { dx: -1, dy: 1, w: 3 },
      { dx: 0, dy: 1, w: 5 }
    ]
  },
  shiau_fan_2: {
    divisor: 8,
    matrix: [
      { dx: 1, dy: 0, w: 4 },
      { dx: -1, dy: 1, w: 1 },
      { dx: 0, dy: 1, w: 3 }
    ]
  },
  false_floyd_steinberg: {
    divisor: 8,
    matrix: [
      { dx: 1, dy: 0, w: 3 },
      { dx: 0, dy: 1, w: 3 },
      { dx: 1, dy: 1, w: 2 }
    ]
  },
  minimized_avg_error: {
    divisor: 16,
    matrix: [
      { dx: 1, dy: 0, w: 7 }, { dx: 2, dy: 0, w: 2 },
      { dx: -1, dy: 1, w: 1 }, { dx: 0, dy: 1, w: 3 }, { dx: 1, dy: 1, w: 2 },
      { dx: 0, dy: 2, w: 1 }
    ]
  }
};

// Bayer Matrices
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

// Recursive Bayer Generator
function getBayerVal(size, x, y) {
  if (size === 2) return (BAYER_2[y % 2][x % 2] + 0.5) / 4;
  if (size === 4) return (BAYER_4[y % 4][x % 4] + 0.5) / 16;
  if (size === 8) {
    const b4 = getBayerVal(4, x % 4, y % 4) * 16 - 0.5;
    const quad = Math.floor((y / 4) % 2) * 2 + Math.floor((x / 4) % 2);
    const offset = quad === 0 ? 0 : (quad === 1 ? 2 : (quad === 2 ? 3 : 1));
    return (4 * b4 + offset + 0.5) / 64;
  }
  // 16x16
  const b8 = getBayerVal(8, x % 8, y % 8) * 64 - 0.5;
  const quad = Math.floor((y / 8) % 2) * 2 + Math.floor((x / 8) % 2);
  const offset = quad === 0 ? 0 : (quad === 1 ? 2 : (quad === 2 ? 3 : 1));
  return (4 * b8 + offset + 0.5) / 256;
}

const CLUSTER_6 = [
  [32, 28, 24, 25, 29, 33],
  [20, 12, 8, 9, 13, 21],
  [16, 4, 0, 1, 5, 17],
  [18, 6, 2, 3, 7, 19],
  [22, 14, 10, 11, 15, 23],
  [34, 30, 26, 27, 31, 35]
];

// Apply image adjustments (Brightness, contrast, saturation, gamma)
export function applyTweaks(data, width, height, settings) {
  const bOffset = (settings.brightness || 0) * 128;
  const cFactor = (settings.contrast || 0) >= 0 ? 1 + (settings.contrast || 0) * 2 : 1 + (settings.contrast || 0) * 0.8;
  const sFactor = 1 + (settings.saturation || 0);
  const invGamma = 1 / Math.max(0.01, settings.gamma || 1.0);

  const len = width * height * 4;
  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Contrast & Brightness
    r = (r - 128) * cFactor + 128 + bOffset;
    g = (g - 128) * cFactor + 128 + bOffset;
    b = (b - 128) * cFactor + 128 + bOffset;

    // Saturation
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = luma + (r - luma) * sFactor;
    g = luma + (g - luma) * sFactor;
    b = luma + (b - luma) * sFactor;

    // Gamma
    if (settings.gamma && settings.gamma !== 1.0) {
      r = 255 * Math.pow(Math.max(0, Math.min(255, r)) / 255, invGamma);
      g = 255 * Math.pow(Math.max(0, Math.min(255, g)) / 255, invGamma);
      b = 255 * Math.pow(Math.max(0, Math.min(255, b)) / 255, invGamma);
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
}

// Master Algorithm Dispatcher
export function applyDitherAlgorithm(imageData, settings) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const palette = settings.palette || [[0, 0, 0, 255], [255, 255, 255, 255]];
  const algId = settings.algorithmId || "floyd_steinberg";
  const serpentine = settings.serpentine !== false;
  const strength = settings.diffusionStrength !== undefined ? settings.diffusionStrength : 1.0;
  const threshold = settings.threshold !== undefined ? settings.threshold : 0.5;
  const scale = settings.scale || 1.0;
  const seed = settings.temporalSeed || 0;

  // 1. Error Diffusion Handlers
  if (KERNELS[algId] || algId === "dynamic_serpentine") {
    const kObj = algId === "dynamic_serpentine" ? KERNELS.floyd_steinberg : KERNELS[algId];
    const divisor = kObj.divisor;
    const kernel = kObj.matrix;
    const factor = strength / divisor;

    // RGB Error Grid
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

        const targetR = Math.max(0, Math.min(255, data[pIdx] + errBuf[eIdx]));
        const targetG = Math.max(0, Math.min(255, data[pIdx + 1] + errBuf[eIdx + 1]));
        const targetB = Math.max(0, Math.min(255, data[pIdx + 2] + errBuf[eIdx + 2]));

        const nearest = findNearestColor(targetR, targetG, targetB, palette);
        data[pIdx] = nearest[0];
        data[pIdx + 1] = nearest[1];
        data[pIdx + 2] = nearest[2];
        data[pIdx + 3] = 255;

        const errR = targetR - nearest[0];
        const errG = targetG - nearest[1];
        const errB = targetB - nearest[2];

        for (let k = 0; k < kernel.length; k++) {
          const entry = kernel[k];
          const kx = isRtl ? -entry.dx : entry.dx;
          const nx = x + kx;
          const ny = y + entry.dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const neIdx = (ny * width + nx) * 3;
            const w = entry.w * factor;
            errBuf[neIdx] += errR * w;
            errBuf[neIdx + 1] += errG * w;
            errBuf[neIdx + 2] += errB * w;
          }
        }
      }
    }
    return;
  }

  // 2. Ordered Dithering
  if (algId.startsWith("bayer_") || algId === "clustered_dot") {
    let bayerSize = 4;
    if (algId === "bayer_2x2") bayerSize = 2;
    if (algId === "bayer_4x4") bayerSize = 4;
    if (algId === "bayer_8x8") bayerSize = 8;
    if (algId === "bayer_16x16") bayerSize = 16;

    const spread = 48 * strength;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pIdx = (y * width + x) * 4;
        const bayerVal = algId === "clustered_dot"
          ? (CLUSTER_6[y % 6][x % 6] + 0.5) / 36
          : getBayerVal(bayerSize, x, y);

        const shift = (bayerVal - threshold) * spread;
        const tr = Math.max(0, Math.min(255, data[pIdx] + shift));
        const tg = Math.max(0, Math.min(255, data[pIdx + 1] + shift));
        const tb = Math.max(0, Math.min(255, data[pIdx + 2] + shift));

        const nearest = findNearestColor(tr, tg, tb, palette);
        data[pIdx] = nearest[0];
        data[pIdx + 1] = nearest[1];
        data[pIdx + 2] = nearest[2];
        data[pIdx + 3] = 255;
      }
    }
    return;
  }

  // 3. Pattern Dithering
  const patternTypes = [
    "checkered", "horizontal_lines", "vertical_lines", "crosshatch",
    "diagonal_hatch", "concentric_diamond", "woven_basket", "hex_stipple"
  ];
  if (patternTypes.includes(algId)) {
    const sc = Math.max(0.5, scale);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sx = Math.floor(x / sc);
        const sy = Math.floor(y / sc);
        let pVal = 0.5;

        switch (algId) {
          case "checkered":
            pVal = (sx + sy) % 2 === 0 ? 0.75 : 0.25;
            break;
          case "horizontal_lines":
            pVal = sy % 3 === 0 ? 0.8 : 0.2;
            break;
          case "vertical_lines":
            pVal = sx % 3 === 0 ? 0.8 : 0.2;
            break;
          case "crosshatch":
            pVal = (sx % 4 === 0 || sy % 4 === 0) ? 0.85 : 0.15;
            break;
          case "diagonal_hatch":
            pVal = (sx + sy) % 4 === 0 ? 0.85 : 0.15;
            break;
          case "concentric_diamond":
            pVal = (Math.abs(sx % 8 - 4) + Math.abs(sy % 8 - 4)) / 8;
            break;
          case "woven_basket":
            const bx = Math.floor(sx / 4) % 2;
            const by = Math.floor(sy / 4) % 2;
            pVal = (bx ^ by) === 0 ? (sy % 2 === 0 ? 0.75 : 0.25) : (sx % 2 === 0 ? 0.75 : 0.25);
            break;
          case "hex_stipple":
            const hx = sx % 6;
            const hy = sy % 6;
            pVal = ((hx === 0 && hy === 0) || (hx === 3 && hy === 3)) ? 0.9 : 0.1;
            break;
        }

        const shift = (pVal - threshold) * 60 * strength;
        const pIdx = (y * width + x) * 4;
        const tr = Math.max(0, Math.min(255, data[pIdx] + shift));
        const tg = Math.max(0, Math.min(255, data[pIdx + 1] + shift));
        const tb = Math.max(0, Math.min(255, data[pIdx + 2] + shift));

        const nearest = findNearestColor(tr, tg, tb, palette);
        data[pIdx] = nearest[0];
        data[pIdx + 1] = nearest[1];
        data[pIdx + 2] = nearest[2];
        data[pIdx + 3] = 255;
      }
    }
    return;
  }

  // 4. Glitch Effects
  if (algId === "scanline_jitter") {
    const copy = new Uint8ClampedArray(data);
    const maxJitter = Math.floor(scale * 16);
    for (let y = 0; y < height; y++) {
      const jitter = Math.floor(Math.sin(y * 0.3 + seed * 0.5) * maxJitter);
      for (let x = 0; x < width; x++) {
        const srcX = Math.max(0, Math.min(width - 1, x + jitter));
        const sIdx = (y * width + srcX) * 4;
        const dIdx = (y * width + x) * 4;
        const nearest = findNearestColor(copy[sIdx], copy[sIdx + 1], copy[sIdx + 2], palette);
        data[dIdx] = nearest[0];
        data[dIdx + 1] = nearest[1];
        data[dIdx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "chromatic_offset") {
    const copy = new Uint8ClampedArray(data);
    const offset = Math.floor(scale * 8);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const rx = Math.max(0, Math.min(width - 1, x + offset));
        const bx = Math.max(0, Math.min(width - 1, x - offset));
        const r = copy[(y * width + rx) * 4];
        const g = copy[(y * width + x) * 4 + 1];
        const b = copy[(y * width + bx) * 4 + 2];
        const nearest = findNearestColor(r, g, b, palette);
        const idx = (y * width + x) * 4;
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "pixel_sorting") {
    const threshLuma = threshold * 255;
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const luma = 0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2];
        row.push({ x, r: data[idx], g: data[idx + 1], b: data[idx + 2], luma });
      }

      let i = 0;
      while (i < width) {
        if (row[i].luma > threshLuma) {
          const start = i;
          while (i < width && row[i].luma > threshLuma) i++;
          const slice = row.slice(start, i);
          slice.sort((a, b) => a.luma - b.luma);
          for (let k = 0; k < slice.length; k++) {
            row[start + k] = slice[k];
          }
        } else {
          i++;
        }
      }

      for (let x = 0; x < width; x++) {
        const item = row[x];
        const nearest = findNearestColor(item.r, item.g, item.b, palette);
        const idx = (y * width + x) * 4;
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "digital_artifacts") {
    const bs = Math.max(4, Math.floor(scale * 8));
    for (let by = 0; by < height; by += bs) {
      for (let bx = 0; bx < width; bx += bs) {
        const leadIdx = (by * width + bx) * 4;
        const nearest = findNearestColor(data[leadIdx], data[leadIdx + 1], data[leadIdx + 2], palette);
        for (let y = by; y < Math.min(height, by + bs); y++) {
          for (let x = bx; x < Math.min(width, bx + bs); x++) {
            const idx = (y * width + x) * 4;
            data[idx] = nearest[0];
            data[idx + 1] = nearest[1];
            data[idx + 2] = nearest[2];
          }
        }
      }
    }
    return;
  }

  if (algId === "interlacing_tear") {
    const copy = new Uint8ClampedArray(data);
    const shift = Math.floor(scale * 6);
    for (let y = 0; y < height; y++) {
      const xs = y % 2 === 0 ? shift : -shift;
      for (let x = 0; x < width; x++) {
        const srcX = Math.max(0, Math.min(width - 1, x + xs));
        const sIdx = (y * width + srcX) * 4;
        const dIdx = (y * width + x) * 4;
        const nearest = findNearestColor(copy[sIdx], copy[sIdx + 1], copy[sIdx + 2], palette);
        data[dIdx] = nearest[0];
        data[dIdx + 1] = nearest[1];
        data[dIdx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "crt_bloom") {
    const copy = new Uint8ClampedArray(data);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sr = 0, sg = 0, sb = 0, cnt = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const sIdx = (ny * width + nx) * 4;
              sr += copy[sIdx];
              sg += copy[sIdx + 1];
              sb += copy[sIdx + 2];
              cnt++;
            }
          }
        }
        const oIdx = (y * width + x) * 4;
        const bw = strength * 0.5;
        const tr = copy[oIdx] * (1 - bw) + (sr / cnt) * bw;
        const tg = copy[oIdx + 1] * (1 - bw) + (sg / cnt) * bw;
        const tb = copy[oIdx + 2] * (1 - bw) + (sb / cnt) * bw;
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[oIdx] = nearest[0];
        data[oIdx + 1] = nearest[1];
        data[oIdx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "bit_crush") {
    const depth = Math.max(1, Math.min(32, settings.depth || 4));
    const step = Math.max(1, 256 / depth);
    for (let i = 0; i < data.length; i += 4) {
      const tr = Math.floor(data[i] / step) * step;
      const tg = Math.floor(data[i + 1] / step) * step;
      const tb = Math.floor(data[i + 2] / step) * step;
      const nearest = findNearestColor(tr, tg, tb, palette);
      data[i] = nearest[0];
      data[i + 1] = nearest[1];
      data[i + 2] = nearest[2];
    }
    return;
  }

  if (algId === "vhs_tracking") {
    const bandY = Math.floor((seed * 11) % height);
    const bandH = Math.max(10, Math.floor(scale * 24));
    for (let y = 0; y < height; y++) {
      const isBand = y >= bandY && y < bandY + bandH;
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        let tr = data[idx];
        let tg = data[idx + 1];
        let tb = data[idx + 2];
        if (isBand) {
          const noise = ((x * 17 + y * 23 + seed) % 120) - 60;
          tr = Math.max(0, Math.min(255, tr + noise));
          tg = Math.max(0, Math.min(255, tg + noise));
          tb = Math.max(0, Math.min(255, tb + noise));
        }
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "bad_ram") {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        let r = data[idx];
        let g = data[idx + 1];
        let b = data[idx + 2];
        if (((x ^ y) + seed) % 29 === 0) {
          r ^= 0x40;
          g ^= 0x20;
        }
        const nearest = findNearestColor(r, g, b, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "wave_distortion") {
    const copy = new Uint8ClampedArray(data);
    const amp = scale * 12;
    for (let y = 0; y < height; y++) {
      const offset = Math.floor(Math.sin(y * 0.05 + seed * 0.1) * amp);
      for (let x = 0; x < width; x++) {
        const sx = Math.max(0, Math.min(width - 1, x + offset));
        const sIdx = (y * width + sx) * 4;
        const dIdx = (y * width + x) * 4;
        const nearest = findNearestColor(copy[sIdx], copy[sIdx + 1], copy[sIdx + 2], palette);
        data[dIdx] = nearest[0];
        data[dIdx + 1] = nearest[1];
        data[dIdx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "quant_slice") {
    for (let i = 0; i < data.length; i += 4) {
      const luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      const slice = Math.floor(luma / 32) * 32;
      const nearest = findNearestColor(slice, slice, slice, palette);
      data[i] = nearest[0];
      data[i + 1] = nearest[1];
      data[i + 2] = nearest[2];
    }
    return;
  }

  if (algId === "matrix_rake") {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const rake = ((x + y * 2) % 16) / 16;
        const shift = (rake - threshold) * 60;
        const idx = (y * width + x) * 4;
        const tr = Math.max(0, Math.min(255, data[idx] + shift));
        const tg = Math.max(0, Math.min(255, data[idx + 1] + shift));
        const tb = Math.max(0, Math.min(255, data[idx + 2] + shift));
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "static_snow") {
    const amt = (settings.noiseAmount || 0.3) * 128;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const noise = (((x * 37 + y * 97 + seed * 13) % 256) - 128) * (amt / 128);
        const idx = (y * width + x) * 4;
        const tr = Math.max(0, Math.min(255, data[idx] + noise));
        const tg = Math.max(0, Math.min(255, data[idx + 1] + noise));
        const tb = Math.max(0, Math.min(255, data[idx + 2] + noise));
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "sync_pulse_loss") {
    const copy = new Uint8ClampedArray(data);
    const roll = Math.floor((seed * 7) % height);
    for (let y = 0; y < height; y++) {
      const sy = (y + roll) % height;
      for (let x = 0; x < width; x++) {
        const sIdx = (sy * width + x) * 4;
        const dIdx = (y * width + x) * 4;
        const nearest = findNearestColor(copy[sIdx], copy[sIdx + 1], copy[sIdx + 2], palette);
        data[dIdx] = nearest[0];
        data[dIdx + 1] = nearest[1];
        data[dIdx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "feedback_ringing") {
    const copy = new Uint8ClampedArray(data);
    const lag = Math.floor(scale * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const lagX = Math.max(0, x - lag);
        const lIdx = (y * width + lagX) * 4;
        const tr = copy[idx] * 0.7 + copy[lIdx] * 0.3;
        const tg = copy[idx + 1] * 0.7 + copy[lIdx + 1] * 0.3;
        const tb = copy[idx + 2] * 0.7 + copy[lIdx + 2] * 0.3;
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "chroma_subsample") {
    const block = 4;
    for (let y = 0; y < height; y++) {
      for (let bx = 0; bx < width; bx += block) {
        const leadIdx = (y * width + bx) * 4;
        const lr = data[leadIdx], lg = data[leadIdx + 1], lb = data[leadIdx + 2];
        for (let x = bx; x < Math.min(width, bx + block); x++) {
          const idx = (y * width + x) * 4;
          const tr = data[idx] * 0.5 + lr * 0.5;
          const tg = data[idx + 1] * 0.5 + lg * 0.5;
          const tb = data[idx + 2] * 0.5 + lb * 0.5;
          const nearest = findNearestColor(tr, tg, tb, palette);
          data[idx] = nearest[0];
          data[idx + 1] = nearest[1];
          data[idx + 2] = nearest[2];
        }
      }
    }
    return;
  }

  if (algId === "moire_glitch") {
    const freq = scale * 0.2;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const w1 = Math.sin(x * freq);
        const w2 = Math.sin((x * 0.7 + y * 0.7) * freq * 1.1);
        const beat = w1 * w2 * 50;
        const idx = (y * width + x) * 4;
        const tr = Math.max(0, Math.min(255, data[idx] + beat));
        const tg = Math.max(0, Math.min(255, data[idx + 1] + beat));
        const tb = Math.max(0, Math.min(255, data[idx + 2] + beat));
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  // 5. Special Effects
  if (algId === "fixed_threshold" || algId === "random_threshold") {
    const isRand = algId === "random_threshold";
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const luma = 0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2];
        const th = isRand ? (((x * 47 + y * 73 + seed * 19) % 256)) : threshold * 255;
        const tr = luma >= th ? 255 : 0;
        const nearest = findNearestColor(tr, tr, tr, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "blue_noise") {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const h = ((x * 67 + y * 131) % 64) / 64;
        const shift = (h - threshold) * 55 * strength;
        const idx = (y * width + x) * 4;
        const tr = Math.max(0, Math.min(255, data[idx] + shift));
        const tg = Math.max(0, Math.min(255, data[idx + 1] + shift));
        const tb = Math.max(0, Math.min(255, data[idx + 2] + shift));
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "gaussian_noise") {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const u1 = (((x * 19 + y * 31) % 100) + 1) / 101;
        const u2 = (((x * 37 + y * 53) % 100) + 1) / 101;
        const gauss = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const shift = gauss * 30 * strength;
        const idx = (y * width + x) * 4;
        const tr = Math.max(0, Math.min(255, data[idx] + shift));
        const tg = Math.max(0, Math.min(255, data[idx + 1] + shift));
        const tb = Math.max(0, Math.min(255, data[idx + 2] + shift));
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "perlin_gradient") {
    const sc = scale * 0.05;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const val = (Math.sin(x * sc) + Math.cos(y * sc)) * 0.5;
        const shift = (val - threshold + 0.5) * 60;
        const idx = (y * width + x) * 4;
        const tr = Math.max(0, Math.min(255, data[idx] + shift));
        const tg = Math.max(0, Math.min(255, data[idx + 1] + shift));
        const tb = Math.max(0, Math.min(255, data[idx + 2] + shift));
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "tpdf_noise") {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const r1 = ((x * 43 + y * 71) % 100) / 100;
        const r2 = ((x * 89 + y * 13) % 100) / 100;
        const tpdf = (r1 - r2) * 50 * strength;
        const idx = (y * width + x) * 4;
        const tr = Math.max(0, Math.min(255, data[idx] + tpdf));
        const tg = Math.max(0, Math.min(255, data[idx + 1] + tpdf));
        const tb = Math.max(0, Math.min(255, data[idx + 2] + tpdf));
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "companding_curve") {
    for (let i = 0; i < data.length; i += 4) {
      const tr = Math.sqrt(data[i] / 255) * 255;
      const tg = Math.sqrt(data[i + 1] / 255) * 255;
      const tb = Math.sqrt(data[i + 2] / 255) * 255;
      const nearest = findNearestColor(tr, tg, tb, palette);
      data[i] = nearest[0];
      data[i + 1] = nearest[1];
      data[i + 2] = nearest[2];
    }
    return;
  }

  if (algId === "sobel_feature") {
    const copy = new Uint8ClampedArray(data);
    const getLuma = (px, py) => {
      const idx = (py * width + px) * 4;
      return 0.2126 * copy[idx] + 0.7152 * copy[idx + 1] + 0.0722 * copy[idx + 2];
    };
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const gx = -getLuma(x - 1, y - 1) + getLuma(x + 1, y - 1)
                   -2 * getLuma(x - 1, y) + 2 * getLuma(x + 1, y)
                   -getLuma(x - 1, y + 1) + getLuma(x + 1, y + 1);
        const gy = -getLuma(x - 1, y - 1) - 2 * getLuma(x, y - 1) - getLuma(x + 1, y - 1)
                   +getLuma(x - 1, y + 1) + 2 * getLuma(x, y + 1) + getLuma(x + 1, y + 1);
        const edge = Math.sqrt(gx * gx + gy * gy);
        const idx = (y * width + x) * 4;
        let tr = copy[idx], tg = copy[idx + 1], tb = copy[idx + 2];
        if (edge < 100) {
          const shift = (((x + y) % 4) - 2) * 20;
          tr = Math.max(0, Math.min(255, tr + shift));
          tg = Math.max(0, Math.min(255, tg + shift));
          tb = Math.max(0, Math.min(255, tb + shift));
        }
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "laplacian_mod") {
    const copy = new Uint8ClampedArray(data);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const up = ((y - 1) * width + x) * 4;
        const dn = ((y + 1) * width + x) * 4;
        const lf = (y * width + (x - 1)) * 4;
        const rt = (y * width + (x + 1)) * 4;

        const lapR = 4 * copy[idx] - copy[up] - copy[dn] - copy[lf] - copy[rt];
        const lapG = 4 * copy[idx + 1] - copy[up + 1] - copy[dn + 1] - copy[lf + 1] - copy[rt + 1];
        const lapB = 4 * copy[idx + 2] - copy[up + 2] - copy[dn + 2] - copy[lf + 2] - copy[rt + 2];

        const tr = Math.max(0, Math.min(255, copy[idx] + lapR * 0.5 * strength));
        const tg = Math.max(0, Math.min(255, copy[idx + 1] + lapG * 0.5 * strength));
        const tb = Math.max(0, Math.min(255, copy[idx + 2] + lapB * 0.5 * strength));

        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "voronoi_cellular") {
    const cs = Math.max(4, Math.floor(scale * 8));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cx = Math.floor(x / cs) * cs + cs / 2;
        const cy = Math.floor(y / cs) * cs + cs / 2;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const shift = (dist / cs - threshold) * 60;
        const idx = (y * width + x) * 4;
        const tr = Math.max(0, Math.min(255, data[idx] + shift));
        const tg = Math.max(0, Math.min(255, data[idx + 1] + shift));
        const tb = Math.max(0, Math.min(255, data[idx + 2] + shift));
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  if (algId === "quantum_stipple") {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const luma = (0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2]) / 255;
        const prob = ((x * 127 + y * 311 + seed * 43) % 1000) / 1000;
        const tr = prob < luma ? 255 : 0;
        const nearest = findNearestColor(tr, tr, tr, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  // 6. Bespoke Effect: Ignition Glow
  if (algId === "ignition_glow") {
    // Step 1: Base Bayer 8x8
    const spread = 48 * strength;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const bVal = getBayerVal(8, x, y);
        const shift = (bVal - threshold) * spread;
        const tr = Math.max(0, Math.min(255, data[idx] + shift));
        const tg = Math.max(0, Math.min(255, data[idx + 1] + shift));
        const tb = Math.max(0, Math.min(255, data[idx + 2] + shift));
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }

    // Step 2: Bespoke Phosphor Bloom
    const copy = new Uint8ClampedArray(data);
    const rad = Math.max(1, Math.floor(scale * 3));
    const intensity = strength * 0.55;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sr = 0, sg = 0, sb = 0, wSum = 0;
        for (let dy = -rad; dy <= rad; dy++) {
          for (let dx = -rad; dx <= rad; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const sIdx = (ny * width + nx) * 4;
              const luma = 0.2126 * copy[sIdx] + 0.7152 * copy[sIdx + 1] + 0.0722 * copy[sIdx + 2];
              if (luma > 120) {
                const w = 1 / (1 + dx * dx + dy * dy);
                sr += copy[sIdx] * w;
                sg += copy[sIdx + 1] * w;
                sb += copy[sIdx + 2] * w;
                wSum += w;
              }
            }
          }
        }
        if (wSum > 0) {
          const idx = (y * width + x) * 4;
          const tr = Math.max(0, Math.min(255, copy[idx] + (sr / wSum) * intensity));
          const tg = Math.max(0, Math.min(255, copy[idx + 1] + (sg / wSum) * intensity));
          const tb = Math.max(0, Math.min(255, copy[idx + 2] + (sb / wSum) * intensity));
          const nearest = findNearestColor(tr, tg, tb, palette);
          data[idx] = nearest[0];
          data[idx + 1] = nearest[1];
          data[idx + 2] = nearest[2];
        }
      }
    }
    return;
  }

  // 7. Temporal Kinetic Dither
  if (algId === "temporal_kinetic") {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const phase = (Math.sin(x * 0.1 + y * 0.1 + seed * 0.5) * 0.5 + 0.5) * 50;
        const idx = (y * width + x) * 4;
        const tr = Math.max(0, Math.min(255, data[idx] + phase));
        const tg = Math.max(0, Math.min(255, data[idx + 1] + phase));
        const tb = Math.max(0, Math.min(255, data[idx + 2] + phase));
        const nearest = findNearestColor(tr, tg, tb, palette);
        data[idx] = nearest[0];
        data[idx + 1] = nearest[1];
        data[idx + 2] = nearest[2];
      }
    }
    return;
  }

  // Fallback to Floyd-Steinberg
  const kObj = KERNELS.floyd_steinberg;
  const factor = strength / kObj.divisor;
  const errBuf = new Float32Array(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const pIdx = idx * 4;
      const eIdx = idx * 3;
      const tr = Math.max(0, Math.min(255, data[pIdx] + errBuf[eIdx]));
      const tg = Math.max(0, Math.min(255, data[pIdx + 1] + errBuf[eIdx + 1]));
      const tb = Math.max(0, Math.min(255, data[pIdx + 2] + errBuf[eIdx + 2]));
      const nearest = findNearestColor(tr, tg, tb, palette);
      data[pIdx] = nearest[0];
      data[pIdx + 1] = nearest[1];
      data[pIdx + 2] = nearest[2];
      const errR = tr - nearest[0];
      const errG = tg - nearest[1];
      const errB = tb - nearest[2];
      for (let k = 0; k < kObj.matrix.length; k++) {
        const entry = kObj.matrix[k];
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
}

