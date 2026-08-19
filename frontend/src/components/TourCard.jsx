import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Heart, MapPin, Users } from 'lucide-react'
import { mediaUrl, priceText } from '../lib/api'
import { useWishlist } from '../lib/WishlistContext'
import Stars from './Stars'

const FALLBACK_IMAGE = '/images/hero/hero-sigiriya.jpg'

/** One tour package in the listing grid. */
export default function TourCard({ tour, index = 0 }) {
  const { has, toggle } = useWishlist()
  const key = `tour:${tour.id}`
  const saved = has(key)
  const href = `/tours/${tour.slug || tour.id}`

  const price = Number(tour.price) || 0
  const oldPrice = Number(tour.oldPrice) || 0
  const hasDiscount = oldPrice > price && price > 0
  const off = hasDiscount ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="relative overflow-hidden bg-shell">
        <Link to={href} aria-label={tour.title}>
          <img
            src={mediaUrl(tour.image) || FALLBACK_IMAGE}
            alt={tour.title}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE }}
            className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          onClick={() =>
            toggle({
              key,
              type: 'tour',
              id: tour.id,
              name: tour.title,
              image: mediaUrl(tour.image) || FALLBACK_IMAGE,
              href,
            })
          }
          aria-pressed={saved}
          aria-label={saved ? `Remove ${tour.title} from your list` : `Save ${tour.title} to your list`}
          className={`absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${
            saved ? 'bg-leaf text-white' : 'bg-white/85 text-ink/55 hover:text-leaf'
          }`}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {tour.category && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-leaf">
              {tour.category}
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-mango px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
              Save {off}%
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {tour.rating > 0 && (
          <div className="mb-2 flex items-center gap-2">
            <Stars rating={tour.rating} size={14} />
            <span className="text-xs text-ink/50">
              {Number(tour.rating).toFixed(1)}
              {tour.reviewCount > 0 ? ` (${tour.reviewCount})` : ''}
            </span>
          </div>
        )}

        <h3 className="text-lg leading-snug">
          <Link to={href} className="transition hover:text-leaf">{tour.title}</Link>
        </h3>

        {tour.locations?.length > 0 && (
          <p className="mt-2 flex items-start gap-1.5 text-xs text-ink/55">
            <MapPin size={13} className="mt-0.5 shrink-0 text-leaf" />
            <span className="line-clamp-1">{tour.locations.join(' · ')}</span>
          </p>
        )}

        {tour.summary && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/65">{tour.summary}</p>
        )}

        <div className="mt-4 flex items-end gap-2">
          <span className="font-display text-xl font-semibold text-leaf">
            {priceText(tour.price, tour.currency)}
          </span>
          {hasDiscount && (
            <span className="pb-0.5 text-sm text-ink/40 line-through">
              {priceText(tour.oldPrice, tour.currency)}
            </span>
          )}
        </div>
        <p className="text-[11px] uppercase tracking-wider text-ink/45">From, per person</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink/8 pt-4 text-xs text-ink/65">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-leaf" />
            {tour.days} {tour.days === 1 ? 'day' : 'days'}
            {tour.nights > 0 ? ` / ${tour.nights}N` : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-leaf" /> up to {tour.maxGuests}
          </span>
          <Link to={href} className="font-semibold text-leaf transition hover:text-leaf-dark">
            Explore →
          </Link>
        </div>
      </div>
    </motion.article>
  )
}