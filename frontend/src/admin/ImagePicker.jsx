import { useRef, useState } from 'react'
import { ImagePlus, Link2, Loader2, Trash2 } from 'lucide-react'
import { api, errorText, mediaUrl } from '../lib/api'

/**
 * Picks an image either by uploading a file or by pasting a URL.
 * This is what lets the site owner swap any picture on the site without a developer.
 */
export default function ImagePicker({ value, onChange, label = 'Image', hint }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const upload = async (file) => {
    if (!file) return
    setBusy(true)
    setError('')
    const body = new FormData()
    body.append('file', file)
    try {
      const { data } = await api.post('/admin/upload', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(data.url)
    } catch (err) {
      setError(errorText(err, 'The image could not be uploaded.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-shell">
          {value ? (
            <img src={mediaUrl(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-xs text-ink/40">No image</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="btn-ghost px-4 py-2 text-xs"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
              {busy ? 'Uploading' : 'Upload image'}
            </button>
            {value && (
              <button type="button" onClick={() => onChange('')} className="btn-ghost px-4 py-2 text-xs">
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 rounded-2xl border border-ink/12 bg-white px-3 py-2">
            <Link2 size={14} className="shrink-0 text-ink/40" />
            <input
              className="w-full bg-transparent text-xs outline-none"
              placeholder="…or paste an image address"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
          </label>

          {hint && <p className="text-[11px] text-ink/45">{hint}</p>}
          {error && <p className="text-[11px] text-red-600">{error}</p>}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          upload(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}
