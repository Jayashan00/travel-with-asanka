import { motion } from 'framer-motion'
import { Bed, Binoculars, Luggage, Map, Plane, Route, Car } from 'lucide-react'
import { Link } from 'react-router-dom'

const icons = { map: Map, plane: Plane, bed: Bed, luggage: Luggage, binoculars: Binoculars, route: Route, car: Car }

export default function ServiceGrid({ services }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => {
        const Icon = icons[service.icon] || Map
        return (
          <motion.div
            key={service.id || service.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="group relative overflow-hidden rounded-3xl border border-ink/8 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-lift"
          >
            <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-mango/10 transition duration-500 group-hover:scale-150" />
            <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-leaf/10 text-leaf">
              <Icon size={22} />
            </span>
            <h3 className="relative mt-5 text-lg">{service.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-ink/65">{service.description}</p>
            <Link to="/contact" className="relative mt-5 inline-block text-sm font-semibold text-leaf">
              Ask about this →
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
