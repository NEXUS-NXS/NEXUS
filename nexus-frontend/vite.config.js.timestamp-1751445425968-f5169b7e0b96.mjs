// vite.config.js
import { defineConfig } from "file:///D:/Nexus-dup/NEXUS/nexus-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Nexus-dup/NEXUS/nexus-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs";
import path from "path";
var __vite_injected_original_dirname = "D:\\Nexus-dup\\NEXUS\\nexus-frontend";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__vite_injected_original_dirname, "certs/127.0.0.1-key.pem")),
      cert: fs.readFileSync(path.resolve(__vite_injected_original_dirname, "certs/127.0.0.1.pem"))
    },
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": {
        target: "https://nexus-test-api-8bf398f16fc4.herokuapp.com",
        changeOrigin: true,
        secure: false
        // Ignore self-signed SSL certs
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxOZXh1cy1kdXBcXFxcTkVYVVNcXFxcbmV4dXMtZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXE5leHVzLWR1cFxcXFxORVhVU1xcXFxuZXh1cy1mcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovTmV4dXMtZHVwL05FWFVTL25leHVzLWZyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIGh0dHBzOiB7XHJcbiAgICAgIGtleTogZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdjZXJ0cy8xMjcuMC4wLjEta2V5LnBlbScpKSxcclxuICAgICAgY2VydDogZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdjZXJ0cy8xMjcuMC4wLjEucGVtJykpLFxyXG4gICAgfSxcclxuICAgIGhvc3Q6ICcxMjcuMC4wLjEnLFxyXG4gICAgcG9ydDogNTE3MyxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vMTI3LjAuMC4xOjgwMDAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBzZWN1cmU6IGZhbHNlLCAvLyBJZ25vcmUgc2VsZi1zaWduZWQgU1NMIGNlcnRzXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UixTQUFTLG9CQUFvQjtBQUMxVCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxLQUFLLEdBQUcsYUFBYSxLQUFLLFFBQVEsa0NBQVcseUJBQXlCLENBQUM7QUFBQSxNQUN2RSxNQUFNLEdBQUcsYUFBYSxLQUFLLFFBQVEsa0NBQVcscUJBQXFCLENBQUM7QUFBQSxJQUN0RTtBQUFBLElBQ0EsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
