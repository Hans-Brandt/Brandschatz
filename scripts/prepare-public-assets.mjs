import { copyFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
await mkdir(`${projectRoot}/public/fonts`, { recursive: true })

for (const [font, filename] of [
  ['manrope', 'manrope-latin-wght-normal.woff2'],
  ['fraunces', 'fraunces-latin-standard-normal.woff2'],
]) {
  const source = `${projectRoot}/node_modules/@fontsource-variable/${font}`
  await copyFile(`${source}/files/${filename}`, `${projectRoot}/public/fonts/${font}-latin.woff2`)
  await copyFile(`${source}/LICENSE`, `${projectRoot}/public/fonts/${font}-LICENSE.txt`)
}

await sharp(`${projectRoot}/public/favicon.svg`)
  .resize(180, 180)
  .png()
  .toFile(`${projectRoot}/public/apple-touch-icon.png`)

await sharp(`${projectRoot}/src/assets/cafe/ankersee-luftaufnahme.jpeg`)
  .rotate()
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(`${projectRoot}/public/social-preview.jpg`)
