import { useEffect, useState } from 'react'
import { Loader2, Mail, MailOpen, Trash2 } from 'lucide-react'
import { api, errorText } from '../lib/api'

export default function Inbox({ notify }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api
      .get('/admin/messages')
      .then((res) => setMessages(res.data))
      .catch((err) => notify?.({ type: 'error', message: errorText(err, 'Messages could not be loaded.') }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const toggleRead = async (msg) => {
    try {
      await api.patch(`/admin/messages/${msg.id}/read`, { read: !msg.read })
      load()
    } catch (err) {
      notify?.({ type: 'error', message: errorText(err) })
    }
  }

  const remove = async (msg) => {
    if (!window.confirm(`Delete the message from ${msg.name}?`)) return
    try {
      await api.delete(`/admin/messages/${msg.id}`)
      notify?.({ type: 'success', message: 'Message deleted.' })
      load()
    } catch (err) {
      notify?.({ type: 'error', message: errorText(err) })
    }
  }

  return (
    <div>
      <h1 className="text-2xl">Messages</h1>
      <p className="mt-1 text-sm text-ink/60">Enquiries sent from the contact form.</p>

      {loading ? (
        <div className="grid place-items-center py-20 text-ink/50"><Loader2 className="animate-spin" /></div>
      ) : messages.length === 0 ? (
        <div className="card mt-6 px-8 py-16 text-center">
          <p className="text-lg">No messages yet</p>
          <p className="mt-1 text-sm text-ink/55">New enquiries from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {messages.map((m) => (
            <article key={m.id} className={`card p-6 ${m.read ? '' : 'border-mango/50'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {m.name} {!m.read && <span className="ml-2 rounded-full bg-mango px-2 py-0.5 text-[10px] font-bold uppercase text-ink">New</span>}
                  </p>
                  <p className="text-xs text-ink/55">
                    <a href={`mailto:${m.email}`} className="hover:text-leaf">{m.email}</a>
                    {m.phone ? ` · ${m.phone}` : ''}
                    {m.createdAt ? ` · ${new Date(m.createdAt).toLocaleString()}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleRead(m)} className="btn-ghost px-4 py-2 text-xs">
                    {m.read ? <><Mail size={14} /> Mark unread</> : <><MailOpen size={14} /> Mark read</>}
                  </button>
                  <button onClick={() => remove(m)} className="rounded-xl p-2 text-ink/50 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {m.subject && <p className="mt-4 text-sm font-semibold">{m.subject}</p>}
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/70">{m.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
