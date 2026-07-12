import { portfolioData, type PortfolioData } from "@/lib/portfolio-data"

export type IslandZoneKind =
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "resume"
  | "contact"
  | "achievements"
  | "tech"
  | "socials"

export type IslandItem = {
  id: string
  zoneId: string
  title: string
  subtitle: string
  description: string
  tags?: string[]
  href?: string
  position: [number, number, number]
  scale: number
  visual: "board" | "crystal" | "building" | "waterfall" | "academy" | "harbor" | "lighthouse" | "peak" | "obelisk" | "shrine"
}

export type IslandZone = {
  id: IslandZoneKind
  title: string
  biome: string
  summary: string
  position: [number, number, number]
  radius: number
  items: IslandItem[]
}

export type IslandWorld = {
  hero: {
    title: string
    subtitle: string
  }
  zones: IslandZone[]
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

function radialPosition(
  center: [number, number, number],
  index: number,
  total: number,
  radius: number
): [number, number, number] {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2
  return [
    center[0] + Math.cos(angle) * radius,
    center[1],
    center[2] + Math.sin(angle) * radius,
  ]
}

export function createIslandWorld(data: PortfolioData = portfolioData): IslandWorld {
  // Spaced out coordinates for a massive island (radius up to 150)
  const aboutCenter: [number, number, number] = [-80, 0, 50]
  const skillsCenter: [number, number, number] = [60, 0, 80]
  const projectsCenter: [number, number, number] = [-50, 0, -90]
  const experienceCenter: [number, number, number] = [90, 0, -70]
  const educationCenter: [number, number, number] = [-90, 0, -40]
  const achievementsCenter: [number, number, number] = [10, 0, -120]
  const resumeCenter: [number, number, number] = [0, 0, 110]
  const contactCenter: [number, number, number] = [110, 0, 60]
  const techCenter: [number, number, number] = [-110, 0, 10]
  const socialsCenter: [number, number, number] = [40, 0, 120]

  const aboutText = data.about.paragraphs.join(" ")
  const skills = data.skills.flatMap((category) =>
    category.skills.map((skill) => ({ ...skill, category: category.title }))
  )

  return {
    hero: {
      title: `Welcome to ${data.profile.name.split(" ")[0]}'s Island`,
      subtitle: data.profile.tagline,
    },
    zones: [
      {
        id: "about",
        title: "Botanical Garden",
        biome: "About",
        summary: data.about.heading,
        position: aboutCenter,
        radius: 12,
        items: [
          {
            id: "about-board",
            zoneId: "about",
            title: data.about.eyebrow,
            subtitle: data.about.heading,
            description: aboutText,
            position: aboutCenter,
            scale: 1.35,
            visual: "board",
          },
        ],
      },
      {
        id: "skills",
        title: "Enchanted Forest",
        biome: "Skills",
        summary: `${skills.length} living skill crystals generated from shared portfolio data.`,
        position: skillsCenter,
        radius: 8,
        items: skills.map((skill, index) => ({
          id: `skill-${slugify(skill.name)}`,
          zoneId: "skills",
          title: skill.name,
          subtitle: `${skill.category} - ${skill.level}%`,
          description: `${skill.name} appears as a glowing crystal in the forest. Its intensity is driven by the skill level in the shared data source.`,
          position: radialPosition(skillsCenter, index, skills.length, 4.8),
          scale: 0.8 + skill.level / 180,
          visual: "crystal",
        })),
      },
      {
        id: "projects",
        title: "Medieval Village",
        biome: "Projects",
        summary: `${data.projects.length} project buildings generated automatically.`,
        position: projectsCenter,
        radius: 10,
        items: data.projects.map((project, index) => ({
          id: `project-${slugify(project.title)}`,
          zoneId: "projects",
          title: project.title,
          subtitle:
            project.type === "mobile"
              ? "Mobile App"
              : project.type === "client"
                ? "Client Project"
                : "Web App",
          description: project.description,
          tags: project.tags,
          href: project.liveUrl || project.githubUrl,
          position: [
            projectsCenter[0] + (index - (data.projects.length - 1) / 2) * 9.5,
            projectsCenter[1],
            projectsCenter[2] - 4.8,
          ],
          scale: project.type === "client" ? 1.35 : 1.05,
          visual: "building",
        })),
      },
      {
        id: "experience",
        title: "Waterfall Valley",
        biome: "Experience",
        summary: `${data.experience.length} career milestones flow through this valley.`,
        position: experienceCenter,
        radius: 7,
        items: data.experience.map((item, index) => ({
          id: `experience-${slugify(item.title)}`,
          zoneId: "experience",
          title: item.title,
          subtitle: `${item.organization} - ${item.period}`,
          description: item.description,
          position: radialPosition(experienceCenter, index, data.experience.length, 4.6),
          scale: 1,
          visual: "waterfall",
        })),
      },
      {
        id: "education",
        title: "Academy",
        biome: "Education",
        summary: `${data.education.length} learning milestones archived here.`,
        position: educationCenter,
        radius: 6,
        items: data.education.map((item, index) => ({
          id: `education-${slugify(item.title)}`,
          zoneId: "education",
          title: item.title,
          subtitle: `${item.organization} - ${item.period}`,
          description: item.description,
          position: radialPosition(educationCenter, index, data.education.length, 3.8),
          scale: 1,
          visual: "academy",
        })),
      },
      {
        id: "achievements",
        title: "Mountain Peak",
        biome: "Achievements",
        summary: data.about.stats.map((stat) => `${stat.value} ${stat.label}`).join(", "),
        position: achievementsCenter,
        radius: 5,
        items: data.about.stats.map((stat, index) => ({
          id: `achievement-${slugify(stat.label)}`,
          zoneId: "achievements",
          title: stat.value,
          subtitle: stat.label,
          description: `${stat.value} ${stat.label} is generated from the stats used by the main About section.`,
          position: radialPosition(achievementsCenter, index, data.about.stats.length, 2.6),
          scale: 1.15,
          visual: "peak",
        })),
      },
      {
        id: "resume",
        title: "Harbor",
        biome: "Resume",
        summary: "Resume dock with direct PDF access.",
        position: resumeCenter,
        radius: 5,
        items: [
          {
            id: "resume-harbor",
            zoneId: "resume",
            title: data.resume.title,
            subtitle: "Resume PDF",
            description: data.resume.description,
            href: data.resume.file,
            position: resumeCenter,
            scale: 1.2,
            visual: "harbor",
          },
        ],
      },
      {
        id: "contact",
        title: "Lighthouse",
        biome: "Contact",
        summary: "A beacon for collaboration and conversation.",
        position: contactCenter,
        radius: 5,
        items: [
          {
            id: "contact-lighthouse",
            zoneId: "contact",
            title: "Get in touch",
            subtitle: data.contact.email,
            description: `${data.contact.intro} Phone: ${data.contact.phone}. Location: ${data.contact.location}.`,
            href: `mailto:${data.contact.email}`,
            position: contactCenter,
            scale: 1.2,
            visual: "lighthouse",
          },
        ],
      },
      {
        id: "tech",
        title: "Tech Obelisk",
        biome: "Tech Stack",
        summary: `Daily technologies: ${data.dailyTech.join(", ")}`,
        position: techCenter,
        radius: 6,
        items: data.dailyTech.map((tech, index) => ({
          id: `tech-${slugify(tech)}`,
          zoneId: "tech",
          title: tech,
          subtitle: "Daily Stack",
          description: `${tech} is part of Jithu's daily technology toolkit used to build modern systems.`,
          position: radialPosition(techCenter, index, data.dailyTech.length, 3.5),
          scale: 1,
          visual: "obelisk",
        })),
      },
      {
        id: "socials",
        title: "Social Sanctuary",
        biome: "Socials",
        summary: "Connect with Jithu Girish across the web.",
        position: socialsCenter,
        radius: 5,
        items: Object.entries(data.socials).map(([platform, url], index, arr) => ({
          id: `social-${platform}`,
          zoneId: "socials",
          title: platform.charAt(0).toUpperCase() + platform.slice(1),
          subtitle: "Link",
          description: `Connect via ${platform}.`,
          href: url,
          position: radialPosition(socialsCenter, index, arr.length, 3),
          scale: 1.1,
          visual: "shrine",
        })),
      },
    ],
  }
}
