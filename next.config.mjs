import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Prevents @react-pdf/renderer's native canvas dep from crashing the bundle.
  // canvas is a server-only Node.js native module; we stub it out for the browser.
  webpack: (config) => {
    config.resolve.alias.canvas = path.resolve('./lib/canvas-stub.js');
    return config;
  },
}

export default nextConfig
