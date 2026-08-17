import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const SiteContext = createContext({ settings: null, loading: true })

/** Site-wide content (brand, contact details, hero slides) loaded once and shared. */
export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    api
      .get('/settings')
      .then((res) => alive && setSettings(res.data))
      .catch(() => alive && setSettings(null))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return <SiteContext.Provider value={{ settings, loading }}>{children}</SiteContext.Provider>
}

export function useSite() {
  return useContext(SiteContext)
}
