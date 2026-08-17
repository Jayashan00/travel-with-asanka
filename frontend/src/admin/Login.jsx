import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Lock } from 'lucide-react'
import { api, auth, errorText } from '../lib/api'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      auth.save(data.token)
      navigate('/admin')
    } catch (err) {
      setError(errorText(err, 'Sign in failed. Check the username and password.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lift">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf/10 text-leaf">
          <Lock size={22} />
        </span>
        <h1 className="mt-5 text-2xl">Site admin</h1>
        <p className="mt-1 text-sm text-ink/60">Sign in to manage content, photos and bookings.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="lg-user">Username</label>
            <input id="lg-user" required autoFocus className="field" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="lg-pass">Password</label>
            <input id="lg-pass" type="password" required className="field" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
        </div>

        {error && <p className="mt-4 rounded-2xl bg-ink/5 px-4 py-3 text-sm">{error}</p>}

        <button disabled={busy} className="btn-primary mt-6 w-full">
          {busy ? <><Loader2 size={16} className="animate-spin" /> Signing in</> : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
