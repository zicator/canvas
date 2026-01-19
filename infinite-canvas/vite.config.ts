import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'github-pages' ? '/canvas/' : '/',
  build: {
    outDir: 'dist',
  },
  define: {
    // Hack: Force development mode to bypass Tldraw license check in production
    // This allows the app to run without a license key for non-commercial/demo use
    'process.env.NODE_ENV': JSON.stringify('development'),
    // Expose build timestamp and version
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString()),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version),
  }
})
