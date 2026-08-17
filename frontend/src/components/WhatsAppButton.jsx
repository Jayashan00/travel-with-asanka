import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import { useSite } from '../lib/SiteContext'

/** Floating contact launcher — mirrors the "Contact us" bubble on the current site. */
export default function WhatsAppButton() {
  const { settings } = useSite()
  const [open, setOpen] = useState(false)
  const whatsapp = settings?.whatsapp || '94761857110'
  const phone = settings?.contactPhone || '+94 76 185 7110'

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 print:hidden">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-64 rounded-2xl bg-white p-4 shadow-lift"
        >
          <p className="text-sm font-semibold">Talk to Asanka</p>
          <p className="mt-1 text-xs leading-relaxed text-ink/60">
            Ask about a route, a price or a pickup time. Replies usually come within a few hours.
          </p>
          <div className="mt-3 space-y-2">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-leaf px-3 py-2 text-xs font-semibold text-white"
            >
              <MessageCircle size={15} /> Message on WhatsApp
            </a>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 rounded-xl border border-ink/12 px-3 py-2 text-xs font-semibold"
            >
              <Phone size={15} /> Call {phone}
            </a>
          </div>
        </motion.div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close contact options' : 'Open contact options'}
        className="flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-semibold text-white shadow-lift transition hover:bg-leaf-dark"
      >
        <MessageCircle size={18} />
        Contact us
      </button>
    </div>
  )
}
