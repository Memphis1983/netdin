import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'

async function captureBrandSystem(page, storefront) {
  await page.evaluate((storefront) => {
    const stage = document.createElement('main')
    stage.className = 'brand-system-scene'
    stage.innerHTML = `
      <section class="system-identity"><span>01 / BRAND IDENTITY</span><strong>supply</strong><p>Good ideas.<br>Great beginnings.</p><div class="system-symbol"><i></i><i></i><i></i><i></i></div><footer><span>DIGITAL GOODS.<br>HUMAN POTENTIAL.</span><div class="system-swatches"><i></i><i></i><i></i></div></footer></section>
      <section class="system-store"><header class="system-browser"><span>02 / WEBSITE</span><span>supply.design / collection</span><span>+</span></header>${storefront}</section>
      <section class="system-admin"><header><strong>supply<span> / STUDIO</span></strong><span>03 / SOFTWARE</span></header><div class="system-admin-body"><aside><b>Catalogue</b><span>Orders</span><span>Customers</span><span>Analytics</span></aside><div class="system-catalogue"><div class="system-catalogue-heading"><div><h2>Your collection</h2><p>Everything you make, in one place.</p></div><span>+ New product</span></div><table><thead><tr><th>Product</th><th>Status</th><th>Price</th><th>Sales</th></tr></thead><tbody><tr><td><i class="product-icon"></i>Workspace UI kit</td><td><span>Published</span></td><td>$48</td><td>128</td></tr><tr><td><i class="product-icon product-icon-red"></i>Editorial template</td><td><span>Published</span></td><td>$32</td><td>86</td></tr></tbody></table><footer>2 PRODUCTS<span>ILLUSTRATIVE CONCEPT DATA</span></footer></div></div></section>`
    document.body.replaceChildren(stage)
  }, storefront)
  await page.addStyleTag({ content: `
    body { margin: 0; }
    .brand-system-scene { position: relative; width: 2400px; height: 1100px; overflow: hidden; background: #edf0f4; color: #182a48; font-family: 'Manrope Variable', sans-serif; }
    .brand-system-scene * { box-sizing: border-box; }
    .system-identity { position: absolute; left: 1030px; top: 260px; width: 360px; height: 580px; padding: 34px; background: #2144de; color: white; display: flex; flex-direction: column; box-shadow: 0 22px 45px #182a4820; }
    .system-identity > span { font-family: 'IBM Plex Mono', monospace; font-size: 14px; }
    .system-identity > strong { font-family: 'Archivo Variable', sans-serif; font-weight: 750; font-size: 82px; line-height: 1; margin-top: 40px; }
    .system-identity > p { font-size: 26px; line-height: 1.4; margin-top: 24px; }
    .system-symbol { display: grid; grid-template-columns: repeat(2, 54px); gap: 8px; margin-top: 38px; }
    .system-symbol i { height: 54px; border: 2px solid #cdd6ff; }
    .system-symbol i:last-child { background: #d9ee9e; border-color: #d9ee9e; }
    .system-identity footer { display: flex; justify-content: space-between; align-items: end; margin-top: auto; font-size: 11px; line-height: 1.6; }
    .system-swatches { display: flex; gap: 5px; }
    .system-swatches i { width: 24px; height: 38px; background: #f7f8fa; }
    .system-swatches i:nth-child(2) { background: #ec5145; }
    .system-swatches i:nth-child(3) { background: #d9ee9e; }
    .system-store { position: absolute; left: 1440px; top: 220px; width: 850px; background: white; border: 1px solid #cbd1db; box-shadow: 0 24px 50px #182a481c; border-radius: 8px; overflow: hidden; }
    .system-browser { display: flex; justify-content: space-between; padding: 16px 24px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #68738a; background: #fff; border-bottom: 1px solid #e2e6ed; }
    .system-store .commerce-site { border: 0; border-radius: 0; background: #fff; }
    .system-store .commerce-nav { padding: 20px 30px; font-size: 12px; color: #2144de; }
    .system-store .commerce-nav b { font-family: 'Archivo Variable', sans-serif; font-size: 34px; font-weight: 750; }
    .system-store .commerce-title { padding: 20px 30px; font-size: 36px; line-height: 1.1; color: #182a48; }
    .system-store .commerce-product { padding: 0 30px 24px; gap: 28px; }
    .system-store .kit-preview { background: #e7ecfc; }
    .system-store .kit-toolbar { padding: 12px; font-size: 12px; }
    .system-store .kit-layout { min-height: 156px; }
    .system-store .kit-canvas { padding: 14px; }
    .system-store .kit-swatches i { width: 24px; height: 24px; background: #2144de; }
    .system-store .kit-swatches i:nth-child(2) { background: #d9ee9e; }
    .system-store .kit-swatches i:nth-child(3) { background: #ec5145; }
    .system-store .kit-chart { height: 52px; }
    .system-store .kit-chart i { background: #2144de; }
    .system-store .commerce-product-info > span { font-size: 12px; }
    .system-store .commerce-product-info h3 { font-size: 23px; }
    .system-store .commerce-product-info p { font-size: 14px; }
    .system-store .commerce-product-info .commerce-price { font-size: 25px; margin-top: 14px; }
    .system-store .commerce-caption { padding: 14px 30px; font-size: 12px; }
    .system-admin { position: absolute; left: 1440px; top: 760px; width: 850px; background: #fff; border: 1px solid #cbd1db; border-radius: 8px; box-shadow: 0 24px 50px #182a481c; overflow: hidden; }
    .system-admin > header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #e2e6ed; }
    .system-admin > header strong { font-size: 25px; font-family: 'Archivo Variable', sans-serif; color: #2144de; }
    .system-admin > header strong span, .system-admin > header > span { font: 11px 'IBM Plex Mono', monospace; color: #68738a; }
    .system-admin-body { display: grid; grid-template-columns: 138px 1fr; }
    .system-admin aside { display: flex; flex-direction: column; gap: 18px; padding: 24px 14px; background: #f6f7fb; font-size: 13px; }
    .system-admin aside b { background: #e4eafd; color: #2144de; padding: 8px; margin: -8px; }
    .system-catalogue { padding: 18px 24px; }
    .system-catalogue-heading { display: flex; align-items: center; justify-content: space-between; }
    .system-catalogue-heading h2 { font-size: 21px; font-weight: 650; }
    .system-catalogue-heading p { font-size: 12px; color: #68738a; margin-top: 4px; }
    .system-catalogue-heading > span { padding: 9px 12px; background: #2144de; color: #fff; font-size: 12px; }
    .system-catalogue table { margin-top: 20px; border-collapse: collapse; width: 100%; text-align: left; font-size: 12px; }
    .system-catalogue th { font-size: 10px; color: #68738a; font-weight: 400; padding-bottom: 10px; }
    .system-catalogue td { padding: 12px 0; border-top: 1px solid #e2e6ed; }
    .system-catalogue td:first-child { display: flex; align-items: center; gap: 9px; }
    .system-catalogue td > span { background: #edf4df; color: #3c5620; padding: 4px 7px; }
    .product-icon { width: 20px; height: 24px; background: #2144de; display: inline-block; }
    .product-icon-red { background: #ec5145; }
    .system-catalogue footer { display: flex; justify-content: space-between; font: 9px 'IBM Plex Mono', monospace; color: #68738a; padding-top: 8px; }
    .brand-system-short { height: 720px; }
    .brand-system-short .system-identity { top: 70px; left: 1030px; }
    .brand-system-short .system-store { top: 30px; transform: scale(.78); transform-origin: top left; }
    .brand-system-short .system-admin { top: 460px; transform: scale(.78); transform-origin: top left; }
    .brand-system-mobile { width: 1200px; height: 900px; }
    .brand-system-mobile .system-identity { left: 35px; top: 45px; width: 340px; height: 580px; }
    .brand-system-mobile .system-store { left: 410px; top: 45px; width: 850px; transform: scale(.89); transform-origin: top left; }
    .brand-system-mobile .system-admin { left: 410px; top: 520px; width: 850px; transform: scale(.89); transform-origin: top left; }
    .brand-system-mobile .system-identity { height: 800px; }
    .brand-system-mobile .system-symbol { margin-top: 80px; }
  ` })
  await page.evaluate(() => document.fonts.ready)
  await page.setViewportSize({ width: 2400, height: 1100 })
  await page.screenshot({ path: fileURLToPath(new URL('../public/images/netdin-brand-system.jpg', import.meta.url)), type: 'jpeg', quality: 94, animations: 'disabled' })
  await page.setViewportSize({ width: 2400, height: 720 })
  await page.locator('.brand-system-scene').evaluate((element) => element.classList.add('brand-system-short'))
  await page.screenshot({ path: fileURLToPath(new URL('../public/images/netdin-brand-system-short.jpg', import.meta.url)), type: 'jpeg', quality: 94, animations: 'disabled' })
  await page.setViewportSize({ width: 1200, height: 900 })
  await page.locator('.brand-system-scene').evaluate((element) => { element.classList.remove('brand-system-short'); element.classList.add('brand-system-mobile') })
  await page.screenshot({ path: fileURLToPath(new URL('../public/images/netdin-brand-system-mobile.jpg', import.meta.url)), type: 'jpeg', quality: 94, animations: 'disabled' })
  console.log('Generated desktop/mobile Supply brand-to-product compositions from rendered HTML. No image API request sent.')
}

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 2000, height: 1100 }, deviceScaleFactor: 1 })
  await page.goto('http://127.0.0.1:5173/?artwork=static', { waitUntil: 'networkidle' })
  const previews = {}
  for (const name of ['Supply', 'Orbit']) {
    await page.getByRole('button', { name: `Explore ${name} concept` }).click()
    previews[name.toLowerCase()] = await page.locator(`.project-dialog ${name === 'Supply' ? '.commerce-site' : '.orbit-window'}`).evaluate((element) => element.outerHTML)
    await page.keyboard.press('Escape')
  }
  if (process.argv.includes('--brand-system')) {
    await captureBrandSystem(page, previews.supply)
  } else {
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
  }
} finally {
  await browser.close()
}