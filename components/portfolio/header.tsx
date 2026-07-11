"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Resume", href: "#resume" },
  { name: "Contact", href: "#contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      
      // Update active section based on scroll position
      const sections = navLinks.map(link => link.href.substring(1))
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-6">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`mx-auto w-[calc(100%-3rem)] md:w-auto md:max-w-fit px-2 py-2 rounded-full border border-border/40 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/70 backdrop-blur-xl shadow-xl shadow-black/5" 
            : "bg-background/40 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center gap-2 translate-z-0 w-full justify-between md:justify-start">
          {/* Logo First - Visible on all screens */}
          <div className="flex items-center">
            <motion.a
              href="#home"
              className="flex items-center overflow-clip justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg border border-primary/20 shadow-md shadow-primary/5 hover:bg-gray transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="./JithuGirish.png" alt="Logo" width={40} height={40} />
            </motion.a>
          </div>

          {/* Desktop Navigation Following Logo */}
          <div className="hidden md:flex items-center gap-1 border-l border-border/40 pl-2 ml-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1)
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </a>
              )
            })}
          </div>

          {/* Mobile Menu Trigger & Right spacing */}
          <div className="flex items-center ml-auto pl-2 md:pl-0">
            <motion.button
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative w-5 h-5 flex flex-col justify-center items-center gap-1.5">
                <motion.span 
                  animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  className="w-4 h-0.5 bg-foreground rounded-full"
                />
                <motion.span 
                  animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-4 h-0.5 bg-foreground rounded-full"
                />
                <motion.span 
                  animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  className="w-4 h-0.5 bg-foreground rounded-full"
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className="fixed top-24 left-6 right-6 z-50 md:hidden bg-card/90 backdrop-blur-2xl border border-border/40 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col p-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className={`px-6 py-4 text-xl font-semibold rounded-2xl transition-colors ${
                      activeSection === link.href.substring(1)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
