import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, Loader2 } from 'lucide-react'
import { api, errorText } from '../lib/api'
import { useCollection } from '../lib/useCollection'

const SERVICES = [
  'Tour around Sri Lanka',
  'Airport transfer',
  'Hotel booking',
  'Baggage transport',
  'Safari day trip',
  'Point to point taxi',
]

const empty = {
  name: '', email: '', phone: '', country: '',
  serviceType: SERVICES[0], vehicleId: '', pickupLocation: '', dropLocation: '',
  pickupDate: '', pickupTime: '', passengers: 2, days: 1, notes: '',
}

/** Booking request form. Saves to the API and shows the reference number. */
export default function BookingForm({ presetVehicleId = '', compact = false, onDone }) {
  const { data: vehicles } = useCollection('/vehicles')
  const [form, setForm] = useState({ ...empty, vehicleId: presetVehicleId })
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const vehicle = vehicles.find((v) => v.id === form.vehicleId)
      const { data } = await api.post('/bookings', {
        ...form,
        passengers: Number(form.passengers) || 1,
        days: Number(form.days) || 1,
        vehicleName: vehicle?.name || '',
      })
      setResult(data)
      setForm({ ...empty, vehicleId: presetVehicleId })
      onDone?.(data)
    } catch (err) {
      setError(errorText(err, 'The booking could not be sent. Check your details and try again.'))
    } finally {
      setBusy(false)
    }
  }

  if (result) {
    return (
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="card p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf/10 text-leaf">
          <CalendarCheck size={26} />
        </span>
        <h3 className="mt-4 text-2xl">Booking request received</h3>
        <p className="mt-2 text-sm text-ink/65">{result.message}</p>
        <p className="mt-4 inline-block rounded-full bg-shell px-4 py-2 font-mono text-sm">
          Reference {result.reference}
        </p>
        <button onClick={() => setResult(null)} className="btn-ghost mt-6">
          Send another request
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8">
      <h3 className="text-2xl">Request a booking</h3>
      <p className="mt-1 text-sm text-ink/60">
        Tell us the dates and the route. You'll get a price and a confirmation, with nothing to pay online.
      </p>

      <div className={`mt-6 grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <div>
          <label className="label" htmlFor="bk-name">Your name</label>
          <input id="bk-name" required className="field" value={form.name} onChange={set('name')} placeholder="Marie Schob" />
        </div>
        <div>
          <label className="label" htmlFor="bk-email">Email</label>
          <input id="bk-email" type="email" required className="field" value={form.email} onChange={set('email')} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label" htmlFor="bk-phone">Phone or WhatsApp</label>
          <input id="bk-phone" className="field" value={form.phone} onChange={set('phone')} placeholder="+33 6 12 34 56 78" />
        </div>
        <div>
          <label className="label" htmlFor="bk-country">Country</label>
          <input id="bk-country" className="field" value={form.country} onChange={set('country')} placeholder="France" />
        </div>
        <div>
          <label className="label" htmlFor="bk-service">Service</label>
          <select id="bk-service" className="field" value={form.serviceType} onChange={set('serviceType')}>
            {SERVICES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="bk-vehicle">Preferred vehicle</label>
          <select id="bk-vehicle" className="field" value={form.vehicleId} onChange={set('vehicleId')}>
            <option value="">Let Asanka suggest one</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name} · {v.seats} seats</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="bk-from">Pick up from</label>
          <input id="bk-from" className="field" value={form.pickupLocation} onChange={set('pickupLocation')} placeholder="Colombo airport (CMB)" />
        </div>
        <div>
          <label className="label" htmlFor="bk-to">Going to</label>
          <input id="bk-to" className="field" value={form.dropLocation} onChange={set('dropLocation')} placeholder="Kandy" />
        </div>
        <div>
          <label className="label" htmlFor="bk-date">Pick up date</label>
          <input id="bk-date" type="date" className="field" value={form.pickupDate} onChange={set('pickupDate')} />
        </div>
        <div>
          <label className="label" htmlFor="bk-time">Pick up time</label>
          <input id="bk-time" type="time" className="field" value={form.pickupTime} onChange={set('pickupTime')} />
        </div>
        <div>
          <label className="label" htmlFor="bk-pax">Travellers</label>
          <input id="bk-pax" type="number" min="1" max="20" className="field" value={form.passengers} onChange={set('passengers')} />
        </div>
        <div>
          <label className="label" htmlFor="bk-days">Days</label>
          <input id="bk-days" type="number" min="1" max="60" className="field" value={form.days} onChange={set('days')} />
        </div>
      </div>

      <div className="mt-4">
        <label className="label" htmlFor="bk-notes">Anything else</label>
        <textarea id="bk-notes" rows={4} className="field" value={form.notes} onChange={set('notes')}
          placeholder="Two adults and a toddler, we'd like to see Sigiriya and stay near Ella for two nights." />
      </div>

      {error && <p className="mt-4 rounded-2xl bg-ink/5 px-4 py-3 text-sm text-ink">{error}</p>}

      <button type="submit" disabled={busy} className="btn-primary mt-6 w-full sm:w-auto">
        {busy ? <><Loader2 size={17} className="animate-spin" /> Sending</> : 'Send booking request'}
      </button>
    </form>
  )
}
