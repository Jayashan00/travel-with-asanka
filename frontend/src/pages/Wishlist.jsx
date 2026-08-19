import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { EmptyState } from '../components/Loader'
import { useWishlist } from '../lib/WishlistContext'

const HEADER_IMAGE = '/images/hero/hero-south-coast.jpg'

export default function Wishlist() {
  const { items, remove, clear } = useWishlist()

  /** Sends the saved list to the contact form so the visitor does not retype it. */
  const enquiryLink = items.length
    ? `/contact?places=${encodeURIComponent(items.map((i) => i.name).join(', '))}`
    : '/contact'

  return (
    <>
      <PageHeader
        title="My travel list"
        subtitle="The places and vehicles you saved. Send them to us and we will build the route around them."
        image={HEADER_IMAGE}
        crumbs={['My list']}
      />

      <section className="container-x py-16">
        {items.length === 0 ? (
          <EmptyState
            title="Nothing saved yet"
            hint="Tap the heart on any place or vehicle and it will appear here."
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-ink/60">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved on this device.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={enquiryLink} className="btn-primary">Send this list to Shan</Link>
                <button onClick={clear} className="btn-ghost">Clear all</button>
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <Reveal key={item.key} delay={(i % 3) * 0.06}>
                  <div className="group relative overflow-hidden rounded-3xl bg-white shadow-card">
                    <div className="h-44 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">
                        {item.type === 'vehicle' ? 'Vehicle' : item.type === 'tour' ? 'Tour' : 'Place'}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold text-ink">{item.name}</h3>
                      <div className="mt-4 flex items-center justify-between">
                        <Link to={item.href || '/location'} className="text-sm font-semibold text-leaf hover:underline">
                          View →
                        </Link>
                        <button
                          onClick={() => remove(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/45 transition hover:text-ink"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-ink/45">
              <Heart size={13} /> This list is stored in your browser only, so it will not follow you to another device.
            </p>
          </>
        )}
      </section>
    </>
  )
}