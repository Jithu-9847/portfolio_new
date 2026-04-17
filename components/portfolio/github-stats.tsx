"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Github } from "lucide-react"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function GitHubStats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const username = "Jithu-9847"
  const isDark = mounted ? resolvedTheme === "dark" : true // Default to dark for placeholder
  
  // Theme-specific colors
  const colors = {
    title: isDark ? "3b82f6" : "2563eb",
    text: isDark ? "cbd5e1" : "475569",
    icon: isDark ? "3b82f6" : "2563eb",
    count: isDark ? "ffffff" : "1e293b",
    bg: "00000000", // Transparent
  }

  // github-readme-stats URLs with dynamic colors
  const statsUrl = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${isDark ? "dark" : "default"}&hide_border=true&bg_color=${colors.bg}&title_color=${colors.title}&text_color=${colors.text}&icon_color=${colors.icon}&count_color=${colors.count}`
  const languagesUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${isDark ? "dark" : "default"}&hide_border=true&bg_color=${colors.bg}&title_color=${colors.title}&text_color=${colors.text}`
  const streakUrl = `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${isDark ? "dark" : "default"}&hide_border=true&background=${colors.bg}&ring=${colors.title}&fire=${colors.title}&currStreakLabel=${colors.title}&currStreakNum=${colors.count}&sideNums=${colors.count}&sideLabels=${colors.text}`

  return (
    <section id="github" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
           
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            GitHub Statistics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A real-time look at my coding activity, contributions, and most used languages across GitHub repositories.
          </p>
        </motion.div>

        {!mounted ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[400px]">
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-1 animate-pulse h-full" />
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-1 animate-pulse h-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Main Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-8"
            >
              <div className="flex-1 p-1 bg-linear-to-br from-border/50 via-transparent to-border/50 rounded-3xl">
                <div className="h-full bg-card/50 backdrop-blur-sm rounded-[22px] p-6 flex items-center justify-center min-h-[200px]">
                  <img 
                    src={statsUrl} 
                    alt="GitHub Stats" 
                    className="w-full h-auto max-w-full"
                  />
                </div>
              </div>
              
              <div className="flex-1 p-1 bg-linear-to-br from-border/50 via-transparent to-border/50 rounded-3xl">
                <div className="h-full bg-card/50 backdrop-blur-sm rounded-[22px] p-6 flex items-center justify-center min-h-[200px]">
                  <img 
                    src={streakUrl} 
                    alt="GitHub Streak" 
                    className="w-full h-auto max-w-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Languages Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-1 bg-linear-to-br from-border/50 via-transparent to-border/50 rounded-3xl"
            >
              <div className="h-full bg-card/50 backdrop-blur-sm rounded-[22px] p-6 lg:p-8 flex items-center justify-center">
                <img 
                  src={languagesUrl} 
                  alt="Top Languages" 
                  className="w-full h-auto max-w-full"
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <span>Follow me on GitHub</span>
            <Github className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
