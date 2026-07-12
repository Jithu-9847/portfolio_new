"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { ExternalLink, Github, Smartphone, Globe, Briefcase, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TiltCard } from "./tilt-card"
import Image from "next/image"
import { portfolioData, type PortfolioProject } from "@/lib/portfolio-data"

export function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [filter, setFilter] = useState<"all" | "web" | "mobile">("all")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { projects, socials } = portfolioData

  const personalProjects = projects.filter(p => p.type === "web" || p.type === "mobile")
  const filteredPersonal = filter === "all" 
    ? personalProjects 
    : personalProjects.filter(p => p.type === filter)
  
  const clientProjects = projects.filter(p => p.type === "client")

  return (
    <section id="projects" className="py-12 md:py-20 relative">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div

          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            Portfolio
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-foreground text-balance">
            Featured Projects
          </h2>
        </motion.div>

        {/* Personal Projects Section */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">Personal Projects</h3>
            
            {/* Filters */}
            <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-full border border-border">
              {(["all", "web", "mobile"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-1.5 rounded-full text-xs font-medium transition-all duration-300 capitalize ${
                    filter === f
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "mobile" ? "Apps" : f}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="grid md:grid-cols-2 gap-8"
          >
            {filteredPersonal.map((project, index) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard project={project} onImageClick={setSelectedImage} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Client Work Section */}
        {clientProjects.length > 0 && (
          <div className="pt-24 border-t border-border">
            <div className="flex items-center gap-4 mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">Client Work</h3>
              <div className="h-px bg-border flex-1" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {clientProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProjectCard project={project} onImageClick={setSelectedImage} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Button asChild variant="outline" size="lg" className="gap-2 border-border hover:border-primary hover:text-white">
            <a href={socials.github} target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5" />
              View All Projects on GitHub
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-[80vh] bg-card rounded-2xl overflow-hidden shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Project Preview"
                fill
                className="object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors border border-border shadow-md"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ProjectCard({ 
  project, 
  onImageClick 
}: { 
  project: PortfolioProject,
  onImageClick: (img: string) => void
}) {
  return (
    <TiltCard className="relative group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 h-full">
      {/* Project image */}
      <div 
        className="relative h-64 md:h-72 bg-muted/30 overflow-hidden cursor-zoom-in"
        onClick={() => project.image && onImageClick(project.image)}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className={`transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105 ${
              project.type === "mobile" ? "object-contain p-4" : "object-cover"
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              {project.type === "mobile" ? (
                <Smartphone className="w-10 h-10 text-primary/60" />
              ) : project.type === "client" ? (
                <Briefcase className="w-10 h-10 text-primary/60" />
              ) : (
                <Globe className="w-10 h-10 text-primary/60" />
              )}
            </div>
          </div>
        )}
        
        {/* Type badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-medium bg-background/90 backdrop-blur-sm rounded-full border border-border shadow-sm">
            {project.type === "mobile" ? "Mobile App" : project.type === "client" ? "Client Project" : "Web App"}
          </span>
        </div>
        <motion.div
          className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {"rating" in project && project.rating && (
            <div className="flex items-center gap-0.5" title={`${project.rating} Star Client Satisfaction`}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < (project.rating as number) ? "fill-amber-400 text-amber-400" : "text-muted"}`} 
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          {project.liveUrl?
            <Button asChild variant="outline" size="sm" className="gap-2 border-border hover:border-primary hover:text-white">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          </Button>
          :null
          }
          {
            project.githubUrl?
             <Button asChild variant="ghost" size="sm" className="gap-2 hover:text-white">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4" />
              Code
            </a>
          </Button>
          :null
          }
         
        </div>
      </div>
    </TiltCard>
  )
}
