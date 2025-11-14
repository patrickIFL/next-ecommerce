"use client"

import { useCallback, useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { isDark, toggleTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = useCallback(async () => {
    if (!buttonRef.current) return

    await document.startViewTransition(() => {
      flushSync(() => toggleTheme())
    }).ready

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [isDark, toggleTheme, duration])

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={cn(className)}
      {...props}
    >
      {isDark ? <Sun color={"var(--color-foreground)"} size={18}/> : <Moon color={"var(--color-foreground)"} size={18}/>}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
