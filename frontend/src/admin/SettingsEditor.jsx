import { useEffect, useState } from 'react'
import { GripVertical, Loader2, Plus, Trash2 } from 'lucide-react'
import { api, errorText } from '../lib/api'
import ImagePicker from './ImagePicker'

/** Defined outside the screen component so typing never remounts the input. */
function TextField({ label, k, placeholder, area = false, rows = 3, value, onChange }) {
  return (
    <div>
      <label className="label" htmlFor={`st-${k}`}>{label}</label>
      {area ? (
        <textarea id={`st-${k}`} rows={rows} className="field" value={value} onChange={onChange} placeholder={placeholder} />
      ) : (
        <input id={`st-${k}`} className="field" value={value} onChange={onChange} placeholder={placeholder} />
      )}
    </div>
  )
}

const emptySlide = { image: '', title: '', subtitle: '', ctaLabel: 'Plan my trip', ctaLink: '/contact' }

export default function SettingsEditor({ notify }) {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => setForm({ heroSlides: [], ...res.data }))
      .catch((err) => notify?.({ type: 'error', message: errorText(err, 'Site content could not be loaded.') }))
  }, [])

  if (!form) {
    return <div className="grid place-items-center py-24 text-ink/50"><Loader2 className="animate-spin" /></div>
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const setImage = (key) => (url) => setForm({ ...form, [key]: url })

  const setSlide = (i, key, value) => {
    const slides = [...form.heroSlides]
    slides[i] = { ...slides[i], [key]: value }
    setForm({ ...form, heroSlides: slides })
  }

  const moveSlide = (i, delta) => {
    const slides = [...form.heroSlides]
    const j = i + delta
    if (j < 0 || j >= slides.length) return
    ;[slides[i], slides[j]] = [slides[j], slides[i]]
    setForm({ ...form, heroSlides: slides })
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        googleRating: Number(form.googleRating) || 0,
        tripadvisorRating: Number(form.tripadvisorRating) || 0,
        googleReviewCount: Number(form.googleReviewCount) || 0,
        tripadvisorReviewCount: Number(form.tripadvisorReviewCount) || 0,
      }
      await api.put('/admin/settings', payload)
      notify?.({ type: 'success', message: 'Site content saved. Refresh the public site to see it.' })
    } catch (err) {
      notify?.({ type: 'error', message: errorText(err, 'The changes could not be saved.') })
    } finally {
      setSaving(false)
    }
  }


  return (
    <form onSubmit={save} className="space-y-8 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Site content</h1>
          <p className="mt-1 text-sm text-ink/60">Brand details, homepage slideshow, about page and contact information.</p>
        </div>
        <button disabled={saving} className="btn-primary">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving</> : 'Save changes'}
        </button>
      </div>

      <section className="card p-7">
        <h2 className="text-lg">Brand</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField label="Business name" k="brandName"  value={form.brandName ?? ''} onChange={set('brandName')} />
          <TextField label="Tagline (shown in the footer)" k="tagline"  value={form.tagline ?? ''} onChange={set('tagline')} />
          <div className="sm:col-span-2">
            <ImagePicker label="Logo" value={form.logo} onChange={setImage('logo')} hint="A transparent PNG or SVG works best. Leave empty to use the lettermark." />
          </div>
        </div>
      </section>

      <section className="card p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg">Homepage slideshow</h2>
            <p className="mt-1 text-sm text-ink/60">Each slide has its own picture, heading and button.</p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, heroSlides: [...form.heroSlides, { ...emptySlide }] })}
            className="btn-ghost px-4 py-2 text-xs"
          >
            <Plus size={14} /> Add slide
          </button>
        </div>

        <div className="mt-5">
          <label className="label" htmlFor="st-eyebrow">Small label above the heading</label>
          <input id="st-eyebrow" className="field" value={form.heroEyebrow ?? ''} onChange={set('heroEyebrow')} />
        </div>

        <div className="mt-6 space-y-5">
          {form.heroSlides.map((slide, i) => (
            <div key={i} className="rounded-3xl border border-ink/10 p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
                  <GripVertical size={14} /> Slide {i + 1}
                </span>
                <span className="flex gap-1">
                  <button type="button" onClick={() => moveSlide(i, -1)} className="rounded-lg px-2 py-1 text-xs hover:bg-shell">Up</button>
                  <button type="button" onClick={() => moveSlide(i, 1)} className="rounded-lg px-2 py-1 text-xs hover:bg-shell">Down</button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, heroSlides: form.heroSlides.filter((_, j) => j !== i) })}
                    className="rounded-lg p-1.5 text-ink/50 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove slide ${i + 1}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              </div>

              <div className="mt-4">
                <ImagePicker label="Slide picture" value={slide.image} onChange={(url) => setSlide(i, 'image', url)} hint="Landscape images around 1600×1000 look best." />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Heading</label>
                  <input className="field" value={slide.title ?? ''} onChange={(e) => setSlide(i, 'title', e.target.value)} />
                </div>
                <div>
                  <label className="label">Button label</label>
                  <input className="field" value={slide.ctaLabel ?? ''} onChange={(e) => setSlide(i, 'ctaLabel', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Sub heading</label>
                  <input className="field" value={slide.subtitle ?? ''} onChange={(e) => setSlide(i, 'subtitle', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Button goes to</label>
                  <input className="field" value={slide.ctaLink ?? ''} onChange={(e) => setSlide(i, 'ctaLink', e.target.value)} placeholder="/contact" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-7">
        <h2 className="text-lg">About page</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField label="Page title" k="aboutTitle"  value={form.aboutTitle ?? ''} onChange={set('aboutTitle')} />
          <TextField label="Second section title" k="aboutSecondaryTitle"  value={form.aboutSecondaryTitle ?? ''} onChange={set('aboutSecondaryTitle')} />
          <div className="sm:col-span-2"><TextField label="Intro paragraph" k="aboutIntro" area rows={4}  value={form.aboutIntro ?? ''} onChange={set('aboutIntro')} /></div>
          <div className="sm:col-span-2"><TextField label="Second section text" k="aboutSecondaryText" area  value={form.aboutSecondaryText ?? ''} onChange={set('aboutSecondaryText')} /></div>
          <ImagePicker label="Main about picture" value={form.aboutImage} onChange={setImage('aboutImage')} />
          <ImagePicker label="Second about picture" value={form.aboutSecondaryImage} onChange={setImage('aboutSecondaryImage')} />
        </div>
      </section>

      <section className="card p-7">
        <h2 className="text-lg">Island section (homepage)</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField label="Title" k="ceylonSectionTitle"  value={form.ceylonSectionTitle ?? ''} onChange={set('ceylonSectionTitle')} />
          <TextField label="Subtitle" k="ceylonSectionSubtitle"  value={form.ceylonSectionSubtitle ?? ''} onChange={set('ceylonSectionSubtitle')} />
          <div className="sm:col-span-2"><TextField label="Paragraph about Sri Lanka" k="countryIntro" area rows={5}  value={form.countryIntro ?? ''} onChange={set('countryIntro')} /></div>
          <div className="sm:col-span-2">
            <ImagePicker label="Background picture" value={form.ceylonImage} onChange={setImage('ceylonImage')} />
          </div>
        </div>
      </section>

      <section className="card p-7">
        <h2 className="text-lg">Contact & social</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField label="Address" k="contactAddress"  value={form.contactAddress ?? ''} onChange={set('contactAddress')} />
          <TextField label="Email" k="contactEmail"  value={form.contactEmail ?? ''} onChange={set('contactEmail')} />
          <TextField label="Phone" k="contactPhone"  value={form.contactPhone ?? ''} onChange={set('contactPhone')} />
          <TextField label="WhatsApp number (digits only)" k="whatsapp" placeholder="94761857110"  value={form.whatsapp ?? ''} onChange={set('whatsapp')} />
          <TextField label="Facebook page URL" k="facebookUrl"  value={form.facebookUrl ?? ''} onChange={set('facebookUrl')} />
          <TextField label="Instagram URL" k="instagramUrl"  value={form.instagramUrl ?? ''} onChange={set('instagramUrl')} />
          <TextField label="TripAdvisor URL" k="tripadvisorUrl"  value={form.tripadvisorUrl ?? ''} onChange={set('tripadvisorUrl')} />
          <TextField label="Google review URL" k="googleReviewUrl"  value={form.googleReviewUrl ?? ''} onChange={set('googleReviewUrl')} />
          <div className="sm:col-span-2"><TextField label="Google Maps embed URL" k="mapEmbedUrl"  value={form.mapEmbedUrl ?? ''} onChange={set('mapEmbedUrl')} /></div>
        </div>
      </section>

      <section className="card p-7">
        <h2 className="text-lg">Ratings shown on the site</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          <TextField label="Google rating" k="googleRating"  value={form.googleRating ?? ''} onChange={set('googleRating')} />
          <TextField label="Google review count" k="googleReviewCount"  value={form.googleReviewCount ?? ''} onChange={set('googleReviewCount')} />
          <TextField label="TripAdvisor rating" k="tripadvisorRating"  value={form.tripadvisorRating ?? ''} onChange={set('tripadvisorRating')} />
          <TextField label="TripAdvisor review count" k="tripadvisorReviewCount"  value={form.tripadvisorReviewCount ?? ''} onChange={set('tripadvisorReviewCount')} />
        </div>
      </section>

      <div className="flex justify-end">
        <button disabled={saving} className="btn-primary">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving</> : 'Save changes'}
        </button>
      </div>
    </form>
  )
}