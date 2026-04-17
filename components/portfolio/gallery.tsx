"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

const galleryItems = [
  {
    id: 1,
    title: "Build with AI Alappuzha Wrap-up",
    category: "Events Conducted",
    image: "/gallery/WhatsApp Image 2026-04-17 at 9.10.28 PM.jpeg",
    description: "Celebrating the successful conclusion of the 'Build with AI' workshop in Alappuzha with the community.",
  },
  {
    id: 2,
    title: "Product Design Keynote",
    category: "Mentoring Sessions",
    image: "/gallery/WhatsApp Image 2026-04-17 at 9.10.50 PM.jpeg",
    description: "Sharing insights on modern product design and development principles with aspiring creators.",
  },
  {
    id: 3,
    title: "Annual General Body Meeting",
    category: "Events Conducted",
    image: "/gallery/WhatsApp Image 2026-04-17 at 9.11.31 PM.jpeg",
    description: "A formal gathering of the PRODDEC team to discuss progress and future initiatives.",
  },
  {
    id: 4,
    title: "Tech Community Gathering",
    category: "Events Conducted",
    image: "/gallery/WhatsApp Image 2026-04-17 at 9.15.22 PM.jpeg",
    description: "Exploring new horizons and building connections within the vibrant tech community at CEC.",
  },
  {
    id: 5,
    title: "Interactive Mentoring Session",
    category: "Mentoring Sessions",
    image: "/gallery/WhatsApp Image 2026-04-17 at 9.16.19 PM.jpeg",
    description: "Hands-on guidance and collaborative learning during an intensive mentoring session.",
  },
  {
    id: 6,
    title: "Hands-on Workshop",
    category: "Events Conducted",
    image: "/gallery/WhatsApp Image 2026-04-17 at 9.17.32 PM.jpeg",
    description: "Empowering students through practical, hands-on experience in modern technology workshops.",
  },
]

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section id="gallery" className="py-24 md:py-32 bg-secondary/30 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary tracking-widest uppercase mb-4 block">
            Gallery
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Events & Mentoring
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the workshops I've lead and the developers I've had the privilege to mentor.
          </p>
        </motion.div>

        {/* Gallery Collage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[1200px] md:h-[600px] lg:h-[700px]">
          {galleryItems.map((item, index) => {
            // Define specific spans for collage effect (mapping to 6 items now)
            const spans = [
              "md:col-span-2 md:row-span-2", // Large first item
              "md:col-span-1 md:row-span-1", // Small second item
              "md:col-span-1 md:row-span-1", // Small third item
              "md:col-span-1 md:row-span-1", // Small fourth item
              "md:col-span-1 md:row-span-1", // Small fifth item
              "md:col-span-1 md:row-span-1", // Small sixth item
            ]
            
            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl bg-muted border border-border/50 shadow-sm cursor-zoom-in ${spans[index] || ""}`}
                onClick={() => setSelectedImage(item.image)}
              >
                {/* Grayscale Image */}
                <div className="absolute inset-0 grayscale transition-all duration-700 group-hover:grayscale-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-semibold text-primary/90 uppercase tracking-widest mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
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
                alt="Gallery View"
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
