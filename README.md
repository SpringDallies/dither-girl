# ✨ Dither Girl

> An all-in-one retro image and video dithering studio running locally in your browser on port 8000.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Port](https://img.shields.io/badge/port-8000-green.svg)
![Platform](https://img.shields.io/badge/platform-web%20%7C%20node-orange.svg)

---

## 🎨 Overview

**Dither Girl** is an authentic retro dithering and image-processing studio. It provides an extensive collection of dithering algorithms, screen-angle halftone processing, color quantization, and palette customization with zero external dependencies needed to run.

---

## 🚀 Quick Start

### 1. Start the Local Server

```bash
# Clone the repository
git clone https://github.com/SpringDallies/dither-girl.git
cd dither-girl

# Start server on port 8000
npm start
```

### 2. Open in Browser

Open [http://localhost:8000](http://localhost:8000) in your web browser.

---

## ⚡ Features

- **70+ Dithering Algorithms**:
  - **Error Diffusion**: Floyd–Steinberg, Atkinson, Jarvis–Judice–Ninke, Stucki, Burkes, Sierra 3, Sierra 2, Sierra Lite, Stevenson–Arce, Ostromukhov, and more.
  - **Ordered Dithering**: Bayer 2×2, 4×4, 8×8, 16×16, clustered dot screens.
  - **Pattern & Glitch Dithers**: Checkered, linear gratings, crosshatch, diagonal hatch, stochastic stipple, and glitch modulations.
- **Halftone Screening Engine**: Multi-angle CMYK and Grayscale continuous-tone dot rasterizer.
- **Custom Color Palettes**: Built-in retro palettes (GameBoy, CGA, EGA, Cyberpunk, Monochrome, Apple II, etc.) and custom palette creation.
- **Real-Time Live Canvas**: Interactive preview with instant feedback on parameter changes.
- **High-Resolution Export**: Export to PNG, JPEG, WebP, or copy directly to clipboard.
- **Self-Contained Web Architecture**: Runs locally on port 8000 with client-side accelerated processing.

---

## 🛠 Project Structure

```
dither-girl/
├── dist/
│   ├── renderer/
│   │   ├── assets/              # React bundle, CSS styles, web fonts
│   │   ├── browser-shim.js      # In-browser dithering engine & electron API shim
│   │   ├── dither-metadata.json # Complete algorithm catalog
│   │   └── index.html           # Main studio web interface
│   ├── main.js                  # Electron entrypoint (optional desktop mode)
│   └── preload.js               # Desktop preload script
├── server.js                    # High-performance local web server (port 8000)
├── package.json                 # Project configuration & start scripts
└── README.md                    # Project documentation
```

---

## 💻 Development & Custom Port

To run on a custom port instead of `8000`:

```bash
PORT=8080 npm start
```

---

## 📜 License

MIT License. Designed & developed with love for retro aesthetics.
