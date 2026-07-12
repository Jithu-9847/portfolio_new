"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { portfolioData } from "@/lib/portfolio-data"

export function Resume() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { resume } = portfolioData

  return (
    <section id="resume" className="py-12 md:py-20 relative bg-muted/30">
      {/* Top and bottom borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      
      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-background-foreground">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            Resume
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            View My Professional Journey
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my education, experience, and skills. 
            Feel free to view or download my resume for your records.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative inline-block"
        >
          <div className="p-8 md:p-12 bg-card border border-border rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            
            <div className="text-left flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{resume.title}</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                {resume.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                  <a 
                    href={resume.file} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View Resume
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 border-border hover:border-primary hover:text-white">
                  <a 
                    href={resume.file} 
                    download={resume.downloadName}
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="absolute -z-10 -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -z-10 -bottom-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  )
}
