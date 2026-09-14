import { ArrowDown, ArrowUpRight } from 'lucide-react'
import './AgencyHero.css'

export function AgencyHero({ onStart }: { onStart: () => void }) {
  return (
    <section className="hero agency-hero" id="home" aria-labelledby="hero-title">
      <div className="agency-stage">
        <picture>
          <source media="(max-width: 1100px)" srcSet="/images/netdin-brand-system-mobile.jpg" />
          <source media="(max-height: 760px)" srcSet="/images/netdin-brand-system-short.jpg" />
          <img className="agency-art" src="/images/netdin-brand-system.jpg" width={2400} height={1100} alt="Supply self-initiated concept: a blue brand identity, its digital-goods storefront and a matching catalogue-management interface with illustrative data" fetchPriority="high" />
        </picture>
        <div className="agency-copy wrap">
          <span className="technical agency-kicker">INDEPENDENT DESIGN & TECHNOLOGY</span>
          <h1 id="hero-title">netdin</h1>
          <p className="agency-statement">Brands. Websites.<br />Software.</p>
          <p className="agency-description">We turn ambitious ideas into<br />brands, websites and software.</p>
          <div className="agency-actions">
            <button onClick={onStart}>Start a project <ArrowUpRight size={19} /></button>
            <a href="#work">Explore our work <ArrowDown size={18} /></a>
          </div>
        </div>
        <span className="agency-art-caption technical">SUPPLY<span>SELF-INITIATED CONCEPT</span></span>
      </div>
      <div className="agency-availability wrap">
        <span><i /> INDEPENDENT STUDIO / INDIA & EVERYWHERE</span>
        <span className="agency-disciplines">STRATEGY <b>/</b> DESIGN <b>/</b> ENGINEERING</span>
      </div>
    </section>
  )
}