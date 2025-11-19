"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface ThemeContextValue {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Load theme from localStorage *first*
    const stored = localStorage.getItem("theme")

    if (stored === "dark") {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    } else if (stored === "light") {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    } else {
      // No stored value → fallback to system theme
      // this is an api that checks the values of the preferences of the device.
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.toggle("dark", prefersDark)
      setIsDark(prefersDark)
    }

    // Watch for manual DOM changes (still useful)
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    document.documentElement.classList.toggle("dark", newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
    setIsDark(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider />")
  return ctx
}
