import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { mediaUrl } from '../lib/api'

export default function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  const image = index === null ? null : images[index]

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-ink/92 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 text-white/80 hover:text-white">
            <X size={26} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            aria-label="Previous photo"
            className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white sm:left-8"
          >
            <ChevronLeft size={24} />
          </button>
          <motion.figure
            key={index}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={mediaUrl(image.url)} alt={image.caption || ''} className="max-h-[76vh] w-full rounded-2xl object-contain" />
            {image.caption && <figcaption className="mt-4 text-center text-sm text-white/75">{image.caption}</figcaption>}
          </motion.figure>
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            aria-label="Next photo"
            className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white sm:right-8"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
