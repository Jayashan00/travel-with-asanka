import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { mediaUrl } from '../lib/api'

export default function PageHeader({ title, subtitle, image = '/images/hero/contact-hero.jpg', crumbs = [] }) {
  return (
    <section className="relative h-[46vh] min-h-[320px] overflow-hidden">
      <motion.img
        src={mediaUrl(image)}
        alt=""
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'linear' }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/35 to-ink/65" />
      <div className="container-x relative flex h-full flex-col justify-center pt-10">
        <motion.nav
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70"
        >
          <Link to="/" className="hover:text-mango">Home</Link>
          {crumbs.map((c) => <span key={c}>· {c}</span>)}
        </motion.nav>
        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="max-w-3xl text-[clamp(2.2rem,5.5vw,3.6rem)] font-semibold leading-tight text-white"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-white/80"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}
