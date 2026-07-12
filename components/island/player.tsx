"use client"

import React, { useEffect, useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { getIslandHeight } from "./terrain"
import { ISLAND_COLLIDERS } from "./assets"
import { IslandItem, type IslandWorld } from "@/lib/portfolio/island-adapter"

interface PlayerProps {
  world: IslandWorld
  activeZoneId: string | null
  setActiveZoneId: (id: string | null) => void
  flyToTarget: [number, number, number] | null
  onClearFlyTo: () => void
  isMobileTouch: {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
    jump: boolean
  }
  isPointerLocked: boolean
  setIsPointerLocked: (locked: boolean) => void
  onNearProjectSign?: (proj: IslandItem | null) => void
  onInteractProject?: (proj: IslandItem) => void
}

export function Player({
  world,
  activeZoneId,
  setActiveZoneId,
  flyToTarget,
  onClearFlyTo,
  isMobileTouch,
  isPointerLocked,
  setIsPointerLocked,
  onNearProjectSign,
  onInteractProject,
}: PlayerProps) {
  const { camera, gl } = useThree()

  // Physics constants
  const eyeHeight = 1.8
  const baseSpeed = 12.0
  const sprintSpeed = 22.0
  const jumpForce = 9.0
  const gravity = 22.0

  // Refs for tracking position, look, and velocity states
  const playerPos = useRef(new THREE.Vector3(0, getIslandHeight(0, 0) + eyeHeight, 5))
  const rotation = useRef({ yaw: 0, pitch: 0 })
  
  // Smooth velocity vectors
  const velocityH = useRef(new THREE.Vector2(0, 0)) // (x, z) movement speed
  const velocityY = useRef(0)
  const isGrounded = useRef(true)
  const bobTimer = useRef(0)

  // Keyboard state
  const keys = useRef({
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
    Space: false,
    ShiftLeft: false,
    KeyE: false,
  })

  // Mouse drag state
  const mouse = useRef({
    isMouseDown: false,
  })

  // Fast Travel flight properties
  const isFlying = useRef(false)
  const flightTime = useRef(0)
  const flightDuration = 2.2 // seconds
  const flightStartPos = useRef(new THREE.Vector3())
  const flightEndPos = useRef(new THREE.Vector3())
  const flightStartYaw = useRef(0)
  const flightEndYaw = useRef(0)
  const flightStartPitch = useRef(0)
  const flightEndPitch = useRef(0)

  // Reusable vector allocations to optimize garbage collection (runs at 60fps)
  const forwardVec = useMemo(() => new THREE.Vector3(), [])
  const rightVec = useMemo(() => new THREE.Vector3(), [])
  const moveDir = useMemo(() => new THREE.Vector3(), [])
  const targetLook = useMemo(() => new THREE.Vector3(), [])

  // Refs to allow key listener to access interaction target without stale closure issues
  const currentNearestProjectRef = useRef<IslandItem | null>(null)
  const lastNearestProject = useRef<string | null>(null)
  const onInteractProjectRef = useRef(onInteractProject)

  useEffect(() => {
    onInteractProjectRef.current = onInteractProject
  }, [onInteractProject])

  // Setup Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code in keys.current) {
        keys.current[e.code as keyof typeof keys.current] = true
      }
      if (e.code === "ArrowUp") keys.current.KeyW = true
      if (e.code === "ArrowDown") keys.current.KeyS = true
      if (e.code === "ArrowLeft") keys.current.KeyA = true
      if (e.code === "ArrowRight") keys.current.KeyD = true
      if (e.code === "ShiftRight") keys.current.ShiftLeft = true

      // Trigger E interaction if near a project sign
      if (e.code === "KeyE") {
        if (currentNearestProjectRef.current && onInteractProjectRef.current) {
          onInteractProjectRef.current(currentNearestProjectRef.current)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code in keys.current) {
        keys.current[e.code as keyof typeof keys.current] = false
      }
      if (e.code === "ArrowUp") keys.current.KeyW = false
      if (e.code === "ArrowDown") keys.current.KeyS = false
      if (e.code === "ArrowLeft") keys.current.KeyA = false
      if (e.code === "ArrowRight") keys.current.KeyD = false
      if (e.code === "ShiftRight") keys.current.ShiftLeft = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Setup Pointer Lock & Look Listeners
  useEffect(() => {
    const domElement = gl.domElement

    const requestLock = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Ignore click if it's on UI elements
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".ui-card") ||
        target.closest(".ui-overlay")
      ) {
        return
      }
      if (isFlying.current) return
      
      // Request pointer lock
      try {
        domElement.requestPointerLock()
      } catch (err) {
        console.warn("Pointer lock request failed:", err)
      }
    }

    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === domElement)
    }

    domElement.addEventListener("click", requestLock)
    document.addEventListener("pointerlockchange", handlePointerLockChange)

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".ui-card") ||
        target.closest(".ui-overlay")
      ) {
        return
      }
      mouse.current.isMouseDown = true
    }

    const handlePointerUp = () => {
      mouse.current.isMouseDown = false
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (isFlying.current) return

      // Look around if locked or dragging
      const isLocked = document.pointerLockElement === domElement
      if (isLocked || mouse.current.isMouseDown) {
        const sensitivity = isLocked ? 0.0022 : 0.003
        rotation.current.yaw -= e.movementX * sensitivity
        rotation.current.pitch -= e.movementY * sensitivity

        // Clamp vertical pitch to prevent flipping
        const limit = Math.PI / 2.25
        rotation.current.pitch = Math.max(-limit, Math.min(limit, rotation.current.pitch))
      }
    }

    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("pointerup", handlePointerUp)
    window.addEventListener("pointermove", handlePointerMove)

    return () => {
      domElement.removeEventListener("click", requestLock)
      document.removeEventListener("pointerlockchange", handlePointerLockChange)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("pointermove", handlePointerMove)
    }
  }, [gl, setIsPointerLocked])

  // Handle Fly-To Trigger
  useEffect(() => {
    if (flyToTarget) {
      isFlying.current = true
      flightTime.current = 0
      
      flightStartPos.current.copy(playerPos.current)
      
      // Target position slightly set back from landmark center to frame it nicely
      const tx = flyToTarget[0]
      const tz = flyToTarget[2] + 13.0 // Offset north slightly
      const ty = getIslandHeight(tx, tz) + eyeHeight
      
      flightEndPos.current.set(tx, ty, tz)

      // Start angles
      flightStartYaw.current = rotation.current.yaw
      flightStartPitch.current = rotation.current.pitch

      // End angles (look directly at the landmark center)
      const dx = flyToTarget[0] - tx
      const dz = flyToTarget[2] - tz
      flightEndYaw.current = Math.atan2(dx, dz)
      flightEndPitch.current = -0.1

      // Exit pointer lock if active when flying to make UI navigation easier
      if (document.pointerLockElement) {
        document.exitPointerLock()
      }
    }
  }, [flyToTarget])

  useFrame((state, delta) => {
    // Limit delta to prevent physics glitches on frame lags
    const dt = Math.min(delta, 0.1)

    if (isFlying.current) {
      // 1. FLIGHT CAMERA CONTROL
      flightTime.current += dt
      const t = Math.min(1.0, flightTime.current / flightDuration)
      
      // Smooth easing (Cubic Bezier)
      const ease = t * t * (3 - 2 * t)

      // Interpolate position
      const currentX = THREE.MathUtils.lerp(flightStartPos.current.x, flightEndPos.current.x, ease)
      const currentZ = THREE.MathUtils.lerp(flightStartPos.current.z, flightEndPos.current.z, ease)
      
      // Scenic arch height bump
      const startY = flightStartPos.current.y
      const endY = flightEndPos.current.y
      const archOffset = Math.sin(t * Math.PI) * 22.0
      const currentY = THREE.MathUtils.lerp(startY, endY, ease) + archOffset

      playerPos.current.set(currentX, currentY, currentZ)

      // Lerp angles
      rotation.current.yaw = THREE.MathUtils.lerp(flightStartYaw.current, flightEndYaw.current, ease)
      rotation.current.pitch = THREE.MathUtils.lerp(flightStartPitch.current, flightEndPitch.current, ease)

      // Reset velocity during flight
      velocityH.current.set(0, 0)
      velocityY.current = 0

      if (t >= 1.0) {
        isFlying.current = false
        onClearFlyTo() // Reset trigger
      }
    } else {
      // 2. NORMAL FIRST-PERSON WALKING CONTROLS
      const moveForward = keys.current.KeyW || isMobileTouch.forward
      const moveBackward = keys.current.KeyS || isMobileTouch.backward
      const moveLeft = keys.current.KeyA || isMobileTouch.left
      const moveRight = keys.current.KeyD || isMobileTouch.right
      const doJump = keys.current.Space || isMobileTouch.jump
      const isSprinting = keys.current.ShiftLeft && moveForward // Sprint only when moving forward

      const speed = isSprinting ? sprintSpeed : baseSpeed

      // Compute directional speed vectors relative to camera yaw
      const yaw = rotation.current.yaw
      forwardVec.set(Math.sin(yaw), 0, Math.cos(yaw))
      rightVec.set(Math.cos(yaw), 0, -Math.sin(yaw))

      // Reset movement direction
      moveDir.set(0, 0, 0)
      if (moveForward) moveDir.add(forwardVec)
      if (moveBackward) moveDir.sub(forwardVec)
      if (moveLeft) moveDir.sub(rightVec)
      if (moveRight) moveDir.add(rightVec)

      // Calculate target horizontal velocities
      let targetVelX = 0
      let targetVelZ = 0
      if (moveDir.lengthSq() > 0) {
        moveDir.normalize().multiplyScalar(speed)
        targetVelX = moveDir.x
        targetVelZ = moveDir.z
      }

      // Smooth horizontal velocity (momentum acceleration/deceleration)
      const lerpSpeed = moveDir.lengthSq() > 0 ? 10.0 : 8.0 // quicker startup than stop
      velocityH.current.x = THREE.MathUtils.lerp(velocityH.current.x, targetVelX, dt * lerpSpeed)
      velocityH.current.y = THREE.MathUtils.lerp(velocityH.current.y, targetVelZ, dt * lerpSpeed)

      // Apply horizontal movement to position
      playerPos.current.x += velocityH.current.x * dt
      playerPos.current.z += velocityH.current.y * dt

      // Custom 2D Sliding Collision Engine
      const playerRadius = 0.8
      for (const col of ISLAND_COLLIDERS) {
        const dx = playerPos.current.x - col.x
        const dz = playerPos.current.z - col.z
        const distSq = dx * dx + dz * dz
        const minD = playerRadius + col.r
        
        // If overlapping with collider (and distance > 0 to prevent div by zero)
        if (distSq < minD * minD && distSq > 0.001) {
          const dist = Math.sqrt(distSq)
          const overlap = minD - dist
          
          // Push player out along the collision normal
          playerPos.current.x += (dx / dist) * overlap
          playerPos.current.z += (dz / dist) * overlap
          
          // Dampen velocity to prevent jittering against corners
          velocityH.current.x *= 0.5
          velocityH.current.y *= 0.5
        }
      }

      // Physics/Jumping
      const currentTerrainY = getIslandHeight(playerPos.current.x, playerPos.current.z)
      const groundLevel = currentTerrainY + eyeHeight

      if (isGrounded.current) {
        playerPos.current.y = groundLevel
        if (doJump) {
          velocityY.current = jumpForce
          isGrounded.current = false
        }
      } else {
        velocityY.current -= gravity * dt
        playerPos.current.y += velocityY.current * dt

        // Ground collision check
        if (playerPos.current.y <= groundLevel) {
          playerPos.current.y = groundLevel
          velocityY.current = 0
          isGrounded.current = true
        }
      }

      // Clamp player within island borders (radius 180 units)
      const dist = Math.sqrt(playerPos.current.x ** 2 + playerPos.current.z ** 2)
      if (dist > 180) {
        const angle = Math.atan2(playerPos.current.z, playerPos.current.x)
        playerPos.current.x = Math.cos(angle) * 180
        playerPos.current.z = Math.sin(angle) * 180
      }

      // Zone distance triggers: Check if the player is within range of any zone
      let nearAnyZone = false
      for (const zone of world.zones) {
        const dx = playerPos.current.x - zone.position[0]
        const dz = playerPos.current.z - zone.position[2]
        const zoneDist = Math.sqrt(dx * dx + dz * dz)

        // If player is inside the trigger radius
        if (zoneDist <= zone.radius) {
          nearAnyZone = true
          if (activeZoneId !== zone.id) {
            setActiveZoneId(zone.id)
          }
          break
        }
      }

      if (!nearAnyZone && activeZoneId !== null) {
        setActiveZoneId(null)
      }

      // Project house signboard proximity check
      let nearestProject: IslandItem | null = null
      let minProjDist = 4.8 // 4.8 units interaction distance threshold

      const projectsZone = world.zones.find((z) => z.id === "projects")
      if (projectsZone) {
        for (const item of projectsZone.items) {
          if (item.visual === "building") {
            // Signboard is placed at [0.6, 0, 1.5] relative to item.position
            // Scale is also applied to item
            const signX = item.position[0] + 0.6 * item.scale
            const signZ = item.position[2] + 1.5 * item.scale
            
            const dx = playerPos.current.x - signX
            const dz = playerPos.current.z - signZ
            const distToSign = Math.sqrt(dx * dx + dz * dz)
            if (distToSign < minProjDist) {
              minProjDist = distToSign
              nearestProject = item
            }
          }
        }
      }

      // Proximity check for Academy signboard
      const educationZone = world.zones.find((z) => z.id === "education")
      if (educationZone) {
        // Signboard is placed at [0, 0, 3.2] relative to zone.position
        const signX = educationZone.position[0]
        const signZ = educationZone.position[2] + 3.2
        
        const dx = playerPos.current.x - signX
        const dz = playerPos.current.z - signZ
        const distToSign = Math.sqrt(dx * dx + dz * dz)
        if (distToSign < minProjDist) {
          minProjDist = distToSign
          nearestProject = {
            id: "education-academy",
            zoneId: "education",
            title: "Academy of Sciences",
            subtitle: "Education & Milestones",
            description: "Academic history and qualifications",
            position: [signX, 0, signZ],
            scale: 1,
            visual: "academy"
          }
        }
      }

      // Proximity check for Achievements signboard
      const achievementsZone = world.zones.find((z) => z.id === "achievements")
      if (achievementsZone) {
        // Signboard is placed at [0, 0, 2.8] relative to zone.position
        const signX = achievementsZone.position[0]
        const signZ = achievementsZone.position[2] + 2.8
        
        const dx = playerPos.current.x - signX
        const dz = playerPos.current.z - signZ
        const distToSign = Math.sqrt(dx * dx + dz * dz)
        if (distToSign < minProjDist) {
          minProjDist = distToSign
          nearestProject = {
            id: "achievements-peak",
            zoneId: "achievements",
            title: "Achievements Peak",
            subtitle: "Completed Milestones",
            description: "15+ Projects Completed Successfully",
            position: [signX, 0, signZ],
            scale: 1,
            visual: "flag"
          }
        }
      }

      // Proximity check for Experience signboard
      const experienceZone = world.zones.find((z) => z.id === "experience")
      if (experienceZone) {
        // Signboard is placed at [0, 0, 3.5] relative to zone.position
        const signX = experienceZone.position[0]
        const signZ = experienceZone.position[2] + 3.5
        
        const dx = playerPos.current.x - signX
        const dz = playerPos.current.z - signZ
        const distToSign = Math.sqrt(dx * dx + dz * dz)
        if (distToSign < minProjDist) {
          minProjDist = distToSign
          nearestProject = {
            id: "experience-workshop",
            zoneId: "experience",
            title: "Crafter's Guild",
            subtitle: "Professional Experience",
            description: "Work history and contributions",
            position: [signX, 0, signZ],
            scale: 1,
            visual: "workshop"
          }
        }
      }

      // Proximity checks for Social Sanctuary signboards
      const socialsZone = world.zones.find((z) => z.id === "socials")
      if (socialsZone) {
        const offsets = [
          { id: "social-linkedin", name: "LinkedIn", offset: [-1.8, 3.2] },
          { id: "social-github", name: "GitHub", offset: [0, 3.2] },
          { id: "social-instagram", name: "Instagram", offset: [1.8, 3.2] }
        ]
        
        for (const item of offsets) {
          const signX = socialsZone.position[0] + item.offset[0]
          const signZ = socialsZone.position[2] + item.offset[1]
          
          const dx = playerPos.current.x - signX
          const dz = playerPos.current.z - signZ
          const distToSign = Math.sqrt(dx * dx + dz * dz)
          if (distToSign < minProjDist) {
            minProjDist = distToSign
            nearestProject = {
              id: item.id,
              zoneId: "socials",
              title: item.name,
              subtitle: "Social Connection",
              description: `Press [E] to connect on ${item.name}`,
              position: [signX, 0, signZ],
              scale: 1,
              visual: "social"
            }
          }
        }
      }

      // Proximity check for Contact (Lighthouse) signboard
      const contactZone = world.zones.find((z) => z.id === "contact")
      if (contactZone) {
        // Signboard is placed on the path offset [-4.5, -2.0] relative to zone.position
        const signX = contactZone.position[0] - 4.5
        const signZ = contactZone.position[2] - 2.0
        
        const dx = playerPos.current.x - signX
        const dz = playerPos.current.z - signZ
        const distToSign = Math.sqrt(dx * dx + dz * dz)
        if (distToSign < minProjDist) {
          minProjDist = distToSign
          nearestProject = {
            id: "contact-lighthouse",
            zoneId: "contact",
            title: "Lighthouse",
            subtitle: "Get in Touch",
            description: "Interact to see contact details",
            position: [signX, 0, signZ],
            scale: 1,
            visual: "lighthouse"
          }
        }
      }

      // Proximity check for About (Botanical Garden) signboard
      const aboutZone = world.zones.find((z) => z.id === "about")
      if (aboutZone) {
        const signX = aboutZone.position[0] + 5
        const signZ = aboutZone.position[2] - 8
        
        const dx = playerPos.current.x - signX
        const dz = playerPos.current.z - signZ
        const distToSign = Math.sqrt(dx * dx + dz * dz)
        if (distToSign < minProjDist) {
          minProjDist = distToSign
          nearestProject = {
            id: "about-garden",
            zoneId: "about",
            title: "Botanical Garden",
            subtitle: "About Me",
            description: "Learn more about the explorer",
            position: [signX, 0, signZ],
            scale: 1,
            visual: "garden"
          }
        }
      }

      // Proximity check for Skills (Enchanted Forest) signboard
      const skillsZone = world.zones.find((z) => z.id === "skills")
      if (skillsZone) {
        const signX = skillsZone.position[0]
        const signZ = skillsZone.position[2] - 6
        
        const dx = playerPos.current.x - signX
        const dz = playerPos.current.z - signZ
        const distToSign = Math.sqrt(dx * dx + dz * dz)
        if (distToSign < minProjDist) {
          minProjDist = distToSign
          nearestProject = {
            id: "skills-forest",
            zoneId: "skills",
            title: "Enchanted Forest",
            subtitle: "Technical Skills",
            description: "Discover the skill crystals",
            position: [signX, 0, signZ],
            scale: 1,
            visual: "forest"
          }
        }
      }

      // Proximity check for Resume (Harbor) signboard
      const resumeZone = world.zones.find((z) => z.id === "resume")
      if (resumeZone) {
        const signX = resumeZone.position[0]
        const signZ = resumeZone.position[2] - 4
        
        const dx = playerPos.current.x - signX
        const dz = playerPos.current.z - signZ
        const distToSign = Math.sqrt(dx * dx + dz * dz)
        if (distToSign < minProjDist) {
          minProjDist = distToSign
          nearestProject = {
            id: "resume-harbor",
            zoneId: "resume",
            title: "Harbor Dock",
            subtitle: "Resume",
            description: "Download CV",
            position: [signX, 0, signZ],
            scale: 1,
            visual: "harbor"
          }
        }
      }

      // Proximity check for Tech (Obelisk) signboard
      const techZone = world.zones.find((z) => z.id === "tech")
      if (techZone) {
        const signX = techZone.position[0]
        const signZ = techZone.position[2] + 5
        
        const dx = playerPos.current.x - signX
        const dz = playerPos.current.z - signZ
        const distToSign = Math.sqrt(dx * dx + dz * dz)
        if (distToSign < minProjDist) {
          minProjDist = distToSign
          nearestProject = {
            id: "tech-obelisk",
            zoneId: "tech",
            title: "Tech Obelisk",
            subtitle: "Daily Tech Stack",
            description: "Languages and frameworks",
            position: [signX, 0, signZ],
            scale: 1,
            visual: "obelisk"
          }
        }
      }

      currentNearestProjectRef.current = nearestProject

      const nearestId = nearestProject ? nearestProject.id : null
      if (lastNearestProject.current !== nearestId) {
        lastNearestProject.current = nearestId
        onNearProjectSign?.(nearestProject)
      }
    }

    // 3. APPLY STATE AND EFFECTS TO THREE CAMERA
    camera.position.copy(playerPos.current)

    // Head bobbing effect when walking/running on ground
    const currentSpeedH = velocityH.current.length()
    if (currentSpeedH > 0.5 && isGrounded.current && !isFlying.current) {
      // Bob timer frequency scales with speed
      const freq = currentSpeedH > baseSpeed ? 11.5 : 8.0
      bobTimer.current += dt * freq
      
      const bobAmount = currentSpeedH > baseSpeed ? 0.04 : 0.02
      const bobY = Math.sin(bobTimer.current) * bobAmount
      camera.position.y += bobY
    } else {
      // Gently return bob to center when stopped
      bobTimer.current = 0
    }
    
    // Calculate direction looking vector from yaw and pitch
    targetLook.set(
      playerPos.current.x + Math.sin(rotation.current.yaw) * Math.cos(rotation.current.pitch),
      playerPos.current.y + Math.sin(rotation.current.pitch),
      playerPos.current.z + Math.cos(rotation.current.yaw) * Math.cos(rotation.current.pitch)
    )
    camera.lookAt(targetLook)
  })

  return null
}
