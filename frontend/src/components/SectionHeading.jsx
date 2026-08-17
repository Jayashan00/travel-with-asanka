import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, intro, align = 'center', light = false }) {
  const alignment = align === 'left' ? 'text-left items-start' : 'text-center items-center mx-auto'
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <span className={`eyebrow ${light ? 'text-mango' : ''}`}>
          <span className={`h-px w-8 ${light ? 'bg-mango' : 'bg-leaf'}`} />
          {eyebrow}
        </span>
      )}
      <h2 className={`text-3xl leading-tight sm:text-4xl md:text-[2.75rem] ${light ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {intro && <p className={`text-base leading-relaxed ${light ? 'text-white/80' : 'text-ink/70'}`}>{intro}</p>}
    </Reveal>
  )
}
