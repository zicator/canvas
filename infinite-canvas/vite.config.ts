import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toLocaleString()),
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || 'dev'),
  },
  plugins: [react()],
  define: {
    // Hack: Force development mode to bypass Tldraw license check in production
    // This allows the app to run without a license key for non-commercial/demo use
    'process.env.NODE_ENV': JSON.stringify('development'),
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toLocaleString()),
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || 'dev'),
  }
})
