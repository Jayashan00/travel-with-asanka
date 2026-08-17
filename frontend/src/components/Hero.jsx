import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { mediaUrl } from '../lib/api'
import { useSite } from '../lib/SiteContext'
import Stars from './Stars'

const FALLBACK = [
  {
    image: '/images/hero/hero-sigiriya.jpg',
    title: 'Feel the nature',
    subtitle: 'Sigiriya at sunrise, on the road before the crowds wake up.',
    ctaLabel: 'Plan my trip',
    ctaLink: '/contact',
  },
]

export default function Hero() {
  const { settings } = useSite()
  const slides = settings?.heroSlides?.length ? settings.heroSlides : FALLBACK
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return undefined
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500)
    return () => clearInterval(id)
  }, [slides.length])

  const slide = slides[index] || slides[0]

  return (
    <section className="relative h-[92vh] min-h-[560px] w-full overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.1 }, scale: { duration: 7.5, ease: 'linear' } }}
        >
          <img
            src={mediaUrl(slide.image)}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/70" />

      <div className="container-x relative flex h-full flex-col justify-center pb-24 pt-16">
        <motion.p
          key={`eyebrow-${index}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-mango" />
          {settings?.heroEyebrow || 'Sri Lanka, at your own pace'}
        </motion.p>

        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${index}`}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.6rem,7vw,4.75rem)] font-semibold leading-[1.02] text-white"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${index}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 max-w-lg text-lg leading-relaxed text-white/85"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link to={slide.ctaLink || '/contact'} className="btn-accent">
              {slide.ctaLabel || 'Plan my trip'} <ArrowRight size={17} />
            </Link>
            <Link
              to="/vehicles"
              className="btn border border-white/40 text-white hover:bg-white hover:text-ink"
            >
              See vehicles & prices
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80"
          >
            <span className="flex items-center gap-2">
              <Stars rating={settings?.googleRating || 5} size={15} />
              {settings?.googleRating || 5}.0 on Google
            </span>
            <span className="hidden h-4 w-px bg-white/30 sm:block" />
            <span>{settings?.tripadvisorReviewCount || 60}+ five star reviews on TripAdvisor</span>
          </motion.div>
        </div>
      </div>

      {/* Slide controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 left-0 right-0">
          <div className="container-x flex items-center gap-3">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}: ${s.title || ''}`}
                aria-current={i === index}
                className="group h-1.5 flex-1 max-w-[84px] overflow-hidden rounded-full bg-white/30"
              >
                <span
                  className={`block h-full rounded-full bg-mango transition-all duration-500 ${
                    i === index ? 'w-full' : 'w-0 group-hover:w-1/3'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70">
        <ChevronDown size={26} className="animate-float" />
      </div>
    </section>
  )
}
