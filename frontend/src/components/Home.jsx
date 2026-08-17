import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Clock, HandCoins, ShieldCheck } from 'lucide-react'
import Hero from '../components/Hero'
import JourneyLine from '../components/JourneyLine'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import ServiceGrid from '../components/ServiceGrid'
import VehicleCard from '../components/VehicleCard'
import TestimonialCard from '../components/TestimonialCard'
import Stars from '../components/Stars'
import { CardSkeleton } from '../components/Loader'
import { useCollection } from '../lib/useCollection'
import { useSite } from '../lib/SiteContext'
import { mediaUrl } from '../lib/api'

const promises = [
  { Icon: HandCoins, title: 'Price agreed first', text: 'You get the full cost in writing before the trip. No meter, no surprise extras at the end.' },
  { Icon: ShieldCheck, title: 'Safe on every road', text: 'Insured vehicles, seat belts in every seat and a driver who knows the mountain bends.' },
  { Icon: Clock, title: 'We wait, happily', text: 'One more photo, one more temple, one more cup of tea. The schedule bends around you.' },
  { Icon: BadgeCheck, title: 'Local knowledge', text: 'Which park the elephants moved to this week, and which viewpoint is empty at 7am.' },
]

export default function Home() {
  const { settings } = useSite()
  const { data: services, loading: servicesLoading } = useCollection('/services')
  const { data: vehicles, loading: vehiclesLoading } = useCollection('/vehicles')
  const { data: posts } = useCollection('/posts')
  const { data: reviews } = useCollection('/testimonials')

  const featuredPosts = posts.slice(0, 3)
  const featuredReviews = reviews.filter((r) => r.featured).slice(0, 3)
  const shown = featuredReviews.length ? featuredReviews : reviews.slice(0, 3)

  return (
    <>
      <Hero />

      <JourneyLine>
        {/* Trust bar */}
        <section className="relative z-10 -mt-16">
          <div className="container-x">
            <Reveal className="grid gap-px overflow-hidden rounded-3xl bg-ink/8 shadow-lift sm:grid-cols-3">
              {[
                { value: `${settings?.googleRating ?? 5}.0`, label: 'Google rating', sub: `${settings?.googleReviewCount ?? 60}+ reviews` },
                { value: `${settings?.tripadvisorRating ?? 5}.0`, label: 'TripAdvisor', sub: `${settings?.tripadvisorReviewCount ?? 60}+ reviews` },
                { value: '10+', label: 'Years driving', sub: 'Across all nine provinces' },
              ].map((s) => (
                <div key={s.label} className="bg-white px-8 py-7 text-center">
                  <p className="font-display text-3xl font-semibold text-leaf">{s.value}</p>
                  <p className="mt-1 text-sm font-semibold">{s.label}</p>
                  <p className="text-xs text-ink/50">{s.sub}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Invitation */}
        <section className="container-x py-20 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal from="right">
              <span className="eyebrow"><span className="h-px w-8 bg-leaf" />Let us take you on an adventure</span>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] leading-tight">
                An affordable travel partner who actually knows the island
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink/70">
                {settings?.aboutIntro ||
                  'Friendly staff, competitive prices and a wide selection of vehicles. Whether you travel alone or with a large group, the plan is built around you.'}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/contact" className="btn-primary">Plan my trip <ArrowRight size={16} /></Link>
                <Link to="/about" className="btn-ghost">Meet Asanka</Link>
              </div>
            </Reveal>

            <Reveal from="left" delay={0.1} className="relative">
              <img
                src={mediaUrl(settings?.aboutImage || '/images/hero/about-team.jpg')}
                alt="Travelling through the Sri Lankan hill country"
                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="absolute -bottom-7 -left-4 w-56 rounded-3xl bg-white p-5 shadow-lift sm:-left-8"
              >
                <Stars rating={5} />
                <p className="mt-2 text-sm leading-snug text-ink/70">
                  "Better than our own itinerary." — Peter &amp; Anne, UK
                </p>
              </motion.div>
            </Reveal>
          </div>
        </section>

        {/* Services */}
        <section className="bg-white py-20 sm:py-24">
          <div className="container-x">
            <SectionHeading
              eyebrow="Our services"
              title="Everything you need, arranged before you land"
              intro="Pick one, or let us handle the whole trip from the arrivals hall to the departure gate."
            />
            <div className="mt-12">
              {servicesLoading ? <CardSkeleton /> : <ServiceGrid services={services} />}
            </div>
          </div>
        </section>

        {/* Fleet */}
        <section className="container-x py-20 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              align="left"
              eyebrow="Our fleet"
              title="Choose the vehicle that fits your group"
              intro="Every price below includes fuel, the driver's meals and accommodation, and air conditioning."
            />
            <Link to="/vehicles" className="btn-ghost">All vehicles & tariffs</Link>
          </div>
          <div className="mt-12">
            {vehiclesLoading ? (
              <CardSkeleton />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.slice(0, 6).map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
              </div>
            )}
          </div>
        </section>

        {/* Why us */}
        <section className="bg-leaf py-20 text-white sm:py-24">
          <div className="container-x">
            <SectionHeading light eyebrow="Why travellers stay with us" title="Four promises we keep on every trip" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {promises.map(({ Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 0.08}>
                  <div className="h-full rounded-3xl bg-white/10 p-7 backdrop-blur-sm transition hover:bg-white/15">
                    <Icon size={26} className="text-mango" />
                    <h3 className="mt-4 text-lg text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Destinations */}
        <section className="container-x py-20 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              align="left"
              eyebrow={settings?.ceylonSectionSubtitle || "Sri Lanka's beautiful places"}
              title="Where we can take you"
              intro="Short guides to the places our guests ask about most, written from the driver's seat."
            />
            <Link to="/blog" className="btn-ghost">All destinations</Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredPosts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.1}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group relative block h-[380px] overflow-hidden rounded-3xl shadow-card"
                >
                  <img
                    src={mediaUrl(post.coverImage)}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-mango">{post.district}</p>
                    <h3 className="mt-1 text-2xl">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/80">{post.excerpt}</p>
                    <span className="mt-3 inline-block text-sm font-semibold text-mango">Continue reading →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Ceylon panel */}
        <section className="relative overflow-hidden">
          <img
            src={mediaUrl(settings?.ceylonImage || '/images/hero/ceylon.jpg')}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/70" />
          <div className="container-x relative py-24 text-center text-white">
            <Reveal>
              <p className="eyebrow justify-center text-mango">Democratic Socialist Republic of</p>
              <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,4rem)] font-semibold">
                {settings?.ceylonSectionTitle || 'Ceylon'}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80">
                {settings?.countryIntro}
              </p>
              <Link to="/blog" className="btn-accent mt-8">Explore the island</Link>
            </Reveal>
          </div>
        </section>

        {/* Reviews */}
        <section className="container-x py-20 sm:py-24">
          <SectionHeading
            eyebrow="What our clients say"
            title="Real reviews from real guests"
            intro="Collected on Facebook, Google and TripAdvisor after trips that actually happened."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {shown.map((r) => <TestimonialCard key={r.id} item={r} />)}
          </div>
          <div className="mt-10 flex justify-center">
            <Link to="/reviews" className="btn-ghost">See all reviews</Link>
          </div>
        </section>

        {/* Closing CTA — the ticket */}
        <section className="container-x pb-24">
          <Reveal>
            <div className="ticket-edge relative overflow-hidden rounded-[2rem] bg-ink px-8 py-14 text-center text-white sm:px-16">
              <div className="absolute inset-y-0 left-1/2 hidden w-px border-l-2 border-dashed border-white/15 lg:block" />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:text-left">
                <div>
                  <p className="eyebrow text-mango">Your seat is open</p>
                  <h2 className="mt-3 text-[clamp(2rem,4vw,2.8rem)] leading-tight">
                    Tell us your dates. We'll build the route.
                  </h2>
                  <p className="mt-4 text-white/75">
                    Send a message today and get a full itinerary with prices, usually within a few hours.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-end">
                  <Link to="/contact" className="btn-accent">Get in touch</Link>
                  <a
                    href={`https://wa.me/${settings?.whatsapp || '94761857110'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn border border-white/35 text-white hover:bg-white hover:text-ink"
                  >
                    WhatsApp Asanka
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </JourneyLine>
    </>
  )
}
