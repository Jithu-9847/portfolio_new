"use client"

import { useEffect, useState, useCallback } from "react"

interface TextScrambleProps {
  texts: string[]
  className?: string
}

const chars = "!<>-_\\/[]{}—=+*^?#________"

export function TextScramble({ texts, className = "" }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(texts[0])
  const [currentIndex, setCurrentIndex] = useState(0)

  const scramble = useCallback((newText: string) => {
    let iteration = 0
    const maxIterations = newText.length

    const interval = setInterval(() => {
      setDisplayText(
        newText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return newText[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )

      iteration += 1 / 3

      if (iteration >= maxIterations) {
        clearInterval(interval)
        setDisplayText(newText)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % texts.length
      setCurrentIndex(nextIndex)
      scramble(texts[nextIndex])
    }, 3000)

    return () => clearTimeout(timeout)
  }, [currentIndex, texts, scramble])

  return (
    <span className={`font-mono ${className}`}>
      {displayText}
    </span>
  )
}
