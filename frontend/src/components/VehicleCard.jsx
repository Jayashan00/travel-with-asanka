import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Fuel, Settings2, Snowflake, Users } from 'lucide-react'
import { mediaUrl, money } from '../lib/api'

export default function VehicleCard({ vehicle, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="relative overflow-hidden bg-shell">
        <img
          src={mediaUrl(vehicle.image)}
          alt={vehicle.name}
          loading="lazy"
          className="h-52 w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {vehicle.bestSelling && (
            <span className="rounded-full bg-mango px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
              Best selling
            </span>
          )}
          {vehicle.topRated && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-leaf">
              Top rated
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl leading-snug">{vehicle.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">{vehicle.category}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-lg font-semibold text-leaf">{money(vehicle.pricePerKm)}</p>
            <p className="text-[11px] uppercase tracking-wider text-ink/45">per km</p>
          </div>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/65">{vehicle.description}</p>

        <ul className="mt-5 grid grid-cols-2 gap-2 text-xs text-ink/70">
          <li className="flex items-center gap-2"><Users size={14} className="text-leaf" /> {vehicle.seats} seats</li>
          <li className="flex items-center gap-2"><Briefcase size={14} className="text-leaf" /> {vehicle.luggage} bags</li>
          <li className="flex items-center gap-2"><Settings2 size={14} className="text-leaf" /> {vehicle.transmission}</li>
          <li className="flex items-center gap-2"><Fuel size={14} className="text-leaf" /> {vehicle.fuel}</li>
          {vehicle.airConditioned && (
            <li className="flex items-center gap-2"><Snowflake size={14} className="text-leaf" /> Air conditioned</li>
          )}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-ink/8 pt-4">
          <span className="text-sm text-ink/60">
            Day hire <strong className="text-ink">{money(vehicle.pricePerDay)}</strong>
          </span>
          <Link
            to={`/vehicles/${vehicle.slug || vehicle.id}`}
            className="text-sm font-semibold text-leaf transition hover:text-leaf-dark"
          >
            View details →
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
