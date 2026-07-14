"use client"

import { motion } from "framer-motion"
import { Gamepad2, Play, ArrowDown } from "lucide-react"
import Link from "next/link"
import { TextScramble } from "./text-scramble"
import { portfolioData } from "@/lib/portfolio-data"

export function Hero() {
  const { profile } = portfolioData

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Main content container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full pt-28 pb-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Main heading */}
              <div className="space-y-2">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-muted-foreground"
                >
                  I&apos;m {profile.name}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight"
                >
                  {profile.role}
                </motion.h1>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground text-base md:text-lg max-w-md"
              >
                {profile.tagline}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-4"
              >
                <div className="flex flex-wrap items-center gap-5">
                  <Link
                    href="/island"
                    className="inline-flex items-center gap-3 group"
                  >
                    <span className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Gamepad2 className="w-5 h-5 text-primary-foreground" />
                    </span>
                    <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                      Explore 3D Portfolio
                    </span>
                  </Link>
                  <a
                    href="#about"
                    className="inline-flex items-center gap-3 group"
                  >
                    <span className="w-12 h-12 rounded-lg bg-secondary border border-border flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 text-foreground fill-current ml-0.5" />
                    </span>
                    <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                      about me
                    </span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right side - Profile image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Image container with gradient fade */}
            <div className="relative">
              {/* Gradient overlay for seamless blend */}
              <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
              
              {/* Profile image with grayscale effect */}
              <div className="relative w-full max-w-full aspect-[3/4] sm:aspect-auto sm:max-w-[400px] sm:h-[520px] md:max-w-[500px] md:h-[650px] lg:max-w-none lg:w-[550px] lg:h-[720px] xl:w-[680px] xl:h-[820px] overflow-hidden rounded-2xl border border-border/50 mx-auto">
                <div className="absolute inset-0 bg-linear-to-br from-muted/50 to-muted/20" />
                <motion.img
                  src={profile.portrait}
                  alt={profile.name}
                  className="w-full h-full object-cover opacity-90 grayscale transition-all duration-700"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                
                {/* Code floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/3 right-8 text-primary/40 font-mono text-sm z-20"
                >
                  {"</>"}
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-1/3 left-8 text-primary/40 font-mono text-sm z-20"
                >
                  {"{ }"}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
       
       
    </section>
  )
}
