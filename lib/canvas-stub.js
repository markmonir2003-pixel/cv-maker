// Browser stub for the Node.js `canvas` native addon.
// @react-pdf/renderer's browser build doesn't need canvas,
// but some bundlers may still try to resolve it.
module.exports = {
  createCanvas: (w, h) => ({
    width: w,
    height: h,
    getContext: () => ({
      drawImage: () => {},
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: new Uint8Array(0), width: 0, height: 0 }),
      putImageData: () => {},
      setTransform: () => {},
      save: () => {},
      restore: () => {},
    }),
    toDataURL: () => '',
    toBuffer: () => new Uint8Array(0),
  }),
  loadImage: async () => ({
    width: 0,
    height: 0,
  }),
  Image: class {
    constructor() { this.onload = null; this.onerror = null; }
    set src(val) { setTimeout(() => this.onload?.(), 0); }
  },
  registerFont: () => {},
};
