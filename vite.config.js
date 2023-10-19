import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  base:'/',
  server:{
    host: 'localhost',
    port: 3307,
    proxy:{
      "/api":{
        target:'http://localhost:8887',
      }
    }
  },
  plugins: [vue()],
})
