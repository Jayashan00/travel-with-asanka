import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Search, SlidersHorizontal, Users } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import TourCard from '../components/TourCard'
import Reveal from '../components/Reveal'
import { CardSkeleton, EmptyState } from '../components/Loader'
import { useCollection } from '../lib/useCollection'

const HEADER_IMAGE = '/images/hero/hero-sigiriya.jpg'

const SORTS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'days-asc', label: 'Duration: short to long' },
  { value: 'days-desc', label: 'Duration: long to short' },
  { value: 'rating', label: 'Rating' },
]

const EMPTY_FILTERS = { location: '', category: '', date: '', guests: '' }

export default function Tours() {
  const { data: tours, loading } = useCollection('/tours')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [sort, setSort] = useState('recommended')
  const resultsRef = useRef(null)

  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))

  const locations = useMemo(() => {
    const all = tours.flatMap((t) => t.locations || [])
    return Array.from(new Set(all.filter(Boolean))).sort((a, b) => a.localeCompare(b))
  }, [tours])

  const categories = useMemo(
    () => Array.from(new Set(tours.map((t) => t.category).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [tours],
  )

  const shown = useMemo(() => {
    const guests = Number(filters.guests) || 0
    const list = tours.filter((t) => {
      if (filters.location && !(t.locations || []).includes(filters.location)) return false
      if (filters.category && t.category !== filters.category) return false
      if (guests > 0 && Number(t.maxGuests || 0) < guests) return false
      return true
    })

    const num = (v) => (v === null || v === undefined || v === '' ? 0 : Number(v))
    const sorted = [...list]
    switch (sort) {
      case 'price-asc': sorted.sort((a, b) => num(a.price) - num(b.price)); break
      case 'price-desc': sorted.sort((a, b) => num(b.price) - num(a.price)); break
      case 'days-asc': sorted.sort((a, b) => num(a.days) - num(b.days)); break
      case 'days-desc': sorted.sort((a, b) => num(b.days) - num(a.days)); break
      case 'rating': sorted.sort((a, b) => num(b.rating) - num(a.rating)); break
      default: sorted.sort((a, b) => num(a.sortOrder) - num(b.sortOrder))
    }
    return sorted
  }, [tours, filters, sort])

  const runSearch = (e) => {
    e.preventDefault()
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filtersActive = Object.values(filters).some(Boolean)

  return (
    <>
      <PageHeader
        title="Explore Sri Lanka"
        subtitle="Ready made tour packages with a private driver, a clear price and room to change anything you like."
        image={HEADER_IMAGE}
        crumbs={['Tours']}
      />

      {/* ------------------------------------------------------------ search */}
      <section className="container-x relative z-10 -mt-14">
        <Reveal>
          <form onSubmit={runSearch} className="card p-5 sm:p-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div>
                <label className="label" htmlFor="tour-location">
                  <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-leaf" /> Location</span>
                </label>
                <select id="tour-location" className="field" value={filters.location} onChange={set('location')}>
                  <option value="">Anywhere in Sri Lanka</option>
                  {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="tour-type">
                  <span className="inline-flex items-center gap-1.5"><SlidersHorizontal size={13} className="text-leaf" /> Tour type</span>
                </label>
                <select id="tour-type" className="field" value={filters.category} onChange={set('category')}>
                  <option value="">All tour types</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="tour-date">
                  <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} className="text-leaf" /> Date from</span>
                </label>
                <input id="tour-date" type="date" className="field" value={filters.date} onChange={set('date')} />
              </div>

              <div>
                <label className="label" htmlFor="tour-guests">
                  <span className="inline-flex items-center gap-1.5"><Users size={13} className="text-leaf" /> Guests</span>
                </label>
                <input
                  id="tour-guests"
                  type="number"
                  min="1"
                  max="30"
                  placeholder="Any"
                  className="field"
                  value={filters.guests}
                  onChange={set('guests')}
                />
              </div>

              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full">
                  <Search size={16} /> Search
                </button>
              </div>
            </div>

            {filtersActive && (
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="mt-4 text-xs font-semibold text-ink/50 underline underline-offset-4 transition hover:text-leaf"
              >
                Clear all filters
              </button>
            )}
          </form>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ results */}
      <section ref={resultsRef} className="container-x scroll-mt-24 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/8 pb-5">
          <p className="text-sm text-ink/60">
            <strong className="text-ink">{loading ? '…' : shown.length}</strong>{' '}
            {shown.length === 1 ? 'tour' : 'tours'}
            {filtersActive ? ' match your search' : ' available'}
          </p>
          <label className="flex items-center gap-2 text-sm text-ink/60">
            Sort by
            <select
              className="rounded-full border border-ink/12 bg-white px-4 py-2 text-sm font-semibold text-ink outline-none transition focus:border-leaf"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort tours"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-10">
          {loading ? (
            <CardSkeleton count={6} />
          ) : shown.length === 0 ? (
            <EmptyState
              title="No tours match that search"
              hint="Try a different location or tour type — or ask us to build a package around your own plan."
              action={<Link to="/contact" className="btn-primary mt-2">Request a custom tour</Link>}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((t, i) => <TourCard key={t.id} tour={t} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ custom */}
      <section className="container-x pb-24">
        <Reveal>
          <div className="card overflow-hidden bg-ink text-white">
            <div className="grid gap-8 p-9 sm:p-12 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
              <div>
                <span className="eyebrow text-mango">
                  <span className="h-px w-8 bg-mango" />
                  Made for you
                </span>
                <h2 className="mt-4 text-3xl leading-tight text-white sm:text-4xl">
                  Request a customised tour package
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
                  Tell us your dates, how many are travelling and what you would like to see. Shan will send
                  a day by day plan and one clear price, usually within a few hours.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link to="/contact" className="btn-accent">Get a quote</Link>
                <Link to="/wishlist" className="btn-ghost border-white/25 bg-white/10 text-white hover:border-mango hover:text-mango">
                  My travel list
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}