import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const server = await createServer({
  root: projectRoot,
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
})

try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const manifest = JSON.parse(await readFile(`${projectRoot}/dist/.vite/manifest.json`, 'utf8'))
  let markup = renderToString(createElement(App))
  for (const [source, asset] of Object.entries(manifest)) {
    markup = markup.replaceAll(`/${source}`, `/${asset.file}`)
  }
  if (markup.includes('/src/')) throw new Error('Prerendered markup contains unbuilt source paths')
  const htmlPath = `${projectRoot}/dist/index.html`
  const html = await readFile(htmlPath, 'utf8')
  if (!html.includes('<div id="root"></div>')) throw new Error('Root placeholder missing')
  await writeFile(htmlPath, html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`))
  await rm(`${projectRoot}/dist/.vite`, { recursive: true })
  console.log('Startseite als statisches HTML erzeugt; ohne JavaScript lesbar.')
} finally {
  await server.close()
}
