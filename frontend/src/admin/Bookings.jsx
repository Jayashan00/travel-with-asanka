import { useEffect, useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { api, errorText } from '../lib/api'

const STATUSES = ['New', 'Confirmed', 'Completed', 'Cancelled']
const tone = {
  New: 'bg-mango/20 text-mango-dark',
  Confirmed: 'bg-leaf/10 text-leaf',
  Completed: 'bg-ink/5 text-ink/60',
  Cancelled: 'bg-red-50 text-red-600',
}

export default function Bookings({ notify }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  const load = () => {
    setLoading(true)
    api
      .get('/admin/bookings')
      .then((res) => setBookings(res.data))
      .catch((err) => notify?.({ type: 'error', message: errorText(err, 'Bookings could not be loaded.') }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const setStatus = async (booking, status) => {
    try {
      await api.patch(`/admin/bookings/${booking.id}/status`, { status })
      notify?.({ type: 'success', message: `Marked as ${status.toLowerCase()}.` })
      load()
    } catch (err) {
      notify?.({ type: 'error', message: errorText(err) })
    }
  }

  const remove = async (booking) => {
    if (!window.confirm(`Delete booking ${booking.reference}?`)) return
    try {
      await api.delete(`/admin/bookings/${booking.id}`)
      notify?.({ type: 'success', message: 'Booking deleted.' })
      load()
    } catch (err) {
      notify?.({ type: 'error', message: errorText(err) })
    }
  }

  const shown = filter === 'All' ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <div>
      <h1 className="text-2xl">Booking requests</h1>
      <p className="mt-1 text-sm text-ink/60">Every request sent from the site, newest first.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === s ? 'bg-leaf text-white' : 'bg-white text-ink/60 hover:text-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid place-items-center py-20 text-ink/50"><Loader2 className="animate-spin" /></div>
      ) : shown.length === 0 ? (
        <div className="card mt-6 px-8 py-16 text-center">
          <p className="text-lg">No booking requests here</p>
          <p className="mt-1 text-sm text-ink/55">Requests sent from the site land in this list.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {shown.map((b) => (
            <article key={b.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-ink/45">{b.reference}</p>
                  <p className="mt-1 font-semibold">{b.name} · {b.serviceType}</p>
                  <p className="text-xs text-ink/55">
                    <a href={`mailto:${b.email}`} className="hover:text-leaf">{b.email}</a>
                    {b.phone ? ` · ${b.phone}` : ''}{b.country ? ` · ${b.country}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${tone[b.status] || ''}`}>
                    {b.status}
                  </span>
                  <select
                    value={b.status}
                    onChange={(e) => setStatus(b, e.target.value)}
                    className="rounded-xl border border-ink/12 bg-white px-3 py-2 text-xs"
                    aria-label="Change booking status"
                  >
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => remove(b)} className="rounded-xl p-2 text-ink/50 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
                {[
                  ['Route', [b.pickupLocation, b.dropLocation].filter(Boolean).join(' → ') || '—'],
                  ['Pick up', [b.pickupDate, b.pickupTime].filter(Boolean).join(' at ') || '—'],
                  ['Travellers', `${b.passengers || 1} · ${b.days || 1} day${(b.days || 1) > 1 ? 's' : ''}`],
                  ['Vehicle', b.vehicleName || 'To be suggested'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[11px] uppercase tracking-wider text-ink/45">{label}</dt>
                    <dd className="mt-0.5 text-ink/75">{value}</dd>
                  </div>
                ))}
              </dl>

              {b.notes && <p className="mt-4 rounded-2xl bg-sand px-4 py-3 text-sm text-ink/70">{b.notes}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
