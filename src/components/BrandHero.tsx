import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Layers3, Pause, Play, RotateCcw, RotateCw } from 'lucide-react'
import type { createBrandScene, SculptureSettings } from '../lib/brandScene'
import './BrandHero.css'

const initial: SculptureSettings = { finish: 0, separation: 0, paused: false, rotation: 0, reset: 0 }
const finishes = ['Cobalt', 'Vermilion', 'Studio print']

export function BrandHero({ onStart }: { onStart: () => void }) {
  const host = useRef<HTMLDivElement>(null)
  const interaction = useRef<HTMLDivElement>(null)
  const controller = useRef<ReturnType<typeof createBrandScene> | null>(null)
  const current = useRef(initial)
  const [settings, setSettings] = useState(initial)
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')

  useEffect(() => {
    current.current = settings
    controller.current?.update(settings)
  }, [settings])

  useEffect(() => {
    let cancelled = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setSettings((value) => ({ ...value, paused: reducedMotion.matches }))
    updateMotion()
    reducedMotion.addEventListener('change', updateMotion)
    import('../lib/brandScene').then(({ createBrandScene }) => {
      if (cancelled || !host.current || !interaction.current) return
      try {
        controller.current = createBrandScene(host.current, interaction.current, () => {
          controller.current?.destroy()
          controller.current = null
          setStatus('fallback')
        })
        controller.current.update(current.current)
        setStatus('ready')
      } catch {
        setStatus('fallback')
      }
    }).catch(() => { if (!cancelled) setStatus('fallback') })
    return () => {
      cancelled = true
      reducedMotion.removeEventListener('change', updateMotion)
      controller.current?.destroy()
      controller.current = null
    }
  }, [])

  function reset() {
    setSettings((value) => ({ ...initial, paused: window.matchMedia('(prefers-reduced-motion: reduce)').matches, reset: value.reset + 1 }))
  }

  return (
    <section className="hero brand-hero" id="home" aria-labelledby="hero-title" data-scene={status}>
      <img className="sculpture-fallback" src="/images/netdin-sculpture.jpg" alt="GPT Image 2 concept of a Netdin N sculpture in cobalt enamel, chrome and vermilion" width="1536" height="1024" fetchPriority="high" />
      <div ref={host} className="sculpture-stage" />
      <div ref={interaction} className="sculpture-interaction" role="img" aria-label="Interactive three-dimensional Netdin sculpture. Rotation and material controls follow." />
      <div className="brand-hero-top wrap"><span className="technical"><span className="live-square" /> INDEPENDENT DESIGN & ENGINEERING</span><span className="technical hero-edition">OBJECT STUDY / N-001</span></div>
      <div className="brand-hero-copy wrap">
        <h1 id="hero-title">netdin<span className="brand-period">.</span></h1>
        <h2>Independent minds.<br />Unexpected outcomes.</h2>
        <p>Distinctive brands. Ambitious websites.<br />Software that moves you forward.</p>
        <button className="button button-dark instrument-cta" onClick={onStart}>Make your next move <ArrowUpRight size={22} /></button>
      </div>
      <div className="brand-object-caption technical"><span>FORM / FUNCTION / A LITTLE FRICTION</span><span>{status === 'fallback' ? 'ARTWORK EDITION' : 'NETDIN ORIGINAL / 2026'}</span></div>
      <div className="brand-hero-base wrap">
        <a href="#work" className="hero-work-link"><span className="technical">SELECTED THINKING</span><span>See what takes shape <ArrowDown size={18} /></span></a>
        <fieldset className="object-controls" disabled={status !== 'ready'} aria-label="Sculpture controls">
          <legend className="sr-only">Sculpture controls</legend>
          <div className="object-finishes" role="group" aria-label="Sculpture material">{finishes.map((finish, index) => <button type="button" key={finish} className={`object-swatch finish-${index}`} title={finish} aria-label={`${finish} material`} aria-pressed={settings.finish === index} onClick={() => setSettings((value) => ({ ...value, finish: index }))} />)}</div>
          <span className="control-divider" />
          <button type="button" className="object-tool" title={settings.separation ? 'Assemble sculpture' : 'Separate sculpture layers'} aria-label="Separate sculpture layers" aria-pressed={settings.separation > 0} onClick={() => setSettings((value) => ({ ...value, separation: value.separation ? 0 : 100 }))}><Layers3 size={19} /></button>
          <label className="assembly-control"><span className="sr-only">Layer separation</span><input type="range" min="0" max="100" value={settings.separation} onChange={(event) => setSettings((value) => ({ ...value, separation: Number(event.target.value) }))} /></label>
          <button type="button" className="object-tool" title="Rotate sculpture" aria-label="Rotate sculpture" onClick={() => setSettings((value) => ({ ...value, rotation: value.rotation + Math.PI / 6 }))}><RotateCw size={19} /></button>
          <button type="button" className="object-tool" title={settings.paused ? 'Play motion' : 'Pause motion'} aria-label={settings.paused ? 'Play sculpture motion' : 'Pause sculpture motion'} onClick={() => setSettings((value) => ({ ...value, paused: !value.paused }))}>{settings.paused ? <Play size={18} /> : <Pause size={18} />}</button>
          <button type="button" className="object-tool" title="Reset sculpture" aria-label="Reset sculpture" onClick={reset}><RotateCcw size={18} /></button>
        </fieldset>
        <output className="object-status technical" aria-live="polite">{status === 'ready' ? `${finishes[settings.finish]} / ${settings.separation ? 'Exploded' : 'Assembled'}` : status === 'fallback' ? 'Static artwork' : 'Preparing object'}</output>
      </div>
    </section>
  )
}