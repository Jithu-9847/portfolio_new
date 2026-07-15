import { Header } from "@/components/portfolio/header"
import { Hero } from "@/components/portfolio/hero"
import { CustomCursor } from "@/components/portfolio/custom-cursor"
import { ScrollProgress } from "@/components/portfolio/scroll-progress"
import { LoadingScreen } from "@/components/portfolio/loading-screen"
import dynamic from "next/dynamic"

const About = dynamic(() => import("@/components/portfolio/about").then((mod) => mod.About))
const Skills = dynamic(() => import("@/components/portfolio/skills").then((mod) => mod.Skills))
const GitHubStats = dynamic(() => import("@/components/portfolio/github-stats").then((mod) => mod.GitHubStats))
const Projects = dynamic(() => import("@/components/portfolio/projects").then((mod) => mod.Projects))
const Gallery = dynamic(() => import("@/components/portfolio/gallery").then((mod) => mod.Gallery))
const Resume = dynamic(() => import("@/components/portfolio/resume").then((mod) => mod.Resume))
const Contact = dynamic(() => import("@/components/portfolio/contact").then((mod) => mod.Contact))
const Footer = dynamic(() => import("@/components/portfolio/footer").then((mod) => mod.Footer))
const InteractiveTerminal = dynamic(() => import("@/components/portfolio/interactive-terminal").then((mod) => mod.InteractiveTerminal))

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LoadingScreen />
      <CustomCursor />
      <ScrollProgress />
      <Header />
      <Hero />
      <About />
      <Skills />
      <GitHubStats />
      <Projects />
      <Gallery />
      <Resume />
      <Contact />
      <Footer />
      <InteractiveTerminal />
    </main>
  )
}
