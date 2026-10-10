// DitherForge Palette Engine
// Clean-Room Implementation of Palette Extractions, Quantizers & Built-in Schemes

export const BUILTIN_PALETTES = [
  {
    id: "monochrome_1bit",
    name: "Monochrome 1-Bit",
    category: "Monochrome",
    colors: [
      [0, 0, 0, 255],
      [255, 255, 255, 255]
    ]
  },
  {
    id: "gameboy_emerald",
    name: "GameBoy Emerald",
    category: "Retro Handheld",
    colors: [
      [15, 56, 15, 255],
      [48, 98, 48, 255],
      [139, 172, 15, 255],
      [155, 188, 15, 255]
    ]
  },
  {
    id: "phosphor_amber",
    name: "Phosphor Amber CRT",
    category: "Terminal",
    colors: [
      [10, 5, 0, 255],
      [80, 40, 0, 255],
      [180, 100, 10, 255],
      [255, 176, 0, 255]
    ]
  },
  {
    id: "cyberpunk_2084",
    name: "Cyberpunk 2084",
    category: "Sci-Fi",
    colors: [
      [11, 13, 19, 255],
      [255, 0, 128, 255],
      [0, 240, 255, 255],
      [255, 230, 0, 255],
      [112, 0, 255, 255]
    ]
  },
  {
    id: "cga_mode_1",
    name: "CGA Mode 1 (Cyan/Magenta)",
    category: "Vintage Computing",
    colors: [
      [0, 0, 0, 255],
      [85, 255, 255, 255],
      [255, 85, 255, 255],
      [255, 255, 255, 255]
    ]
  },
  {
    id: "c64_heritage",
    name: "C64 Heritage",
    category: "Vintage Computing",
    colors: [
      [0, 0, 0, 255],
      [255, 255, 255, 255],
      [136, 0, 0, 255],
      [170, 255, 238, 255],
      [204, 68, 204, 255],
      [0, 204, 85, 255],
      [0, 0, 170, 255],
      [238, 238, 119, 255],
      [221, 136, 85, 255],
      [102, 68, 0, 255],
      [255, 119, 119, 255],
      [51, 51, 51, 255],
      [119, 119, 119, 255],
      [170, 255, 102, 255],
      [0, 136, 255, 255],
      [187, 187, 187, 255]
    ]
  },
  {
    id: "pico_fantasy",
    name: "PICO Fantasy 16",
    category: "Fantasy Console",
    colors: [
      [0, 0, 0, 255],
      [29, 43, 83, 255],
      [126, 37, 83, 255],
      [0, 135, 81, 255],
      [171, 82, 54, 255],
      [95, 87, 79, 255],
      [194, 195, 199, 255],
      [255, 241, 232, 255],
      [255, 0, 77, 255],
      [255, 163, 0, 255],
      [255, 236, 39, 255],
      [0, 228, 54, 255],
      [41, 173, 255, 255],
      [131, 118, 156, 255],
      [255, 119, 168, 255],
      [255, 204, 170, 255]
    ]
  },
  {
    id: "nordic_frost",
    name: "Nordic Frost",
    category: "Atmospheric",
    colors: [
      [14, 21, 37, 255],
      [43, 76, 126, 255],
      [100, 149, 196, 255],
      [195, 222, 243, 255],
      [245, 250, 255, 255]
    ]
  },
  {
    id: "vaporwave_neon",
    name: "Vaporwave Neon",
    category: "Aesthetic",
    colors: [
      [36, 20, 60, 255],
      [140, 48, 130, 255],
      [245, 90, 155, 255],
      [78, 205, 196, 255],
      [255, 230, 109, 255]
    ]
  },
  {
    id: "solar_flare",
    name: "Solar Flare",
    category: "Atmospheric",
    colors: [
      [20, 10, 15, 255],
      [120, 20, 30, 255],
      [220, 70, 20, 255],
      [250, 160, 30, 255],
      [255, 240, 120, 255]
    ]
  },
  {
    id: "ega_royal_16",
    name: "EGA Royal 16",
    category: "Vintage Computing",
    colors: [
      [0, 0, 0, 255],
      [0, 0, 170, 255],
      [0, 170, 0, 255],
      [0, 170, 170, 255],
      [170, 0, 0, 255],
      [170, 0, 170, 255],
      [170, 85, 0, 255],
      [170, 170, 170, 255],
      [85, 85, 85, 255],
      [85, 85, 255, 255],
      [85, 255, 85, 255],
      [85, 255, 255, 255],
      [255, 85, 85, 255],
      [255, 85, 255, 255],
      [255, 255, 85, 255],
      [255, 255, 255, 255]
    ]
  },
  {
    id: "sepia_daguerreotype",
    name: "Sepia Daguerreotype",
    category: "Historical",
    colors: [
      [28, 20, 14, 255],
      [78, 54, 38, 255],
      [142, 107, 76, 255],
      [206, 172, 136, 255],
      [248, 232, 212, 255]
    ]
  },
  {
    id: "sinclair_spectrum",
    name: "Sinclair Spectrum",
    category: "Vintage Computing",
    colors: [
      [0, 0, 0, 255],
      [0, 0, 215, 255],
      [215, 0, 0, 255],
      [215, 0, 215, 255],
      [0, 215, 0, 255],
      [0, 215, 215, 255],
      [215, 215, 0, 255],
      [215, 215, 215, 255]
    ]
  },
  {
    id: "mac_classic_1984",
    name: "Macintosh 1984 Classic",
    category: "Historical",
    colors: [
      [17, 17, 17, 255],
      [238, 238, 238, 255]
    ]
  }
];

export function hexToRgba(hex) {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map(ch => ch + ch).join("");
  }
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
}

export function rgbaToHex(r, g, b) {
  const toHex = v => Math.round(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Rec. 709 Luminance-Weighted Euclidean Color Metric
export function colorDistSq(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return 0.2126 * dr * dr + 0.7152 * dg * dg + 0.0722 * db * db;
}

export function findNearestColor(r, g, b, palette) {
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

// Median Cut Palette Extraction
export function extractPaletteMedianCut(imageData, targetCount = 8) {
  const data = imageData.data;
  const pixels = [];
  const step = Math.max(1, Math.floor((data.length / 4) / 4000)); // Sample ~4000 pixels
  for (let i = 0; i < data.length; i += 4 * step) {
    if (data[i + 3] > 64) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  if (pixels.length === 0) {
    return [[0, 0, 0, 255], [255, 255, 255, 255]];
  }

  let boxes = [pixels];

  while (boxes.length < targetCount) {
    let bestIdx = -1;
    let maxRange = -1;
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      if (b.length <= 1) continue;
      let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
      for (let j = 0; j < b.length; j++) {
        const p = b[j];
        if (p[0] < minR) minR = p[0];
        if (p[0] > maxR) maxR = p[0];
        if (p[1] < minG) minG = p[1];
        if (p[1] > maxG) maxG = p[1];
        if (p[2] < minB) minB = p[2];
        if (p[2] > maxB) maxB = p[2];
      }
      const range = Math.max(maxR - minR, maxG - minG, maxB - minB);
      if (range > maxRange) {
        maxRange = range;
        bestIdx = i;
      }
    }
    if (bestIdx === -1 || maxRange <= 0) break;

    const b = boxes.splice(bestIdx, 1)[0];
    let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
    for (let j = 0; j < b.length; j++) {
      const p = b[j];
      if (p[0] < minR) minR = p[0];
      if (p[0] > maxR) maxR = p[0];
      if (p[1] < minG) minG = p[1];
      if (p[1] > maxG) maxG = p[1];
      if (p[2] < minB) minB = p[2];
      if (p[2] > maxB) maxB = p[2];
    }
    const rRange = maxR - minR;
    const gRange = maxG - minG;
    const bRange = maxB - minB;
    const channel = (rRange >= gRange && rRange >= bRange) ? 0 : (gRange >= rRange && gRange >= bRange ? 1 : 2);

    b.sort((p1, p2) => p1[channel] - p2[channel]);
    const median = Math.floor(b.length / 2);
    const b2 = b.splice(median);
    boxes.push(b);
    boxes.push(b2);
  }

  return boxes.map(b => {
    if (b.length === 0) return [0, 0, 0, 255];
    let sr = 0, sg = 0, sb = 0;
    for (let j = 0; j < b.length; j++) {
      sr += b[j][0];
      sg += b[j][1];
      sb += b[j][2];
    }
    return [
      Math.round(sr / b.length),
      Math.round(sg / b.length),
      Math.round(sb / b.length),
      255
    ];
  });
}

// K-Means Clustering Extraction
export function extractPaletteKMeans(imageData, k = 8, iterations = 8) {
  const data = imageData.data;
  const pixels = [];
  const step = Math.max(1, Math.floor((data.length / 4) / 3000));
  for (let i = 0; i < data.length; i += 4 * step) {
    if (data[i + 3] > 64) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  if (pixels.length === 0) return [[0, 0, 0, 255], [255, 255, 255, 255]];

  // Initialize centroids
  let centroids = [];
  for (let i = 0; i < k; i++) {
    const idx = Math.floor(Math.random() * pixels.length);
    centroids.push([...pixels[idx]]);
  }

  for (let iter = 0; iter < iterations; iter++) {
    const clusters = Array.from({ length: k }, () => []);
    for (let i = 0; i < pixels.length; i++) {
      const p = pixels[i];
      let bestDist = Infinity;
      let bestC = 0;
      for (let c = 0; c < k; c++) {
        const d = colorDistSq(p[0], p[1], p[2], centroids[c][0], centroids[c][1], centroids[c][2]);
        if (d < bestDist) {
          bestDist = d;
          bestC = c;
        }
      }
      clusters[bestC].push(p);
    }

    for (let c = 0; c < k; c++) {
      if (clusters[c].length > 0) {
        let sr = 0, sg = 0, sb = 0;
        for (let j = 0; j < clusters[c].length; j++) {
          sr += clusters[c][j][0];
          sg += clusters[c][j][1];
          sb += clusters[c][j][2];
        }
        centroids[c] = [
          Math.round(sr / clusters[c].length),
          Math.round(sg / clusters[c].length),
          Math.round(sb / clusters[c].length)
        ];
      }
    }
  }

  return centroids.map(c => [c[0], c[1], c[2], 255]);
}

