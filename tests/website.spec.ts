import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'

test('Karte sendet erst nach Freigabe Daten und lässt sich widerrufen', async ({ page, context }) => {
  const thirdPartyRequests: string[] = []
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4177') thirdPartyRequests.push(request.url())
  })
  const tile = await readFile('public/apple-touch-icon.png')
  await page.route('https://tile.openstreetmap.org/**', route => route.fulfill({ contentType: 'image/png', body: tile }))
  await page.goto('/')
  const loadButton = page.getByRole('button', { name: 'Karte laden', exact: true })
  await loadButton.scrollIntoViewIfNeeded()
  await page.waitForLoadState('networkidle')
  expect(thirdPartyRequests).toEqual([])
  await loadButton.click()
  await expect.poll(() => thirdPartyRequests.length).toBeGreaterThan(0)
  expect(thirdPartyRequests.every(url => new URL(url).hostname === 'tile.openstreetmap.org')).toBe(true)
  await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible()
  await page.locator('.leaflet-marker-icon').click()
  await expect(page.locator('.leaflet-popup')).toContainText('Hauptstraße 5, Anker')
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(results.violations).toEqual([])
  await page.getByRole('button', { name: 'Karte ausblenden und Freigabe widerrufen' }).click()
  await expect(page.locator('.leaflet-container')).toHaveCount(0)
  await expect(loadButton).toBeFocused()
  expect(await context.cookies()).toEqual([])
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 })
  thirdPartyRequests.length = 0
  await page.reload()
  await loadButton.scrollIntoViewIfNeeded()
  await page.waitForLoadState('networkidle')
  await expect(loadButton).toBeVisible()
  expect(thirdPartyRequests).toEqual([])
})

test('Kartenfehler lässt die Routenlinks benutzbar', async ({ page }) => {
  await page.route('**/leaflet-src-*.js', route => route.abort())
  await page.goto('/')
  await page.getByRole('button', { name: 'Karte laden', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Die Karte konnte nicht geladen werden')
  await expect(page.getByRole('link', { name: 'Karte auf OpenStreetMap vergrößern (neuer Tab)' })).toBeVisible()
  await page.getByRole('button', { name: 'Karte ausblenden und Freigabe widerrufen' }).click()
  await expect(page.getByRole('button', { name: 'Karte laden', exact: true })).toBeFocused()
})

test('Tastatur, Bilder, Links und Darstellung funktionieren auf allen Breiten', async ({ page, browserName }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  // macOS WebKit uses Option+Tab for links with the default keyboard preference.
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab')
  await expect(page.getByRole('link', { name: 'Zum Inhalt springen' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  for (const width of [320, 390, 680, 681, 820, 930, 931, 1120, 1121, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `Überlauf bei ${width}px`).toBe(false)
    const invalidAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links
      .map(link => link.getAttribute('href')!.slice(1)).filter(id => !document.getElementById(id)))
    expect(invalidAnchors).toEqual([])
    for (const selector of ['.header-nav a', '.footer-links a']) {
      const heights = await page.locator(selector).evaluateAll(links => links.map(link => link.getBoundingClientRect().height))
      expect(heights.every(height => height >= 44)).toBe(true)
    }
  }
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded()
    await image.evaluate((element: HTMLImageElement) => element.decode())
  }
  const gallery = page.locator('.gallery-grid img')
  await expect(gallery).toHaveCount(4)
  expect(await gallery.evaluateAll(images => images.map(image => image.getAttribute('alt')))).toEqual([
    'Sitzplätze unter dem Kastanienbaum im Garten am Ankersee',
    'Innenraum der Gaststube',
    'Café Brandtschatz mit Terrasse und einem grünen Oldtimer im Vordergrund',
    'Luftaufnahme des Ankersees und des Café Brandtschatz',
  ])
  await expect(page.locator('.eyebrow')).toHaveCount(0)
  await page.locator('.header-nav a[href="#kontakt"]').click()
  await expect(page).toHaveURL(/#kontakt$/)
  await expect(page.getByRole('heading', { name: 'Wir freuen uns auf Ihren Besuch' })).toBeInViewport()
  await page.locator('.brand').click()
  expect(await page.evaluate(() => scrollY)).toBeLessThan(30)
  expect(errors).toEqual([])
})

test('Startseite und Rechtstexte sind auch ohne JavaScript lesbar', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  for (const [url, title] of [
    ['/', 'Café Brandtschatz am Ankersee'],
    ['/impressum.html', 'Impressum'],
    ['/datenschutz.html', 'Datenschutzerklärung'],
  ]) {
    const response = await page.goto(`http://127.0.0.1:4177${url}`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: title, exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
  }
  await context.close()
})

test('Barrierefreiheitsprüfung auf Startseite, Rechtstexten und Fehlerseite', async ({ page }) => {
  for (const path of ['/', '/impressum.html', '/datenschutz.html', '/404.html']) {
    await page.goto(path)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(results.violations, `Befunde auf ${path}`).toEqual([])
  }
})

test('Unbekannte URL liefert echte 404, Vorschau und strukturierte Angaben sind vorhanden', async ({ page, request }) => {
  const response = await page.goto('/diese-seite-existiert-nicht')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Diese Seite ist nicht mehr da')
  await page.getByRole('link', { name: 'Zur Startseite', exact: true }).click()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.brandtschatz.de/')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://www.brandtschatz.de/social-preview.jpg')
  const data = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? '')
  expect(data['@type']).toBe('CafeOrCoffeeShop')
  expect(data.address.streetAddress).toBe('Hauptstraße 5')
  for (const asset of ['/social-preview.jpg', '/favicon.svg', '/apple-touch-icon.png', '/robots.txt', '/sitemap.xml']) {
    expect((await request.get(asset)).status()).toBe(200)
  }
})
