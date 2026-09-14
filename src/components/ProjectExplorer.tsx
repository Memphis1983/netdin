import { useState, type ReactNode } from 'react'
import { ArrowUpRight, Image, PanelsTopLeft, RotateCcw } from 'lucide-react'
import './ProjectExplorer.css'

const periods = {
  '6 months': { total: '$48,250', growth: '+18.6%', labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], values: [4800, 6250, 5600, 8750, 9850, 13000] },
  '12 months': { total: '$86,420', growth: '+24.2%', labels: ['Oct-Nov', 'Dec-Jan', 'Feb-Mar', 'Apr-May', 'Jun-Jul', 'Aug-Sep'], values: [8900, 11400, 12200, 14600, 17400, 21920] },
}

export function ProjectExplorer({ type, children, artwork }: { type: string; children: ReactNode; artwork: ReactNode }) {
  const [view, setView] = useState('interface')
  const [palette, setPalette] = useState('Ocean')
  const [period, setPeriod] = useState<keyof typeof periods>('6 months')
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const data = periods[period]

  function reset() {
    setView('interface')
    setPalette('Ocean')
    setPeriod('6 months')
    setSelectedMonth(null)
  }

  return (
    <div className="project-explorer">
      <div className="explorer-toolbar">
        <div className="preview-segments" role="group" aria-label="Project view">
          <button type="button" aria-pressed={view === 'interface'} onClick={() => setView('interface')}><PanelsTopLeft size={16} />Interface</button>
          <button type="button" aria-pressed={view === 'artwork'} onClick={() => setView('artwork')}><Image size={16} />Art direction</button>
        </div>
        <button type="button" className="icon-button" title="Reset preview" aria-label="Reset preview" onClick={reset}><RotateCcw size={18} /></button>
      </div>
      {view === 'artwork' ? <div className="explorer-artwork">{artwork}</div> : type === 'supply' ? (
        <div data-palette={palette} className="supply-playground">
          <div className="palette-toolbar"><span>Brand palette</span><div role="group" aria-label="Brand palette">{['Ocean', 'Forest', 'Cherry'].map((name) => <button key={name} type="button" className={`palette-swatch palette-${name.toLowerCase()}`} aria-label={`${name} palette`} aria-pressed={palette === name} title={`${name} palette`} onClick={() => setPalette(name)} />)}</div><output aria-live="polite">{palette}</output></div>
          {children}
        </div>
      ) : (
        <section className="orbit-playground" aria-label="Orbit interactive concept">
          <div className="orbit-live-heading"><strong>orbit<span>Workspace overview</span></strong><span className="demo-label">ILLUSTRATIVE DATA</span></div>
          <div className="revenue-summary"><div><span>Total revenue</span><strong aria-live="polite">{data.total}</strong></div><span className="revenue-growth"><ArrowUpRight size={16} />{data.growth}</span></div>
          <div className="revenue-toolbar"><h3>Revenue overview</h3><div className="preview-segments" role="group" aria-label="Revenue period">{(Object.keys(periods) as Array<keyof typeof periods>).map((name) => <button type="button" key={name} aria-pressed={period === name} onClick={() => { setPeriod(name); setSelectedMonth(null) }}>{name}</button>)}</div></div>
          <div className="revenue-chart" role="group" aria-label="Revenue breakdown">{data.values.map((value, index) => <button type="button" className="revenue-column" key={data.labels[index]} aria-label={`${data.labels[index]}: $${value}`} aria-pressed={selectedMonth === index} onClick={() => setSelectedMonth(index)}><span className="revenue-bar-track"><span className="revenue-bar" style={{ height: `${value / Math.max(...data.values) * 100}%` }} /></span><span>{data.labels[index]}</span></button>)}</div>
          <output className="revenue-readout" aria-live="polite">{selectedMonth === null ? `${period} / Revenue in USD` : `${data.labels[selectedMonth]} / $${data.values[selectedMonth].toLocaleString('en-US')}`}</output>
          <div className="orbit-live-project"><span>Website redesign</span><span>In progress</span><span>Sep 24</span></div>
        </section>
      )}
    </div>
  )
}