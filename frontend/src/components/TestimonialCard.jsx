import { Quote } from 'lucide-react'
import Stars from './Stars'
import { mediaUrl } from '../lib/api'

const sourceColor = {
  Google: 'bg-[#4285F4]/10 text-[#2b6cb0]',
  TripAdvisor: 'bg-[#34E0A1]/15 text-[#0b7a55]',
  Facebook: 'bg-[#1877F2]/10 text-[#1454a8]',
}

export default function TestimonialCard({ item }) {
  const initials = (item.name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  return (
    <figure className="card flex h-full flex-col gap-4 p-7">
      <Quote size={26} className="text-mango" />
      <blockquote className="flex-1 text-sm leading-relaxed text-ink/75">{item.message}</blockquote>
      <Stars rating={item.rating || 5} />
      <figcaption className="flex items-center gap-3 border-t border-ink/8 pt-4">
        {item.avatar ? (
          <img src={mediaUrl(item.avatar)} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf/10 text-sm font-bold text-leaf">
            {initials}
          </span>
        )}
        <span className="flex-1">
          <span className="block text-sm font-semibold">{item.name}</span>
          <span className="block text-xs text-ink/50">{item.country}</span>
        </span>
        {item.source && (
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${sourceColor[item.source] || 'bg-ink/5 text-ink/60'}`}>
            {item.source}
          </span>
        )}
      </figcaption>
    </figure>
  )
}
