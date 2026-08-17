import { Star } from 'lucide-react'

export default function Stars({ rating = 5, size = 16, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'fill-mango text-mango' : 'text-ink/20'}
          strokeWidth={1.5}
        />
      ))}
    </span>
  )
}
