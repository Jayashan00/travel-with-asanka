import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Briefcase, Check, Fuel, Settings2, Snowflake, Users } from 'lucide-react'
import BookingForm from '../components/BookingForm'
import Reveal from '../components/Reveal'
import { api, mediaUrl, money } from '../lib/api'
import { EmptyState } from '../components/Loader'

export default function VehicleDetail() {
  const { slug } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setLoading(true)
    setFailed(false)
    api
      .get(`/vehicles/${slug}`)
      .then((res) => setVehicle(res.data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return <div className="container-x py-32"><div className="h-72 animate-pulse rounded-3xl bg-shell" /></div>
  }

  if (failed || !vehicle) {
    return (
      <div className="container-x py-32">
        <EmptyState
          title="That vehicle is no longer listed"
          hint="It may have been renamed or retired. Browse the current fleet instead."
          action={<Link to="/vehicles" className="btn-primary mt-2">See all vehicles</Link>}
        />
      </div>
    )
  }

  const specs = [
    { Icon: Users, label: 'Seats', value: vehicle.seats },
    { Icon: Briefcase, label: 'Luggage', value: `${vehicle.luggage} bags` },
    { Icon: Settings2, label: 'Gearbox', value: vehicle.transmission },
    { Icon: Fuel, label: 'Fuel', value: vehicle.fuel },
    { Icon: Snowflake, label: 'Climate', value: vehicle.airConditioned ? 'Air conditioned' : 'Fan only' },
  ]

  return (
    <div className="container-x py-16">
      <Link to="/vehicles" className="inline-flex items-center gap-2 text-sm font-semibold text-leaf">
        <ArrowLeft size={16} /> All vehicles
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
        <Reveal>
          <img
            src={mediaUrl(vehicle.image)}
            alt={vehicle.name}
            className="w-full rounded-3xl bg-white object-cover shadow-lift"
          />

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">{vehicle.category}</p>
            <h1 className="mt-2 text-[clamp(2rem,4vw,2.8rem)]">{vehicle.name}</h1>
            <p className="mt-4 leading-relaxed text-ink/70">{vehicle.description}</p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {specs.map(({ Icon, label, value }) => (
                <div key={label} className="rounded-2xl bg-white p-4 shadow-card">
                  <Icon size={18} className="text-leaf" />
                  <p className="mt-2 text-xs uppercase tracking-wider text-ink/45">{label}</p>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>

            {vehicle.features?.length > 0 && (
              <>
                <h2 className="mt-10 text-xl">Included with every hire</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {vehicle.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-ink/70">
                      <Check size={16} className="text-leaf" /> {f}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-10 flex flex-wrap gap-6 rounded-3xl bg-leaf px-7 py-6 text-white">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70">Per kilometre</p>
                <p className="font-display text-2xl font-semibold">{money(vehicle.pricePerKm)}</p>
              </div>
              <div className="h-auto w-px bg-white/25" />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70">Per day</p>
                <p className="font-display text-2xl font-semibold">{money(vehicle.pricePerDay)}</p>
              </div>
              <div className="h-auto w-px bg-white/25" />
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70">Free km per day</p>
                <p className="font-display text-2xl font-semibold">{vehicle.freeKmPerDay} km</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <BookingForm presetVehicleId={vehicle.id} compact />
        </div>
      </div>
    </div>
  )
}
