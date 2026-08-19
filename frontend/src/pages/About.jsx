import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartHandshake, Languages, MapPinned, Users } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { useSite } from '../lib/SiteContext'

const facts = [
  { Icon: MapPinned, value: 'All 9 provinces', label: 'Routes we drive regularly' },
  { Icon: Users, value: '1 to 12 travellers', label: 'From a couple to a full van' },
  { Icon: Languages, value: 'English & Sinhala', label: 'Spoken by your driver' },
  { Icon: HeartHandshake, value: 'Fixed prices', label: 'Agreed before you travel' },
]

/** Photographs for the two body sections. */
const TEAM_IMAGE = '/images/hero/team.jpeg'
const TOGETHER_IMAGE = '/images/hero/together.jpeg'

/** Banner photo at the top of the page. */
const HEADER_IMAGE = '/images/hero/about-team.jpg'

/** Shows the photo, quietly swapping to a fallback if the file is missing. */
function AboutImage({ src, fallback, alt, className }) {
  const [current, setCurrent] = useState(src)

  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      onError={() => current !== fallback && setCurrent(fallback)}
      className={className}
    />
  )
}

export default function About() {
  const { settings } = useSite()

  return (
    <>
      <PageHeader
        title={settings?.aboutTitle || 'About Us'}
        subtitle={settings?.aboutIntro}
        image={settings?.aboutImage || HEADER_IMAGE}
        crumbs={['About']}
      />

      <section className="container-x py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal from="right">
            <span className="eyebrow"><span className="h-px w-8 bg-leaf" />Friendly staff</span>
            <h2 className="mt-4 text-[clamp(2rem,4vw,2.8rem)] leading-tight">
              A driver-guide, not just a car with a number plate
            </h2>
            <p className="mt-5 leading-relaxed text-ink/70">
              With a wide range of vehicles to suit your needs, our friendly staff are always on hand to make the
              journey as comfortable as possible. Let us take the hassle out of planning your next trip and enjoy the
              best service at the best price.
            </p>
            <p className="mt-4 leading-relaxed text-ink/70">
              Shan has been driving visitors around Sri Lanka for over a decade, from single airport runs to three
              week island loops. He knows which viewpoints are quiet at sunrise, which roads flood in the monsoon, and
              which small kade makes the best kottu on the way to Ella.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">Start planning</Link>
              <Link to="/reviews" className="btn-ghost">Read guest reviews</Link>
            </div>
          </Reveal>

          <Reveal from="left" delay={0.1}>
            <AboutImage
              src={TEAM_IMAGE}
              fallback={HEADER_IMAGE}
              alt="Shan with guests at Sigiriya"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-mango py-16">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(({ Icon, value, label }, i) => (
            <Reveal key={value} delay={i * 0.08}>
              <div className="rounded-3xl bg-white/70 p-7 backdrop-blur">
                <Icon size={24} className="text-leaf" />
                <p className="mt-4 font-display text-xl font-semibold text-ink">{value}</p>
                <p className="mt-1 text-sm text-ink/65">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <AboutImage
              src={TOGETHER_IMAGE}
              fallback="/images/hero/about-together.jpg"
              alt="Working together"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
            />
          </Reveal>
          <Reveal from="left" delay={0.1}>
            <span className="eyebrow"><span className="h-px w-8 bg-leaf" />Working together</span>
            <h2 className="mt-4 text-[clamp(2rem,4vw,2.8rem)] leading-tight">
              {settings?.aboutSecondaryTitle || 'Working together'}
            </h2>
            <p className="mt-5 leading-relaxed text-ink/70">
              {settings?.aboutSecondaryText ||
                'Whether you are travelling with a large group or just a few friends, our service is guaranteed to provide the best experience possible.'}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink/70">
              {[
                'We plan the route with you by email or WhatsApp before you arrive.',
                'Prices cover fuel, tolls, parking, and the driver\u2019s food and stay.',
                'Change your mind mid-trip and we rework the plan the same day.',
                'Hotels, safari jeeps and train tickets booked on request.',
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mango" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-24">
        <SectionHeading
          eyebrow="How a trip works"
          title="Four steps from first message to last goodbye"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            ['Tell us your dates', 'Send your arrival date, group size and the places on your list.'],
            ['Get a plan and a price', 'A day-by-day route with a fixed total, adjusted until it suits you.'],
            ['Meet your driver', 'Shan is waiting at the airport or your hotel with a name board.'],
            ['Travel, and change it freely', 'Stay longer somewhere you love. The plan follows you, not the reverse.'],
          ].map(([title, text], i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="card h-full p-7">
                <span className="font-display text-3xl font-semibold text-mango">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}