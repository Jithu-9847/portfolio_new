import { Header } from "@/components/portfolio/header"
import { Hero } from "@/components/portfolio/hero"
import { About } from "@/components/portfolio/about"
import { Skills } from "@/components/portfolio/skills"
import { Projects } from "@/components/portfolio/projects"
import { Contact } from "@/components/portfolio/contact"
import { Footer } from "@/components/portfolio/footer"
import { CustomCursor } from "@/components/portfolio/custom-cursor"
import { InteractiveTerminal } from "@/components/portfolio/interactive-terminal"
import { ScrollProgress } from "@/components/portfolio/scroll-progress"
import { Gallery } from "@/components/portfolio/gallery"
import { Resume } from "@/components/portfolio/resume"
import { GitHubStats } from "@/components/portfolio/github-stats"
import { LoadingScreen } from "@/components/portfolio/loading-screen"

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
