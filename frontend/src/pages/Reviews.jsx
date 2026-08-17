import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import TestimonialCard from '../components/TestimonialCard'
import Stars from '../components/Stars'
import Reveal from '../components/Reveal'
import { CardSkeleton, EmptyState } from '../components/Loader'
import { useCollection } from '../lib/useCollection'
import { useSite } from '../lib/SiteContext'
import { api, errorText } from '../lib/api'

export default function Reviews() {
  const { settings } = useSite()
  const { data: reviews, loading } = useCollection('/testimonials')
  const [source, setSource] = useState('All')
  const [form, setForm] = useState({ name: '', country: '', rating: 5, message: '' })
  const [state, setState] = useState({ busy: false, done: '', error: '' })

  const sources = useMemo(
    () => ['All', ...Array.from(new Set(reviews.map((r) => r.source).filter(Boolean)))],
    [reviews],
  )
  const shown = source === 'All' ? reviews : reviews.filter((r) => r.source === source)

  const submit = async (e) => {
    e.preventDefault()
    setState({ busy: true, done: '', error: '' })
    try {
      const { data } = await api.post('/testimonials', { ...form, rating: Number(form.rating), source: 'Website' })
      setState({ busy: false, done: data.message, error: '' })
      setForm({ name: '', country: '', rating: 5, message: '' })
    } catch (err) {
      setState({ busy: false, done: '', error: errorText(err, 'Your review could not be sent. Please try again.') })
    }
  }

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating || 5) === star).length,
  }))
  const total = reviews.length || 1

  return (
    <>
      <PageHeader
        title="Guest reviews"
        subtitle="Five stars on Google and TripAdvisor, written by people we actually drove."
        image="/images/gallery-9.svg"
        crumbs={['Reviews']}
      />

      <section className="container-x py-16">
        <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
          <Reveal className="card h-fit p-7">
            <p className="font-display text-5xl font-semibold text-leaf">
              {(settings?.googleRating ?? 5).toFixed(1)}
            </p>
            <Stars rating={5} size={20} />
            <p className="mt-2 text-sm text-ink/60">Based on {reviews.length} published reviews</p>
            <ul className="mt-6 space-y-2">
              {breakdown.map(({ star, count }) => (
                <li key={star} className="flex items-center gap-3 text-xs text-ink/60">
                  <span className="w-16">{star} star</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-shell">
                    <span className="block h-full rounded-full bg-mango" style={{ width: `${(count / total) * 100}%` }} />
                  </span>
                  <span className="w-6 text-right">{count}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              {settings?.googleReviewUrl && (
                <a href={settings.googleReviewUrl} target="_blank" rel="noreferrer" className="btn-ghost w-full">
                  Write a review on Google
                </a>
              )}
              {settings?.tripadvisorUrl && (
                <a href={settings.tripadvisorUrl} target="_blank" rel="noreferrer" className="btn-accent w-full">
                  Write a review on TripAdvisor
                </a>
              )}
            </div>
          </Reveal>

          <div>
            <div className="flex flex-wrap gap-2">
              {sources.map((s) => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    source === s ? 'bg-leaf text-white shadow-card' : 'bg-white text-ink/65 hover:text-ink'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-8">
              {loading ? (
                <CardSkeleton count={4} />
              ) : shown.length === 0 ? (
                <EmptyState title="No reviews here yet" hint="Reviews appear once the team has checked them." />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {shown.map((r) => <TestimonialCard key={r.id} item={r} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x pb-24">
        <SectionHeading eyebrow="Travelled with us?" title="Leave a review" intro="Your words help the next traveller decide. We publish reviews once we have checked them." />
        <form onSubmit={submit} className="card mx-auto mt-10 max-w-2xl p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="rv-name">Your name</label>
              <input id="rv-name" required className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="rv-country">Country</label>
              <input id="rv-country" className="field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
          </div>
          <div className="mt-4">
            <label className="label" htmlFor="rv-rating">Rating</label>
            <select id="rv-rating" className="field" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div className="mt-4">
            <label className="label" htmlFor="rv-message">Your review</label>
            <textarea id="rv-message" required rows={5} className="field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          {state.error && <p className="mt-4 rounded-2xl bg-ink/5 px-4 py-3 text-sm">{state.error}</p>}
          {state.done && <p className="mt-4 rounded-2xl bg-leaf/10 px-4 py-3 text-sm text-leaf-dark">{state.done}</p>}
          <button disabled={state.busy} className="btn-primary mt-6">
            {state.busy ? <><Loader2 size={16} className="animate-spin" /> Sending</> : 'Publish my review'}
          </button>
        </form>
      </section>
    </>
  )
}
