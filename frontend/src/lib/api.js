import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const api = axios.create({ baseURL: `${API_URL}/api` })

const TOKEN_KEY = 'twa_admin_token'

export const auth = {
  get token() {
    return localStorage.getItem(TOKEN_KEY)
  },
  save(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
  },
}

api.interceptors.request.use((config) => {
  const token = auth.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error?.config?.url || ''
    if (error?.response?.status === 401 && url.includes('/admin')) {
      auth.clear()
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  },
)

/** Turns an API error into a sentence worth showing to a person. */
export function errorText(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  if (data?.fields) return Object.values(data.fields)[0]
  return data?.error || fallback
}

/** Uploaded files live on the API server; bundled artwork lives on the site itself. */
export function mediaUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path
  if (path.startsWith('/uploads/')) return `${API_URL}${path}`
  return path
}

export function money(value) {
  if (value === null || value === undefined || value === '') return '—'
  return `LKR ${Number(value).toLocaleString('en-LK')}`
}
