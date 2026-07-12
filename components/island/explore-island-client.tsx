"use client"

import React, { useState, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import Link from "next/link"
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Compass,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  FolderKanban,
  User,
  Zap,
  Phone,
  Trophy,
  Github,
  Linkedin,
  Instagram,
  FileDown,
  Navigation,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft as MoveLeft,
  ArrowRight,
  Maximize2,
  CloudRain,
  CloudFog,
  Cloud,
  Monitor
} from "lucide-react"

import { createIslandWorld, type IslandZone, type IslandItem } from "@/lib/portfolio/island-adapter"
import { portfolioData } from "@/lib/portfolio-data"
import { Terrain } from "./terrain"
import { Player } from "./player"
import {
  BotanicalGardenLandmark,
  EnchantedForestLandmark,
  MedievalVillageLandmark,
  ExperienceWorkshopLandmark,
  AcademyLandmark,
  MountainPeakLandmark,
  HarborLandmark,
  LighthouseLandmark,
  TechObeliskLandmark,
  SocialSanctuaryLandmark,
  ProceduralEnvironment,
  ProjectHouse,
  CrystalItem,
  FarmingLand,
  Playground,
  SpawnArch,
  Temple,
  Pond,
  Windmill,
  CampfireSite,
  MysticRuins,
  Rain,
  Clouds
} from "./assets"

// Load world data
const world = createIslandWorld(portfolioData)

export type Weather = 'sunny' | 'rainy' | 'foggy'

export function ExploreIslandClient() {
  // Theme state
  const [isNight, setIsNight] = useState(false)
  const [weather, setWeather] = useState<Weather>('sunny')
  
  // Active Zone state
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null)
  
  // Navigation camera trigger state
  const [flyToTarget, setFlyToTarget] = useState<[number, number, number] | null>(null)

  // Audio system state
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Mobile controls state
  const [isMobile, setIsMobile] = useState(false)
  const [isPointerLocked, setIsPointerLocked] = useState(false)
  const [mobileKeys, setMobileKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  })

  // Active Project Detail Popup
  const [activeProject, setActiveProject] = useState<IslandItem | null>(null)

  // Track nearest project for E key interaction
  const [nearestProject, setNearestProject] = useState<IslandItem | null>(null)

  // Wake-up "Eye Opening" animation state
  const [hasOpenedEyes, setHasOpenedEyes] = useState(false)

  // Handle E or TAP interactions on all signs
  const interactWithSign = (proj: IslandItem) => {
    if (proj.id === "social-linkedin") {
      window.open("https://linkedin.com/in/jithugirish1", "_blank")
      return
    }
    if (proj.id === "social-github") {
      window.open("https://github.com/Jithu-9847", "_blank")
      return
    }
    if (proj.id === "social-instagram") {
      window.open("https://instagram.com/jithu_girish_", "_blank")
      return
    }
    setActiveProject(proj)
    if (document.pointerLockElement) {
      document.exitPointerLock()
    }
  }

  // Check if mobile on mount and initialize local weather
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Trigger eye-opening animation shortly after mount
    const wakeTimer = setTimeout(() => {
      setHasOpenedEyes(true)
    }, 500)

    // Attempt to sync weather with user's real-world location via IP
    const syncLocalWeather = async () => {
      try {
        const ipRes = await fetch('https://ipapi.co/json/')
        const ipData = await ipRes.json()
        
        if (ipData.latitude && ipData.longitude) {
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${ipData.latitude}&longitude=${ipData.longitude}&current_weather=true`)
          const weatherData = await weatherRes.json()
          
          // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
          const code = weatherData.current_weather?.weathercode || 0
          
          if (code === 45 || code === 48) {
            setWeather('foggy')
          } else if (code >= 51) { // 51-99 cover rain, snow, thunderstorms
            setWeather('rainy')
          } else { // 0-3 cover clear, mostly clear, cloudy
            setWeather('sunny')
          }
        }
      } catch (err) {
        console.warn("Failed to fetch real-world weather. Falling back to random.", err)
        // Fallback to random if API fails (e.g. adblocker blocks it)
        const weathers: Weather[] = ['sunny', 'rainy', 'foggy']
        setWeather(weathers[Math.floor(Math.random() * weathers.length)])
      }
    }
    
    syncLocalWeather()

    return () => {
      window.removeEventListener("resize", checkMobile)
      clearTimeout(wakeTimer)
    }
  }, [])

  // Web Audio Synthesizer: Play organic retro-ambient synth chords when entering new zones
  const playZoneSynth = (zoneId: string | null) => {
    if (!soundEnabled || !zoneId) return

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const now = ctx.currentTime

      // Define synth chords for different zones (chords in Hz)
      const chords: Record<string, number[]> = {
        about: [261.63, 329.63, 392.00, 493.88], // Cmaj7 (garden vibes)
        skills: [293.66, 349.23, 440.00, 523.25], // Dmin7 (mystic forest)
        projects: [329.63, 392.00, 493.88, 587.33], // Emin7 (village activity)
        experience: [349.23, 440.00, 523.25, 659.25], // Fmaj7 (flowing waterfall)
        education: [392.00, 493.88, 587.33, 698.46], // G7 (academy of wisdom)
        achievements: [440.00, 554.37, 659.25, 830.61], // Amaj7 (high mountain success)
        resume: [220.00, 261.63, 329.63, 392.00], // Amin7 (port/dock calm)
        contact: [293.66, 369.99, 440.00, 554.37], // Dmaj7 (lighthouse signal)
        tech: [329.63, 415.30, 493.88, 659.25], // Emaj7 (monument strength)
        socials: [261.63, 349.23, 392.00, 523.25], // Csus4 (connected sky)
      }

      const notes = chords[zoneId] || [261.63, 329.63, 392.00]

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        const filter = ctx.createBiquadFilter()

        osc.type = "sine"
        osc.frequency.value = freq

        // Soft slow attack and decay
        gainNode.gain.setValueAtTime(0, now)
        gainNode.gain.linearRampToValueAtTime(0.02, now + 0.3 + idx * 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.5)

        // Low-pass filter for smooth soft retro tone
        filter.type = "lowpass"
        filter.frequency.value = 500

        osc.connect(gainNode)
        gainNode.connect(filter)
        filter.connect(ctx.destination)

        osc.start(now)
        osc.stop(now + 2.8)
      })
    } catch (e) {
      console.warn("Synth failed to start", e)
    }
  }

  // Play beep on jump
  const playJumpSynth = () => {
    if (!soundEnabled) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "triangle"
      osc.frequency.setValueAtTime(150, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.15)
      
      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.2)
    } catch (e) {}
  }

  // Trigger synth whenever zone changes
  useEffect(() => {
    if (activeZoneId) {
      playZoneSynth(activeZoneId)
    }
  }, [activeZoneId, soundEnabled])

  // Get data of current active zone
  const activeZone = world.zones.find((z) => z.id === activeZoneId)

  // Trigger Fast Travel flight
  const handleFastTravel = (zone: IslandZone) => {
    setFlyToTarget(zone.position)
    setActiveZoneId(zone.id)
  }

  // Touch handlers for mobile
  const setMobileKey = (key: keyof typeof mobileKeys, value: boolean) => {
    setMobileKeys((prev) => ({ ...prev, [key]: value }))
    if (key === "jump" && value) {
      playJumpSynth()
    }
  }

  // Weather Derived Lighting & Fog
  let skyColor = isNight ? "#090c15" : "#bae6fd"
  let fogNear = 15
  let fogFar = 230
  let ambientIntensity = isNight ? 0.2 : 0.45
  let directionalIntensity = isNight ? 0.35 : 0.8

  if (weather === 'rainy') {
    skyColor = isNight ? "#020617" : "#64748b"
    fogNear = 10
    fogFar = 120
    ambientIntensity *= 0.7
    directionalIntensity *= 0.6
  } else if (weather === 'foggy') {
    skyColor = isNight ? "#0f172a" : "#cbd5e1"
    fogNear = 5
    fogFar = 40
    ambientIntensity *= 0.8
    directionalIntensity *= 0.5
  }

  const cycleWeather = () => {
    if (weather === 'sunny') setWeather('rainy')
    else if (weather === 'rainy') setWeather('foggy')
    else setWeather('sunny')
  }

  // ----------------------------------------------------
  // MOBILE FALLBACK SCREEN
  // ----------------------------------------------------
  if (isMobile) {
    return (
      <main className="w-screen h-screen flex flex-col items-center justify-center bg-[#090d16] text-center p-8 space-y-4">
        <Monitor className="w-16 h-16 text-amber-400 mb-2" />
        <h2 className="text-xl font-black text-white tracking-widest uppercase">Desktop Experience Only</h2>
        <div className="h-px w-16 bg-white/20 my-2 mx-auto" />
        <p className="text-sm text-neutral-400 font-medium max-w-sm leading-relaxed">
          This 3D interactive portfolio is optimized to work exclusively with desktop devices. Please switch to a larger screen for the full experience!
        </p>
      </main>
    )
  }

  return (
    <main className="w-screen h-screen relative overflow-hidden select-none bg-[#090d16] text-white">
      
      {/* 1. THREE.JS GRAPHICS CANVAS */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas shadows camera={{ fov: 60, near: 0.1, far: 500, position: [0, 5, 10] }}>
          {/* Dynamic Sky Color */}
          <color attach="background" args={[skyColor]} />
          
          {/* Dynamic Fog for Depth */}
          <fog attach="fog" args={[skyColor, fogNear, fogFar]} />

          {/* Dynamic Lights */}
          <ambientLight intensity={ambientIntensity} color={isNight ? "#6c7b95" : "#ffffff"} />
          
          {/* Main directional light representing Sun or Moon */}
          <directionalLight
            castShadow
            position={isNight ? [-60, 50, -60] : [60, 90, 60]}
            intensity={directionalIntensity}
            color={isNight ? "#8eb3ff" : "#fffdeb"}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
            shadow-camera-near={0.1}
            shadow-camera-far={250}
            shadow-bias={-0.001}
          />
          
          {/* Rain Particle System */}
          {weather === 'rainy' && <Rain isNight={isNight} />}
          
          {/* Dynamic Sky Clouds */}
          <Clouds weather={weather} isNight={isNight} />

          {/* Night Stars */}
          {isNight && <Stars radius={120} depth={50} count={1200} factor={6} saturation={0.5} fade speed={1.2} />}

          {/* Low-Poly Terrain Heightmap */}
          <Terrain />

          {/* Procedural tree canopy, rocks, and signposts */}
          <ProceduralEnvironment isNight={isNight} />

          {/* Decorative Scenery — Farming Land, Playground, Temple, Pond, and more! */}
          <FarmingLand position={[60, 0, 15]} />
          <Playground position={[-90, 0, -60]} />
          <Temple position={[-45, 0, 45]} />
          <Pond position={[45, 0, -45]} />
          <Windmill position={[70, 0, -20]} />
          <CampfireSite position={[20, 0, -80]} />
          <MysticRuins position={[-70, 0, -10]} />
          <SpawnArch />

          {/* Render all 10 Landmark zones */}
          {world.zones.map((zone) => {
            switch (zone.id) {
              case "about":
                return <BotanicalGardenLandmark key={zone.id} zone={zone} />
              case "skills":
                return <EnchantedForestLandmark key={zone.id} zone={zone} isNight={isNight} />
              case "projects":
                return <MedievalVillageLandmark key={zone.id} zone={zone} />
              case "experience":
                return (
                  <ExperienceWorkshopLandmark
                    key={zone.id}
                    zone={zone}
                    onOpenProject={(proj) => {
                      setActiveProject(proj)
                      if (document.pointerLockElement) {
                        document.exitPointerLock()
                      }
                    }}
                  />
                )
              case "education":
                return (
                  <AcademyLandmark
                    key={zone.id}
                    zone={zone}
                    onOpenProject={(proj) => {
                      setActiveProject(proj)
                      if (document.pointerLockElement) {
                        document.exitPointerLock()
                      }
                    }}
                  />
                )
              case "achievements":
                return (
                  <MountainPeakLandmark
                    key={zone.id}
                    zone={zone}
                    isNight={isNight}
                    onOpenProject={(proj) => {
                      setActiveProject(proj)
                      if (document.pointerLockElement) {
                        document.exitPointerLock()
                      }
                    }}
                  />
                )
              case "resume":
                return <HarborLandmark key={zone.id} zone={zone} />
              case "contact":
                return <LighthouseLandmark key={zone.id} zone={zone} isNight={isNight} />
              case "tech":
                return <TechObeliskLandmark key={zone.id} zone={zone} isNight={isNight} />
              case "socials":
                return <SocialSanctuaryLandmark key={zone.id} zone={zone} isNight={isNight} />
              default:
                return null
            }
          })}

          {/* Render individual items from adapter (e.g. project houses & floating skill crystals) */}
          {world.zones.map((zone) =>
            zone.items.map((item) => {
              if (item.visual === "building") {
                return (
                  <ProjectHouse
                    key={item.id}
                    item={item}
                    isNight={isNight}
                    onOpenProject={(proj) => {
                      setActiveProject(proj)
                      if (document.pointerLockElement) {
                        document.exitPointerLock()
                      }
                    }}
                  />
                )
              }
              if (item.visual === "crystal") {
                return (
                  <CrystalItem
                    key={item.id}
                    position={item.position}
                    scale={item.scale}
                    color="#4dffff"
                    isNight={isNight}
                    lightIntensity={2.2}
                  />
                )
              }
              return null
            })
          )}

          {/* FPS Camera and movement physics */}
          <Player
            world={world}
            activeZoneId={activeZoneId}
            setActiveZoneId={setActiveZoneId}
            flyToTarget={flyToTarget}
            onClearFlyTo={() => setFlyToTarget(null)}
            isMobileTouch={mobileKeys}
            isPointerLocked={isPointerLocked}
            setIsPointerLocked={setIsPointerLocked}
            onNearProjectSign={setNearestProject}
            onInteractProject={interactWithSign}
          />
        </Canvas>
      </div>

      {/* 0. WAKE UP "EYE OPENING" ANIMATION OVERLAY */}
      <div className={`fixed inset-0 z-50 pointer-events-none flex flex-col justify-between transition-opacity duration-700 ease-in ${hasOpenedEyes ? 'opacity-0' : 'opacity-100'}`}>
        <div className={`w-full bg-black transition-all duration-[2000ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${hasOpenedEyes ? 'h-0' : 'h-[52vh]'}`} />
        <div className={`w-full bg-black transition-all duration-[2000ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${hasOpenedEyes ? 'h-0' : 'h-[52vh]'}`} />
      </div>

      {/* 2D HUD Top Banner: Current Area Indicator */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none z-30">
        <div className="bg-slate-950/85 backdrop-blur-md border-3 border-slate-950 px-4 py-1.5 rounded-full shadow-[4px_4px_0px_#0f172a] text-slate-100 font-extrabold text-[10px] tracking-wider flex items-center gap-2 transition-all duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-neutral-400 font-bold uppercase">Area:</span>
          <span className="text-white uppercase tracking-normal text-xs font-black">
            {activeZone ? activeZone.title : null}
          </span>
        </div>
      </div>

      {/* 2. HUD CONTROL PANEL OVERLAYS */}
      <div className="absolute top-0 inset-x-0 p-5 flex items-center justify-between pointer-events-none z-10">
        
        {/* Header Branding */}
        <div className="flex items-center gap-3 pointer-events-auto bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4 text-neutral-400" />
            <span className="font-semibold tracking-wide text-xs hidden sm:inline">Portfolio</span>
          </Link>
          <div className="h-3 w-px bg-white/15" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <h1 className="text-xs font-bold tracking-wider text-neutral-200">ISLAND EXPLORER</h1>
          </div>
        </div>

        {/* Ambient Settings Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Day / Night Toggle */}
          <button
            onClick={() => setIsNight(!isNight)}
            className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all flex items-center justify-center cursor-pointer shadow-md text-neutral-200"
            title="Toggle Day/Night Cycle"
          >
            {isNight ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Weather Toggle */}
          <button
            onClick={cycleWeather}
            className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all flex items-center justify-center cursor-pointer shadow-md text-neutral-200"
            title="Cycle Weather (Sunny / Rainy / Foggy)"
          >
            {weather === 'sunny' ? <Sun className="w-4 h-4 text-amber-200" /> : 
             weather === 'rainy' ? <CloudRain className="w-4 h-4 text-sky-400" /> : 
             <CloudFog className="w-4 h-4 text-neutral-400" />}
          </button>

          {/* Synth Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all flex items-center justify-center cursor-pointer shadow-md text-neutral-200"
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-400" />}
          </button>
        </div>
      </div>

      {/* 3. FAST TRAVEL SIDEBAR (COLLAPSED BY DEFAULT ON MOBILE) */}
      <div className="absolute left-5 top-20 bottom-20 w-52 pointer-events-none hidden md:flex flex-col gap-2 z-10">
        <div className="pointer-events-auto bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl p-3 shadow-2xl flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-white/15">
            <Compass className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-xs tracking-wider text-neutral-300">FAST TRAVEL</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
            {world.zones.map((zone) => {
              const isActive = activeZoneId === zone.id
              return (
                <button
                  key={zone.id}
                  onClick={() => handleFastTravel(zone)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? "bg-amber-400/15 border-amber-400 text-amber-300 shadow-inner"
                      : "bg-white/5 border-transparent text-neutral-400 hover:bg-white/10 hover:text-white"
                  }`}
                  title={`Fast travel to ${zone.title}`}
                >
                  <span className="font-semibold text-[11px] truncate pr-2 group-hover:pl-1 transition-all duration-300">
                    {zone.title}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-transparent'}`} />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 4. ACTIVE ZONE DETAIL DRAWER (GLASSMORPHIC CARDS) */}
      <div className="absolute right-5 bottom-5 top-20 md:top-auto md:bottom-5 w-[calc(100vw-40px)] md:w-[480px] pointer-events-none flex flex-col justify-end z-10">
        {activeZone ? (
          <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col transition-all duration-500 animate-slide-up ui-card">
            
            {/* Header banner */}
            <div className="bg-linear-to-r from-[#1e293b]/70 to-[#0f172a]/70 p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">
                  {activeZone.biome}
                </span>
                <h3 className="font-black text-lg tracking-wide text-white mt-0.5">
                  {activeZone.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveZoneId(null)}
                className="text-xs bg-white/10 border border-white/5 px-2.5 py-1 rounded-md hover:bg-white/20 transition-all font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Zone content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-sm text-neutral-300">
              
              {activeZone.id === "about" && (
                <div className="space-y-3 font-light leading-relaxed">
                  <User className="w-8 h-8 text-amber-400 mb-2" />
                  {portfolioData.about.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              )}

              {activeZone.id === "skills" && (
                <div className="space-y-4">
                  <Zap className="w-8 h-8 text-yellow-400 mb-2" />
                  {portfolioData.skills.map((category) => (
                    <div key={category.title} className="space-y-2">
                      <h4 className="font-bold text-xs tracking-wider text-neutral-400 uppercase">
                        {category.title}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.skills.map((skill) => (
                          <div key={skill.name} className="bg-white/5 border border-white/5 rounded-lg p-2 flex flex-col justify-between">
                            <span className="font-medium text-xs text-white">{skill.name}</span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-linear-to-r from-emerald-400 to-teal-400 rounded-full"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                              <span className="text-[10px] opacity-75 font-mono">{skill.level}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeZone.id === "projects" && (
                <div className="space-y-3">
                  <FolderKanban className="w-8 h-8 text-sky-400 mb-2" />
                  {portfolioData.projects.map((project) => (
                    <div key={project.title} className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-2 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{project.title}</span>
                        <span className="text-[10px] bg-sky-400/10 border border-sky-400/20 text-sky-300 px-2 py-0.5 rounded-full font-semibold uppercase">
                          {project.type}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-light leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-[9px] bg-white/5 border border-white/5 text-neutral-400 px-2 py-0.5 rounded-md font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-1.5 bg-white/10 border border-white/5 text-xs font-semibold rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Github className="w-3.5 h-3.5" /> Code
                          </a>
                        )}
                        {project.liveUrl && project.liveUrl !== "#" && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-1.5 bg-amber-400 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-300 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Maximize2 className="w-3.5 h-3.5" /> Launch
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeZone.id === "experience" && (
                <div className="space-y-4">
                  <Briefcase className="w-8 h-8 text-emerald-400 mb-2" />
                  <div className="relative border-l-2 border-white/10 ml-2.5 pl-4 space-y-5">
                    {portfolioData.experience.map((item, idx) => (
                      <div key={idx} className="relative space-y-1">
                        {/* Timeline dot */}
                        <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />
                        <div className="flex items-baseline justify-between gap-2 flex-wrap">
                          <span className="font-bold text-white text-xs">{item.title}</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full">
                            {item.period}
                          </span>
                        </div>
                        <h5 className="text-[11px] text-neutral-400 font-bold">{item.organization}</h5>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeZone.id === "education" && (
                <div className="space-y-4">
                  <GraduationCap className="w-8 h-8 text-indigo-400 mb-2" />
                  <div className="relative border-l-2 border-white/10 ml-2.5 pl-4 space-y-5">
                    {portfolioData.education.map((item, idx) => (
                      <div key={idx} className="relative space-y-1">
                        <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-400 border border-slate-900" />
                        <div className="flex items-baseline justify-between gap-2 flex-wrap">
                          <span className="font-bold text-white text-xs">{item.title}</span>
                          <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-400/10 px-2 py-0.5 rounded-full">
                            {item.period}
                          </span>
                        </div>
                        <h5 className="text-[11px] text-neutral-400 font-bold">{item.organization}</h5>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeZone.id === "achievements" && (
                <div className="space-y-3">
                  <Trophy className="w-8 h-8 text-amber-500 mb-2" />
                  <div className="bg-white/5 border border-white/5 rounded-xl p-5 text-center space-y-2">
                    <span className="text-3xl font-black text-white tracking-tight">15+</span>
                    <h4 className="font-bold text-sm text-neutral-300">Projects Completed</h4>
                    <p className="text-xs text-neutral-500 font-light">
                      Successfully developed and delivered various systems across web, mobile apps, and artificial intelligence.
                    </p>
                  </div>
                </div>
              )}

              {activeZone.id === "resume" && (
                <div className="space-y-4">
                  <FileDown className="w-8 h-8 text-amber-400 mb-2" />
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Download my full curriculum vitae to learn more about my technical background, projects, academic honors, and work experiences.
                  </p>
                  <a
                    href={portfolioData.resume.file}
                    download={portfolioData.resume.downloadName}
                    className="w-full py-3 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <FileDown className="w-4 h-4" /> DOWNLOAD CV (PDF)
                  </a>
                </div>
              )}

              {activeZone.id === "contact" && (
                <div className="space-y-4">
                  <Phone className="w-8 h-8 text-rose-400 mb-2" />
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {portfolioData.contact.intro}
                  </p>
                  <div className="space-y-2 pt-2">
                    <div className="bg-white/5 border border-white/5 rounded-lg p-2.5 flex flex-col">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase">EMAIL ME</span>
                      <a href={`mailto:${portfolioData.contact.email}`} className="text-xs font-bold text-white hover:text-amber-400 transition-colors">
                        {portfolioData.contact.email}
                      </a>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-lg p-2.5 flex flex-col">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase">CALL ME</span>
                      <a href={`tel:${portfolioData.contact.phone}`} className="text-xs font-bold text-white hover:text-amber-400 transition-colors">
                        {portfolioData.contact.phone}
                      </a>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-lg p-2.5 flex flex-col">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase">LOCATION</span>
                      <span className="text-xs font-bold text-white">
                        {portfolioData.contact.location}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeZone.id === "tech" && (
                <div className="space-y-4">
                  <Zap className="w-8 h-8 text-cyan-400 mb-2" />
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    A collection of programming languages, libraries, and frameworks I use on a daily basis.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {portfolioData.dailyTech.map((tech) => (
                      <div key={tech} className="bg-slate-900 border border-white/5 rounded-xl p-3 text-center shadow-md">
                        <span className="font-bold text-xs text-cyan-300">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeZone.id === "socials" && (
                <div className="space-y-4">
                  <Sparkles className="w-8 h-8 text-indigo-400 mb-2" />
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    Connect with me on social platforms and check out my live development feeds.
                  </p>
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <a
                      href={portfolioData.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-1.5 hover:bg-white/10 hover:border-white/15 hover:scale-105 transition-all text-neutral-300 hover:text-white"
                    >
                      <Github className="w-5 h-5 text-neutral-200" />
                      <span className="text-[10px] font-bold">GitHub</span>
                    </a>
                    <a
                      href={portfolioData.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-1.5 hover:bg-white/10 hover:border-white/15 hover:scale-105 transition-all text-neutral-300 hover:text-white"
                    >
                      <Linkedin className="w-5 h-5 text-sky-400" />
                      <span className="text-[10px] font-bold">LinkedIn</span>
                    </a>
                    <a
                      href={portfolioData.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-1.5 hover:bg-white/10 hover:border-white/15 hover:scale-105 transition-all text-neutral-300 hover:text-white"
                    >
                      <Instagram className="w-5 h-5 text-rose-400" />
                      <span className="text-[10px] font-bold">Instagram</span>
                    </a>
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* Exploration Overlay instruction when in neutral areas */
          <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center pointer-events-auto max-w-[340px] mx-auto shadow-xl animate-fade-in flex flex-col gap-2">
            <Navigation className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-bounce" />
            <h4 className="font-bold text-xs tracking-wider text-white">READY TO EXPLORE</h4>
            <p className="text-[10px] text-neutral-300 font-light leading-relaxed">
              Use <strong className="text-white font-semibold">WASD/Arrows</strong> to walk, <strong className="text-white font-semibold">Shift</strong> to sprint, and <strong className="text-white font-semibold">Space</strong> to jump. Search for path lanterns!
            </p>
            {!isMobile && (
              <p className="text-[9px] text-amber-300/90 font-medium border border-amber-500/20 bg-amber-500/5 py-1 px-2 rounded-md">
                Click on the landscape to lock cursor & look with mouse. Press <strong className="text-white font-semibold">ESC</strong> to unlock.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 5. ON-SCREEN MOBILE TOUCH CONTROLS (D-PAD & JUMP) */}
      {isMobile && (
        <div className="absolute inset-x-5 bottom-6 pointer-events-none flex items-center justify-between z-10">
          
          {/* Movement Directional buttons */}
          <div className="flex flex-col gap-1.5 pointer-events-auto bg-black/30 backdrop-blur-sm p-2.5 rounded-2xl border border-white/5 shadow-lg">
            <div className="flex justify-center">
              <button
                onTouchStart={() => setMobileKey("forward", true)}
                onTouchEnd={() => setMobileKey("forward", false)}
                className="w-10 h-10 rounded-xl bg-white/10 active:bg-white/30 border border-white/10 flex items-center justify-center"
              >
                <ArrowUp className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="flex gap-1.5">
              <button
                onTouchStart={() => setMobileKey("left", true)}
                onTouchEnd={() => setMobileKey("left", false)}
                className="w-10 h-10 rounded-xl bg-white/10 active:bg-white/30 border border-white/10 flex items-center justify-center"
              >
                <MoveLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onTouchStart={() => setMobileKey("backward", true)}
                onTouchEnd={() => setMobileKey("backward", false)}
                className="w-10 h-10 rounded-xl bg-white/10 active:bg-white/30 border border-white/10 flex items-center justify-center"
              >
                <ArrowDown className="w-5 h-5 text-white" />
              </button>
              <button
                onTouchStart={() => setMobileKey("right", true)}
                onTouchEnd={() => setMobileKey("right", false)}
                className="w-10 h-10 rounded-xl bg-white/10 active:bg-white/30 border border-white/10 flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Jump & Fast Travel list buttons */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            {/* Jump Button */}
            <button
              onTouchStart={() => setMobileKey("jump", true)}
              onTouchEnd={() => setMobileKey("jump", false)}
              className="w-14 h-14 rounded-full bg-amber-400 active:bg-amber-300 text-slate-950 font-black tracking-tighter text-sm flex items-center justify-center border-4 border-slate-950 shadow-2xl"
            >
              JUMP
            </button>
          </div>
        </div>
      )}

      {/* Floating small mobile compass for menu */}
      {isMobile && (
        <div className="absolute right-4 top-16 pointer-events-auto z-10 flex flex-col gap-1.5">
          {world.zones.map((zone) => {
            const isActive = activeZoneId === zone.id
            return (
              <button
                key={zone.id}
                onClick={() => handleFastTravel(zone)}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[9px] font-bold shadow-md transition-all ${
                  isActive
                    ? "bg-amber-400 border-amber-400 text-slate-950"
                    : "bg-black/50 border-white/10 text-neutral-400"
                }`}
                title={zone.title}
              >
                {zone.title.charAt(0)}
              </button>
            )
          })}
        </div>
      )}

      {/* CSS Anim style definition */}
      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Cartoon Details Popup Styles */
        .cartoon-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: cartoon-fade-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .cartoon-popup-window {
          position: relative;
          background: #fffbeb;
          border: 4px solid #1e293b;
          box-shadow: 8px 8px 0px #1e293b;
          border-radius: 20px;
          width: 90%;
          max-width: 520px;
          padding: 32px;
          font-family: 'Outfit', 'Inter', sans-serif;
          color: #1e293b;
          transform-origin: center;
          animation: cartoon-bounce-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .cartoon-popup-close {
          position: absolute;
          top: -16px;
          right: -16px;
          background: #ef4444;
          color: white;
          border: 3px solid #1e293b;
          box-shadow: 3px 3px 0px #1e293b;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          font-size: 18px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.1s ease;
        }
        .cartoon-popup-close:hover {
          transform: scale(1.1) rotate(90deg);
          background: #dc2626;
        }
        .cartoon-popup-close:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0px #1e293b;
        }
        .cartoon-popup-header {
          margin-bottom: 20px;
        }
        .cartoon-popup-badge {
          display: inline-block;
          background: #f59e0b;
          color: #1e293b;
          font-weight: 800;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 8px;
          border: 2px solid #1e293b;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
          box-shadow: 2px 2px 0px #1e293b;
        }
        .cartoon-popup-title {
          font-size: 26px;
          font-weight: 900;
          margin: 0 0 6px 0;
          line-height: 1.2;
          color: #1e293b;
        }
        .cartoon-popup-subtitle {
          font-size: 15px;
          color: #d97706;
          font-weight: 700;
          margin: 0;
        }
        .cartoon-popup-content {
          background: #ffffff;
          border: 3px solid #1e293b;
          box-shadow: 4px 4px 0px #1e293b;
          border-radius: 12px;
          padding: 18px;
          margin-bottom: 24px;
        }
        .cartoon-popup-desc {
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 16px 0;
          color: #475569;
        }
        .cartoon-popup-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .cartoon-popup-tag {
          font-size: 12px;
          font-weight: 700;
          color: #2563eb;
          background: #eff6ff;
          border: 2px solid #1e293b;
          padding: 3px 8px;
          border-radius: 6px;
          box-shadow: 2px 2px 0px #1e293b;
        }
        .cartoon-popup-actions {
          display: flex;
          justify-content: center;
        }
        .cartoon-popup-btn {
          display: inline-block;
          background: #10b981;
          color: white;
          font-weight: 800;
          font-size: 16px;
          padding: 12px 28px;
          border-radius: 14px;
          border: 3px solid #1e293b;
          box-shadow: 4px 4px 0px #1e293b;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .cartoon-popup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 6px 6px 0px #1e293b;
          background: #059669;
        }
        .cartoon-popup-btn:active {
          transform: translate(3px, 3px);
          box-shadow: 1px 1px 0px #1e293b;
        }
        @keyframes cartoon-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cartoon-bounce-in {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.06); }
          100% { transform: scale(1.0); opacity: 1; }
        }
      `}</style>

      {/* 6. GAME HUD OVERLAYS (Crosshair & Lock hints) */}
      {isPointerLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white/70 rounded-full border border-black/20 shadow-md" />
        </div>
      )}

      {!isPointerLocked && !isMobile && !activeZone && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-amber-400/90 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-full text-xs pointer-events-none shadow-2xl transition-all duration-300 animate-pulse z-40 border border-amber-300/40">
          Click the island to lock mouse & look around
        </div>
      )}

      {/* 2D Gamified HUD Prompt for E interaction */}
      {nearestProject && !activeProject && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-amber-400 border-4 border-slate-950 px-6 py-3 rounded-2xl shadow-[6px_6px_0px_#0f172a] text-slate-950 font-black tracking-tight animate-bounce pointer-events-auto z-40 flex items-center gap-3">
          <div className="bg-slate-950 text-white rounded-lg px-2.5 py-1 text-sm font-black border border-white/20">
            E
          </div>
          <span className="text-sm">
            Read Sign: <span className="underline">{nearestProject.title}</span>
          </span>
          {isMobile && (
            <button
              onClick={() => interactWithSign(nearestProject)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-xl border-2 border-slate-950 font-extrabold text-xs ml-2 cursor-pointer shadow-[2px_2px_0px_#0f172a]"
            >
              TAP
            </button>
          )}
        </div>
      )}

      {/* Cartoony Popup Window for Projects */}
      {activeProject && (
        <div className="cartoon-popup-overlay" onClick={() => setActiveProject(null)}>
          <div className="cartoon-popup-window" onClick={(e) => e.stopPropagation()}>
            <button className="cartoon-popup-close" onClick={() => setActiveProject(null)}>
              ✕
            </button>
            {activeProject.id === "education-academy" ? (
              <>
                <div className="cartoon-popup-header">
                  <span className="cartoon-popup-badge bg-indigo-600 text-white">ACADEMICS</span>
                  <h2 className="cartoon-popup-title">Academy of Sciences</h2>
                  <p className="cartoon-popup-subtitle">Educational Timeline & Milestones</p>
                </div>
                <div className="cartoon-popup-content max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                  {portfolioData.education.map((item, idx) => (
                    <div key={idx} className="bg-amber-50/50 border-3 border-slate-950 p-4 rounded-xl shadow-[4px_4px_0px_#0f172a] space-y-2">
                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-950 text-sm">{item.title}</span>
                        <span className="text-[10px] text-white font-mono font-bold bg-indigo-600 border border-slate-950 px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_#000]">
                          {item.period}
                        </span>
                      </div>
                      <h5 className="text-xs text-indigo-950 font-black">{item.organization}</h5>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : activeProject.id === "achievements-peak" ? (
              <>
                <div className="cartoon-popup-header">
                  <span className="cartoon-popup-badge bg-amber-500 text-white border-2 border-slate-950 px-2 py-0.5 rounded-md font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">ACHIEVEMENTS</span>
                  <h2 className="cartoon-popup-title">Achievements Peak</h2>
                  <p className="cartoon-popup-subtitle text-slate-600 font-medium font-bold">Completed Milestones</p>
                </div>
                <div className="cartoon-popup-content flex flex-col items-center justify-center p-6 space-y-4 text-center">
                  <div className="bg-amber-100 border-4 border-slate-950 p-6 rounded-2xl shadow-[6px_6px_0px_#0f172a] transform -rotate-1 hover:rotate-0 transition-transform duration-300 max-w-sm w-full space-y-3">
                    <span className="text-5xl font-black text-slate-950 tracking-tight block animate-bounce">15+</span>
                    <h3 className="text-lg font-extrabold text-slate-950 uppercase">Projects Completed</h3>
                    <div className="h-1 bg-slate-950 rounded-full w-16 mx-auto my-2" />
                    <p className="text-xs text-slate-800 font-bold leading-relaxed">
                      Successfully developed various production-ready systems across Web Development and Mobile Apps.
                    </p>
                  </div>
                </div>
              </>
            ) : activeProject.id === "contact-lighthouse" ? (
              <>
                <div className="cartoon-popup-header">
                  <span className="cartoon-popup-badge bg-emerald-600 text-white border-2 border-slate-950 px-2 py-0.5 rounded-md font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">CONTACT</span>
                  <h2 className="cartoon-popup-title">Lighthouse Beacon</h2>
                  <p className="cartoon-popup-subtitle text-slate-600 font-bold">A Beacon for Collaboration</p>
                </div>
                <div className="cartoon-popup-content flex flex-col p-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="bg-amber-50/50 border-3 border-slate-950 p-4 rounded-xl shadow-[4px_4px_0px_#0f172a]">
                    <p className="text-xs text-slate-800 font-bold leading-relaxed">
                      {portfolioData.contact.intro}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white border-3 border-slate-950 p-3 rounded-xl shadow-[3px_3px_0px_#0f172a] flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-black text-slate-500 uppercase">Email</span>
                      <span className="text-xs font-black text-slate-950 select-all">{portfolioData.contact.email}</span>
                    </div>

                    <div className="bg-white border-3 border-slate-950 p-3 rounded-xl shadow-[3px_3px_0px_#0f172a] flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-black text-slate-500 uppercase">Phone</span>
                      <span className="text-xs font-black text-slate-950 select-all">{portfolioData.contact.phone}</span>
                    </div>

                    <div className="bg-white border-3 border-slate-950 p-3 rounded-xl shadow-[3px_3px_0px_#0f172a] flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-black text-slate-500 uppercase">Location</span>
                      <span className="text-xs font-black text-slate-950">{portfolioData.contact.location}</span>
                    </div>
                  </div>

                  <a
                    href={`mailto:${portfolioData.contact.email}`}
                    className="inline-block text-center bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black text-sm py-3 px-6 rounded-xl border-3 border-slate-950 shadow-[4px_4px_0px_#0f172a] active:translate-y-0.5 active:shadow-[2px_2px_0px_#0f172a] transition-all"
                  >
                    ✦ Send a Message ✦
                  </a>
                </div>
              </>
            ) : activeProject.id === "experience-workshop" ? (
              <>
                <div className="cartoon-popup-header">
                  <span className="cartoon-popup-badge bg-rose-600 text-white border-2 border-slate-950 px-2 py-0.5 rounded-md font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">EXPERIENCE</span>
                  <h2 className="cartoon-popup-title">Crafter's Guild</h2>
                  <p className="cartoon-popup-subtitle text-slate-600 font-bold">Professional Work History</p>
                </div>
                <div className="cartoon-popup-content max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                  {portfolioData.experience.map((item, idx) => (
                    <div key={idx} className="bg-amber-50/50 border-3 border-slate-950 p-4 rounded-xl shadow-[4px_4px_0px_#0f172a] space-y-2">
                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-950 text-sm">{item.title}</span>
                        <span className="text-[10px] text-white font-mono font-bold bg-rose-600 border border-slate-950 px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_#000]">
                          {item.period}
                        </span>
                      </div>
                      <h5 className="text-xs text-rose-950 font-black">{item.organization}</h5>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : activeProject.id === "about-garden" ? (
              <>
                <div className="cartoon-popup-header">
                  <span className="cartoon-popup-badge bg-green-600 text-white border-2 border-slate-950 px-2 py-0.5 rounded-md font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">ABOUT ME</span>
                  <h2 className="cartoon-popup-title">Botanical Garden</h2>
                  <p className="cartoon-popup-subtitle text-slate-600 font-bold">The Explorer's Story</p>
                </div>
                <div className="cartoon-popup-content max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                  {portfolioData.about.paragraphs.map((p, idx) => (
                    <div key={idx} className="bg-amber-50/50 border-3 border-slate-950 p-4 rounded-xl shadow-[4px_4px_0px_#0f172a]">
                      <p className="text-xs text-slate-800 font-bold leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : activeProject.id === "skills-forest" ? (
              <>
                <div className="cartoon-popup-header">
                  <span className="cartoon-popup-badge bg-cyan-600 text-white border-2 border-slate-950 px-2 py-0.5 rounded-md font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">SKILLS</span>
                  <h2 className="cartoon-popup-title">Enchanted Forest</h2>
                  <p className="cartoon-popup-subtitle text-slate-600 font-bold">Technical Mastery</p>
                </div>
                <div className="cartoon-popup-content max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                  {portfolioData.skills.map((category, idx) => (
                    <div key={idx} className="bg-amber-50/50 border-3 border-slate-950 p-4 rounded-xl shadow-[4px_4px_0px_#0f172a] space-y-2">
                      <span className="font-extrabold text-slate-950 text-sm uppercase">{category.title}</span>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {category.skills.map((skill) => (
                          <span key={skill.name} className="text-[10px] text-white font-mono font-bold bg-cyan-700 border border-slate-950 px-2.5 py-1 rounded-full shadow-[1px_1px_0px_#000]">
                            {skill.name} · {skill.level}%
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : activeProject.id === "resume-harbor" ? (
              <>
                <div className="cartoon-popup-header">
                  <span className="cartoon-popup-badge bg-amber-500 text-white border-2 border-slate-950 px-2 py-0.5 rounded-md font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">RESUME</span>
                  <h2 className="cartoon-popup-title">Harbor Dock</h2>
                  <p className="cartoon-popup-subtitle text-slate-600 font-bold">Curriculum Vitae</p>
                </div>
                <div className="cartoon-popup-content flex flex-col items-center justify-center p-6 space-y-4 text-center">
                  <div className="bg-amber-100 border-4 border-slate-950 p-6 rounded-2xl shadow-[6px_6px_0px_#0f172a] max-w-sm w-full space-y-3">
                    <span className="text-3xl block">📄</span>
                    <h3 className="text-sm font-extrabold text-slate-950 uppercase">{portfolioData.resume.title}</h3>
                    <p className="text-xs text-slate-800 font-bold leading-relaxed">{portfolioData.resume.description}</p>
                    <a
                      href={portfolioData.resume.file}
                      download={portfolioData.resume.downloadName}
                      className="inline-block text-center bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm py-3 px-6 rounded-xl border-3 border-slate-950 shadow-[4px_4px_0px_#0f172a] active:translate-y-0.5 active:shadow-[2px_2px_0px_#0f172a] transition-all"
                    >
                      ✦ Download CV (PDF) ✦
                    </a>
                  </div>
                </div>
              </>
            ) : activeProject.id === "tech-obelisk" ? (
              <>
                <div className="cartoon-popup-header">
                  <span className="cartoon-popup-badge bg-teal-600 text-white border-2 border-slate-950 px-2 py-0.5 rounded-md font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">TECH STACK</span>
                  <h2 className="cartoon-popup-title">Tech Obelisk</h2>
                  <p className="cartoon-popup-subtitle text-slate-600 font-bold">Daily Tools & Technologies</p>
                </div>
                <div className="cartoon-popup-content max-h-[60vh] overflow-y-auto pr-2">
                  <div className="flex flex-wrap gap-2.5 p-2">
                    {portfolioData.dailyTech.map((tech) => (
                      <span key={tech} className="bg-teal-100 border-3 border-slate-950 px-3.5 py-2 rounded-xl shadow-[3px_3px_0px_#0f172a] font-black text-xs text-slate-950">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="cartoon-popup-header">
                  <span className="cartoon-popup-badge">PROJECT</span>
                  <h2 className="cartoon-popup-title">{activeProject.title}</h2>
                  <p className="cartoon-popup-subtitle">{activeProject.subtitle}</p>
                </div>
                <div className="cartoon-popup-content">
                  <p className="cartoon-popup-desc">{activeProject.description}</p>
                  {activeProject.tags && activeProject.tags.length > 0 && (
                    <div className="cartoon-popup-tags">
                      {activeProject.tags.map((tag) => (
                        <span key={tag} className="cartoon-popup-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {activeProject.href && (
                  <div className="cartoon-popup-actions">
                    <a
                      href={activeProject.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cartoon-popup-btn"
                    >
                      Visit Project Website ➜
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
