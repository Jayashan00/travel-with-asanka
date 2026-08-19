import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Check, Heart, MapPin, Users, X } from 'lucide-react'
import BookingForm from '../components/BookingForm'
import Reveal from '../components/Reveal'
import Stars from '../components/Stars'
import { EmptyState } from '../components/Loader'
import { api, mediaUrl, priceText } from '../lib/api'
import { useWishlist } from '../lib/WishlistContext'

const FALLBACK_IMAGE = '/images/hero/hero-sigiriya.jpg'

export default function TourDetail() {
  const { slug } = useParams()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const { has, toggle } = useWishlist()

  useEffect(() => {
    setLoading(true)
    setFailed(false)
    api
      .get(`/tours/${slug}`)
      .then((res) => setTour(res.data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return <div className="container-x py-32"><div className="h-72 animate-pulse rounded-3xl bg-shell" /></div>
  }

  if (failed || !tour) {
    return (
      <div className="container-x py-32">
        <EmptyState
          title="That tour is no longer listed"
          hint="It may have been renamed or replaced. Browse the current packages instead."
          action={<Link to="/tours" className="btn-primary mt-2">See all tours</Link>}
        />
      </div>
    )
  }

  const key = `tour:${tour.id}`
  const saved = has(key)
  const price = Number(tour.price) || 0
  const oldPrice = Number(tour.oldPrice) || 0
  const hasDiscount = oldPrice > price && price > 0
  const gallery = (tour.gallery || []).filter(Boolean)

  return (
    <div className="container-x py-16">
      <Link to="/tours" className="inline-flex items-center gap-2 text-sm font-semibold text-leaf">
        <ArrowLeft size={16} /> All tours
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
        <div>
          <Reveal>
            <img
              src={mediaUrl(tour.image) || FALLBACK_IMAGE}
              alt={tour.title}
              onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE }}
              className="h-[360px] w-full rounded-3xl bg-white object-cover shadow-lift"
            />
          </Reveal>

          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.slice(0, 6).map((g, i) => (
                <img
                  key={`${g}-${i}`}
                  src={mediaUrl(g)}
                  alt=""
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  className="h-24 w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          )}

          {tour.description && (
            <p className="mt-8 text-base leading-relaxed text-ink/70">{tour.description}</p>
          )}

          {tour.highlights?.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl">Highlights</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-ink/70">
                    <Check size={16} className="mt-0.5 shrink-0 text-leaf" /> {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tour.itinerary?.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl">Day by day</h2>
              <ol className="mt-4 space-y-3">
                {tour.itinerary.map((line, i) => (
                  <li key={`${i}-${line.slice(0, 12)}`} className="flex gap-4 rounded-2xl bg-white p-4 shadow-card">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-leaf/10 text-sm font-bold text-leaf">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-ink/70">{line}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {(tour.includes?.length > 0 || tour.excludes?.length > 0) && (
            <section className="mt-10 grid gap-6 sm:grid-cols-2">
              {tour.includes?.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-xl">What is included</h3>
                  <ul className="mt-3 space-y-2">
                    {tour.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
                        <Check size={15} className="mt-0.5 shrink-0 text-leaf" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.excludes?.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-xl">Not included</h3>
                  <ul className="mt-3 space-y-2">
                    {tour.excludes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink/60">
                        <X size={15} className="mt-0.5 shrink-0 text-ink/35" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

        {/* ------------------------------------------------------- side panel */}
        <div>
          <Reveal delay={0.08}>
            <div className="card p-7">
              {tour.category && (
                <span className="inline-flex rounded-full bg-leaf/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-leaf">
                  {tour.category}
                </span>
              )}
              <h1 className="mt-3 text-[clamp(1.7rem,3vw,2.4rem)] leading-tight">{tour.title}</h1>

              {tour.rating > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <Stars rating={tour.rating} size={15} />
                  <span className="text-xs text-ink/55">
                    {Number(tour.rating).toFixed(1)}
                    {tour.reviewCount > 0 ? ` · ${tour.reviewCount} reviews` : ''}
                  </span>
                </div>
              )}

              {tour.summary && <p className="mt-4 text-sm leading-relaxed text-ink/65">{tour.summary}</p>}

              <div className="mt-6 flex items-end gap-3">
                <span className="font-display text-3xl font-semibold text-leaf">
                  {priceText(tour.price, tour.currency)}
                </span>
                {hasDiscount && (
                  <span className="pb-1 text-base text-ink/40 line-through">
                    {priceText(tour.oldPrice, tour.currency)}
                  </span>
                )}
              </div>
              <p className="text-[11px] uppercase tracking-wider text-ink/45">From, per person</p>

              <ul className="mt-6 space-y-2 border-t border-ink/8 pt-5 text-sm text-ink/70">
                <li className="flex items-center gap-2">
                  <CalendarDays size={15} className="text-leaf" />
                  {tour.days} days{tour.nights > 0 ? ` / ${tour.nights} nights` : ''}
                </li>
                <li className="flex items-center gap-2">
                  <Users size={15} className="text-leaf" /> Up to {tour.maxGuests} guests
                </li>
                {tour.locations?.length > 0 && (
                  <li className="flex items-start gap-2">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-leaf" /> {tour.locations.join(' · ')}
                  </li>
                )}
              </ul>

              <button
                type="button"
                onClick={() =>
                  toggle({
                    key,
                    type: 'tour',
                    id: tour.id,
                    name: tour.title,
                    image: mediaUrl(tour.image) || FALLBACK_IMAGE,
                    href: `/tours/${tour.slug || tour.id}`,
                  })
                }
                aria-pressed={saved}
                className={`mt-6 w-full ${saved ? 'btn-primary' : 'btn-ghost'}`}
              >
                <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved to your list' : 'Save this tour'}
              </button>
            </div>
          </Reveal>

          <div className="mt-8">
            <h2 className="text-2xl">Request this tour</h2>
            <p className="mt-1 text-sm text-ink/60">
              Mention “{tour.title}” in the notes and we will price it for your dates.
            </p>
            <div className="mt-4">
              <BookingForm compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}