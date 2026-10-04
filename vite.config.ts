import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, stat } from 'node:fs/promises'
import { resolve, sep } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'static-404-preview',
    configurePreviewServer(server) {
      const output = resolve(server.config.root, server.config.build.outDir)
      server.middlewares.use(async (request, response, next) => {
        if (!request.headers.accept?.includes('text/html')) return next()
        let pathname: string
        try {
          pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
        } catch {
          return next()
        }
        const file = resolve(output, `.${pathname === '/' ? '/index.html' : pathname}`)
        if (!file.startsWith(`${output}${sep}`)) return next()
        try {
          if ((await stat(file)).isFile()) return next()
        } catch { /* Serve the same error page as Apache. */ }
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.end(await readFile(resolve(output, '404.html')))
      })
    },
  }],
  appType: 'mpa',
  build: { manifest: true, assetsInlineLimit: 0 },
})
