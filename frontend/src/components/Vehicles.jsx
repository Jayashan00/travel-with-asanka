import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import VehicleCard from '../components/VehicleCard'
import { CardSkeleton, EmptyState } from '../components/Loader'
import { useCollection } from '../lib/useCollection'
import { money } from '../lib/api'

export default function Vehicles() {
  const { data: vehicles, loading } = useCollection('/vehicles')
  const [filter, setFilter] = useState('All')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(vehicles.map((v) => v.category).filter(Boolean)))],
    [vehicles],
  )
  const shown = filter === 'All' ? vehicles : vehicles.filter((v) => v.category === filter)

  return (
    <>
      <PageHeader
        title="Vehicles & tariffs"
        subtitle="Clean, air conditioned vehicles with fuel and the driver included in every price."
        image="/images/places/ella.jpg"
        crumbs={['Vehicles']}
      />

      <section className="container-x py-16">
        <SectionHeading
          eyebrow="Our fleet"
          title="Pick the right size, pay one clear price"
          intro="Per kilometre rates suit day trips; day hire suits multi-day tours. Long trips are usually quoted as a package, so ask us for the exact total."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                filter === c ? 'bg-leaf text-white shadow-card' : 'bg-white text-ink/65 hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {loading ? (
            <CardSkeleton count={6} />
          ) : shown.length === 0 ? (
            <EmptyState title="No vehicles in this category yet" hint="Try another category, or ask us what is available for your dates." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {!loading && vehicles.length > 0 && (
        <section className="container-x pb-24">
          <div className="card overflow-hidden">
            <div className="border-b border-ink/8 px-7 py-6">
              <h2 className="text-2xl">Tariff table</h2>
              <p className="mt-1 text-sm text-ink/60">
                Rates in Sri Lankan rupees. Day hire includes {vehicles[0]?.freeKmPerDay || 100} km per day; extra
                kilometres are charged at the per-km rate.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-shell text-xs uppercase tracking-wider text-ink/60">
                  <tr>
                    <th className="px-7 py-4">Vehicle</th>
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Seats</th>
                    <th className="px-4 py-4">Per km</th>
                    <th className="px-7 py-4">Per day</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id} className="border-t border-ink/6 transition hover:bg-sand">
                      <td className="px-7 py-4 font-semibold">{v.name}</td>
                      <td className="px-4 py-4 text-ink/65">{v.category}</td>
                      <td className="px-4 py-4 text-ink/65">{v.seats}</td>
                      <td className="px-4 py-4 text-ink/65">{money(v.pricePerKm)}</td>
                      <td className="px-7 py-4 font-semibold text-leaf">{money(v.pricePerDay)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
