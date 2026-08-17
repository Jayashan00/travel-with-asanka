import { useEffect, useState } from 'react'
import { api } from './api'

/** Loads a public collection once and reports its loading / error state. */
export function useCollection(path, fallback = []) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    api
      .get(path)
      .then((res) => alive && setData(res.data))
      .catch(() => alive && setFailed(true))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [path])

  return { data, loading, failed }
}
