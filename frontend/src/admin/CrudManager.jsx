import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { api, errorText, mediaUrl } from '../lib/api'
import ImagePicker from './ImagePicker'

/**
 * One editor screen for any collection. Give it a field list and it renders the
 * table, the form, and handles create / update / delete against the API.
 */
export default function CrudManager({ title, intro, path, fields, columns, emptyRecord, notify, searchKeys = ['name', 'title'] }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')

  const load = () => {
    setLoading(true)
    api
      .get(`/admin/${path}`)
      .then((res) => setItems(res.data))
      .catch((err) => notify?.({ type: 'error', message: errorText(err, 'The list could not be loaded.') }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [path])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) =>
      searchKeys.some((k) => String(item[k] || '').toLowerCase().includes(q)),
    )
  }, [items, query, searchKeys])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...editing }
      fields.forEach((f) => {
        if (f.type === 'list' && typeof payload[f.key] === 'string') {
          payload[f.key] = payload[f.key].split('\n').map((s) => s.trim()).filter(Boolean)
        }
        if (f.type === 'number') payload[f.key] = payload[f.key] === '' ? null : Number(payload[f.key])
      })
      if (editing.id) {
        await api.put(`/admin/${path}/${editing.id}`, payload)
      } else {
        await api.post(`/admin/${path}`, payload)
      }
      notify?.({ type: 'success', message: editing.id ? 'Changes saved.' : 'Added. It is live on the site now.' })
      setEditing(null)
      load()
    } catch (err) {
      notify?.({ type: 'error', message: errorText(err, 'The changes could not be saved.') })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.name || item.title || item.caption || 'this item'}"? This cannot be undone.`)) return
    try {
      await api.delete(`/admin/${path}/${item.id}`)
      notify?.({ type: 'success', message: 'Deleted.' })
      load()
    } catch (err) {
      notify?.({ type: 'error', message: errorText(err, 'It could not be deleted.') })
    }
  }

  const openNew = () => setEditing({ ...emptyRecord })

  const openEdit = (item) => {
    const copy = { ...item }
    fields.forEach((f) => {
      if (f.type === 'list' && Array.isArray(copy[f.key])) copy[f.key] = copy[f.key].join('\n')
    })
    setEditing(copy)
  }

  const setField = (key) => (e) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    setEditing((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">{title}</h1>
          {intro && <p className="mt-1 text-sm text-ink/60">{intro}</p>}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-full border border-ink/12 bg-white px-4 py-2">
            <Search size={15} className="text-ink/40" />
            <input
              className="w-40 bg-transparent text-sm outline-none"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <button onClick={openNew} className="btn-primary px-5 py-2.5 text-sm">
            <Plus size={16} /> Add new
          </button>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        {loading ? (
          <div className="grid place-items-center py-20 text-ink/50">
            <Loader2 className="animate-spin" />
          </div>
        ) : shown.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <p className="text-lg">Nothing here yet</p>
            <p className="mt-1 text-sm text-ink/55">Use “Add new” to create the first one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-shell text-xs uppercase tracking-wider text-ink/55">
                <tr>
                  {columns.map((c) => <th key={c.key} className="px-5 py-3">{c.label}</th>)}
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((item) => (
                  <tr key={item.id} className="border-t border-ink/6 hover:bg-sand">
                    {columns.map((c) => (
                      <td key={c.key} className="px-5 py-3 align-middle">
                        {c.type === 'image' ? (
                          item[c.key] ? (
                            <img src={mediaUrl(item[c.key])} alt="" className="h-11 w-16 rounded-lg object-cover" />
                          ) : (
                            <span className="text-xs text-ink/35">—</span>
                          )
                        ) : c.type === 'boolean' ? (
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${item[c.key] ? 'bg-leaf/10 text-leaf' : 'bg-ink/5 text-ink/45'}`}>
                            {item[c.key] ? 'Yes' : 'No'}
                          </span>
                        ) : (
                          <span className="line-clamp-2 text-ink/75">{String(item[c.key] ?? '—')}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => openEdit(item)} className="mr-2 rounded-lg p-2 text-ink/60 hover:bg-leaf/10 hover:text-leaf" aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => remove(item)} className="rounded-lg p-2 text-ink/60 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm"
            onClick={() => !saving && setEditing(null)}
          >
            <motion.form
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={save}
              className="mx-auto my-8 w-full max-w-2xl rounded-3xl bg-white p-7 shadow-lift"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-xl">{editing.id ? 'Edit' : 'Add'} {title.toLowerCase().replace(/s$/, '')}</h2>
                <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="rounded-lg p-2 hover:bg-shell">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {fields.map((f) => {
                  const span = f.full ? 'sm:col-span-2' : ''
                  if (f.type === 'image') {
                    return (
                      <div key={f.key} className={span}>
                        <ImagePicker
                          label={f.label}
                          hint={f.hint}
                          value={editing[f.key] || ''}
                          onChange={(url) => setEditing((prev) => ({ ...prev, [f.key]: url }))}
                        />
                      </div>
                    )
                  }
                  if (f.type === 'checkbox') {
                    return (
                      <label key={f.key} className={`flex items-center gap-3 rounded-2xl border border-ink/10 px-4 py-3 text-sm ${span}`}>
                        <input type="checkbox" checked={!!editing[f.key]} onChange={setField(f.key)} className="h-4 w-4 accent-[#1F7A45]" />
                        {f.label}
                      </label>
                    )
                  }
                  return (
                    <div key={f.key} className={span}>
                      <label className="label" htmlFor={`fld-${f.key}`}>{f.label}</label>
                      {f.type === 'textarea' || f.type === 'list' ? (
                        <textarea
                          id={`fld-${f.key}`}
                          rows={f.rows || 4}
                          className="field"
                          placeholder={f.placeholder}
                          value={editing[f.key] ?? ''}
                          onChange={setField(f.key)}
                        />
                      ) : f.type === 'select' ? (
                        <select id={`fld-${f.key}`} className="field" value={editing[f.key] ?? ''} onChange={setField(f.key)}>
                          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          id={`fld-${f.key}`}
                          type={f.type === 'number' ? 'number' : 'text'}
                          step="any"
                          className="field"
                          placeholder={f.placeholder}
                          value={editing[f.key] ?? ''}
                          onChange={setField(f.key)}
                        />
                      )}
                      {f.hint && <p className="mt-1 text-[11px] text-ink/45">{f.hint}</p>}
                    </div>
                  )
                })}
              </div>

              <div className="mt-7 flex justify-end gap-2">
                <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving</> : 'Save changes'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
