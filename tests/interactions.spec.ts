import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`hero actions and work filters respond at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const hero = page.locator('.agency-hero')
    await expect(hero.locator('img')).toHaveAttribute('src', '/images/netdin-brand-system.jpg')
    await hero.locator('img').evaluate((image) => (image as HTMLImageElement).decode())
    await expect(hero.getByRole('tablist')).toHaveCount(0)
    await expect(hero.locator('.agency-art-caption')).toHaveText('SUPPLYSELF-INITIATED CONCEPT')
    await hero.screenshot({ path: testInfo.outputPath('netdin-brand-system.png') })
    const start = hero.getByRole('button', { name: 'Start a project' })
    await start.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(start).toBeFocused()
    await hero.getByRole('link', { name: 'Explore our work' }).click()
    await expect(page).toHaveURL(/#work$/)
    const filters = page.getByRole('group', { name: 'Filter selected work' })
    await filters.getByRole('button', { name: /Brand/ }).click()
    await expect(page.locator('.project-card')).toHaveCount(1)
    await expect(page.getByRole('button', { name: 'Explore Supply concept' })).toBeVisible()
    await filters.getByRole('button', { name: /Product/ }).click()
    await expect(page.locator('.project-card')).toHaveCount(1)
    await expect(page.getByRole('button', { name: 'Explore Orbit concept' })).toBeVisible()
    await filters.getByRole('button', { name: /All/ }).click()
    await expect(page.locator('.project-card')).toHaveCount(2)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}

for (const width of [390, 1440]) {
  test(`project explorer controls work at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Explore Supply concept' }).click()
    await page.getByRole('button', { name: 'Cherry palette' }).click()
    await expect(page.locator('.supply-playground')).toHaveAttribute('data-palette', 'Cherry')
    await expect(page.locator('.supply-playground .commerce-title')).toHaveCSS('color', 'rgb(153, 60, 88)')
    await page.getByRole('button', { name: 'Art direction', exact: true }).click()
    await expect(page.locator('.explorer-artwork img')).toBeVisible()
    await page.locator('.explorer-artwork img').evaluate((image) => (image as HTMLImageElement).decode())
    await page.getByRole('dialog').screenshot({ path: testInfo.outputPath('supply-artwork.png'), animations: 'disabled' })
    await page.getByRole('button', { name: 'Reset preview' }).click()
    await expect(page.getByRole('button', { name: 'Ocean palette' })).toHaveAttribute('aria-pressed', 'true')
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Explore Orbit concept' }).click()
    await page.getByRole('button', { name: '12 months', exact: true }).click()
    await expect(page.locator('.revenue-summary strong')).toHaveText('$86,420')
    await page.getByRole('button', { name: 'Oct-Nov: $8900', exact: true }).focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('.revenue-readout')).toHaveText('Oct-Nov / $8,900')
    await page.getByRole('dialog').screenshot({ path: testInfo.outputPath('orbit-interactive.png'), animations: 'disabled' })
    expect(await page.getByRole('dialog').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
    await page.getByRole('button', { name: 'Reset preview' }).click()
    await expect(page.locator('.revenue-summary strong')).toHaveText('$48,250')
  })
}

test('navigation follows scroll position with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'What we do' }).click()
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'What we do' })).toHaveAttribute('aria-current', 'location')
  await expect(page.locator('.reading-progress')).not.toHaveCSS('transform', 'matrix(0, 0, 0, 1, 0, 0)')
  await expect(page.locator('.supply-artwork img')).toHaveAttribute('src', '/images/supply-editorial.jpg')
})

test('local artwork generator can still capture static interfaces', async ({ page }) => {
  await page.goto('/?artwork=static')
  for (const name of ['Supply', 'Orbit']) {
    await page.getByRole('button', { name: `Explore ${name} concept` }).click()
    await expect(page.locator(`.project-dialog ${name === 'Supply' ? '.commerce-site' : '.orbit-window'}`)).toBeVisible()
    await page.keyboard.press('Escape')
  }
})

test('project direction carries the chosen service into the brief', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('radio', { name: /A distinctive brand/ }).check()
  await expect(page.locator('.direction-result h3')).toHaveText('Brand identity')
  await page.getByRole('button', { name: 'Shape this project' }).click()
  await expect(page.getByRole('checkbox', { name: 'Brand identity', exact: true })).toBeChecked()
})

test('artwork and contact remain available without WebGL', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...options: unknown[]) {
      if (contextId === 'webgl' || contextId === 'webgl2' || contextId === 'experimental-webgl') return null
      return Reflect.apply(original, this, [contextId, ...options])
    } as typeof original
  })
  await page.goto('/')
  await expect(page.locator('.agency-art')).toHaveAttribute('src', '/images/netdin-brand-system.jpg')
  await page.locator('.agency-art').evaluate((image) => (image as HTMLImageElement).decode())
  await page.locator('.hero').screenshot({ path: testInfo.outputPath('fallback.png') })
  await page.locator('.agency-hero').getByRole('button', { name: 'Start a project' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})