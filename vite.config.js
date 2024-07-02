import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  // process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const proxyConfig =
    mode === 'development'
      ? {
          server: {
            proxy: {
              '/api/v1': {
                target: 'http://localhost:3000',
                changeOrigin: true
              }
            }
          }
        }
      : {}

  return defineConfig({
    // To access env vars here use process.env.TEST_VAR
    ...proxyConfig,
    plugins: [react()]
  })
}
