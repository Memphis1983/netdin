import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Dialog({ title, onClose, children, className = '' }: {
  title: string
  onClose: () => void
  children: ReactNode
  className?: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div className="dialog-body">
        <button type="button" className="icon-button dialog-close" aria-label="Close dialog" title="Close" onClick={onClose}><X size={22} /></button>
        {children}
      </div>
    </dialog>
  )
}