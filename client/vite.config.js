import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':{
        target: 'http://localhost:3000',
        secure:false,
      }
    } 
  },
  plugins: [preact()],
})
