import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

/**
 * Signature element: a dotted route line down the home page with a marker that
 * advances as you scroll, like a journey progressing across the island.
 */
export default function JourneyLine({ children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })
  const markerTop = useTransform(progress, (v) => `${v * 100}%`)

  return (
    <div ref={ref} className="relative">
      <div className="pointer-events-none absolute left-[26px] top-0 hidden h-full w-px xl:block">
        <div className="h-full w-px border-l-2 border-dashed border-ink/12" />
        <motion.div style={{ scaleY: progress }} className="absolute left-0 top-0 h-full w-[2px] origin-top bg-leaf/60" />
        <motion.span
          style={{ top: markerTop }}
          className="absolute -left-[9px] grid h-5 w-5 place-items-center rounded-full bg-mango shadow-card"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ink" />
        </motion.span>
      </div>
      {children}
    </div>
  )
}
