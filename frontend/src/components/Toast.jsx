import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  const isError = toast?.type === 'error'
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          className="fixed bottom-6 left-1/2 z-[70] w-[min(92vw,26rem)] -translate-x-1/2"
        >
          <div
            className={`flex items-start gap-3 rounded-2xl px-5 py-4 text-sm shadow-lift ${
              isError ? 'bg-ink text-white' : 'bg-leaf text-white'
            }`}
          >
            {isError ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
            <p className="flex-1 leading-relaxed">{toast.message}</p>
            <button onClick={onClose} aria-label="Dismiss" className="opacity-70 transition hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
