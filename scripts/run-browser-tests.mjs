import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir, release } from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { firefox } from '@playwright/test'

// macOS 27 protects the app-data folder of installed browsers. Use a distinct
// name for the downloaded test Firefox, without changing any user browser.
// https://github.com/microsoft/playwright/issues/42768
const environment = { ...process.env }
let temporaryDirectory
let applicationFile

try {
  if (process.platform === 'darwin' && Number(release().split('.')[0]) >= 26 && !environment.CAFE_FIREFOX_EXECUTABLE) {
    const executable = firefox.executablePath()
    const resources = path.resolve(path.dirname(executable), '../Resources')
    const configuration = await readFile(path.join(resources, 'application.ini'), 'utf8')
    temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'brandtschatz-browser-tests-'))
    applicationFile = path.join(resources, 'browser', `${path.basename(temporaryDirectory)}.ini`)
    await writeFile(applicationFile, configuration
      .replace(/^Vendor=.*$/m, 'Vendor=BrandtschatzQA')
      .replace(/^Name=.*$/m, 'Name=BrandtschatzPlaywright'))
    const quote = value => `'${value.replaceAll("'", "'\\''")}'`
    const wrapper = path.join(temporaryDirectory, 'firefox')
    await writeFile(wrapper, `#!/bin/sh\nexec ${quote(executable)} -app ${quote(applicationFile)} "$@"\n`, { mode: 0o700 })
    environment.CAFE_FIREFOX_EXECUTABLE = wrapper
  }

  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)], {
      env: environment,
      stdio: 'inherit',
    })
    child.on('error', reject)
    child.on('exit', code => resolve(code ?? 1))
  })
  process.exitCode = exitCode
} finally {
  if (applicationFile) await rm(applicationFile, { force: true })
  if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true })
}
