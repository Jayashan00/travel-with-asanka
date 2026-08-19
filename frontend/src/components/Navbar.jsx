import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, X, Phone, Search } from 'lucide-react'
import { useSite } from '../lib/SiteContext'
import { mediaUrl } from '../lib/api'
import { useWishlist } from '../lib/WishlistContext'
import SearchOverlay from './SearchOverlay'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/tours', label: 'Tours' },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/blog', label: 'Destinations' },
  { to: '/location', label: 'Location' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
]

export default function Navbar() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [logoBroken, setLogoBroken] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { count } = useWishlist()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => setLogoBroken(false), [settings?.logo])

  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable
      if (e.key === '/' && !typing) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const phone = settings?.contactPhone || '+94 76 441 2050'

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/92 shadow-card backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav className="container-x flex h-[72px] items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-3 whitespace-nowrap">
            {settings?.logo && !logoBroken ? (
              <img
                src={mediaUrl(settings.logo)}
                alt=""
                onError={() => setLogoBroken(true)}
                className="h-11 w-auto"
              />
            ) : (
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-leaf text-lg font-bold text-white">
                D
              </span>
            )}
            <span className="leading-tight">
              <span className="block font-display text-xl font-semibold leading-tight text-ink">
               {settings?.brandName || 'Denoah Lanka Holidays'}
              </span>
               <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/50">
                Travel with Shan
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 xl:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `relative whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition ${
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

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search the site"
              className="grid h-10 w-10 place-items-center rounded-full text-ink/60 transition hover:bg-ink/6 hover:text-ink"
            >
              <Search size={18} />
            </button>

            <Link
              to="/wishlist"
              aria-label={`My travel list, ${count} saved`}
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink/60 transition hover:bg-ink/6 hover:text-ink"
            >
              <Heart size={18} fill={count > 0 ? 'currentColor' : 'none'} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-mango px-1 text-[10px] font-bold text-ink">
                  {count}
                </span>
              )}
            </Link>

            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              aria-label={`Call ${phone}`}
              className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-ink/70 transition hover:bg-ink/6 hover:text-ink 2xl:flex"
            >
              <Phone size={15} className="text-leaf" />
              {phone}
            </a>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              aria-label={`Call ${phone}`}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink/60 transition hover:bg-ink/6 hover:text-ink 2xl:hidden"
            >
              <Phone size={18} />
            </a>
            <Link to="/contact" className="btn-accent ml-1 hidden whitespace-nowrap sm:inline-flex">
              Book a ride
            </Link>
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/12 xl:hidden"
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
              className="overflow-hidden bg-white xl:hidden"
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
                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-leaf/10 text-leaf' : 'text-ink/75'}`
                  }
                >
                  My travel list{count > 0 ? ` (${count})` : ''}
                </NavLink>
                <Link to="/contact" className="btn-accent mt-2">
                  Book a ride
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}