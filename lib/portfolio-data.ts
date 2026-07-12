export type PortfolioProject = {
  title: string
  description: string
  tags: string[]
  type: "web" | "mobile" | "client"
  image?: string
  liveUrl?: string
  githubUrl?: string
  rating?: number
}

export type SkillCategory = {
  title: string
  skills: {
    name: string
    level: number
  }[]
}

export type TimelineItem = {
  title: string
  organization: string
  period: string
  description: string
}

export type PortfolioData = {
  profile: {
    name: string
    role: string
    tagline: string
    portrait: string
  }
  about: {
    eyebrow: string
    heading: string
    paragraphs: string[]
    stats: {
      value: string
      label: string
    }[]
    highlights: {
      title: string
      description: string
    }[]
  }
  education: TimelineItem[]
  experience: TimelineItem[]
  skills: SkillCategory[]
  dailyTech: string[]
  projects: PortfolioProject[]
  resume: {
    title: string
    description: string
    file: string
    downloadName: string
  }
  contact: {
    email: string
    phone: string
    location: string
    intro: string
  }
  socials: {
    github: string
    linkedin: string
    instagram: string
  }
}

export const portfolioData: PortfolioData = {
  profile: {
    name: "Jithu Girish",
    role: "Developer",
    tagline:
      "Passionate about building modern websites, mobile apps, and exploring AI technologies to create user-focused digital experiences.",
    portrait: "/JithuGirish.png",
  },
  about: {
    eyebrow: "About Me",
    heading: "Turning Ideas Into Reality",
    paragraphs: [
      "I'm Jithu Girish, a passionate Full-Stack Web Developer and Flutter App Developer who recently graduated with a degree in Computer Science Engineering from KTU University. I love building modern websites, exploring AI technologies, and creating user-focused digital experiences.",
      "I believe great code deserves great design. I focus on creating intuitive, accessible interfaces.",
      "Technology evolves rapidly, and I'm committed to staying at the forefront of innovation through continuous learning and building innovative solutions.",
    ],
    stats: [{ value: "15+", label: "Projects Completed" }],
    highlights: [
      {
        title: "Web Development",
        description:
          "Building responsive and performant web applications with modern frameworks",
      },
      {
        title: "Flutter Apps",
        description:
          "Creating beautiful cross-platform mobile experiences with Flutter",
      },
      {
        title: "Software Engineering",
        description: "Architecting robust and scalable software solutions",
      },
      {
        title: "Performance",
        description:
          "Optimizing applications for speed and excellent user experience",
      },
    ],
  },
  education: [
    {
      title: "B.Tech Computer Science Engineering",
      organization: "KTU University",
      period: "2022 - 2026",
      description:
        "Graduated with a B.Tech in Computer Science Engineering, with a focus on software development and systems architecture.",
    },
    {
      title: "Higher Secondary Education",
      organization: "St. Thomas Higher Secondary School, Kozhencherry",
      period: "2020 - 2022",
      description: "Completed with 96% marks.",
    },
  ],
  experience: [
    {
      title: "Research and Development Lead",
      organization: "PRODDEC",
      period: "2025 - 2026",
      description:
        "Driving innovation and leading R&D initiatives for next-generation software solutions.",
    },
    {
      title: "Tech In-Charge Software",
      organization: "Proddec",
      period: "2024 - 2025",
      description:
        "Leading technical initiatives, coordinating web development projects, and organizing technical workshops for students.",
    },
    {
      title: "Web Development Intern",
      organization: "Prodigy",
      period: "2024",
      description:
        "Worked as a web development intern and developed responsive web applications.",
    },
  ],
  skills: [
    {
      title: "Frontend",
      skills: [
        { name: "React", level: 85 },
        { name: "JavaScript", level: 90 },
        { name: "Tailwind CSS", level: 80 },
        { name: "HTML5 / CSS3", level: 95 },
      ],
    },
    {
      title: "Mobile & AI",
      skills: [
        { name: "Flutter", level: 70 },
        { name: "OpenCV", level: 40 },
        { name: "Dart", level: 75 },
        { name: "React Native", level: 50 },
      ],
    },
    {
      title: "Development Tools",
      skills: [
        { name: "Git / GitHub", level: 90 },
        { name: "VS Code", level: 90 },
        { name: "Figma", level: 60 },
      ],
    },
    {
      title: "Programming",
      skills: [
        { name: "Python", level: 80 },
        { name: "C", level: 85 },
        { name: "Java", level: 75 },
      ],
    },
  ],
  dailyTech: ["React", "Flutter", "Tailwind", "Node.js", "Firebase", "Git"],
  projects: [
    {
      title: "NoteNest",
      description:
        "A real-time collaborative note-sharing platform for students. Built with React.js, Tailwind CSS, and Firebase.",
      tags: ["React.js", "Tailwind CSS", "Firebase"],
      type: "web",
      image: "/projects/personal/web/notenest_20.png",
      liveUrl: "https://demo.example.com/notenest",
      githubUrl: "https://github.com/jithugirish/notenest",
    },
    {
      title: "PDFly App",
      description:
        "A mobile app providing various PDF tools for seamless document management. Developed using Flutter and Google Project IDX.",
      tags: ["Flutter", "Project IDX", "Dart"],
      type: "mobile",
      image: "/projects/personal/app/pdfly (3).png",
      githubUrl: "https://github.com/jithugirish/pdfly",
    },
    {
      title: "Note Nest Bot",
      description:
        "A Telegram bot that lets students quickly access study notes. Powered by Node.js and Firebase Firestore.",
      tags: ["Node.js", "Telegram API", "Firestore"],
      type: "web",
      image: "/projects/personal/web/bot.png",
      liveUrl: "https://t.me/notenest_bot",
      githubUrl: "https://github.com/jithugirish/notenest-bot",
    },
    {
      title: "Flora",
      description:
        "A mobile application designed to simplify and encourage plastic collection for environmental sustainability.",
      tags: ["Flutter", "Firebase", "Environmental"],
      type: "mobile",
      image: "/projects/personal/app/flora.png",
      liveUrl: "#",
      githubUrl: "https://github.com/jithugirish/flora",
    },
    {
      title: "Eco-life",
      description:
        "A platform promoting eco-friendly living with resources and tips for a sustainable lifestyle.",
      tags: ["HTML", "CSS", "JS", "Firebase"],
      type: "web",
      image: "/projects/personal/web/ecolife.png",
      githubUrl: "https://github.com/jithugirish/ecolife",
    },
    {
      title: "Park-a-lot",
      description:
        "An online parking slot booking website to streamline urban parking management.",
      tags: ["React.js", "Firebase Realtime DB"],
      type: "web",
      image: "/projects/personal/web/park (1).png",
      githubUrl: "https://github.com/jithugirish/parkalot",
    },
    {
      title: "TeamUp",
      description:
        "A collaborative platform for teams to build and manage projects together efficiently.",
      tags: ["Flutter", "Firebase", "Collaboration"],
      type: "mobile",
      image: "/projects/personal/app/teamup.jpeg",
      githubUrl: "https://github.com/jithugirish/teamup",
    },
    {
      title: "Surge",
      description:
        "A comprehensive management system for organizational events and member achievements.",
      tags: ["React Native", "Firestore", "Tailwind CSS"],
      type: "client",
      image: "/projects/client/surge.jpeg",
      rating: 5,
    },
  ],
  resume: {
    title: "Jithu Girish - Resume",
    description:
      "Full-Stack Web & Flutter Developer with a passion for cybersecurity and AI.",
    file: "/JITHU_GIRISH_RESUME.pdf",
    downloadName: "JITHU_GIRISH_RESUME.pdf",
  },
  contact: {
    email: "jithu.girish.dev@gmail.com",
    phone: "+91 73060 89306",
    location: "Pathanamthitta, Kerala, India",
    intro:
      "Whether you have a question, want to start a project, or simply want to connect, feel free to reach out. I'm always open to discussing new projects and creative ideas.",
  },
  socials: {
    github: "https://github.com/Jithu-9847",
    linkedin: "https://linkedin.com/in/jithugirish1",
    instagram: "https://instagram.com/jithu_girish_",
  },
}

