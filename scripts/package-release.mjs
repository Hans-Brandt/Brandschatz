import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { copyFile, mkdir, readFile, readdir, stat, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = path.join(root, 'dist')
const releaseDirectory = path.join(root, 'release')

for (const filename of ['index.html', '.htaccess', '404.html', 'datenschutz.html', 'impressum.html',
  'fonts/fonts.css', 'fonts/manrope-latin.woff2', 'fonts/fraunces-latin.woff2', 'social-preview.jpg', 'sitemap.xml', 'robots.txt']) {
  if (!(await stat(path.join(output, filename))).isFile()) throw new Error(`Upload-Datei fehlt: ${filename}`)
}
const index = await readFile(path.join(output, 'index.html'), 'utf8')
if (!index.includes('id="main-content"') || index.includes('/src/')) throw new Error('Startseite wurde nicht korrekt gebaut')

async function filesIn(directory, prefix = '') {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) result.push(...await filesIn(path.join(directory, entry.name), filename))
    else if (entry.isFile()) result.push(filename)
    else throw new Error(`Unerwarteter Dateityp: ${filename}`)
  }
  return result.sort()
}

const files = await filesIn(output)
if (files.some(filename => /(^|\/)(\.env|node_modules|src|docs|\.git)(\/|$)/.test(filename))) {
  throw new Error('Upload enthält unerwartete Projektdateien')
}
await mkdir(releaseDirectory, { recursive: true })
const zip = path.join(releaseDirectory, 'brandtschatz-upload.zip')
await rm(zip, { force: true })
execFileSync('zip', ['-q', '-X', '-r', zip, '.'], { cwd: output })
const checksums = await Promise.all(files.map(async filename => {
  const hash = createHash('sha256').update(await readFile(path.join(output, filename))).digest('hex')
  return `${hash}  ${filename}`
}))
await writeFile(path.join(releaseDirectory, 'dateipruefung.sha256'), `${checksums.join('\n')}\n`)
await copyFile(path.join(root, 'docs/veroeffentlichung.md'), path.join(releaseDirectory, 'UPLOAD-ANLEITUNG.md'))
await copyFile(path.join(root, 'docs/rechtliches-offen.md'), path.join(releaseDirectory, 'RECHTLICHES-NOCH-PRUEFEN.md'))
console.log(`Upload-Paket: ${zip}\n${files.length} Dateien, ${((await stat(zip)).size / 1024 / 1024).toFixed(1)} MB. Rechtliche Prüfpunkte stehen daneben in RECHTLICHES-NOCH-PRUEFEN.md.`)
