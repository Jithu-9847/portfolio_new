"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Code2, Smartphone, Palette, Zap } from "lucide-react"

const highlights = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Building responsive and performant web applications with modern frameworks",
  },
  {
    icon: Smartphone,
    title: "Flutter Apps",
    description: "Creating beautiful cross-platform mobile experiences with Flutter",
  },
  {
    icon: Palette,
    title: "Software Engineering",
    description: "Architecting robust and scalable software solutions",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Optimizing applications for speed and excellent user experience",
  },
]

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
            About Me
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Turning Ideas Into Reality
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              I&apos;m Jithu Girish, a passionate Full-Stack Web Developer and Flutter App Developer who recently graduated with a degree in Computer Science Engineering from KTU University. I love building modern websites, exploring AI technologies, and creating user-focused digital experiences.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I believe great code deserves great design. I focus on creating intuitive, accessible interfaces.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Technology evolves rapidly, and I&apos;m committed to staying at the forefront of innovation through continuous learning and building innovative solutions.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-8 pt-8 mt-8 border-t border-border">
              {[
                { value: "15+", label: "Projects Completed" },
              ].map((stat, index) => (
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
                <div className="relative pl-6 border-l border-border">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary" />
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h4 className="font-semibold text-foreground">B.Tech Computer Science Engineering</h4>
                    <span className="text-sm font-medium text-primary">2022 - 2026</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">KTU University</p>
                  <p className="text-sm text-muted-foreground">
                    Graduated with a B.Tech in Computer Science Engineering, with a focus on software development and systems architecture.
                  </p>
                </div>
                <div className="relative pl-6 border-l border-border">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary/40" />
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h4 className="font-semibold text-foreground">Higher Secondary Education</h4>
                    <span className="text-sm font-medium text-primary">2020 - 2022</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">St. Thomas Higher Secondary School, Kozhencherry</p>
                  <p className="text-sm text-muted-foreground">
                    Completed with 96% marks.
                  </p>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                Experience
              </h3>
              <div className="space-y-6">
                <div className="relative pl-6 border-l border-border">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary" />
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h4 className="font-semibold text-foreground">Research and Development Lead</h4>
                    <span className="text-sm font-medium text-primary">2025 - 2026</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">PRODDEC</p>
                  <p className="text-sm text-muted-foreground">
                    Driving innovation and leading R&D initiatives for next-generation software solutions.
                  </p>
                </div>
                <div className="relative pl-6 border-l border-border">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary/40" />
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h4 className="font-semibold text-foreground">Tech In-Charge Software</h4>
                    <span className="text-sm font-medium text-primary">2024 - 2025</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Proddec</p>
                  <p className="text-sm text-muted-foreground">
                    Leading technical initiatives, coordinating web development projects, and organizing technical workshops for students.
                  </p>
                </div>
                <div className="relative pl-6 border-l border-border">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary/40" />
                  <div className="flex flex-col md:flex-row md:justify-between mb-1">
                    <h4 className="font-semibold text-foreground">Web Development Intern</h4>
                    <span className="text-sm font-medium text-primary">2024</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Prodigy</p>
                  <p className="text-sm text-muted-foreground">
                    Worked as a web development intern and developed responsive web applications.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
