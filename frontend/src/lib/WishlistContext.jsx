import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'twa_wishlist'

const WishlistContext = createContext({
  items: [],
  has: () => false,
  toggle: () => {},
  remove: () => {},
  clear: () => {},
  count: 0,
})

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Saved places and vehicles, kept in the visitor's own browser.
 * There are no visitor accounts, so the list stays on this device only.
 */
export function WishlistProvider({ children }) {
  const [items, setItems] = useState(read)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // a full or blocked storage quota should never break the page
    }
  }, [items])

  const has = useCallback((key) => items.some((i) => i.key === key), [items])

  const toggle = useCallback((item) => {
    setItems((current) =>
      current.some((i) => i.key === item.key)
        ? current.filter((i) => i.key !== item.key)
        : [...current, { ...item, savedAt: Date.now() }],
    )
  }, [])

  const remove = useCallback((key) => {
    setItems((current) => current.filter((i) => i.key !== key))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({ items, has, toggle, remove, clear, count: items.length }),
    [items, has, toggle, remove, clear],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  return useContext(WishlistContext)
}