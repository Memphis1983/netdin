import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

export type SculptureSettings = { finish: number; separation: number; paused: boolean; rotation: number; reset: number }

export function createBrandScene(host: HTMLElement, interaction: HTMLElement, onFailure: () => void) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0xe9edf0, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = .95
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.domElement.setAttribute('aria-hidden', 'true')
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-5, 5, 4, -4, .1, 80)
  camera.position.set(0, 1.6, 12)
  camera.lookAt(0, 0, 0)
  const environment = new RoomEnvironment()
  const generator = new THREE.PMREMGenerator(renderer)
  const environmentMap = generator.fromScene(environment, .04, .1, 100, { size: 128 })
  scene.environment = environmentMap.texture
  environment.dispose()
  generator.dispose()
  scene.add(new THREE.HemisphereLight(0xffffff, 0xa1aac0, 1))
  const keyLight = new THREE.DirectionalLight(0xffffff, 3)
  keyLight.position.set(-3, 7, 6)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.set(1024, 1024)
  keyLight.shadow.camera.left = -7
  keyLight.shadow.camera.right = 7
  keyLight.shadow.camera.top = 7
  keyLight.shadow.camera.bottom = -7
  keyLight.shadow.normalBias = .04
  scene.add(keyLight)
  const rimLight = new THREE.DirectionalLight(0xdce7ff, 3)
  rimLight.position.set(5, 2, -3)
  scene.add(rimLight)

  const sculpture = new THREE.Group()
  scene.add(sculpture)
  const cobalt = new THREE.MeshPhysicalMaterial({ color: 0x1646ef, metalness: .35, roughness: .23, clearcoat: 1, clearcoatRoughness: .12 })
  const vermilion = cobalt.clone()
  vermilion.color.set(0xf23e26)
  const chrome = new THREE.MeshStandardMaterial({ color: 0xe6ebf0, metalness: 1, roughness: .18 })
  const yellow = new THREE.MeshStandardMaterial({ color: 0xe1ef35, metalness: .25, roughness: .32 })
  const print = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .54, metalness: .12 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x20252c, metalness: .7, roughness: .32 })
  let disposed = false
  const texture = new THREE.TextureLoader().load('/images/netdin-material.jpg', () => {
    if (disposed) { texture.dispose(); return }
    host.dataset.texture = 'ready'
    requestRender()
  }, undefined, () => { host.dataset.texture = 'failed' })
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
  print.map = texture

  const layers: THREE.Group[] = []
  const frontMeshes: THREE.Mesh[] = []
  const beamShapes = [
    { x: -1.17, height: 3.5, angle: 0 },
    { x: 0, height: 4.04, angle: .59 },
    { x: 1.17, height: 3.5, angle: 0 },
  ]
  for (let layerIndex = 0; layerIndex < 3; layerIndex += 1) {
    const layer = new THREE.Group()
    for (const [beamIndex, shape] of beamShapes.entries()) {
      const depth = layerIndex === 1 ? .09 : .38
      const geometry = new RoundedBoxGeometry(.7, shape.height, depth, 4, .07)
      const material = layerIndex === 0 ? chrome : layerIndex === 1 ? yellow : [cobalt, chrome, vermilion][beamIndex]
      const beam = new THREE.Mesh(geometry, material)
      beam.position.x = shape.x
      if (beamIndex === 1) beam.position.z = .025
      beam.rotation.z = shape.angle
      beam.castShadow = true
      beam.receiveShadow = true
      layer.add(beam)
      if (layerIndex === 2) frontMeshes.push(beam)
    }
    layer.position.z = (layerIndex - 1) * .26
    layers.push(layer)
    sculpture.add(layer)
  }
  const screwGeometry = new THREE.CylinderGeometry(.062, .062, .045, 16)
  const slotGeometry = new THREE.BoxGeometry(.064, .012, .012)
  for (const horizontal of [-1.17, 1.17]) {
    for (const vertical of [-1.35, 1.35]) {
      const screw = new THREE.Mesh(screwGeometry, chrome)
      screw.rotation.x = Math.PI / 2
      screw.position.set(horizontal, vertical, .225)
      const slot = new THREE.Mesh(slotGeometry, dark)
      slot.position.set(horizontal, vertical, .252)
      layers[2].add(screw, slot)
    }
  }
  const pins = new THREE.Group()
  const pinGeometry = new THREE.CylinderGeometry(.035, .035, 2.8, 12)
  for (const horizontal of [-1.17, 1.17]) {
    for (const vertical of [-1.15, 1.15]) {
      const pin = new THREE.Mesh(pinGeometry, chrome)
      pin.rotation.x = Math.PI / 2
      pin.position.set(horizontal, vertical, 0)
      pins.add(pin)
    }
  }
  sculpture.add(pins)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.ShadowMaterial({ opacity: .13 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -2
  floor.receiveShadow = true
  scene.add(floor)

  let settings: SculptureSettings = { finish: 0, separation: 0, paused: false, rotation: 0, reset: 0 }
  let frame = 0
  let lastTime = 0
  let phase = 0
  let separation = 0
  let yaw = -.42
  let pitch = .08
  let dragging = false
  let previousX = 0
  let previousY = 0
  let visible = true
  let slowFrames = 0
  let pixelRatio = renderer.getPixelRatio()
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')

  function resize() {
    const { width, height } = host.getBoundingClientRect()
    const mobile = width <= 900
    const viewHeight = mobile ? 9.8 : 6.2
    const viewWidth = viewHeight * width / height
    camera.left = -viewWidth / 2
    camera.right = viewWidth / 2
    camera.top = viewHeight / 2
    camera.bottom = -viewHeight / 2
    camera.position.set(0, mobile ? 0 : 1.6, 12)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    const section = host.parentElement!
    const copyBottom = section.querySelector('.brand-hero-copy')!.getBoundingClientRect().bottom - host.getBoundingClientRect().top
    const controlsTop = section.querySelector('.brand-hero-base')!.getBoundingClientRect().top - host.getBoundingClientRect().top
    const available = Math.max(120, controlsTop - copyBottom - 36)
    const center = copyBottom + 18 + available / 2
    sculpture.position.set(mobile ? 0 : viewWidth * .225, mobile ? (height / 2 - center) * viewHeight / height : .15, 0)
    const scale = mobile ? Math.min(viewWidth / 4.9, available * viewHeight / height / 4.4) : Math.min(1.1, viewWidth / 8.8)
    sculpture.scale.setScalar(scale)
    floor.position.y = sculpture.position.y - 1.83 * scale
    renderer.setSize(width, height)
    requestRender()
  }

  function render(time: number) {
    frame = 0
    if (disposed || !visible || document.hidden || document.querySelector('dialog[open]')) return
    const elapsed = time - lastTime
    if (lastTime && elapsed < 1000 / 30) { requestRender(); return }
    if (lastTime && elapsed > 80 && !settings.paused) slowFrames += 1
    else slowFrames = 0
    if (slowFrames >= 3 && pixelRatio > .6) {
      pixelRatio = Math.max(.6, pixelRatio * .75)
      renderer.setPixelRatio(pixelRatio)
      slowFrames = 0
    }
    const delta = Math.min((time - lastTime) / 1000, .05)
    lastTime = time
    const moving = !settings.paused && !dragging
    if (moving) phase += delta
    const target = settings.separation / 100
    separation = motion.matches ? target : THREE.MathUtils.damp(separation, target, 7, delta || .016)
    sculpture.rotation.set(pitch + Math.sin(phase * .65) * .035, yaw + settings.rotation + Math.sin(phase * .35) * .12, -.055)
    layers.forEach((layer, index) => { layer.position.z = (index - 1) * (.26 + separation * .94) })
    pins.visible = separation > .05
    pins.children.forEach((pin) => { pin.scale.y = .2 + separation * .8 })
    renderer.render(scene, camera)
    host.dataset.rendered = 'true'
    host.dataset.separation = separation.toFixed(2)
    host.dataset.angle = sculpture.rotation.y.toFixed(3)
    if (moving || Math.abs(separation - target) > .001) requestRender()
  }

  function requestRender() { if (!disposed && !frame) frame = window.requestAnimationFrame(render) }
  function pointerDown(event: PointerEvent) {
    if (event.button !== 0) return
    dragging = true
    previousX = event.clientX
    previousY = event.clientY
    interaction.setPointerCapture(event.pointerId)
    interaction.dataset.dragging = 'true'
  }
  function pointerMove(event: PointerEvent) {
    if (!dragging) return
    yaw += (event.clientX - previousX) * .008
    pitch = THREE.MathUtils.clamp(pitch + (event.clientY - previousY) * .004, -.35, .5)
    previousX = event.clientX
    previousY = event.clientY
    requestRender()
  }
  function pointerUp() { dragging = false; interaction.dataset.dragging = 'false'; requestRender() }
  function visibilityChange() { lastTime = performance.now(); requestRender() }
  function contextLost(event: Event) { event.preventDefault(); onFailure() }
  interaction.addEventListener('pointerdown', pointerDown)
  interaction.addEventListener('pointermove', pointerMove)
  interaction.addEventListener('pointerup', pointerUp)
  interaction.addEventListener('pointercancel', pointerUp)
  renderer.domElement.addEventListener('webglcontextlost', contextLost)
  document.addEventListener('visibilitychange', visibilityChange)
  motion.addEventListener('change', visibilityChange)
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  resizeObserver.observe(host.parentElement!.querySelector('.brand-hero-copy')!)
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibilityChange() })
  observer.observe(host)
  const dialogObserver = new MutationObserver(visibilityChange)
  dialogObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] })
  resize()

  return {
    update(next: SculptureSettings) {
      if (next.reset !== settings.reset) { yaw = -.42; pitch = .08; phase = 0 }
      settings = next
      cobalt.color.set(next.finish === 1 ? 0xf23e26 : 0x1646ef)
      vermilion.color.set(next.finish === 1 ? 0xe1ef35 : 0xf23e26)
      frontMeshes.forEach((mesh, index) => { mesh.material = next.finish === 2 ? print : [cobalt, chrome, vermilion][index] })
      host.dataset.finish = String(next.finish)
      requestRender()
    },
    destroy() {
      disposed = true
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      observer.disconnect()
      dialogObserver.disconnect()
      document.removeEventListener('visibilitychange', visibilityChange)
      motion.removeEventListener('change', visibilityChange)
      interaction.removeEventListener('pointerdown', pointerDown)
      interaction.removeEventListener('pointermove', pointerMove)
      interaction.removeEventListener('pointerup', pointerUp)
      interaction.removeEventListener('pointercancel', pointerUp)
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      const geometries = new Set<THREE.BufferGeometry>()
      scene.traverse((object) => { if (object instanceof THREE.Mesh) geometries.add(object.geometry) })
      geometries.forEach((geometry) => geometry.dispose())
      ;[cobalt, vermilion, chrome, yellow, print, dark, floor.material].forEach((material) => material.dispose())
      texture.dispose()
      environmentMap.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}