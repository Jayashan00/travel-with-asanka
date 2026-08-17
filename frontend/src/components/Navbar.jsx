import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import { useSite } from '../lib/SiteContext'
import { mediaUrl } from '../lib/api'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/vehicles', label: 'Vehicles & tariffs' },
  { to: '/blog', label: 'Destinations' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
]

export default function Navbar() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const phone = settings?.contactPhone || '+94 76 185 7110'

  return (
    <>
      <div className="hidden bg-ink py-2 text-center text-[11px] uppercase tracking-[0.28em] text-white/75 md:block">
        {settings?.tagline || 'Best affordable, friendly taxi and travel partner in Sri Lanka'}
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/92 shadow-card backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav className="container-x flex h-[72px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            {settings?.logo ? (
              <img src={mediaUrl(settings.logo)} alt="" className="h-11 w-auto" />
            ) : (
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-leaf text-lg font-bold text-white">
                A
              </span>
            )}
            <span className="leading-tight">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-ink/50">
                Travel with
              </span>
              <span className="block font-display text-xl font-semibold text-ink">
                {(settings?.brandName || 'Travel With Asanka').replace(/^Travel With /i, '')}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'text-leaf' : 'text-ink/70 hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-leaf/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="hidden items-center gap-2 text-sm font-semibold text-ink/70 xl:flex">
              <Phone size={15} className="text-leaf" /> {phone}
            </a>
            <Link to="/contact" className="btn-accent hidden sm:inline-flex">
              Book a ride
            </Link>
            <button
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/12 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white lg:hidden"
            >
              <div className="container-x flex flex-col gap-1 py-4">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-leaf/10 text-leaf' : 'text-ink/75'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <Link to="/contact" className="btn-accent mt-2">
                  Book a ride
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
