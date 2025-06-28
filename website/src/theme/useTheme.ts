import { useState, useEffect } from 'react'

/**
 * Custom hook for managing theme state with localStorage persistence
 * and system preference detection. Prevents theme flashing by working
 * with the theme script in index.html
 */
export const useTheme = (storageKey = 'vite-ui-theme') => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if dark class is already applied
    if (document.documentElement.classList.contains('dark')) return true

    // Fallback logic (should rarely be needed due to inline script)
    return localStorage.getItem(storageKey)
      ? localStorage.getItem(storageKey) === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Toggle dark class based on state
    document.documentElement.classList.toggle('dark', isDarkMode)

    // Always update localStorage to keep it in sync
    localStorage.setItem(storageKey, isDarkMode.toString())
  }, [isDarkMode, storageKey])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return { isDarkMode, toggleDarkMode }
}
