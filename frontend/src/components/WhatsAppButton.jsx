import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, X } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { useSite } from '../lib/SiteContext'
import { messageForPath, waLink } from '../lib/whatsapp'

/**
 * Floating WhatsApp launcher. WhatsApp is how most guests prefer to talk,
 * so it leads, with a phone call as the second option.
 */
export default function WhatsAppButton() {
  const { settings } = useSite()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [nudge, setNudge] = useState(false)

  const phone = settings?.contactPhone || '+94 76 441 2050'
  const href = waLink(settings?.whatsapp, messageForPath(pathname))

  // Show the label once, shortly after the page settles, then let it rest.
  useEffect(() => {
    const show = setTimeout(() => setNudge(true), 2500)
    const hide = setTimeout(() => setNudge(false), 9000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3 sm:right-5 print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-3xl bg-white shadow-lift"
          >
            <div className="flex items-start gap-3 bg-[#075E54] p-4 text-white">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
                <WhatsAppIcon size={22} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Chat with Shan</p>
                <p className="text-xs text-white/75">Usually replies within a few hours</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="ml-auto shrink-0 text-white/70 transition hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4">
              <p className="text-xs leading-relaxed text-ink/65">
                Ask about a route, a price or a pickup time. Tell us your dates and how many are
                travelling and we will send a plan.
              </p>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1EBE5B]"
              >
                <WhatsAppIcon size={17} /> Start a WhatsApp chat
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-ink/12 px-4 py-2.5 text-xs font-semibold text-ink/75 transition hover:border-leaf hover:text-leaf"
              >
                <Phone size={14} /> Call {phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <AnimatePresence>
          {nudge && !open && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="hidden rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-card sm:block"
            >
              Chat with us on WhatsApp
            </motion.span>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close WhatsApp options' : 'Chat with us on WhatsApp'}
          className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:bg-[#1EBE5B] active:scale-95"
        >
          {open ? <X size={24} /> : <WhatsAppIcon size={28} />}
          {!open && (
            <span className="absolute inline-flex h-14 w-14 animate-ping rounded-full bg-[#25D366] opacity-20" />
          )}
        </button>
      </div>
    </div>
  )
}