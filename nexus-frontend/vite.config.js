// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import fs from 'fs'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     https: {
//       key: fs.readFileSync(path.resolve(__dirname, 'certs/127.0.0.1-key.pem')),
//       cert: fs.readFileSync(path.resolve(__dirname, 'certs/127.0.0.1.pem')),
//     },
//     host: '127.0.0.1',
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'https://nexus-test-api-8bf398f16fc4.herokuapp.com',
//         changeOrigin: true,
//         secure: false, // Ignore self-signed SSL certs
//       },
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://nexus-test-api-8bf398f16fc4.herokuapp.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
