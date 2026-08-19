import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useCollection } from '../lib/useCollection'
import { PLACES } from '../lib/places'

/**
 * Site-wide search across places, vehicles and destination guides.
 * Opens from the navbar or with the "/" key.
 */
export default function SearchOverlay({ open, onClose }) {
  const [term, setTerm] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const { data: vehicles } = useCollection('/vehicles')
  const { data: posts } = useCollection('/posts')
  const { data: tours } = useCollection('/tours')

  useEffect(() => {
    if (open) {
      setTerm('')
      const id = setTimeout(() => inputRef.current?.focus(), 80)
      return () => clearTimeout(id)
    }
    return undefined
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const results = useMemo(() => {
    const q = term.trim().toLowerCase()
    if (q.length < 2) return []

    const match = (...fields) => fields.filter(Boolean).join(' ').toLowerCase().includes(q)

    return [
      ...PLACES.filter((p) => match(p.name, p.district, p.blurb)).map((p) => ({
        key: `place-${p.id}`,
        group: 'Place',
        title: p.name,
        sub: p.district,
        image: p.image,
        to: '/location',
      })),
      ...posts.filter((p) => match(p.title, p.district, p.excerpt)).map((p) => ({
        key: `post-${p.id}`,
        group: 'Guide',
        title: p.title,
        sub: p.district,
        image: p.coverImage,
        to: `/blog/${p.slug}`,
      })),
        ...tours.filter((t) => match(t.title, t.category, t.summary, (t.locations || []).join(' '))).map((t) => ({
          key: `tour-${t.id}`,
          group: 'Tour',
          title: t.title,
          sub: t.category,
          image: t.image,
          to: `/tours/${t.slug || t.id}`,
        })),
      ...vehicles.filter((v) => match(v.name, v.category)).map((v) => ({
        key: `vehicle-${v.id}`,
        group: 'Vehicle',
        title: v.name,
        sub: v.category,
        image: v.image,
        to: `/vehicles/${v.slug}`,
      })),
    ].slice(0, 12)
  }, [term, posts, vehicles,tours])

  const go = (to) => {
    onClose()
    navigate(to)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto mt-[12vh] w-[92%] max-w-2xl overflow-hidden rounded-3xl bg-white shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-ink/8 px-5 py-4">
              <Search size={19} className="shrink-0 text-ink/40" />
              <input
                ref={inputRef}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search tours, places, guides and vehicles…"
                aria-label="Search the site"
                className="w-full bg-transparent text-base outline-none placeholder:text-ink/35"
              />
              <button onClick={onClose} aria-label="Close search" className="shrink-0 text-ink/40 hover:text-ink">
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto">
              {term.trim().length < 2 ? (
                <p className="px-5 py-8 text-center text-sm text-ink/45">
                  Type at least two letters — try “Ella”, “safari” or “van”.
                </p>
              ) : results.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-ink/45">
                  Nothing matched “{term}”. Try a district or a vehicle name.
                </p>
              ) : (
                <ul className="divide-y divide-ink/6">
                  {results.map((r) => (
                    <li key={r.key}>
                      <button
                        onClick={() => go(r.to)}
                        className="flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-sand"
                      >
                        <img
                          src={r.image}
                          alt=""
                          onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                          className="h-12 w-12 shrink-0 rounded-xl object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-ink">{r.title}</span>
                          <span className="block truncate text-xs text-ink/50">{r.sub}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-ink/6 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink/55">
                          {r.group}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}