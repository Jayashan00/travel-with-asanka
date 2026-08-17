import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Heart, MapPin, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { CATEGORIES, PLACES } from '../lib/places'
import { useWishlist } from '../lib/WishlistContext'
import 'leaflet/dist/leaflet.css'

/** The whole island sits inside these two corners. */
const SRI_LANKA_BOUNDS = [
  [5.7, 79.5],
  [10.0, 82.0],
]

const HEADER_IMAGE = '/images/hero/hero-sigiriya.jpg'

/** A coloured teardrop pin drawn in SVG, so no marker images are needed. */
function pinIcon(color, active) {
  const scale = active ? 1.25 : 1
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="${32 * scale}" height="${44 * scale}">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 11.5 14.2 26.6 14.8 27.2a1.6 1.6 0 0 0 2.4 0C17.8 42.6 32 27.5 32 16 32 7.2 24.8 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="6.5" fill="#ffffff"/>
    </svg>`
  return L.divIcon({
    html: svg,
    className: 'twa-pin',
    iconSize: [32 * scale, 44 * scale],
    iconAnchor: [16 * scale, 44 * scale],
    popupAnchor: [0, -40 * scale],
  })
}

/**
 * Flies to a place chosen from the list below, then opens its popup.
 * This runs in an effect (never during render) so it cannot fight
 * Leaflet's own auto-pan when a pin is clicked directly.
 */
function FlyTo({ target, markers }) {
  const map = useMap()

  useEffect(() => {
    if (!target) return
    map.flyTo([target.place.lat, target.place.lng], 11, { duration: 1.1 })
    const id = setTimeout(() => markers.current[target.place.id]?.openPopup(), 1150)
    return () => clearTimeout(id)
  }, [target, map, markers])

  return null
}

function SaveButton({ place }) {
  const { has, toggle } = useWishlist()
  const key = `place:${place.id}`
  const saved = has(key)

  return (
    <button
      onClick={() => toggle({ key, type: 'place', id: place.id, name: place.name, image: place.image, href: '/location' })}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${place.name} from your list` : `Save ${place.name} to your list`}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        saved ? 'bg-leaf text-white' : 'bg-ink/6 text-ink/70 hover:bg-ink/10'
      }`}
    >
      <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}

export default function Location() {
  const [active, setActive] = useState(null)
  const [target, setTarget] = useState(null)
  const [filter, setFilter] = useState('all')
  const markers = useRef({})

  const shown = useMemo(
    () => (filter === 'all' ? PLACES : PLACES.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <>
      <PageHeader
        title="Where we can take you"
        subtitle="Every place below is somewhere we drive regularly. Tap a pin to see what it is and when to go."
        image={HEADER_IMAGE}
        crumbs={['Location']}
      />

      <section className="container-x py-14">
        <SectionHeading
          eyebrow="The whole island"
          title="Sri Lanka, pin by pin"
          intro="Twenty five of the places guests ask about most, from the northern ruins to the southern surf."
        />

        {/* Category filter */}
        <div className="mt-9 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              filter === 'all' ? 'bg-leaf text-white shadow-card' : 'bg-white text-ink/65 hover:text-ink'
            }`}
          >
            All places
          </button>
          {Object.entries(CATEGORIES).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                filter === key ? 'bg-leaf text-white shadow-card' : 'bg-white text-ink/65 hover:text-ink'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
              {meta.label}
            </button>
          ))}
        </div>

        {/* The map */}
        <Reveal className="mt-10">
          <div id="twa-map" className="overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-ink/8">
            <MapContainer
              bounds={SRI_LANKA_BOUNDS}
              scrollWheelZoom={false}
              className="h-[70vh] min-h-[520px] w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyTo target={target} markers={markers} />

              {shown.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.lat, place.lng]}
                  ref={(ref) => { markers.current[place.id] = ref }}
                  icon={pinIcon(CATEGORIES[place.category].color, active?.id === place.id)}
                  eventHandlers={{
                    popupopen: () => setActive(place),
                    popupclose: () => setActive((p) => (p?.id === place.id ? null : p)),
                  }}
                >
                  <Popup
                    minWidth={230}
                    maxWidth={250}
                    autoPan
                    keepInView
                    autoPanPadding={[24, 24]}
                  >
                    <div className="w-[226px]">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="h-24 w-full rounded-xl object-cover"
                        loading="lazy"
                      />
                      <p
                        className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
                        style={{ color: CATEGORIES[place.category].color }}
                      >
                        {place.district}
                      </p>
                      <h3 className="font-display text-lg font-semibold leading-tight text-ink">{place.name}</h3>
                      <p className="mt-1 text-[13px] leading-snug text-ink/70">{place.blurb}</p>
                      <p className="mt-2 rounded-lg bg-sand px-2.5 py-1.5 text-[12px] leading-snug text-ink/75">
                        <strong className="font-semibold">Our tip:</strong> {place.tip}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <SaveButton place={place} />
                        <Link to="/contact" className="text-xs font-semibold text-leaf hover:underline">
                          Add to my trip →
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          <p className="mt-3 text-center text-xs text-ink/45">
            Drag to move, pinch or use the buttons to zoom. Tap any pin for photos and advice.
          </p>
        </Reveal>
      </section>

      {/* Browsable list under the map */}
      <section className="container-x pb-24">
        <SectionHeading
          eyebrow="Or browse the list"
          title="Every place, with a photo"
          intro="Tap any card and the map above will fly straight to it."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((place, i) => (
            <Reveal key={place.id} delay={(i % 3) * 0.06}>
              <button
                onClick={() => {
                  setTarget({ place, nonce: Date.now() })
                  document.getElementById('twa-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }}
                className="group block h-full w-full overflow-hidden rounded-3xl bg-white text-left shadow-card transition hover:shadow-lift"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
                    style={{ background: CATEGORIES[place.category].color }}
                  >
                    {CATEGORIES[place.category].label}
                  </span>
                </div>
                <div className="p-6">
                  <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-ink/45">
                    <MapPin size={12} /> {place.district}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-ink">{place.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{place.blurb}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-leaf">Show on the map →</span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {active && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => { setActive(null); setTarget(null) }}
              className="inline-flex items-center gap-2 rounded-full bg-ink/6 px-5 py-2 text-sm font-semibold text-ink/70 hover:bg-ink/10"
            >
              <X size={14} /> Clear selection
            </button>
          </div>
        )}
      </section>
    </>
  )
}