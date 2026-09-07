import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: './data/prompts',
        replacement: fileURLToPath(new URL('./src/data/prompts-v2.js', import.meta.url)),
      },
    ],
  },
})
