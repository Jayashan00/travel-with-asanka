import { useState } from 'react'
import { Loader2, Mail, MapPin, Phone } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import BookingForm from '../components/BookingForm'
import Reveal from '../components/Reveal'
import { api, errorText } from '../lib/api'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { messageForPath, waLink } from '../lib/whatsapp'
import { useSite } from '../lib/SiteContext'

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [state, setState] = useState({ busy: false, done: '', error: '' })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setState({ busy: true, done: '', error: '' })
    try {
      const { data } = await api.post('/messages', form)
      setState({ busy: false, done: data.message, error: '' })
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setState({ busy: false, done: '', error: errorText(err, 'The message could not be sent. Please try again.') })
    }
  }

  const details = [
    { Icon: MapPin, label: 'Address', value: settings?.contactAddress || 'Kandy, Sri Lanka' },
    { Icon: Mail, label: 'Email', value: settings?.contactEmail || 'travelwithshankandy@gmail.com', href: `mailto:${settings?.contactEmail || 'travelwithshankandy@gmail.com'}` },
    { Icon: Phone, label: 'Phone', value: settings?.contactPhone || '+94 76 441 2050', href: `tel:${(settings?.contactPhone || '+94764412050').replace(/\s/g, '')}` },
  ]

  return (
    <>
      <PageHeader
        title="Contact"
        subtitle="Send a message and Shan will reply personally, usually within a few hours."
        	image="/images/hero/contact-hero.jpg"
        crumbs={['Contact']}
      />

      <section className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-[360px,1fr]">
          <Reveal className="space-y-4">
            <a
              href={waLink(settings?.whatsapp, messageForPath('/contact'))}
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden rounded-3xl bg-[#075E54] p-6 text-white shadow-lift transition hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#25D366]">
                  <WhatsAppIcon size={28} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Fastest way to reach us
                  </p>
                  <p className="font-display text-xl font-semibold">Chat on WhatsApp</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                Most of our guests plan their trip with us on WhatsApp. Send your dates and how many
                are travelling, and we will reply with a route and a price.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold transition group-hover:bg-[#1EBE5B]">
                <WhatsAppIcon size={16} /> Message us now
              </span>
            </a>

            {details.map(({ Icon, label, value, href }) => (
              <div key={label} className="card flex items-start gap-4 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-leaf/10 text-leaf">
                  <Icon size={19} />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-ink/45">{label}</span>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-sm font-semibold hover:text-leaf">
                      {value}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold">{value}</span>
                  )}
                </span>
              </div>
            ))}

            {settings?.mapEmbedUrl && (
              <div className="overflow-hidden rounded-3xl shadow-card">
                <iframe
                  title="Where we are based"
                  src={settings.mapEmbedUrl}
                  className="h-64 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={submit} className="card p-7">
              <h2 className="text-2xl">Ask a question</h2>
              <p className="mt-1 text-sm text-ink/60">Route ideas, prices, availability — anything at all.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="ct-name">Your name</label>
                  <input id="ct-name" required className="field" value={form.name} onChange={set('name')} />
                </div>
                <div>
                  <label className="label" htmlFor="ct-email">Your email</label>
                  <input id="ct-email" type="email" required className="field" value={form.email} onChange={set('email')} />
                </div>
                <div>
                  <label className="label" htmlFor="ct-phone">Phone (optional)</label>
                  <input id="ct-phone" className="field" value={form.phone} onChange={set('phone')} />
                </div>
                <div>
                  <label className="label" htmlFor="ct-subject">Subject</label>
                  <input id="ct-subject" className="field" value={form.subject} onChange={set('subject')} />
                </div>
              </div>
              <div className="mt-4">
                <label className="label" htmlFor="ct-message">Your message</label>
                <textarea id="ct-message" required rows={6} className="field" value={form.message} onChange={set('message')} />
              </div>

              {state.error && <p className="mt-4 rounded-2xl bg-ink/5 px-4 py-3 text-sm">{state.error}</p>}
              {state.done && <p className="mt-4 rounded-2xl bg-leaf/10 px-4 py-3 text-sm text-leaf-dark">{state.done}</p>}

              <button disabled={state.busy} className="btn-primary mt-6">
                {state.busy ? <><Loader2 size={16} className="animate-spin" /> Sending</> : 'Send message'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="mx-auto max-w-3xl">
          <BookingForm />
        </div>
      </section>
    </>
  )
}