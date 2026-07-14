"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Lock scrolling on mount
    document.body.style.overflow = "hidden"

    const timer = setTimeout(() => {
      setIsLoading(false)
      document.body.style.overflow = "unset"
    }, 1500)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.4 } 
          }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center select-none"
        >
          {/* Custom self-contained CSS animation style */}
          <style>{`
            @keyframes orbit-cw {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes orbit-ccw {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
            @keyframes pulse-center {
              0%, 100% { transform: scale(0.75); opacity: 0.3; }
              50% { transform: scale(1.1); opacity: 0.9; }
            }
            .loader-container {
              position: relative;
              width: 56px;
              height: 56px;
            }
            .loader-ring {
              position: absolute;
              inset: 0;
              border-radius: 50%;
              border: 2px solid transparent;
            }
            .loader-ring-outer {
              border-top-color: var(--primary, currentColor);
              border-left-color: var(--primary, currentColor);
              animation: orbit-cw 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
            }
            .loader-ring-inner {
              inset: 4px;
              border-bottom-color: var(--primary, currentColor);
              border-right-color: var(--primary, currentColor);
              opacity: 0.5;
              animation: orbit-ccw 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
            }
            .loader-dot {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 6px;
              height: 6px;
              margin-top: -3px;
              margin-left: -3px;
              border-radius: 50%;
              background-color: var(--primary, currentColor);
              animation: pulse-center 1.4s ease-in-out infinite;
            }
          `}</style>

          <div className="loader-container">
            <div className="loader-ring loader-ring-outer" />
            <div className="loader-ring loader-ring-inner" />
            <div className="loader-dot" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
