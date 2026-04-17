"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Instagram, Heart, Mail, MapPin, ArrowUp, ExternalLink } from "lucide-react"

const socialLinks = [
  { icon: Github, href: "https://github.com/Jithu-9847", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/jithugirish1", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/jithu_girish_", label: "Instagram" },
]

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
]

const resources = [
  { name: "Resume", href: "#resume" },
  { name: "Contact", href: "#contact" },
  { name: "GitHub Stats", href: "#github" },
  { name: "Gallery", href: "#gallery" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative border-t border-border bg-background/50 backdrop-blur-sm overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <motion.a
              href="#home"
              className="flex items-center gap-2 group max-w-fit"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <span>J</span>
              </div>
              <span className="text-xl font-bold text-foreground">Jithu Girish</span>
            </motion.a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Web & App Developer passionate about building seamless digital experiences and innovative solutions.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Navigation</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300 rounded-full" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Resources</h3>
            <ul className="space-y-4">
              {resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300 rounded-full" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <a 
                href="mailto:jithu.girish.dev@gmail.com" 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                jithu.girish.dev@gmail.com
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                Pathanamthitta, Kerala, India
              </div>
            </div>
            
            <button
              onClick={scrollToTop}
              className="mt-4 flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
            >
              Back to Top
              <ArrowUp className="w-3 h-3 animate-bounce" />
            </button>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground order-2 md:order-1">
            &copy; {currentYear} Jithu Girish. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground order-1 md:order-2">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart className="w-4 h-4 text-primary fill-current" />
            </motion.div>
            <span>by Jithu Girish</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
