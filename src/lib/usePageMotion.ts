import { useEffect, useRef, useState } from 'react'

export function usePageMotion() {
  const [activeSection, setActiveSection] = useState('home')
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'))
    let frame = 0
    function update() {
      const available = document.documentElement.scrollHeight - window.innerHeight
      const progress = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
      const current = sections.filter((section) => section.getBoundingClientRect().top <= 180).at(-1)
      setActiveSection(current?.id ?? 'home')
      frame = 0
    }
    function schedule() { if (!frame) frame = window.requestAnimationFrame(update) }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('has-entered')
          observer.unobserve(entry.target)
        }
      }
    }, { threshold: 0.12 })
    document.querySelectorAll('.section-top, .studio-workflow, .process-step').forEach((element) => observer.observe(element))
    const resizeObserver = new ResizeObserver(schedule)
    resizeObserver.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return { activeSection, progressRef }
}