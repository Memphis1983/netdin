import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 2000, height: 1100 }, deviceScaleFactor: 1 })
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  const previews = {}
  for (const name of ['Supply', 'Orbit']) {
    await page.getByRole('button', { name: `Explore ${name} concept` }).click()
    previews[name.toLowerCase()] = await page.locator(`.project-dialog ${name === 'Supply' ? '.commerce-site' : '.orbit-window'}`).evaluate((element) => element.outerHTML)
    await page.keyboard.press('Escape')
  }
  await page.evaluate(({ orbit }) => {
    const stage = document.createElement('div')
    stage.className = 'product-scene'
    stage.innerHTML = orbit
    document.body.replaceChildren(stage)
  }, previews)
  await page.addStyleTag({ content: `
    body { margin: 0; }
    .product-scene { position: relative; width: 2000px; height: 1100px; overflow: hidden; background: #f4f6f5; }
    .product-scene::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(90deg, transparent calc(100% - 1px), #dfe5e1 1px), linear-gradient(transparent calc(100% - 1px), #dfe5e1 1px); background-size: 160px 160px; opacity: .45; }
    .product-scene .orbit-window { position: absolute; left: 1040px; top: 200px; width: 640px; min-height: 425px; transform: rotate(-5deg) scale(1.38); transform-origin: top left; box-shadow: 0 50px 85px -24px rgb(27 33 30 / 25%), 0 0 0 10px #fbfcfc, 0 0 0 12px #d1dad5; border-radius: 8px; overflow: hidden; }
    .product-scene .orbit-sidebar { width: 120px; padding: 22px 16px; gap: 25px; }
    .product-scene .orbit-sidebar > b { font-size: 25px; }
    .product-scene .orbit-sidebar > span { font-size: 8px; }
    .product-scene .orbit-content { padding: 22px; }
    .product-scene .orbit-top { font-size: 7px; }
    .product-scene .avatar { font-size: 8px; }
    .product-scene .orbit-heading { margin-top: 22px; }
    .product-scene .orbit-heading small { font-size: 6px; }
    .product-scene .orbit-heading h3 { font-size: 17px; }
    .product-scene .metric-row small { font-size: 7px; }
    .product-scene .metric-row strong { font-size: 28px; }
    .product-scene .metric-row strong span { font-size: 6px; }
    .product-scene .chart-heading { font-size: 8px; }
    .product-scene .chart-heading > span { font-size: 7px; }
    .product-scene .chart { height: 155px; }
    .product-scene .chart-grid, .product-scene .bars span { font-size: 6px; }
    .product-scene .bars i { background: #b7d0c1; }
    .product-scene .bars > div:last-child i { background: #3b6652; }
    .product-scene .orbit-task { font-size: 7px; }
    .product-scene .sidebar-active { background: #e3eee7; color: #344c40; }
    .study { width: 1440px; height: 1100px; }
    .study::before { display: none; }
    .study-heading { position: absolute; top: 66px; left: 74px; right: 74px; display: flex; align-items: center; justify-content: space-between; font-size: 18px; }
    .study-heading b { font-family: var(--display); font-size: 64px; font-weight: 500; }
    .study-caption { position: absolute; bottom: 48px; left: 74px; right: 74px; display: flex; justify-content: space-between; font-size: 18px; }
    .supply-study { background: #dfeaf1; color: #152d42; }
    .supply-study .commerce-site { position: absolute; width: 800px; left: 565px; top: 225px; transform: rotate(-5deg); border: 8px solid #f7fafc; border-radius: 8px; box-shadow: 0 50px 70px -30px #486f8955; }
    .supply-study .commerce-nav { padding: 24px 30px; font-size: 13px; }
    .supply-study .commerce-nav b { font-size: 34px; }
    .supply-study .commerce-title { font-size: 40px; padding: 32px; }
    .supply-study .commerce-product { padding: 0 32px 32px; gap: 28px; }
    .supply-study .kit-layout { min-height: 220px; }
    .supply-study .kit-toolbar { font-size: 13px; padding: 15px; }
    .supply-study .kit-canvas { padding: 20px; }
    .supply-study .kit-chart { height: 90px; }
    .supply-study .kit-swatches i { width: 32px; height: 32px; }
    .supply-study .commerce-product-info > span { font-size: 13px; }
    .supply-study .commerce-product-info h3 { font-size: 25px; }
    .supply-study .commerce-product-info p { font-size: 15px; }
    .supply-study .commerce-product-info .commerce-price { font-size: 28px; margin-top: 24px; }
    .supply-study .commerce-caption { padding: 20px 32px; font-size: 14px; }
    .identity-sheet { position: absolute; left: 74px; top: 265px; width: 400px; height: 610px; padding: 34px; background: #203f58; color: #fff; transform: rotate(3deg); box-shadow: 0 30px 45px -24px #284d7277; display: flex; flex-direction: column; }
    .identity-sheet small { font-size: 15px; }
    .identity-sheet strong { font-family: var(--display); font-size: 72px; line-height: 1.05; font-weight: 500; margin-top: 45px; }
    .identity-sheet p { font-size: 20px; line-height: 1.6; margin-top: 24px; }
    .identity-swatches { display: flex; margin-top: auto; height: 68px; }
    .identity-swatches i { flex: 1; background: #9bbdce; }
    .identity-swatches i:nth-child(2) { background: #e8f0f3; }
    .identity-swatches i:nth-child(3) { background: #d8e8a1; }
    .orbit-study { background: #172b26; color: #e8f1eb; }
    .orbit-study .orbit-window { left: 260px; top: 275px; transform: rotate(-4deg) scale(1.48); color: #1b211e; }
    .orbit-study .study-heading span { color: #bdcfc4; }
    .orbit-study .study-caption { color: #bdcfc4; }
    .orbit-study .study-heading b { display: flex; align-items: center; gap: 20px; }
    .orbit-study .study-heading b::before { content: ''; width: 45px; height: 45px; border: 9px solid #c5e5ae; border-radius: 50%; }
    .mobile-scene { width: 960px; height: 680px; }
    .mobile-scene .orbit-window { left: 90px; top: 100px; transform: rotate(-4deg) scale(1.2); }
  ` })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: fileURLToPath(new URL('../public/images/product-hero.png', import.meta.url)), animations: 'disabled' })
  await page.setViewportSize({ width: 960, height: 680 })
  await page.locator('.product-scene').evaluate((element) => element.classList.add('mobile-scene'))
  await page.screenshot({ path: fileURLToPath(new URL('../public/images/product-hero-mobile.png', import.meta.url)), animations: 'disabled' })
  await page.setViewportSize({ width: 1440, height: 1100 })
  for (const name of ['supply', 'orbit']) {
    await page.evaluate(({ name, preview }) => {
      const stage = document.querySelector('.product-scene')
      stage.className = `product-scene study ${name}-study`
      stage.innerHTML = `<div class="study-heading"><b>${name}</b><span>${name === 'supply' ? 'DIGITAL GOODS, CONSIDERED.' : 'YOUR BUSINESS. IN FOCUS.'}</span></div>${preview}<div class="study-caption"><span>${name === 'supply' ? 'IDENTITY / COMMERCE / DESIGN SYSTEM' : 'PRODUCT STRATEGY / INTERFACE / DEVELOPMENT'}</span><span>NETDIN CONCEPT / 0${name === 'supply' ? '1' : '2'}</span></div>`
      if (name === 'supply') stage.insertAdjacentHTML('beforeend', '<div class="identity-sheet"><small>THE SUPPLY COLLECTION / 01</small><strong>Make<br>room for<br>ideas.</strong><p>Thoughtful tools.<br>Endless possibilities.</p><div class="identity-swatches"><i></i><i></i><i></i></div></div>')
    }, { name, preview: previews[name] })
    await page.screenshot({ path: fileURLToPath(new URL(`../public/images/${name}-study.png`, import.meta.url)), animations: 'disabled' })
  }
  console.log('Generated desktop/mobile product heroes and Supply/Orbit study artwork.')
} finally {
  await browser.close()
}