"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, X, Minus, Square } from "lucide-react"

const commands: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  about     - Learn about me",
    "  skills    - View my tech stack",
    "  contact   - Get my contact info",
    "  projects  - See my work",
    "  clear     - Clear terminal",
    "  hello     - Say hi!",
  ],
  about: [
    "┌─────────────────────────────────────┐",
    "│  Jithu Girish                       │",
    "│  Full-Stack & Flutter Developer     │",
    "├─────────────────────────────────────┤",
    "│  CSE Student at KTU University      │",
    "│  R&D Lead at PRODDEC                │",
    "└─────────────────────────────────────┘",
  ],
  skills: [
    "Loading skills... ████████████ 100%",
    "",
    "FRONTEND  → React, JavaScript, Tailwind, HTML/CSS",
    "MOBILE/AI → Flutter, Dart, OpenCV, React Native",
    "PROG      → Python, C, Java",
    "TOOLS     → Git, GitHub, VS Code, Figma",
    "",
    "Type 'projects' to see these in action!",
  ],
  contact: [
    "📧 Email: jithu.girish.dev@gmail.com",
    "📞 Phone: +91 73060 89306",
    "🔗 GitHub: github.com/Jithu-9847",
    "💼 LinkedIn: linkedin.com/in/jithugirish1",
    "📍 Loc: Pathanamthitta, Kerala, India",
    "",
    "Or scroll down to the contact section!",
  ],
  projects: [
    "Featured Projects:",
    "",
    "01 │ NoteNest         [WEB] - Collab notes",
    "02 │ PDFly App        [APP] - PDF tools",
    "03 │ Note Nest Bot    [WEB] - Telegram bot",
    "04 │ Flora            [APP] - Sustainability",
    "05 │ Eco-life         [WEB] - Eco platform",
    "06 │ Park-a-lot       [WEB] - Parking slots",
    "07 │ TeamUp           [APP] - Collaboration",
    "",
    "Scroll to 'Projects' section for details.",
  ],
  hello: [
    "👋 Hey there!",
    "",
    "Nice to meet you!",
    "Feel free to explore with commands.",
    "Type 'help' for available commands.",
  ],
  hi: [
    "👋 Hey there!",
    "",
    "Nice to meet you!",
    "Feel free to explore with commands.",
    "Type 'help' for available commands.",
  ],
  "": [],
}

export function InteractiveTerminal() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<{ command: string; output: string[] }[]>([
    { command: "", output: ["Welcome! Type 'help' to see available commands."] },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.toLowerCase().trim()
    
    if (trimmedCmd === "clear") {
      setHistory([])
      return
    }

    const output = commands[trimmedCmd] || [`Command not found: ${cmd}`, "Type 'help' for available commands."]
    setHistory((prev) => [...prev, { command: cmd, output }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
      setInput("")
    }
  }

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  return (
    <>
      {/* Terminal Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        whileHover={{ rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open terminal"
        data-cursor="Terminal"
      >
        <Terminal className="w-6 h-6" />
      </motion.button>

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl border border-neutral-800"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#2a2a2a] border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
                    aria-label="Close"
                  />
                  <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors" aria-label="Minimize">
                    <Minus className="w-2 h-2 opacity-0" />
                  </button>
                  <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" aria-label="Maximize">
                    <Square className="w-2 h-2 opacity-0" />
                  </button>
                </div>
              </div>
              <span className="text-xs text-neutral-400 font-mono">jithu@portfolio ~ </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Close terminal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Terminal Body */}
            <div
              ref={terminalRef}
              className="h-72 overflow-y-auto p-4 font-mono text-sm"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((item, i) => (
                <div key={i} className="mb-3">
                  {item.command && (
                    <div className="flex items-center gap-2 text-purple-400">
                      <span className="text-neutral-500">$</span>
                      <span>{item.command}</span>
                    </div>
                  )}
                  {item.output.map((line, j) => (
                    <div key={j} className="text-neutral-300 whitespace-pre">
                      {line}
                    </div>
                  ))}
                </div>
              ))}

              {/* Input Line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="text-neutral-500">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-purple-400 outline-none caret-purple-400"
                  autoComplete="off"
                  spellCheck={false}
                />
                <span className="w-2 h-4 bg-purple-400 animate-pulse" />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
