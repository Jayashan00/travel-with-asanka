import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Car, Images, Mail, MapPinned, MessageSquareQuote } from 'lucide-react'
import { api, errorText } from '../lib/api'

export default function Dashboard({ notify }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch((err) => notify?.({ type: 'error', message: errorText(err, 'The summary could not be loaded.') }))
  }, [])

  const cards = [
    { key: 'newBookings', label: 'New booking requests', Icon: CalendarCheck, to: '/admin/bookings', accent: true },
    { key: 'unreadMessages', label: 'Unread messages', Icon: Mail, to: '/admin/messages', accent: true },
    { key: 'vehicles', label: 'Vehicles listed', Icon: Car, to: '/admin/vehicles' },
    { key: 'posts', label: 'Destination guides', Icon: MapPinned, to: '/admin/posts' },
    { key: 'testimonials', label: 'Reviews', Icon: MessageSquareQuote, to: '/admin/testimonials' },
    { key: 'photos', label: 'Gallery photos', Icon: Images, to: '/admin/gallery' },
  ]

  return (
    <div>
      <h1 className="text-2xl">Welcome back</h1>
      <p className="mt-1 text-sm text-ink/60">Everything on the public site is managed from here.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ key, label, Icon, to, accent }) => (
          <Link
            key={key}
            to={to}
            className={`card p-6 transition hover:-translate-y-1 hover:shadow-lift ${accent ? 'border-mango/40' : ''}`}
          >
            <Icon size={22} className={accent ? 'text-mango' : 'text-leaf'} />
            <p className="mt-4 font-display text-3xl font-semibold">
              {stats ? stats[key] ?? 0 : <span className="inline-block h-8 w-10 animate-pulse rounded bg-shell" />}
            </p>
            <p className="mt-1 text-sm text-ink/60">{label}</p>
          </Link>
        ))}
      </div>

      <div className="card mt-8 p-7">
        <h2 className="text-lg">Changing the pictures</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">
          Every image on the site can be replaced here. Open any item, use <strong>Upload image</strong> to pick a photo
          from your computer, or paste an image address. Save, and the public site updates immediately — no developer
          needed. The homepage slideshow lives under <Link to="/admin/settings" className="font-semibold text-leaf">Site content</Link>.
        </p>
      </div>
    </div>
  )
}
