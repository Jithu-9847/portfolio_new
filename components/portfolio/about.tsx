"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { portfolioData } from "@/lib/portfolio-data"

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { about, education, experience } = portfolioData

  return (
    <section id="about" className="py-12 md:py-20 relative">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      
      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            {about.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            {about.heading}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}

            {/* Stats */}
            <div className="grid grid-cols-1 gap-8 pt-8 mt-8 border-t border-border">
              {about.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Education Section */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                Education
              </h3>
              <div className="space-y-6">
                {education.map((item, index) => (
                  <div key={item.title} className="relative pl-6 border-l border-border">
                    <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full ${index === 0 ? "bg-primary" : "bg-primary/40"}`} />
                    <div className="flex flex-col md:flex-row md:justify-between mb-1">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <span className="text-sm font-medium text-primary">{item.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.organization}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                Experience
              </h3>
              <div className="space-y-6">
                {experience.map((item, index) => (
                  <div key={item.title} className="relative pl-6 border-l border-border">
                    <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full ${index === 0 ? "bg-primary" : "bg-primary/40"}`} />
                    <div className="flex flex-col md:flex-row md:justify-between mb-1">
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <span className="text-sm font-medium text-primary">{item.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.organization}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
