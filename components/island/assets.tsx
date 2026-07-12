"use client"

import React, { useMemo, useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { OBJLoader, MTLLoader } from "three-stdlib"
import * as THREE from "three"
import { distToSegmentWithPoint, getIslandHeight, PATHS } from "./terrain"
import { type IslandZone, type IslandItem } from "@/lib/portfolio/island-adapter"

export const ISLAND_COLLIDERS: { x: number, z: number, r: number }[] = []

// Low-poly Pine Tree
export function PineTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.35, 2.5, 5]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} flatShading />
      </mesh>
      {/* Foliage Layers */}
      <mesh position={[0, 3.25, 0]} castShadow>
        <coneGeometry args={[1.5, 2.0, 5]} />
        <meshStandardMaterial color="#2d4a22" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[1.1, 1.6, 5]} />
        <meshStandardMaterial color="#375a2b" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 5.5, 0]} castShadow>
        <coneGeometry args={[0.7, 1.2, 5]} />
        <meshStandardMaterial color="#446d36" roughness={0.8} flatShading />
      </mesh>
    </group>
  )
}

// Low-poly Oak Tree
export function OakTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.5, 3.0, 6]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} flatShading />
      </mesh>
      {/* Foliage Spheres */}
      <mesh position={[0, 4.0, 0]} castShadow>
        <dodecahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#385e38" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.8, 4.5, 0.4]} castShadow>
        <dodecahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#446e44" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[-0.7, 4.3, -0.5]} castShadow>
        <dodecahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color="#2e4e2e" roughness={0.85} flatShading />
      </mesh>
    </group>
  )
}

// Low-poly Palm Tree
export function PalmTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk curve */}
      <mesh position={[0.2, 1.5, 0]} rotation={[0, 0, -0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.3, 3.0, 6]} />
        <meshStandardMaterial color="#6e5040" roughness={0.95} flatShading />
      </mesh>
      {/* Fronds */}
      <group position={[0.4, 3.0, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8]}
              rotation={[0.2, -angle, 0.4, "YXZ"]}
              castShadow
            >
              <boxGeometry args={[1.5, 0.05, 0.4]} />
              <meshStandardMaterial color="#32612d" roughness={0.8} flatShading />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

// Low-poly Rock
export function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const rotation = useMemo<[number, number, number]>(() => [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  ], [])

  return (
    <mesh position={position} scale={[scale, scale, scale]} rotation={rotation} castShadow receiveShadow>
      <dodecahedronGeometry args={[1.0, 0]} />
      <meshStandardMaterial color="#737982" roughness={0.85} flatShading />
    </mesh>
  )
}

// Glowing Path Lantern
export function PathLantern({ position, isNight = false }: { position: [number, number, number]; isNight?: boolean }) {
  return (
    <group position={position}>
      {/* Wooden Post */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 2.4, 4]} />
        <meshStandardMaterial color="#4a3b32" roughness={0.9} />
      </mesh>
      {/* Hanger Arm */}
      <mesh position={[0.2, 2.3, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 4]} />
        <meshStandardMaterial color="#4a3b32" roughness={0.9} />
      </mesh>
      {/* Lantern Cap */}
      <mesh position={[0.4, 2.15, 0]} castShadow>
        <coneGeometry args={[0.25, 0.15, 4]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* Lantern Bulb */}
      <mesh position={[0.4, 1.95, 0]}>
        <boxGeometry args={[0.15, 0.25, 0.15]} />
        <meshStandardMaterial
          color={isNight ? "#ffdd66" : "#eeeeee"}
          emissive={isNight ? "#ffbb44" : "#222222"}
          emissiveIntensity={isNight ? 2.5 : 0.0}
        />
      </mesh>
      {isNight && (
        <pointLight
          position={[0.4, 1.95, 0]}
          color="#ffaa33"
          intensity={5.0}
          distance={15}
          decay={1.8}
          castShadow
          shadow-bias={-0.002}
        />
      )}
    </group>
  )
}

// Direction Signpost
export function DirectionSign({ position, rotation = 0, label }: { position: [number, number, number]; rotation?: number; label: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Wooden post */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 2.0, 5]} />
        <meshStandardMaterial color="#5a4232" roughness={0.9} />
      </mesh>
      {/* Wooden board */}
      <mesh position={[0, 1.6, 0.1]} castShadow>
        <boxGeometry args={[1.3, 0.4, 0.12]} />
        <meshStandardMaterial color="#7c5c43" roughness={0.8} />
      </mesh>
      {/* Small direction arrow marker */}
      <mesh position={[0.5, 1.6, 0.16]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.15, 0.3, 3]} />
        <meshStandardMaterial color="#ffcc33" roughness={0.7} />
      </mesh>
    </group>
  )
}

// --- LANDMARK STRUCTURES ---

// 1. Botanical Garden (About Me)
export function BotanicalGardenLandmark({ zone }: { zone: IslandZone }) {
  const center = zone.position
  const y = getIslandHeight(center[0], center[2])

  // Pre-generate flower positions inside the garden
  const flowers = useMemo(() => {
    const colors = ["#ff4455", "#ffaa00", "#cc33ff", "#33ccff", "#ff88dd", "#f43f5e", "#ec4899", "#10b981", "#a855f7"]
    const list = []
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2
      // Scatter within the garden pavilion area (radius between 0.8 and 5.4 units)
      const radius = 0.8 + Math.random() * 4.6
      list.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.6 + Math.random() * 0.7,
      })
    }
    return list
  }, [])
  
  return (
    <group position={[center[0], y, center[2]]}>
      {/* Huge Stone Walls surrounding the garden (radius ~10.5) */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        // Leave a gap at index 3 and 4 (approx south-east direction) for path entry
        if (i === 3 || i === 4) return null
        const angle = (i / 12) * Math.PI * 2
        const radius = 10.5
        const wx = Math.cos(angle) * radius
        const wz = Math.sin(angle) * radius
        return (
          <group key={i} position={[wx, 2.1, wz]} rotation={[0, -angle + Math.PI / 2, 0]}>
            {/* Wall Block */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[5.8, 4.2, 1.4]} />
              <meshStandardMaterial color="#64748b" roughness={0.95} flatShading />
            </mesh>
            {/* Castle Battlements */}
            <mesh position={[-1.6, 2.4, 0]} castShadow>
              <boxGeometry args={[1.3, 0.6, 1.4]} />
              <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
            </mesh>
            <mesh position={[1.6, 2.4, 0]} castShadow>
              <boxGeometry args={[1.3, 0.6, 1.4]} />
              <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
            </mesh>
          </group>
        )
      })}

      {/* Pavilion Base */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[6.0, 6.2, 0.4, 8]} />
        <meshStandardMaterial color="#889c7c" roughness={0.7} flatShading />
      </mesh>
      
      {/* Scattered flowers */}
      {flowers.map((f, idx) => (
        <group key={idx} position={[f.x, 0.3, f.z]} scale={[f.scale, f.scale, f.scale]}>
          {/* Green Stem */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.5, 4]} />
            <meshStandardMaterial color="#16a34a" roughness={0.9} />
          </mesh>
          {/* Flower Bud */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <dodecahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial color={f.color} roughness={0.6} flatShading />
          </mesh>
        </group>
      ))}

      {/* Pillars */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        const angle = (i / 10) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 5.2, 2.1, Math.sin(angle) * 5.2]}
            castShadow
          >
            <cylinderGeometry args={[0.18, 0.18, 4.0, 6]} />
            <meshStandardMaterial color="#eae6df" roughness={0.6} />
          </mesh>
        )
      })}

      {/* Pavilion Roof */}
      <mesh position={[0, 5.3, 0]} castShadow>
        <coneGeometry args={[6.2, 2.5, 8]} />
        <meshStandardMaterial color="#a0522d" roughness={0.8} flatShading />
      </mesh>

      {/* Huge Wooden Sign */}
      <group position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
        {/* Support Post Left */}
        <mesh position={[-1.9, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 2.8, 5]} />
          <meshStandardMaterial color="#4a2f1b" roughness={0.9} />
        </mesh>
        {/* Support Post Right */}
        <mesh position={[1.8, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 2.8, 5]} />
          <meshStandardMaterial color="#4a2f1b" roughness={0.9} />
        </mesh>
        {/* Large Wooden Board */}
        <mesh position={[0, 2.2, 0.08]} castShadow>
          <boxGeometry args={[4.8, 1.8, 0.24]} />
          <meshStandardMaterial color="#783f04" roughness={0.85} flatShading />
        </mesh>
        {/* Sign border frame */}
        <mesh position={[0, 2.2, 0.21]}>
          <boxGeometry args={[4.8, 0.12, 0.05]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
        
        {/* 3D Bold Text on Sign */}
        <Text
          position={[0, 2.5, 0.22]}
          fontSize={0.45}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ABOUT ME
        </Text>
        <Text
          position={[0, 1.8, 0.22]}
          fontSize={0.25}
          color="#ffd000"
          anchorX="center"
          anchorY="middle"
          fontWeight="normal"
        >
          It's me Jithu Girish
        </Text>
      </group>

      {/* Cute Grazing Sheep */}
      <CuteSheep position={[-3.2, 0.25, -3.2]} scale={0.7} />
      <CuteSheep position={[3.2, 0.25, 3.2]} scale={0.6} />
      <CuteSheep position={[-4.0, 0.25, 2.5]} scale={0.65} />
      <CuteSheep position={[4.0, 0.25, -2.5]} scale={0.58} />

      {/* Interactive Signpost on the path */}
      <group position={[5, getIslandHeight(center[0] + 5, center[2] - 8) - y, -8]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 6]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.0, 0.03]} castShadow>
          <boxGeometry args={[1.6, 0.5, 0.1]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        <mesh position={[0, 1.0, 0.08]}>
          <boxGeometry args={[1.6, 0.05, 0.02]} />
          <meshStandardMaterial color="#4caf50" />
        </mesh>
        <Text position={[0, 1.08, 0.09]} fontSize={0.09} color="#ffffff" fontWeight="bold" anchorX="center" anchorY="middle">
          ABOUT ME
        </Text>
        <Text position={[0, 0.9, 0.09]} fontSize={0.06} color="#ffe082" anchorX="center" anchorY="middle">
          ✦ Press [E] to Read ✦
        </Text>
      </group>
    </group>
  )
}

// 2. Enchanted Forest (Skills - crystals)
export function EnchantedForestLandmark({ zone, isNight = false }: { zone: IslandZone; isNight?: boolean }) {
  const center = zone.position
  const y = getIslandHeight(center[0], center[2])
  
  // Pre-calculate heights for bunnies relative to center y
  const bunny1Y = useMemo(() => getIslandHeight(center[0] - 2.8, center[2] - 2.0) - y, [center, y])
  const bunny2Y = useMemo(() => getIslandHeight(center[0] + 2.8, center[2] + 2.5) - y, [center, y])

  // Map each skill item to a deterministic pseudo-random position in a dense forest structure
  const skillTrees = useMemo(() => {
    return zone.items.map((item, index) => {
      // Deterministic noise generator based on index to ensure layout is static on every reload
      const angleHash = Math.sin(index * 427.53) * 1234.56
      const angle = (angleHash - Math.floor(angleHash)) * Math.PI * 2

      const distHash = Math.sin(index * 983.84) * 5678.90
      const distance = 3.2 + (distHash - Math.floor(distHash)) * 8.5 // Random radius between 3.2 and 11.7 units

      const rx = Math.cos(angle) * distance
      const rz = Math.sin(angle) * distance
      
      // Calculate precise terrain height at the scattered coordinate
      const absX = center[0] + rx
      const absZ = center[2] + rz
      const ry = getIslandHeight(absX, absZ) - y
      
      const levelPercent = item.subtitle.split("-").pop()?.trim() || ""
      const numericLevel = parseInt(levelPercent.replace("%", ""), 10) || 75
      
      return {
        id: item.id,
        pos: [rx, ry, rz] as [number, number, number],
        label: item.title,
        level: numericLevel,
      }
    })
  }, [zone.items, center, y])

  return (
    <group position={[center[0], y, center[2]]}>
      {/* Outer Circle of Ancient Stones */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2
        const sx = Math.cos(angle) * 6.5
        const sz = Math.sin(angle) * 6.5
        const sy = getIslandHeight(center[0] + sx, center[2] + sz) - y
        return (
          <mesh
            key={i}
            position={[sx, sy + 1.2, sz]}
            rotation={[Math.random() * 0.2, angle, Math.random() * 0.2]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[1.0, 2.5, 0.8]} />
            <meshStandardMaterial color="#50555c" roughness={0.9} flatShading />
          </mesh>
        )
      })}
       

      {/* Thematic Skill Trees with hanging signs */}
      {skillTrees.map((st) => (
        <SkillTree
          key={st.id}
          position={st.pos}
          label={st.label}
          level={st.level}
        />
      ))}

      {/* Interactive Signpost on the path */}
      <group position={[center[0], getIslandHeight(center[0], center[2] - 6), center[2] - 6]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 6]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.0, 0.03]} castShadow>
          <boxGeometry args={[1.6, 0.5, 0.1]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        <mesh position={[0, 1.0, 0.08]}>
          <boxGeometry args={[1.6, 0.05, 0.02]} />
          <meshStandardMaterial color="#00bcd4" />
        </mesh>
        <Text position={[0, 1.08, 0.09]} fontSize={0.09} color="#ffffff" fontWeight="bold" anchorX="center" anchorY="middle">
          SKILLS
        </Text>
        <Text position={[0, 0.9, 0.09]} fontSize={0.06} color="#ffe082" anchorX="center" anchorY="middle">
          ✦ Press [E] to View ✦
        </Text>
      </group>
    </group>
  )
}

export function CrystalItem({
  position,
  scale,
  color,
  isNight,
  lightIntensity
}: {
  position: [number, number, number]
  scale: number
  color: string
  isNight: boolean
  lightIntensity: number
}) {
  const crystalRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (crystalRef.current) {
      // Gentle floating animation
      crystalRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.12
      crystalRef.current.rotation.y = state.clock.elapsedTime * 0.4 + position[2]
    }
  })

  return (
    <group>
      <mesh ref={crystalRef} position={position} scale={[scale, scale * 1.6, scale]} castShadow>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isNight ? 1.8 : 0.3}
          transparent
          opacity={0.9}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {isNight && (
        <pointLight
          position={[position[0], position[1] + 0.5, position[2]]}
          color={color}
          intensity={lightIntensity}
          distance={16}
          decay={1.8}
        />
      )}
    </group>
  )
}

// 3. Medieval Village (Projects - houses)
export function MedievalVillageLandmark({ zone }: { zone: IslandZone }) {
  const center = zone.position
  const y = getIslandHeight(center[0], center[2])

  return (
    <group position={[center[0], y, center[2]]}>
      {/* Central Well */}
      <group position={[0, 0.5, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.2, 0.6, 6]} />
          <meshStandardMaterial color="#555" roughness={0.9} flatShading />
        </mesh>
        {/* Well posts */}
        <mesh position={[-0.8, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.6, 4]} />
          <meshStandardMaterial color="#4a2e1b" />
        </mesh>
        <mesh position={[0.8, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.6, 4]} />
          <meshStandardMaterial color="#4a2e1b" />
        </mesh>
        {/* Well roof */}
        <mesh position={[0, 1.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.3, 0.6, 4]} />
          <meshStandardMaterial color="#9e382d" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

// Individual Project House component in Village
export function ProjectHouse({
  item,
  isNight = false,
  onOpenProject,
}: {
  item: IslandItem
  isNight?: boolean
  onOpenProject?: (item: IslandItem) => void
}) {
  const pos = item.position
  const y = getIslandHeight(pos[0], pos[2])

  // Alternate house styles
  const isBarn = item.id.includes("notenest") || item.id.includes("flora")
  const wallColor = isBarn ? "#b25a38" : "#dfd5c6"
  const roofColor = isBarn ? "#4c4842" : "#9e382d"

  return (
    <group position={[pos[0], y, pos[2]]} scale={[item.scale, item.scale, item.scale]}>
      {/* Stone Foundation */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.3, 2.1]} />
        <meshStandardMaterial color="#4a4d50" roughness={0.9} flatShading />
      </mesh>

      {/* House Plaster Body */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.9, 2.0]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} flatShading />
      </mesh>

      {/* Vertical Corner Wood Beams */}
      {[-0.99, 0.99].map((x) =>
        [-0.99, 0.99].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 1.25, z]} castShadow>
            <boxGeometry args={[0.12, 1.9, 0.12]} />
            <meshStandardMaterial color="#4a2e1b" roughness={0.9} />
          </mesh>
        ))
      )}

      {/* Horizontal Trim Wood Beams */}
      <mesh position={[0, 2.15, 0]} castShadow>
        <boxGeometry args={[2.05, 0.1, 2.05]} />
        <meshStandardMaterial color="#4a2e1b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[2.05, 0.1, 2.05]} />
        <meshStandardMaterial color="#4a2e1b" roughness={0.9} />
      </mesh>

      {/* Roof Structure */}
      <mesh position={[0, 2.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.65, 1.2, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, 2.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <cylinderGeometry args={[1.7, 1.7, 0.1, 4]} />
        <meshStandardMaterial color="#3e2a1e" roughness={0.8} />
      </mesh>

      {/* Stone Chimney */}
      <group position={[0.6, 2.8, -0.4]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.9, 0.3]} />
          <meshStandardMaterial color="#555555" roughness={0.95} flatShading />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.35, 0.1, 0.35]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        {/* Smoke puffs */}
        <mesh position={[0, 0.65, 0.05]} scale={[0.14, 0.14, 0.14]}>
          <sphereGeometry args={[1, 4, 4]} />
          <meshStandardMaterial color="#e2e8f0" transparent opacity={0.65} flatShading />
        </mesh>
        <mesh position={[0.08, 0.9, -0.05]} scale={[0.18, 0.18, 0.18]}>
          <sphereGeometry args={[1, 4, 4]} />
          <meshStandardMaterial color="#cbd5e1" transparent opacity={0.4} flatShading />
        </mesh>
      </group>

      {/* Door Frame */}
      <mesh position={[0, 0.65, 1.01]}>
        <boxGeometry args={[0.82, 1.3, 0.06]} />
        <meshStandardMaterial color="#4a2e1b" roughness={0.9} />
      </mesh>
      {/* Door Panel */}
      <mesh position={[0, 0.62, 1.03]}>
        <boxGeometry args={[0.7, 1.2, 0.04]} />
        <meshStandardMaterial color="#5c3821" roughness={0.8} />
      </mesh>
      {/* Door Handle Ring */}
      <mesh position={[0.22, 0.62, 1.06]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.03, 0.01, 4, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Window Outer Frame */}
      <mesh position={[0.6, 1.4, 1.01]}>
        <boxGeometry args={[0.62, 0.62, 0.06]} />
        <meshStandardMaterial color="#4a2e1b" roughness={0.9} />
      </mesh>
      {/* Glowing Window */}
      <mesh position={[0.6, 1.4, 1.03]}>
        <boxGeometry args={[0.5, 0.5, 0.04]} />
        <meshStandardMaterial
          color={isNight ? "#ffdd66" : "#ffffff"}
          emissive={isNight ? "#ffa812" : "#111"}
          emissiveIntensity={isNight ? 2.5 : 0.0}
        />
      </mesh>
      {/* Window Sill */}
      <mesh position={[0.6, 1.05, 1.04]}>
        <boxGeometry args={[0.75, 0.08, 0.12]} />
        <meshStandardMaterial color="#3e2a1e" roughness={0.8} />
      </mesh>

      {isNight && (
        <pointLight
          position={[0.6, 1.4, 1.3]}
          color="#ffbb44"
          intensity={1.5}
          distance={5}
        />
      )}

      {/* Wall Lantern */}
      <group position={[-0.55, 1.3, 1.06]}>
        {/* Bracket */}
        <mesh position={[0, 0.15, -0.05]} castShadow>
          <boxGeometry args={[0.05, 0.05, 0.15]} />
          <meshStandardMaterial color="#2d3748" metalness={0.8} />
        </mesh>
        {/* Lantern Cap */}
        <mesh position={[0, 0.08, 0.02]} castShadow>
          <coneGeometry args={[0.1, 0.06, 4]} />
          <meshStandardMaterial color="#1a202c" metalness={0.8} />
        </mesh>
        {/* Glow Glass */}
        <mesh position={[0, 0.0, 0.02]}>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 4]} />
          <meshStandardMaterial
            color="#ffd23f"
            emissive="#ff9f1c"
            emissiveIntensity={isNight ? 3.0 : 0.5}
          />
        </mesh>
        {/* Light */}
        <pointLight
          position={[0, 0, 0.05]}
          color="#ffaa33"
          intensity={isNight ? 1.6 : 0.2}
          distance={4.5}
        />
      </group>

      {/* Interactive Signboard in front of house */}
      <group
        position={[0.6, 0.0, 1.5]}
        onClick={(e) => {
          e.stopPropagation()
          onOpenProject?.(item)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "auto"
        }}
      >
        {/* Signpost Post */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 5]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        {/* Sign Board */}
        <mesh position={[0, 0.75, 0.02]} castShadow>
          <boxGeometry args={[1.15, 0.38, 0.08]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        {/* Sign Text (Project Title) */}
        <Text
          position={[0, 0.79, 0.07]}
          fontSize={0.08}
          color="#ffffff"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.05}
        >
          {item.title}
        </Text>
        <Text
          position={[0, 0.65, 0.07]}
          fontSize={0.045}
          color="#ffe082"
          anchorX="center"
          anchorY="middle"
        >
          ✦ Press [E] to Read ✦
        </Text>
      </group>
    </group>
  )
}

export function ExperienceWorkshopLandmark({
  zone,
  onOpenProject,
}: {
  zone: IslandZone
  onOpenProject?: (item: IslandItem) => void
}) {
  const center = zone.position
  const y = getIslandHeight(center[0], center[2])

  // Animated chimney smoke particles
  const smokeCount = 4
  const smokeParticles = useRef<{ pos: [number, number, number]; speed: number; size: number }[]>([])
  const smokeRefs = useRef<any[]>([])

  if (smokeParticles.current.length === 0) {
    for (let i = 0; i < smokeCount; i++) {
      smokeParticles.current.push({
        pos: [0, 0, 0],
        speed: 0.6 + Math.random() * 0.6,
        size: 0.18 + Math.random() * 0.15,
      })
    }
  }

  // Animated forge furnace flame particles
  const flameCount = 5
  const flameParticles = useRef<{ pos: [number, number, number]; speed: number; size: number }[]>([])
  const flameRefs = useRef<any[]>([])

  if (flameParticles.current.length === 0) {
    for (let i = 0; i < flameCount; i++) {
      flameParticles.current.push({
        pos: [0, 0, 0],
        speed: 1.0 + Math.random() * 1.0,
        size: 0.08 + Math.random() * 0.08,
      })
    }
  }

  useFrame((state, delta) => {
    // 1. Animate chimney smoke particles
    smokeParticles.current.forEach((p, idx) => {
      p.pos[1] += delta * p.speed
      p.pos[0] += Math.sin(state.clock.getElapsedTime() * 3 + idx) * 0.02
      if (p.pos[1] > 2.0) {
        p.pos[1] = 0
        p.pos[0] = 0
        p.pos[2] = 0
      }
      const ref = smokeRefs.current[idx]
      if (ref) {
        ref.position.set(1.4 + p.pos[0], 2.8 + p.pos[1], -0.9 + p.pos[2])
        const scale = (1 - p.pos[1] / 2.0) * p.size
        ref.scale.set(scale, scale, scale)
      }
    })

    // 2. Animate forge furnace flame particles
    flameParticles.current.forEach((p, idx) => {
      p.pos[1] += delta * p.speed
      p.pos[0] = (Math.random() - 0.5) * 0.1
      p.pos[2] = (Math.random() - 0.5) * 0.1
      if (p.pos[1] > 0.8) {
        p.pos[1] = 0
      }
      const ref = flameRefs.current[idx]
      if (ref) {
        ref.position.set(-1.6 + p.pos[0], 0.7 + p.pos[1], 1.2 + p.pos[2])
        const scale = (1 - p.pos[1] / 0.8) * p.size
        ref.scale.set(scale, scale, scale)
      }
    })
  })

  return (
    <group position={[center[0], y, center[2]]}>
      {/* Cobblestone Workshop Base Platform */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.5, 0.2, 4.5]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} flatShading />
      </mesh>

      {/* Main Workshop Building Cabin */}
      <mesh position={[0, 1.35, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 2.3, 3.0]} />
        <meshStandardMaterial color="#d1c7bd" roughness={0.9} />
      </mesh>

      {/* Corner Wooden Support Columns */}
      <mesh position={[-2.05, 1.35, 1.05]} castShadow>
        <boxGeometry args={[0.2, 2.3, 0.2]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      <mesh position={[2.05, 1.35, 1.05]} castShadow>
        <boxGeometry args={[0.2, 2.3, 0.2]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      <mesh position={[-2.05, 1.35, -1.85]} castShadow>
        <boxGeometry args={[0.2, 2.3, 0.2]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      <mesh position={[2.05, 1.35, -1.85]} castShadow>
        <boxGeometry args={[0.2, 2.3, 0.2]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>

      {/* Terracotta Tiled Roof */}
      <group position={[0, 2.5, -0.4]}>
        {/* Left Roof Plane */}
        <mesh position={[-1.15, 0.5, 0]} rotation={[0, 0, 0.45]} castShadow>
          <boxGeometry args={[2.6, 0.12, 3.4]} />
          <meshStandardMaterial color="#c2593f" roughness={0.8} flatShading />
        </mesh>
        {/* Right Roof Plane */}
        <mesh position={[1.15, 0.5, 0]} rotation={[0, 0, -0.45]} castShadow>
          <boxGeometry args={[2.6, 0.12, 3.4]} />
          <meshStandardMaterial color="#c2593f" roughness={0.8} flatShading />
        </mesh>
      </group>

      {/* Brick Chimney stack */}
      <mesh position={[1.4, 2.4, -0.9]} castShadow>
        <boxGeometry args={[0.5, 1.6, 0.5]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[1.4, 3.1, -0.9]} castShadow>
        <boxGeometry args={[0.58, 0.2, 0.58]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>

      {/* Chimney Smoke Particles */}
      {smokeParticles.current.map((p, idx) => (
        <mesh
          key={`smoke-${idx}`}
          ref={(el) => {
            smokeRefs.current[idx] = el
          }}
        >
          <sphereGeometry args={[1, 5, 5]} />
          <meshStandardMaterial color="#e2e8f0" transparent opacity={0.6} roughness={0.9} />
        </mesh>
      ))}

      {/* Outdoor Blacksmith Forge / Furnace */}
      <mesh position={[-1.6, 0.5, 1.2]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial color="#475569" roughness={0.85} flatShading />
      </mesh>
      {/* Furnace Back Wall Shield */}
      <mesh position={[-1.6, 1.3, 0.7]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      {/* Furnace Fire Bed (Glow) */}
      <mesh position={[-1.6, 0.95, 1.2]}>
        <boxGeometry args={[0.9, 0.1, 0.9]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.5} />
      </mesh>
      <pointLight position={[-1.6, 1.2, 1.2]} color="#ff6b00" intensity={8.0} distance={6} decay={1.5} />

      {/* Forge Furnace Flame Particles */}
      {flameParticles.current.map((p, idx) => (
        <mesh
          key={`flame-${idx}`}
          ref={(el) => {
            flameRefs.current[idx] = el
          }}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ef4444" emissive="#f97316" emissiveIntensity={1.0} />
        </mesh>
      ))}

      {/* Blacksmith Anvil on Wooden Log */}
      <group position={[1.6, 0.2, 1.2]}>
        {/* Wooden Tree Stump Stump */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.28, 0.5, 6]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} flatShading />
        </mesh>
        {/* Anvil Head */}
        <mesh position={[0, 0.56, 0]} castShadow>
          <boxGeometry args={[0.35, 0.12, 0.16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Anvil Base */}
        <mesh position={[0, 0.46, 0]} castShadow>
          <boxGeometry args={[0.22, 0.08, 0.18]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Anvil Horn */}
        <mesh position={[-0.24, 0.56, 0]} rotation={[0, 0, -0.4]} castShadow>
          <cylinderGeometry args={[0.01, 0.08, 0.16, 5]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Outdoor Tool & Weapon Rack */}
      <group position={[1.8, 0.2, -1.5]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Wooden Frame posts */}
        <mesh position={[-0.5, 0.45, 0]} castShadow>
          <boxGeometry args={[0.06, 0.9, 0.06]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        <mesh position={[0.5, 0.45, 0]} castShadow>
          <boxGeometry args={[0.06, 0.9, 0.06]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[1.06, 0.06, 0.06]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        {/* Leaning Shield */}
        <mesh position={[-0.1, 0.35, 0.1]} rotation={[0.2, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.04, 8]} />
          <meshStandardMaterial color="#854d0e" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[-0.1, 0.35, 0.12]} rotation={[0.2, 0.1, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.042, 8]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Decorative Forest Trees around the workshop */}
      <group position={[-2.4, 0, -2.0]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <coneGeometry args={[0.8, 2.0, 5]} />
          <meshStandardMaterial color="#14532d" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 5]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
      </group>

      {/* Interactive Signboard in front of platform */}
      <group
        position={[0, -0.5, 3.5]}
        onClick={(e) => {
          e.stopPropagation()
          onOpenProject?.({
            id: "experience-workshop",
            zoneId: "experience",
            title: "Crafter's Guild",
            subtitle: "Professional Experience",
            description: "Work history and contributions",
            position: [center[0], 0, center[2] + 3.5],
            scale: 1,
            visual: "workshop"
          })
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "auto"
        }}
      >
        {/* Signpost Post */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 5]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        {/* Sign Board */}
        <mesh position={[0, 0.75, 0.02]} castShadow>
          <boxGeometry args={[1.25, 0.38, 0.08]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        {/* Sign Text */}
        <Text
          position={[0, 0.79, 0.07]}
          fontSize={0.07}
          color="#ffffff"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.15}
        >
          Crafter's Guild
        </Text>
        <Text
          position={[0, 0.65, 0.07]}
          fontSize={0.045}
          color="#ffe082"
          anchorX="center"
          anchorY="middle"
        >
          ✦ Press [E] to Read ✦
        </Text>
      </group>
    </group>
  )
}

// 5. Academy (Education)
export function AcademyLandmark({
  zone,
  onOpenProject,
}: {
  zone: IslandZone
  onOpenProject?: (item: IslandItem) => void
}) {
  const center = zone.position
  const y = getIslandHeight(center[0], center[2])

  return (
    <group position={[center[0], y, center[2]]}>
      {/* 3-Tiered Classical Steps (Grand Plinth) */}
      {/* Bottom Step */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.2, 0.2, 5.2]} />
        <meshStandardMaterial color="#c3beab" roughness={0.9} flatShading />
      </mesh>
      {/* Middle Step */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.7, 0.2, 4.7]} />
        <meshStandardMaterial color="#dcd7c5" roughness={0.85} flatShading />
      </mesh>
      {/* Top Step */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.2, 0.2, 4.2]} />
        <meshStandardMaterial color="#f5f0db" roughness={0.8} flatShading />
      </mesh>

      {/* Inner Hall (Cella Walls) */}
      <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 2.8, 2.8]} />
        <meshStandardMaterial color="#e8e2d0" roughness={0.8} />
      </mesh>

      {/* Academy Grand Entrance Door */}
      <group position={[0, 1.4, 1.41]}>
        {/* Door Frame */}
        <mesh>
          <boxGeometry args={[1.2, 2.0, 0.08]} />
          <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
        </mesh>
        {/* Door Panels */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[1.0, 1.9, 0.06]} />
          <meshStandardMaterial color="#4a2e1b" roughness={0.8} />
        </mesh>
        {/* Gold Emblem on Door */}
        <mesh position={[0, 0.3, 0.06]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.2, 0.2, 0.02]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Columns with Bases and Capitals */}
      {[
        [-2.6, -1.7], [-2.6, 1.7],
        [2.6, -1.7], [2.6, 1.7],
        [-0.9, -1.7], [-0.9, 1.7],
        [0.9, -1.7], [0.9, 1.7]
      ].map(([cx, cz], i) => (
        <group key={i} position={[cx, 0.6, cz]}>
          {/* Column Base */}
          <mesh position={[0, 0.04, 0]} castShadow>
            <boxGeometry args={[0.36, 0.08, 0.36]} />
            <meshStandardMaterial color="#dcd7c5" roughness={0.7} />
          </mesh>
          {/* Column Shaft */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.18, 2.6, 6]} />
            <meshStandardMaterial color="#f7f3e3" roughness={0.7} />
          </mesh>
          {/* Column Capital */}
          <mesh position={[0, 2.76, 0]} castShadow>
            <boxGeometry args={[0.36, 0.08, 0.36]} />
            <meshStandardMaterial color="#dcd7c5" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Architrave (Roof Support beam) */}
      <mesh position={[0, 3.55, 0]} castShadow>
        <boxGeometry args={[6.4, 0.3, 4.4]} />
        <meshStandardMaterial color="#e5e0d8" roughness={0.7} />
      </mesh>

      {/* Frieze Band with Text "ACADEMY" */}
      <group position={[0, 3.85, 0]}>
        <mesh castShadow>
          <boxGeometry args={[6.4, 0.3, 4.4]} />
          <meshStandardMaterial color="#dcd7c5" roughness={0.8} />
        </mesh>
        {/* Text on Front Frieze */}
        <Text
          position={[0, 0.0, 2.22]}
          fontSize={0.22}
          color="#3e2723"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          ACADEMY
        </Text>
      </group>

      {/* Triangular Roof Pediment & Gable */}
      <group position={[0, 4.0, 0]}>
        {/* Hipped Roof Pyramid */}
        <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[4.2, 1.2, 4]} />
          <meshStandardMaterial color="#b56a55" roughness={0.8} flatShading />
        </mesh>
        {/* Front Pediment Triangular Wall */}
        <mesh position={[0, 0.25, 2.18]} castShadow>
          <boxGeometry args={[5.2, 0.5, 0.05]} />
          <meshStandardMaterial color="#f5f0db" roughness={0.8} />
        </mesh>
        {/* Decorative Gold Shield in Front Pediment */}
        <mesh position={[0, 0.25, 2.22]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.24, 0.24, 0.02]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Interactive Signboard in front of steps */}
      <group
        position={[0, 0.0, 3.2]}
        onClick={(e) => {
          e.stopPropagation()
          onOpenProject?.({
            id: "education-academy",
            zoneId: "education",
            title: "Academy of Sciences",
            subtitle: "Education & Milestones",
            description: "Academic history and qualifications",
            position: [center[0], 0, center[2] + 3.2],
            scale: 1,
            visual: "academy"
          })
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "auto"
        }}
      >
        {/* Signpost Post */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 5]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        {/* Sign Board */}
        <mesh position={[0, 0.75, 0.02]} castShadow>
          <boxGeometry args={[1.25, 0.38, 0.08]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        {/* Sign Text (Academy Title) */}
        <Text
          position={[0, 0.79, 0.07]}
          fontSize={0.07}
          color="#ffffff"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.15}
        >
          Academy of Sciences
        </Text>
        <Text
          position={[0, 0.65, 0.07]}
          fontSize={0.045}
          color="#ffe082"
          anchorX="center"
          anchorY="middle"
        >
          ✦ Press [E] to Enter ✦
        </Text>
      </group>
    </group>
  )
}

// 6. Mountain Peak (Achievements)
export function MountainPeakLandmark({
  zone,
  isNight = false,
  onOpenProject,
}: {
  zone: IslandZone
  isNight?: boolean
  onOpenProject?: (item: IslandItem) => void
}) {
  const center = zone.position
  const y = getIslandHeight(center[0], center[2])

  return (
    <group position={[center[0], y, center[2]]}>
      {/* Red Flag and Flagpole */}
      <group position={[0, 0, 0]}>
        {/* Flagpole */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 4.5, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Flagpole Gold Cap */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Red Flag */}
        <group position={[0.75, 2.8, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 0.8, 0.06]} />
            <meshStandardMaterial color="#ef4444" roughness={0.7} />
          </mesh>
          {/* Flag Accent Trim */}
          <mesh position={[-0.75, 0, 0]} castShadow>
            <boxGeometry args={[0.06, 0.9, 0.08]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Interactive Signboard in front of flag */}
      <group
        position={[0, -3., 2.8]}
        onClick={(e) => {
          e.stopPropagation()
          onOpenProject?.({
            id: "achievements-peak",
            zoneId: "achievements",
            title: "Achievements Peak",
            subtitle: "Completed Milestones",
            description: "15+ Projects Completed Successfully",
            position: [center[0], 0, center[2] + 2.8],
            scale: 1,
            visual: "flag"
          })
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = "auto"
        }}
      >
        {/* Signpost Post */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 5]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        {/* Sign Board */}
        <mesh position={[0, 0.75, 0.02]} castShadow>
          <boxGeometry args={[1.25, 0.38, 0.08]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        {/* Sign Text */}
        <Text
          position={[0, 0.79, 0.07]}
          fontSize={0.07}
          color="#ffffff"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.15}
        >
          Achievements Peak
        </Text>
        <Text
          position={[0, 0.65, 0.07]}
          fontSize={0.045}
          color="#ffe082"
          anchorX="center"
          anchorY="middle"
        >
          ✦ Press [E] to Read ✦
        </Text>
      </group>

      {/* Glowing upward achievement sky beacon */}
      <mesh position={[0, 7.5, 0]}>
        <cylinderGeometry args={[1.5, 2.2, 12, 8, 1, true]} />
        <meshBasicMaterial
          color="#4dd2ff"
          transparent
          opacity={isNight ? 0.35 : 0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
      {isNight && (
        <pointLight
          position={[0, 3, 0]}
          color="#33ccff"
          intensity={12.0}
          distance={30}
          decay={1.5}
        />
      )}
    </group>
  )
}

// 7. Harbor (Resume)
export function HarborLandmark({ zone }: { zone: IslandZone }) {
  const center = zone.position
  // Harbor sits at sea level y = -0.4
  const y = -0.4

  const tableY = useMemo(() => getIslandHeight(center[0] - 3.2, center[2] - 3.5) - y, [center, y])

  return (
    <group position={[center[0], y, center[2]]}>
      {/* Wood Dock walkway */}
      <mesh position={[0, 0.3, -4]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.2, 6]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.3, -1]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 0.2, 1.8]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
      </mesh>
      {/* Wood piles/columns supporting the dock */}
      {[-0.8, 0.8].map((cx, i) => (
        <mesh key={i} position={[cx, -0.8, -6]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 2.0, 5]} />
          <meshStandardMaterial color="#4a2e1b" roughness={0.95} />
        </mesh>
      ))}
      {[-2, 0, 2].map((cx, i) => (
        <mesh key={i} position={[cx, -0.8, -1.8]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 2.0, 5]} />
          <meshStandardMaterial color="#4a2e1b" roughness={0.95} />
        </mesh>
      ))}
      {/* Tiny Sailboat anchored */}
      <group position={[2.5, 0.4, -4.5]} rotation={[0, 0.6, 0.05]}>
        {/* Boat hull */}
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.4, 2.4]} />
          <meshStandardMaterial color="#eee" roughness={0.6} flatShading />
        </mesh>
        {/* Mast */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 4]} />
          <meshStandardMaterial color="#553a25" />
        </mesh>
        {/* Sail */}
        <mesh position={[0, 1.5, -0.4]} rotation={[0, Math.PI / 4, 0.2]} castShadow>
          <boxGeometry args={[0.02, 1.5, 0.8]} />
          <meshStandardMaterial color="#fffff0" roughness={0.5} />
        </mesh>
      </group>

      {/* Beach Table model loaded via OBJ/MTL */}
      <React.Suspense fallback={null}>
        <MTLModel
          objPath="/models/outdoor-furniture.obj"
          mtlPath="/models/outdoor-furniture.mtl"
          position={[-3.2, tableY, -3.5]}
          scale={1.2}
          rotation={[0, 0.4, 0]}
        />
      </React.Suspense>

      {/* Interactive Signpost on the path */}
      <group position={[center[0], getIslandHeight(center[0], center[2] - 4), center[2] - 4]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 6]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.0, 0.03]} castShadow>
          <boxGeometry args={[1.6, 0.5, 0.1]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        <mesh position={[0, 1.0, 0.08]}>
          <boxGeometry args={[1.6, 0.05, 0.02]} />
          <meshStandardMaterial color="#ff9800" />
        </mesh>
        <Text position={[0, 1.08, 0.09]} fontSize={0.09} color="#ffffff" fontWeight="bold" anchorX="center" anchorY="middle">
          RESUME
        </Text>
        <Text position={[0, 0.9, 0.09]} fontSize={0.06} color="#ffe082" anchorX="center" anchorY="middle">
          ✦ Press [E] to Download ✦
        </Text>
      </group>
    </group>
  )
}

// 8. Lighthouse (Contact)
export function LighthouseLandmark({ zone, isNight = false }: { zone: IslandZone; isNight?: boolean }) {
  const center = zone.position
  const y = getIslandHeight(center[0], center[2])
  
  const lightRef = useRef<THREE.SpotLight>(null)

  useFrame((state) => {
    if (lightRef.current) {
      // Rotating lighthouse beam
      lightRef.current.target.position.x = center[0] + Math.cos(state.clock.elapsedTime * 0.8) * 40
      lightRef.current.target.position.z = center[2] + Math.sin(state.clock.elapsedTime * 0.8) * 40
      lightRef.current.target.updateMatrixWorld()
    }
  })

  return (
    <group>
      <group position={[center[0], y, center[2]]}>
        {/* Stone Base */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.5, 3.0, 1.2, 8]} />
          <meshStandardMaterial color="#666b6e" roughness={0.8} flatShading />
        </mesh>
        {/* Tower Red section */}
        <mesh position={[0, 4.0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.4, 2.0, 5.6, 8]} />
          <meshStandardMaterial color="#cc3333" roughness={0.75} flatShading />
        </mesh>
        {/* Tower White section */}
        <mesh position={[0, 8.0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.0, 1.4, 2.4, 8]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.7} flatShading />
        </mesh>
        {/* Glass Light House room */}
        <mesh position={[0, 9.8, 0]} castShadow>
          <cylinderGeometry args={[0.9, 1.0, 1.2, 8]} />
          <meshStandardMaterial color="#add8e6" transparent opacity={0.6} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Metal Roof Dome */}
        <mesh position={[0, 10.8, 0]} castShadow>
          <coneGeometry args={[1.2, 0.8, 8]} />
          <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
        </mesh>
        {/* Internal Lantern Glow */}
        <mesh position={[0, 9.8, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial color={isNight ? "#fffde0" : "#999"} />
        </mesh>
        {isNight && (
          <>
            <pointLight position={[0, 9.8, 0]} color="#fff0b3" intensity={8.0} distance={20} />
            <spotLight
              ref={lightRef}
              position={[0, 9.8, 0]}
              color="#fffae6"
              intensity={isNight ? 50 : 0}
              distance={120}
              angle={Math.PI / 10}
              penumbra={0.3}
              castShadow
            />
          </>
        )}
      </group>
      {/* Interactive Signpost on the path */}
      <group
        position={[
          center[0] - 4.5,
          getIslandHeight(center[0] - 4.5, center[2] - 2.0),
          center[2] - 2.0
        ]}
        rotation={[0, Math.PI / 5.5, 0]}
      >
        {/* Post */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 6]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        {/* Board */}
        <mesh position={[0, 1.0, 0.03]} castShadow>
          <boxGeometry args={[1.5, 0.5, 0.1]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        {/* Border Frame */}
        <mesh position={[0, 1.0, 0.08]}>
          <boxGeometry args={[1.5, 0.05, 0.02]} />
          <meshStandardMaterial color="#ff5722" />
        </mesh>
        {/* Sign Text */}
        <Text
          position={[0, 1.08, 0.09]}
          fontSize={0.095}
          color="#ffffff"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          CONTACT
        </Text>
        <Text
          position={[0, 0.9, 0.09]}
          fontSize={0.06}
          color="#ffe082"
          anchorX="center"
          anchorY="middle"
        >
          ✦ Press [E] to Talk ✦
        </Text>
      </group>
    </group>
  )
}

// 9. Tech Obelisk (Daily Tech stack)
export function TechObeliskLandmark({ zone, isNight = false }: { zone: IslandZone; isNight?: boolean }) {
  const center = zone.position
  const y = getIslandHeight(center[0], center[2])

  return (
    <group position={[center[0], y, center[2]]}>
      {/* Stone circular ring platform */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.5, 4.7, 0.25, 12]} />
        <meshStandardMaterial color="#42454a" roughness={0.8} flatShading />
      </mesh>
      {/* Monolithic Obelisk */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 1.0, 5.0, 4]} />
        <meshStandardMaterial color="#1a1c1e" roughness={0.9} metalness={0.2} flatShading />
      </mesh>
      {/* Tip of Obelisk (Pyramid shape) */}
      <mesh position={[0, 5.3, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.85, 0.8, 4]} />
        <meshStandardMaterial
          color="#00ffcc"
          emissive="#00ff99"
          emissiveIntensity={isNight ? 2.0 : 0.4}
        />
      </mesh>
      {/* Floating particles/glowing runes around */}
      <FloatingRune ringIndex={0} radius={2.2} height={2.0} speed={0.6} color="#00ffcc" isNight={isNight} />
      <FloatingRune ringIndex={1} radius={2.5} height={3.2} speed={-0.4} color="#00ffcc" isNight={isNight} />

      {/* Interactive Signpost on the path */}
      <group position={[0, 0, 5]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 6]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.0, 0.03]} castShadow>
          <boxGeometry args={[1.6, 0.5, 0.1]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        <mesh position={[0, 1.0, 0.08]}>
          <boxGeometry args={[1.6, 0.05, 0.02]} />
          <meshStandardMaterial color="#00ffcc" />
        </mesh>
        <Text position={[0, 1.08, 0.09]} fontSize={0.09} color="#ffffff" fontWeight="bold" anchorX="center" anchorY="middle">
          TECH STACK
        </Text>
        <Text position={[0, 0.9, 0.09]} fontSize={0.06} color="#ffe082" anchorX="center" anchorY="middle">
          ✦ Press [E] to View ✦
        </Text>
      </group>
    </group>
  )
}

function FloatingRune({
  ringIndex,
  radius,
  height,
  speed,
  color,
  isNight
}: {
  ringIndex: number
  radius: number
  height: number
  speed: number
  color: string
  isNight: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const angle = state.clock.elapsedTime * speed + ringIndex * Math.PI
      meshRef.current.position.x = Math.cos(angle) * radius
      meshRef.current.position.z = Math.sin(angle) * radius
      meshRef.current.position.y = height + Math.sin(state.clock.elapsedTime * 2.0 + ringIndex) * 0.15
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8
    }
  })

  return (
    <mesh ref={meshRef} position={[0, height, 0]} scale={[0.2, 0.3, 0.2]}>
      <octahedronGeometry args={[0.8, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isNight ? 1.5 : 0.2}
      />
    </mesh>
  )
}

// 10. Social Sanctuary (Social links)
export function SocialSanctuaryLandmark({ zone, isNight = false }: { zone: IslandZone; isNight?: boolean }) {
  const center = zone.position
  const y = getIslandHeight(center[0], center[2])

  return (
    <group position={[center[0], y, center[2]]}>
      {/* Floating Golden Ring */}
      <group position={[0, 1.8, 0]}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[3.0, 0.22, 6, 24]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      {/* Altar Pedestal */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.8, 8]} />
        <meshStandardMaterial color="#f0f0f5" roughness={0.7} flatShading />
      </mesh>
      
      {/* Floating central orb */}

      {/* Floating Social Icons */}
      <FloatingSocialIcon position={[-1.8, 1.8, 0]} color="#0a66c2" type="linkedin" bobDelay={0} />
      <FloatingSocialIcon position={[0, 2.4, 0]} color="#24292f" type="github" bobDelay={1.2} />
      <FloatingSocialIcon position={[1.8, 1.8, 0]} color="#e1306c" type="instagram" bobDelay={2.4} />

      {/* Interactive Signposts */}
      <SmallSocialSignpost position={[-1.8, 0, 3.2]} label="LinkedIn" color="#0a66c2" />
      <SmallSocialSignpost position={[0, 0, 3.2]} label="GitHub" color="#333333" />
      <SmallSocialSignpost position={[1.8, 0, 3.2]} label="Instagram" color="#e1306c" />
    </group>
  )
}

function FloatingOrb({
  position,
  size,
  color,
  isNight
}: {
  position: [number, number, number]
  size: number
  color: string
  isNight: boolean
}) {
  const orbRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.2
    }
  })

  return (
    <mesh ref={orbRef} position={position} scale={[size, size, size]}>
      <sphereGeometry args={[0.8, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isNight ? 2.0 : 0.3}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  )
}

function FloatingSocialIcon({
  position,
  color,
  type,
  bobDelay
}: {
  position: [number, number, number]
  color: string
  type: "linkedin" | "github" | "instagram"
  bobDelay: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  // Determine the correct image URL from the public folder
  const textureUrl = type === "linkedin" ? "/linkedin.png" : type === "github" ? "/github.png" : "/insta.png"
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return loader.load(textureUrl)
  }, [textureUrl])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + bobDelay) * 0.18
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.6 + bobDelay
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* 3D Glassmorphic / Solid brand base card */}
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.7, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.7} />
      </mesh>
      
      {/* Front Face Logo Plane */}
      <mesh position={[0, 0, 0.081]} castShadow>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial map={texture} transparent={true} depthWrite={true} />
      </mesh>

      {/* Back Face Logo Plane */}
      <mesh position={[0, 0, -0.081]} rotation={[0, Math.PI, 0]} castShadow>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial map={texture} transparent={true} depthWrite={true} />
      </mesh>
    </group>
  )
}

function SmallSocialSignpost({
  position,
  label,
  color
}: {
  position: [number, number, number]
  label: string
  color: string
}) {
  return (
    <group position={position}>
      {/* Post */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 5]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      {/* Board */}
      <mesh position={[0, 0.75, 0.02]} castShadow>
        <boxGeometry args={[1.2, 0.35, 0.08]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
      </mesh>
      {/* Border Frame */}
      <mesh position={[0, 0.75, 0.065]}>
        <boxGeometry args={[1.2, 0.04, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Sign Text */}
      <Text
        position={[0, 0.79, 0.07]}
        fontSize={0.065}
        color="#ffffff"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      <Text
        position={[0, 0.66, 0.07]}
        fontSize={0.04}
        color="#ffe082"
        anchorX="center"
        anchorY="middle"
      >
        ✦ Press [E] ✦
      </Text>
    </group>
  )
}

function Mushroom({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 5]} />
        <meshStandardMaterial color="#e2e0d4" roughness={0.9} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <coneGeometry args={[0.3, 0.25, 6]} />
        <meshStandardMaterial color="#d32f2f" roughness={0.7} flatShading />
      </mesh>
      {/* Spots */}
      <mesh position={[0.15, 0.45, 0.1]} rotation={[0.4, 0, 0.2]}>
         <boxGeometry args={[0.08, 0.08, 0.08]} />
         <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function Bush({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.3, 0.3, 0.2]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#1b5e20" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.25, 0.35, -0.2]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#388e3c" roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

function FallenLog({ position, scale = 1, rotation = 0 }: { position: [number, number, number], scale?: number, rotation?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.22, 1.8, 6]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} flatShading />
      </mesh>
      {/* Small branch sticking out */}
      <mesh position={[0.4, 0.3, 0.2]} rotation={[0.2, 0.5, Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.6, 4]} />
        <meshStandardMaterial color="#4e342e" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Stump({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.45, 0.5, 7]} />
        <meshStandardMaterial color="#4e342e" roughness={0.9} flatShading />
      </mesh>
      {/* Top Rings */}
      <mesh position={[0, 0.51, 0]} receiveShadow>
        <cylinderGeometry args={[0.33, 0.33, 0.02, 7]} />
        <meshStandardMaterial color="#d7ccc8" roughness={0.8} flatShading />
      </mesh>
    </group>
  )
}

function WoodCabin({ position, scale = 1, rotation = 0 }: { position: [number, number, number], scale?: number, rotation?: number }) {
  // Sink it into the ground slightly to avoid floating on slopes
  return (
    <group position={[position[0], position[1] - 0.2, position[2]]} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
      {/* Cabin Base */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.2, 1.5]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.9} flatShading />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.3, 0.8, 4]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} flatShading />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.4, 0.76]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.05]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} flatShading />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.4, 1.6, -0.2]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#424242" roughness={0.9} />
      </mesh>
    </group>
  )
}

function StoneCottage({ position, scale = 1, rotation = 0 }: { position: [number, number, number], scale?: number, rotation?: number }) {
  return (
    <group position={[position[0], position[1] - 0.2, position[2]]} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.9, 1.0, 6]} />
        <meshStandardMaterial color="#9e9e9e" roughness={0.9} flatShading />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.0, 0.8, 6]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} flatShading />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.4, 0.86]} castShadow>
        <boxGeometry args={[0.4, 0.7, 0.05]} />
        <meshStandardMaterial color="#4e342e" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Tent({ position, scale = 1, rotation = 0 }: { position: [number, number, number], scale?: number, rotation?: number }) {
  return (
    <group position={[position[0], position[1] - 0.1, position[2]]} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
      {/* Tent Body */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 1.5, 3]} />
        <meshStandardMaterial color="#cddc39" roughness={0.9} flatShading />
      </mesh>
      {/* Tent opening */}
      <mesh position={[0, 0.3, 0.76]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.05]} />
        <meshStandardMaterial color="#212121" roughness={1.0} flatShading />
      </mesh>
    </group>
  )
}

function Fence({ position, scale = 1, rotation = 0 }: { position: [number, number, number], scale?: number, rotation?: number }) {
  // Simple low poly fence segment aligned to Z-axis
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
      {/* Post 1 */}
      <mesh position={[0, 0.4, -0.9]} castShadow>
        <boxGeometry args={[0.15, 0.8, 0.15]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.9} flatShading />
      </mesh>
      {/* Post 2 */}
      <mesh position={[0, 0.4, 0.9]} castShadow>
        <boxGeometry args={[0.15, 0.8, 0.15]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.9} flatShading />
      </mesh>
      {/* Top Plank */}
      <mesh position={[0.05, 0.6, 0]} castShadow>
        <boxGeometry args={[0.05, 0.15, 2.0]} />
        <meshStandardMaterial color="#795548" roughness={0.9} flatShading />
      </mesh>
      {/* Bottom Plank */}
      <mesh position={[0.05, 0.3, 0]} castShadow>
        <boxGeometry args={[0.05, 0.15, 2.0]} />
        <meshStandardMaterial color="#795548" roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

// --- PROCEDURAL SCATTERING & ENVIRONMENT ENVIRONMENT ---

type ScatterItem = {
  type: "pine" | "oak" | "palm" | "rock" | "lantern" | "sign" | "grass" | "mushroom" | "bush" | "log" | "stump" | "cabin" | "cottage" | "tent" | "fence"
  pos: [number, number, number]
  scale: number
  rotation?: number
  label?: string
}

export function ProceduralEnvironment({ isNight = false }: { isNight?: boolean }) {
  const elements = useMemo(() => {
    const list: ScatterItem[] = []
    
    // 0. Initialize Collision Bounds
    ISLAND_COLLIDERS.length = 0
    ISLAND_COLLIDERS.push(
      { x: -45, z: 45, r: 12 }, // Temple
      { x: 45, z: -45, r: 10 }, // Pond
      { x: 70, z: -20, r: 5 },  // Windmill
      { x: 20, z: -80, r: 5 },  // CampfireSite
      { x: -70, z: -10, r: 10 },// MysticRuins
      { x: -90, z: -60, r: 8 }, // Playground
      { x: 60, z: 15, r: 12 },  // FarmingLand
      { x: 0, z: -8, r: 3 }     // SpawnArch
    )
    
    // 1. Scatter trees and rocks along the paths!
    for (const [zoneId, points] of Object.entries(PATHS)) {
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i]
        const p2 = points[i + 1]
        
        // Calculate segment vector
        const dx = p2[0] - p1[0]
        const dz = p2[1] - p1[1]
        const len = Math.sqrt(dx * dx + dz * dz)
        const dirX = dx / len
        const dirZ = dz / len
        
        // Place elements along this segment
        let dist = 0
        const step = 8.5 // Place every ~8.5 units
        
        while (dist < len) {
          // Point on path
          const px = p1[0] + dirX * dist
          const pz = p1[1] + dirZ * dist
          
          // Place lantern every ~28 units
          if (dist > 5 && Math.floor(dist) % 28 < step) {
            // Offset slightly to the left side of the path
            const offsetX = -dirZ * 2.6
            const offsetZ = dirX * 2.6
            const lx = px + offsetX
            const lz = pz + offsetZ
            const ly = getIslandHeight(lx, lz)
            if (ly > 0.6) {
              list.push({ type: "lantern", pos: [lx, ly, lz], scale: 1.0 })
            }
          }
          
          // Place trees on alternating sides of the path
          const isLeft = (Math.floor(dist / step) % 2 === 0)
          const sideOffset = isLeft ? -3.8 : 3.8
          const offsetVar = (Math.random() - 0.5) * 1.5
          const treeX = px - dirZ * (sideOffset + offsetVar)
          const treeZ = pz + dirX * (sideOffset + offsetVar)
          const treeY = getIslandHeight(treeX, treeZ)

          if (treeY > 0.8 && treeY < 32.0) {
            // Select type based on location height
            const treeType = treeY < 5.0 ? "palm" : treeY > 20.0 ? "pine" : (Math.random() > 0.4 ? "pine" : "oak")
            list.push({
              type: treeType as any,
              pos: [treeX, treeY, treeZ],
              scale: 0.75 + Math.random() * 0.4
            })
            ISLAND_COLLIDERS.push({ x: treeX, z: treeZ, r: 0.6 }) // Tree trunk collider
          }

          // Random rock along path side
          if (Math.random() > 0.7) {
            const rockX = px + dirZ * (sideOffset * 1.4 + offsetVar)
            const rockZ = pz - dirX * (sideOffset * 1.4 + offsetVar)
            const rockY = getIslandHeight(rockX, rockZ)
            if (rockY > 0.8) {
              list.push({
                type: "rock",
                pos: [rockX, rockY, rockZ],
                scale: 0.4 + Math.random() * 0.7
              })
              ISLAND_COLLIDERS.push({ x: rockX, z: rockZ, r: 1.0 })
            }
          }

          dist += step
        }

        // 1b. Scatter grass tufts on both sides of this segment
        let grassDist = 1.0
        const grassStep = 0.8 // Increased density from 2.4 to 0.8
        while (grassDist < len - 1.0) {
          const gpx = p1[0] + dirX * grassDist
          const gpz = p1[1] + dirZ * grassDist

          // Normal vector perpendicular to segment direction
          const perpX = -dirZ
          const perpZ = dirX

          // Deterministic noise generator based on coordinates
          const noise = Math.abs(Math.sin(gpx * 12.7 + gpz * 93.3))

          // Place on left side
          if (noise > 0.2) {
            const offsetLeft = 1.6 + noise * 1.2
            const gx = gpx + perpX * offsetLeft
            const gz = gpz + perpZ * offsetLeft
            const gy = getIslandHeight(gx, gz)
            if (gy > 0.6) {
              list.push({
                type: "grass",
                pos: [gx, gy, gz],
                scale: 0.6 + noise * 0.5
              })
            }
          }

          // Place on right side
          if (noise < 0.8) {
            const offsetRight = -(1.6 + (1.0 - noise) * 1.2)
            const gx = gpx + perpX * offsetRight
            const gz = gpz + perpZ * offsetRight
            const gy = getIslandHeight(gx, gz)
            if (gy > 0.6) {
              list.push({
                type: "grass",
                pos: [gx, gy, gz],
                scale: 0.6 + (1.0 - noise) * 0.5
              })
            }
          }

          grassDist += grassStep
        }

        // 1c. Scatter fences continuously on both sides of the path segment
        // Only for Mountain Peak (achievements) and Blacksmith (experience)
        if (len > 4 && (zoneId === "achievements" || zoneId === "experience")) {
          let fenceDist = 0.0
          const fenceStep = 2.0
          const pathAngle = Math.atan2(dx, dz) // direction of path
          
          while (fenceDist < len) {
            // Leave a tiny gap at the very start and end of segments
            if (fenceDist > 1.0 && fenceDist < len - 1.0) {
              const fx = p1[0] + dirX * fenceDist
              const fz = p1[1] + dirZ * fenceDist
              
              // Left fence
              const offsetL = 2.0
              const leftX = fx - dirZ * offsetL
              const leftZ = fz + dirX * offsetL
              const leftY = getIslandHeight(leftX, leftZ)
              if (leftY > 0.6) {
                 list.push({ type: "fence", pos: [leftX, leftY, leftZ], scale: 1.0, rotation: pathAngle })
                 ISLAND_COLLIDERS.push({ x: leftX, z: leftZ, r: 0.8 })
              }

              // Right fence
              const offsetR = -2.0
              const rightX = fx - dirZ * offsetR
              const rightZ = fz + dirX * offsetR
              const rightY = getIslandHeight(rightX, rightZ)
              if (rightY > 0.6) {
                 list.push({ type: "fence", pos: [rightX, rightY, rightZ], scale: 1.0, rotation: pathAngle })
                 ISLAND_COLLIDERS.push({ x: rightX, z: rightZ, r: 0.8 })
              }
            }
            fenceDist += fenceStep
          }
        }
      }
    }

    // 2. Add Direction signs at Spawn Center
    list.push({ type: "sign", pos: [-3, getIslandHeight(-3, 3), 3], scale: 1.0, rotation: 0.8, label: "Botanical Garden" })
    list.push({ type: "sign", pos: [3, getIslandHeight(3, -3), -3], scale: 1.0, rotation: -0.8, label: "Waterfall Valley" })

    // 3. Forest scattering across the broader island (for exploration discovery!)
    // Generate deterministic forest using seed/loop. Increased from 300 to 1200 to fill empty spaces!
    for (let k = 0; k < 1200; k++) {
      // Deterministic coordinates based on index sine
      const x = Math.sin(k * 43.12) * 165
      const z = Math.cos(k * 73.81) * 165
      
      const d = Math.sqrt(x * x + z * z)
      if (d > 165) continue // not outside island limit

      const y = getIslandHeight(x, z)
      
      // Check if it's a suitable forest floor (flat, above sea level, below snow cap)
      if (y > 0.9 && y < 22) {
        // Ensure not too close to the spawns or path segments
        let tooClose = false
        // Close to center spawn
        if (d < 18) tooClose = true
        
        // Close to paths
        for (const [zoneId, points] of Object.entries(PATHS)) {
          for (let i = 0; i < points.length - 1; i++) {
            const { dist } = distToSegmentWithPoint(x, z, points[i][0], points[i][1], points[i+1][0], points[i+1][1])
            if (dist < 8.5) {
              tooClose = true
              break
            }
          }
          if (tooClose) break
        }

        if (!tooClose) {
          const typeRand = Math.sin(k * 892.42) - Math.floor(Math.sin(k * 892.42))
          let itemType = "grass" // Default to grass to increase grass density massively!
          if (typeRand > 0.85) itemType = "oak"
          else if (typeRand > 0.7) itemType = "pine"
          else if (typeRand > 0.6) itemType = "rock"
          else if (typeRand > 0.5) itemType = "bush"
          else if (typeRand > 0.4) itemType = "log"
          else if (typeRand > 0.3) itemType = "stump"
          else if (typeRand > 0.2) itemType = "mushroom"
          else if (typeRand > 0.18) itemType = "cabin"
          else if (typeRand > 0.16) itemType = "cottage"
          else if (typeRand > 0.14) itemType = "tent"

          const isHouse = ["cabin", "cottage", "tent"].includes(itemType)

          list.push({
            type: itemType as any,
            pos: [x, y, z],
            scale: isHouse ? 1.5 + typeRand * 0.5 : 0.65 + typeRand * 0.6,
            rotation: typeRand * Math.PI * 2
          })
          
          if (isHouse) {
            ISLAND_COLLIDERS.push({ x, z, r: 1.8 })
          } else if (itemType === "pine" || itemType === "oak" || itemType === "palm") {
            ISLAND_COLLIDERS.push({ x, z, r: 0.6 })
          } else if (itemType === "rock") {
            ISLAND_COLLIDERS.push({ x, z, r: 1.0 })
          }
        }
      }
    }

    return list
  }, [])

  return (
    <group>
      {elements.map((item, index) => {
        const key = `${item.type}-${index}`
        switch (item.type) {
          case "pine":
            return <PineTree key={key} position={item.pos} scale={item.scale} />
          case "oak":
            return <OakTree key={key} position={item.pos} scale={item.scale} />
          case "palm":
            return <PalmTree key={key} position={item.pos} scale={item.scale} />
          case "rock":
            return <Rock key={key} position={item.pos} scale={item.scale} />
          case "lantern":
            return <PathLantern key={key} position={item.pos} isNight={isNight} />
          case "sign":
            return <DirectionSign key={key} position={item.pos} rotation={item.rotation} label={item.label || "Sign"} />
          case "grass":
            return <GrassTuft key={key} position={item.pos} scale={item.scale} />
          case "mushroom":
            return <Mushroom key={key} position={item.pos} scale={item.scale} />
          case "bush":
            return <Bush key={key} position={item.pos} scale={item.scale} />
          case "log":
            return <FallenLog key={key} position={item.pos} scale={item.scale} rotation={item.rotation} />
          case "stump":
            return <Stump key={key} position={item.pos} scale={item.scale} />
          case "cabin":
            return <WoodCabin key={key} position={item.pos} scale={item.scale} rotation={item.rotation} />
          case "cottage":
            return <StoneCottage key={key} position={item.pos} scale={item.scale} rotation={item.rotation} />
          case "tent":
            return <Tent key={key} position={item.pos} scale={item.scale} rotation={item.rotation} />
          case "fence":
            return <Fence key={key} position={item.pos} scale={item.scale} rotation={item.rotation} />
          default:
            return null
        }
      })}
      {/* Massive Boundary Wall enclosing the entire island */}
      <IslandBoundaryWall />
    </group>
  )
}

/* =========================================================================
   8. CUTE LOW-POLY ANIMALS
   ========================================================================= */

// Cute Grazing/Bobbing Sheep
export function CuteSheep({ position, scale = 1.0 }: { position: [number, number, number]; scale?: number }) {
  const sheepRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (sheepRef.current) {
      // Gentle hopping/bobbing and head tilt rotation
      const time = state.clock.getElapsedTime() + position[0]
      sheepRef.current.position.y = position[1] + Math.max(0, Math.sin(time * 3.5) * 0.08)
      sheepRef.current.rotation.y = position[2] + Math.sin(time * 0.4) * 0.2
    }
  })

  return (
    <group ref={sheepRef} position={position} scale={[scale, scale, scale]}>
      {/* Wool Body */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} flatShading />
      </mesh>
      {/* Face */}
      <mesh position={[0.42, 0.52, 0]} castShadow>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {/* Four Legs */}
      {[
        [-0.18, -0.18], [-0.18, 0.18],
        [0.18, -0.18], [0.18, 0.18]
      ].map(([cx, cz], i) => (
        <mesh key={i} position={[cx, 0.15, cz]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.32, 4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// Cute Hopping Bunny
export function CuteBunny({ position, scale = 1.0 }: { position: [number, number, number]; scale?: number }) {
  const bunnyRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (bunnyRef.current) {
      // Dynamic jumping/hopping cycles
      const time = state.clock.getElapsedTime() * 4.5 + position[0] * 2.2
      const hop = Math.max(0, Math.sin(time) * 0.22)
      bunnyRef.current.position.y = position[1] + hop
      bunnyRef.current.rotation.x = hop * 0.4 // tilts forward when hopping
    }
  })

  return (
    <group ref={bunnyRef} position={position} scale={[scale, scale, scale]}>
      {/* Body */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <dodecahedronGeometry args={[0.28, 1]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} flatShading />
      </mesh>
      {/* Head */}
      <mesh position={[0.18, 0.38, 0]} castShadow>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      {/* Long Ears */}
      <mesh position={[0.12, 0.52, -0.05]} rotation={[0.25, 0, -0.15]} castShadow>
        <boxGeometry args={[0.045, 0.2, 0.07]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh position={[0.12, 0.52, 0.05]} rotation={[-0.25, 0, -0.15]} castShadow>
        <boxGeometry args={[0.045, 0.2, 0.07]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      {/* Fluffy Tail */}
      <mesh position={[-0.26, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.07, 5, 5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

// Cute Swimming Duck
export function CuteDuck({ position, scale = 1.0 }: { position: [number, number, number]; scale?: number }) {
  const duckRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (duckRef.current) {
      // Floating water bobbing and circular patrol swimming
      const time = state.clock.getElapsedTime() + position[0]
      duckRef.current.position.y = position[1] + Math.sin(time * 2.2) * 0.03
      
      // Glides around in a small patrol path
      const angle = time * 0.3
      duckRef.current.position.x = position[0] + Math.cos(angle) * 1.8
      duckRef.current.position.z = position[2] + Math.sin(angle) * 1.8
      duckRef.current.rotation.y = -angle + Math.PI // Orient to forward movement direction
    }
  })

  return (
    <group ref={duckRef} position={position} scale={[scale, scale, scale]}>
      {/* Yellow Body */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.38, 0.2, 0.24]} />
        <meshStandardMaterial color="#fef08a" roughness={0.65} flatShading />
      </mesh>
      {/* Head */}
      <mesh position={[0.16, 0.26, 0]} castShadow>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshStandardMaterial color="#fef08a" roughness={0.65} />
      </mesh>
      {/* Orange Beak */}
      <mesh position={[0.26, 0.24, 0]} castShadow>
        <boxGeometry args={[0.11, 0.05, 0.09]} />
        <meshStandardMaterial color="#f97316" roughness={0.6} />
      </mesh>
    </group>
  )
}

// Component to load OBJ/MTL models from the public folder
export function MTLModel({
  objPath,
  mtlPath,
  position,
  scale = 1.0,
  rotation = [0, 0, 0],
}: {
  objPath: string
  mtlPath: string
  position: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}) {
  const materials = useLoader(MTLLoader, mtlPath)
  const obj = useLoader(OBJLoader, objPath, (loader) => {
    materials.preload()
    loader.setMaterials(materials)
  })

  const cloned = useMemo(() => {
    const clone = obj.clone()
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // Compute bounding box to automatically normalize scale and center the pivot
    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)

    if (maxDim > 0) {
      // Normalize model size so max dimension matches a baseline size of ~2.4 units
      const baselineSize = 2.4
      const scaleFactor = (baselineSize * scale) / maxDim
      clone.scale.set(scaleFactor, scaleFactor, scaleFactor)
    }

    // Recalculate box with new scale to offset pivot point to bottom-center
    const scaledBox = new THREE.Box3().setFromObject(clone)
    const center = new THREE.Vector3()
    scaledBox.getCenter(center)
    
    // Shift model inside a wrapper group so its local origin [0,0,0] sits at bottom center
    clone.position.set(-center.x, -scaledBox.min.y, -center.z)

    const wrapper = new THREE.Group()
    wrapper.add(clone)
    return wrapper
  }, [obj, scale])

  return (
    <primitive
      object={cloned}
      position={position}
      rotation={rotation}
      dispose={null}
    />
  )
}

// Procedural Castle Wall that encloses the entire 3D island at boundary radius 180
export function IslandBoundaryWall() {
  const segments = 64
  const radius = 180
  const wallWidth = 18.2 // slightly overlap adjacent panels to avoid rendering slits
  const wallDepth = 4.0

  const elements = useMemo(() => {
    const list = []
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      // Query terrain height at this boundary coordinate
      const terrainY = getIslandHeight(x, z)
      
      // Let base go deep enough under water, and wall top go high above terrain
      const baseVal = Math.min(-8.0, terrainY - 6.0)
      const topVal = Math.max(16.0, terrainY + 12.0)
      const height = topVal - baseVal
      const y = baseVal + height / 2

      // 1. Core Wall Mesh
      list.push({
        type: "wall",
        pos: [x, y, z] as [number, number, number],
        args: [wallWidth, height, wallDepth] as [number, number, number],
        rotation: [0, -angle + Math.PI / 2, 0] as [number, number, number]
      })

      // 2. High Tower with pointed roof every 4 segments (16 total towers)
      if (i % 4 === 0) {
        const towerHeight = height + 4.5
        const towerY = baseVal + towerHeight / 2
        list.push({
          type: "tower",
          pos: [x, towerY, z] as [number, number, number],
          args: [wallDepth * 1.45, towerHeight, wallDepth * 1.45] as [number, number, number],
          rotation: [0, -angle, 0] as [number, number, number]
        })
      }
    }
    return list
  }, [])

  return (
    <group>
      {elements.map((el, idx) => {
        const key = `${el.type}-${idx}`
        if (el.type === "wall") {
          return (
            <mesh key={key} position={el.pos} rotation={el.rotation} castShadow receiveShadow>
              <boxGeometry args={el.args} />
              <meshStandardMaterial color="#475569" roughness={0.95} flatShading />
            </mesh>
          )
        } else {
          return (
            <group key={key} position={el.pos} rotation={el.rotation}>
              {/* Octagonal/Hexagonal Tower Pillar */}
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[el.args[0] * 0.72, el.args[0], el.args[1], 6]} />
                <meshStandardMaterial color="#334155" roughness={0.9} flatShading />
              </mesh>
              {/* Conical Roof */}
              <mesh position={[0, el.args[1] / 2 + 1.6, 0]} castShadow>
                <coneGeometry args={[el.args[0] * 0.95, 3.8, 6]} />
                <meshStandardMaterial color="#b91c1c" roughness={0.7} flatShading />
              </mesh>
            </group>
          )
        }
      })}
    </group>
  )
}

// Enchanted Skill Tree representing a single portfolio skill
export function SkillTree({
  position,
  label,
  level,
}: {
  position: [number, number, number]
  label: string
  level: number
}) {
  const leafColor = useMemo(() => {
    // Select a magical color based on the characters in the skill name
    const colors = ["#a855f7", "#3b82f6", "#10b981", "#ec4899", "#f59e0b", "#14b8a6"]
    const charSum = label.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[charSum % colors.length]
  }, [label])

  // Normalize knowledge level percentage (between 30% and 100%) for scaling factor (0.3 to 1.0)
  const normFactor = useMemo(() => {
    const clamped = Math.max(30, Math.min(100, level))
    return clamped / 100
  }, [level])

  // Proportional dimensional properties
  const trunkHeight = 1.4 + normFactor * 1.4      // 1.4 units (young) up to 2.8 units (mighty tree)
  const trunkRadiusTop = 0.08 + normFactor * 0.12  // thickness scale
  const trunkRadiusBottom = 0.14 + normFactor * 0.16
  const foliageRadius = 0.5 + normFactor * 0.6     // foliage size scale

  // Position placements relative to custom height
  const foliageY = trunkHeight + foliageRadius * 0.4
  const signY = trunkHeight * 0.55
  const signZ = trunkRadiusTop + 0.12 // slight offset from trunk edge to hang cleanly

  return (
    <group position={position}>
      {/* Wooden Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[trunkRadiusTop, trunkRadiusBottom, trunkHeight, 5]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} flatShading />
      </mesh>

      {/* Magical Glowing Foliage */}
      <mesh position={[0, foliageY, 0]} castShadow>
        <dodecahedronGeometry args={[foliageRadius, 1]} />
        <meshStandardMaterial
          color={leafColor}
          roughness={0.7}
          flatShading
          emissive={leafColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Hanging Wooden Sign Board */}
      <group position={[0, signY, signZ]} rotation={[0, 0, 0]}>
        {/* Sign support ropes */}
        <mesh position={[-0.18, 0.2, -0.05]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.25, 4]} />
          <meshStandardMaterial color="#2d1500" />
        </mesh>
        <mesh position={[0.18, 0.2, -0.05]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.25, 4]} />
          <meshStandardMaterial color="#2d1500" />
        </mesh>

        {/* Wooden Board */}
        <mesh castShadow>
          <boxGeometry args={[0.82, 0.28, 0.08]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>

        {/* Skill Text */}
        <Text
          position={[0, 0.04, 0.05]}
          fontSize={0.085}
          color="#ffffff"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
        <Text
          position={[0, -0.08, 0.05]}
          fontSize={0.065}
          color="#ffe082"
          anchorX="center"
          anchorY="middle"
        >
          {`${level}%`}
        </Text>
      </group>
    </group>
  )
}

// Low-poly Grass Tuft for pathway borders
export function GrassTuft({ position, scale = 1.0 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Blade 1 (Vibrant Green) */}
      <mesh position={[-0.05, 0.2, 0]} rotation={[0.2, 0.1, 0.3]} castShadow>
        <boxGeometry args={[0.04, 0.4, 0.04]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} flatShading />
      </mesh>
      {/* Blade 2 (Medium Forest Green) */}
      <mesh position={[0.05, 0.25, 0.05]} rotation={[-0.1, -0.2, -0.2]} castShadow>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} flatShading />
      </mesh>
      {/* Blade 3 (Bright Light Green) */}
      <mesh position={[0, 0.15, -0.05]} rotation={[0.3, -0.3, 0.1]} castShadow>
        <boxGeometry args={[0.03, 0.3, 0.03]} />
        <meshStandardMaterial color="#4ade80" roughness={0.6} flatShading />
      </mesh>
    </group>
  )
}

// Decorative Temple
export function Temple({ position }: { position: [number, number, number] }) {
  const y = getIslandHeight(position[0], position[2])

  return (
    <group position={[position[0], y, position[2]]}>
      {/* Stone Foundation Base */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[14, 0.8, 10]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.9} flatShading />
      </mesh>
      
      {/* Steps to the temple */}
      <mesh position={[0, 0.2, 5.2]} receiveShadow castShadow>
        <boxGeometry args={[6, 0.4, 1.2]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.9} flatShading />
      </mesh>
      
      {/* Pillars (6 on front/back, 4 on sides) */}
      {[
        [-5.5, -3.5], [-3.3, -3.5], [-1.1, -3.5], [1.1, -3.5], [3.3, -3.5], [5.5, -3.5], // Back row
        [-5.5, 3.5], [-3.3, 3.5], [-1.1, 3.5], [1.1, 3.5], [3.3, 3.5], [5.5, 3.5], // Front row
        [-5.5, -1.2], [-5.5, 1.2], // Left side
        [5.5, -1.2], [5.5, 1.2], // Right side
      ].map((pos, i) => (
        <group key={`pillar-${i}`} position={[pos[0], 0.8, pos[1]]}>
          {/* Pillar base */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.8, 0.3, 0.8]} />
            <meshStandardMaterial color="#e4e4e7" roughness={0.8} />
          </mesh>
          {/* Pillar shaft */}
          <mesh position={[0, 2.3, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.35, 4.0, 8]} />
            <meshStandardMaterial color="#f4f4f5" roughness={0.7} flatShading />
          </mesh>
          {/* Pillar top (Capital) */}
          <mesh position={[0, 4.45, 0]} castShadow>
            <boxGeometry args={[0.9, 0.3, 0.9]} />
            <meshStandardMaterial color="#e4e4e7" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Architrave / Roof Base */}
      <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[14.5, 0.6, 10.5]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.9} flatShading />
      </mesh>

      {/* Triangular Pediment (Roof) */}
      <mesh position={[0, 6.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        {/* A pyramid stretched along X and Z to form a roof. 
            Standard cone has 4 sides if radialSegments=4, making a pyramid.
            To align it with the box, we rotate it by 45 degrees (PI/4). */}
        <coneGeometry args={[9, 2.2, 4]} />
        <meshStandardMaterial color="#a1a1aa" roughness={0.8} flatShading />
      </mesh>

      {/* Inner Chamber (Cella) */}
      <mesh position={[0, 2.8, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[8, 4.0, 5]} />
        <meshStandardMaterial color="#27272a" roughness={1.0} flatShading />
      </mesh>

      {/* Mysterious Glowing Orb inside */}
      <mesh position={[0, 2.5, -0.5]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ff99" emissiveIntensity={1.5} />
      </mesh>
      
      {/* Signboard */}
      <group position={[0, 0.5, 7.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.0, 6]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.0, 0.03]} castShadow>
          <boxGeometry args={[1.8, 0.45, 0.08]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        <Text position={[0, 1.0, 0.08]} fontSize={0.12} color="#ffffff" fontWeight="bold" anchorX="center" anchorY="middle">
          Purpose less building 
        </Text>
      </group>
    </group>
  )
}

// Decorative Pond
export function Pond({ position }: { position: [number, number, number] }) {
  // Use the edge height so the water surface aligns nicely inside the dip
  const edgeY = getIslandHeight(position[0] + 12, position[2])
  
  return (
    <group position={[position[0], edgeY, position[2]]}>
      {/* Water Surface */}
      <mesh position={[0, -0.4, 0]} rotation={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[10, 10, 0.1, 24]} />
        <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.3} transparent opacity={0.85} />
      </mesh>
      
      {/* Decorative Lilypads */}
      {[
        [2, 3], [-3, 4], [4, -2], [-5, -1], [1, -5], [6, 2], [-1, -6]
      ].map((pos, i) => (
        <group key={`lily-${i}`} position={[pos[0], -0.34, pos[1]]} rotation={[0, i * 1.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.5 + (i%3)*0.2, 0.5 + (i%3)*0.2, 0.05, 12]} />
            <meshStandardMaterial color="#4ade80" roughness={0.8} />
          </mesh>
          {/* Lilypad slit (a tiny cutout simulation) */}
          <mesh position={[0.3, 0.02, 0]}>
             <boxGeometry args={[0.4, 0.06, 0.1]} />
             <meshStandardMaterial color="#0284c7" />
          </mesh>
        </group>
      ))}

      {/* Edge Rocks */}
      {[...Array(14)].map((_, i) => {
         const angle = (i / 14) * Math.PI * 2
         const r = 10.2 + (i % 2) * 0.8
         return (
           <mesh key={`rock-${i}`} position={[Math.cos(angle)*r, -0.1, Math.sin(angle)*r]} rotation={[i, i*0.5, i*1.2]} castShadow>
             <dodecahedronGeometry args={[0.7 + (i%3) * 0.3, 0]} />
             <meshStandardMaterial color="#9ca3af" roughness={0.9} flatShading />
           </mesh>
         )
      })}
    </group>
  )
}

// Decorative Windmill
export function Windmill({ position }: { position: [number, number, number] }) {
  const y = getIslandHeight(position[0], position[2])
  const bladesRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z = state.clock.getElapsedTime() * -0.5
    }
  })

  return (
    <group position={[position[0], y, position[2]]}>
      {/* Tower Base */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 2.0, 5, 8]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} flatShading />
      </mesh>
      {/* Wooden Roof */}
      <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 1.5, 8]} />
        <meshStandardMaterial color="#783f04" roughness={0.9} flatShading />
      </mesh>
      {/* Rotor Hub */}
      <mesh position={[0, 4.5, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 8]} />
        <meshStandardMaterial color="#3e2723" />
      </mesh>
      {/* Blades */}
      <group ref={bladesRef} position={[0, 4.5, 1.5]}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
             <mesh position={[0, 1.8, 0]}>
               <boxGeometry args={[0.2, 3.2, 0.05]} />
               <meshStandardMaterial color="#4e342e" />
             </mesh>
             {/* Sail cloth */}
             <mesh position={[0.3, 2.0, -0.02]}>
               <boxGeometry args={[0.5, 2.8, 0.02]} />
               <meshStandardMaterial color="#f8fafc" />
             </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

// Decorative Campfire Site
export function CampfireSite({ position }: { position: [number, number, number] }) {
  const y = getIslandHeight(position[0], position[2])
  return (
    <group position={[position[0], y, position[2]]}>
       {/* Fire Ring */}
       {[...Array(8)].map((_, i) => (
         <mesh key={i} position={[Math.cos((i/8)*Math.PI*2)*0.6, 0.1, Math.sin((i/8)*Math.PI*2)*0.6]} castShadow>
           <dodecahedronGeometry args={[0.15, 0]} />
           <meshStandardMaterial color="#71717a" roughness={0.9} flatShading />
         </mesh>
       ))}
       {/* Logs */}
       <mesh position={[0, 0.1, 0]} rotation={[0, 0.4, Math.PI / 2]}>
         <cylinderGeometry args={[0.06, 0.06, 0.7]} />
         <meshStandardMaterial color="#3e2723" />
       </mesh>
       <mesh position={[0, 0.1, 0]} rotation={[0, -0.4, Math.PI / 2]}>
         <cylinderGeometry args={[0.06, 0.06, 0.7]} />
         <meshStandardMaterial color="#3e2723" />
       </mesh>
       {/* Fire Glow */}
       <mesh position={[0, 0.3, 0]}>
         <dodecahedronGeometry args={[0.2, 0]} />
         <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={2.0} />
       </mesh>
       <pointLight position={[0, 0.5, 0]} color="#fb923c" intensity={4} distance={6} decay={2} />
       {/* Log Benches */}
       <mesh position={[0, 0.2, 1.5]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
         <cylinderGeometry args={[0.2, 0.2, 1.5]} />
         <meshStandardMaterial color="#5d4037" />
       </mesh>
       <mesh position={[0, 0.2, -1.5]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
         <cylinderGeometry args={[0.2, 0.2, 1.5]} />
         <meshStandardMaterial color="#5d4037" />
       </mesh>
    </group>
  )
}

// Stonehenge / Mystic Ruins
export function MysticRuins({ position }: { position: [number, number, number] }) {
  const y = getIslandHeight(position[0], position[2])
  return (
    <group position={[position[0], y, position[2]]}>
      {[...Array(6)].map((_, i) => {
         const angle = (i/6)*Math.PI*2
         const r = 4.0
         return (
           <group key={i} position={[Math.cos(angle)*r, 0, Math.sin(angle)*r]} rotation={[0, -angle, 0]}>
             <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
               <boxGeometry args={[0.8, 3.0, 0.6]} />
               <meshStandardMaterial color="#71717a" roughness={0.9} />
             </mesh>
             {/* Lintel (connecting to next pillar optionally) */}
             {i % 2 === 0 && (
               <mesh position={[0.7, 3.2, 1.8]} rotation={[0, Math.PI/3, 0]} castShadow receiveShadow>
                 <boxGeometry args={[0.6, 0.5, 4.2]} />
                 <meshStandardMaterial color="#71717a" roughness={0.9} />
               </mesh>
             )}
           </group>
         )
      })}
    </group>
  )
}

// Procedural Rain Particle System
export function Rain({ isNight }: { isNight: boolean }) {
  const count = 4000
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Scatter over a large 250x250 area
      pos[i * 3] = (Math.random() - 0.5) * 250
      pos[i * 3 + 1] = Math.random() * 80 // Height
      pos[i * 3 + 2] = (Math.random() - 0.5) * 250
      spd[i] = 0.5 + Math.random() * 0.5 // Fall speed
    }
    return [pos, spd]
  }, [count])

  useFrame(() => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position
    const pos = posAttr.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i]
      // Loop back to top
      if (pos[i * 3 + 1] < -2) {
        pos[i * 3 + 1] = 80
        pos[i * 3] = (Math.random() - 0.5) * 250
        pos[i * 3 + 2] = (Math.random() - 0.5) * 250
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={isNight ? "#60a5fa" : "#93c5fd"} size={0.3} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Low-poly Procedural Clouds
export function Clouds({ weather, isNight }: { weather: string, isNight: boolean }) {
  const cloudsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (cloudsRef.current) {
      // Slowly rotate the entire cloud layer to simulate wind
      cloudsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02
    }
  })

  // Colors based on weather and time
  let color = "#ffffff"
  if (weather === 'rainy') color = isNight ? "#1e293b" : "#64748b"
  else if (weather === 'foggy') color = isNight ? "#334155" : "#94a3b8"
  else if (isNight) color = "#cbd5e1"

  // Generate random cloud clusters
  const clusters = useMemo(() => {
     const arr = []
     for(let i=0; i<25; i++) {
        const angle = Math.random() * Math.PI * 2
        // Spread clouds across the sky
        const radius = 30 + Math.random() * 150
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = 60 + Math.random() * 30 // High up in the sky
        const scale = 1.5 + Math.random() * 3.5
        arr.push({ pos: [x, y, z], scale })
     }
     return arr
  }, [])

  return (
    <group ref={cloudsRef}>
      {clusters.map((c, i) => (
        <group key={i} position={c.pos as [number,number,number]} scale={[c.scale, c.scale, c.scale]}>
           {/* Cloud blobs constructed from intersecting low-poly spheres */}
           <mesh position={[0, 0, 0]} castShadow>
             <dodecahedronGeometry args={[2.0, 0]} />
             <meshStandardMaterial color={color} roughness={1.0} flatShading />
           </mesh>
           <mesh position={[1.5, -0.5, 0.5]} castShadow>
             <dodecahedronGeometry args={[1.5, 0]} />
             <meshStandardMaterial color={color} roughness={1.0} flatShading />
           </mesh>
           <mesh position={[-1.2, -0.2, -0.8]} castShadow>
             <dodecahedronGeometry args={[1.8, 0]} />
             <meshStandardMaterial color={color} roughness={1.0} flatShading />
           </mesh>
           <mesh position={[0.5, 0.8, -1.0]} castShadow>
             <dodecahedronGeometry args={[1.2, 0]} />
             <meshStandardMaterial color={color} roughness={1.0} flatShading />
           </mesh>
        </group>
      ))}
    </group>
  )
}

// Decorative Farming Land
export function FarmingLand({ position }: { position: [number, number, number] }) {
  const y = getIslandHeight(position[0], position[2])

  return (
    <group position={[position[0], y, position[1]]}>
      {/* Plowed Soil Patch */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[12, 0.12, 10]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.95} flatShading />
      </mesh>

      {/* Plowed Rows (6 rows of dark soil ridges) */}
      {[-3.5, -2.1, -0.7, 0.7, 2.1, 3.5].map((zOff, i) => (
        <mesh key={`row-${i}`} position={[0, 0.18, zOff]} receiveShadow>
          <boxGeometry args={[10.5, 0.12, 0.5]} />
          <meshStandardMaterial color="#4a2f1e" roughness={1.0} flatShading />
        </mesh>
      ))}

      {/* Crops — tiny green cone plants on each row */}
      {[-3.5, -2.1, -0.7, 0.7, 2.1, 3.5].map((zOff, rowIdx) =>
        [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((xOff, colIdx) => {
          const cropHeight = 0.25 + Math.sin(rowIdx * 3 + colIdx * 7) * 0.1
          const cropColor = (rowIdx + colIdx) % 3 === 0 ? "#e6b800" : (rowIdx + colIdx) % 3 === 1 ? "#22c55e" : "#16a34a"
          return (
            <mesh key={`crop-${rowIdx}-${colIdx}`} position={[xOff, 0.24 + cropHeight / 2, zOff]} castShadow>
              <coneGeometry args={[0.12, cropHeight, 4]} />
              <meshStandardMaterial color={cropColor} roughness={0.8} flatShading />
            </mesh>
          )
        })
      )}

      {/* Wooden Fence (perimeter) */}
      {/* Front fence */}
      <mesh position={[0, 0.35, -5.2]} castShadow>
        <boxGeometry args={[12.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.55, -5.2]} castShadow>
        <boxGeometry args={[12.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.9} />
      </mesh>
      {/* Back fence */}
      <mesh position={[0, 0.35, 5.2]} castShadow>
        <boxGeometry args={[12.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.55, 5.2]} castShadow>
        <boxGeometry args={[12.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.9} />
      </mesh>
      {/* Left fence */}
      <mesh position={[-6.2, 0.35, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 10.5]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.9} />
      </mesh>
      <mesh position={[-6.2, 0.55, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 10.5]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.9} />
      </mesh>
      {/* Right fence */}
      <mesh position={[6.2, 0.35, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 10.5]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.9} />
      </mesh>
      <mesh position={[6.2, 0.55, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 10.5]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.9} />
      </mesh>

      {/* Fence Posts */}
      {[-6.2, -3, 0, 3, 6.2].map((xp, i) => (
        <React.Fragment key={`fp-f-${i}`}>
          <mesh position={[xp, 0.4, -5.2]} castShadow>
            <boxGeometry args={[0.15, 0.8, 0.15]} />
            <meshStandardMaterial color="#6d4c41" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[xp, 0.4, 5.2]} castShadow>
            <boxGeometry args={[0.15, 0.8, 0.15]} />
            <meshStandardMaterial color="#6d4c41" roughness={0.9} flatShading />
          </mesh>
        </React.Fragment>
      ))}

      {/* Scarecrow */}
      <group position={[4.5, 0, -2]}>
        {/* Pole */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.8, 6]} />
          <meshStandardMaterial color="#5c4033" roughness={0.95} />
        </mesh>
        {/* Cross-arm */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[1.2, 0.08, 0.08]} />
          <meshStandardMaterial color="#5c4033" roughness={0.95} />
        </mesh>
        {/* Head (pumpkin-like) */}
        <mesh position={[0, 1.9, 0]} castShadow>
          <sphereGeometry args={[0.2, 6, 6]} />
          <meshStandardMaterial color="#e8a035" roughness={0.8} flatShading />
        </mesh>
        {/* Hat */}
        <mesh position={[0, 2.1, 0]} castShadow>
          <coneGeometry args={[0.25, 0.3, 6]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} flatShading />
        </mesh>
        {/* Hat brim */}
        <mesh position={[0, 1.97, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.04, 8]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* Water Trough */}
      <group position={[-5, 0, -3.5]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[1.4, 0.5, 0.7]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.9} flatShading />
        </mesh>
        {/* Water inside */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.2, 0.1, 0.5]} />
          <meshStandardMaterial color="#5b9bd5" roughness={0.3} metalness={0.2} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Signboard */}
      <group position={[0, 0, -6]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.0, 6]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.0, 0.03]} castShadow>
          <boxGeometry args={[1.8, 0.45, 0.08]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        <Text position={[0, 1.0, 0.08]} fontSize={0.12} color="#ffffff" fontWeight="bold" anchorX="center" anchorY="middle">
          Farm
        </Text>
      </group>
    </group>
  )
}

// Decorative Playground
export function Playground({ position }: { position: [number, number, number] }) {
  const y = getIslandHeight(position[0], position[2])

  return (
    <group position={[position[0], y, position[2]]}>
      {/* Ground Pad (flat green mat) */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[7, 7, 0.04, 12]} />
        <meshStandardMaterial color="#4caf50" roughness={0.9} flatShading />
      </mesh>

      {/* Swing Set */}
      <group position={[-3, 0, 0]}>
        {/* Left upright post */}
        <mesh position={[-1.2, 1.6, 0]} castShadow>
          <boxGeometry args={[0.12, 3.2, 0.12]} />
          <meshStandardMaterial color="#f44336" roughness={0.7} metalness={0.3} flatShading />
        </mesh>
        {/* Right upright post */}
        <mesh position={[1.2, 1.6, 0]} castShadow>
          <boxGeometry args={[0.12, 3.2, 0.12]} />
          <meshStandardMaterial color="#f44336" roughness={0.7} metalness={0.3} flatShading />
        </mesh>
        {/* Cross bar */}
        <mesh position={[0, 3.2, 0]} castShadow>
          <boxGeometry args={[2.6, 0.12, 0.12]} />
          <meshStandardMaterial color="#ff9800" roughness={0.6} metalness={0.4} flatShading />
        </mesh>
        {/* Swing 1 - chains */}
        <mesh position={[-0.4, 2.0, 0]} castShadow>
          <boxGeometry args={[0.03, 2.4, 0.03]} />
          <meshStandardMaterial color="#9e9e9e" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Swing 1 - seat */}
        <mesh position={[-0.4, 0.7, 0]} castShadow>
          <boxGeometry args={[0.5, 0.06, 0.25]} />
          <meshStandardMaterial color="#2196f3" roughness={0.7} flatShading />
        </mesh>
        {/* Swing 2 - chains */}
        <mesh position={[0.4, 2.0, 0]} castShadow>
          <boxGeometry args={[0.03, 2.4, 0.03]} />
          <meshStandardMaterial color="#9e9e9e" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Swing 2 - seat */}
        <mesh position={[0.4, 0.7, 0]} castShadow>
          <boxGeometry args={[0.5, 0.06, 0.25]} />
          <meshStandardMaterial color="#ff5722" roughness={0.7} flatShading />
        </mesh>
      </group>

      {/* Slide */}
      <group position={[3, 0, -1]}>
        {/* Ladder uprights */}
        <mesh position={[-0.3, 1.3, -0.8]} castShadow>
          <boxGeometry args={[0.1, 2.6, 0.1]} />
          <meshStandardMaterial color="#4caf50" roughness={0.7} metalness={0.3} flatShading />
        </mesh>
        <mesh position={[0.3, 1.3, -0.8]} castShadow>
          <boxGeometry args={[0.1, 2.6, 0.1]} />
          <meshStandardMaterial color="#4caf50" roughness={0.7} metalness={0.3} flatShading />
        </mesh>
        {/* Ladder rungs */}
        {[0.4, 0.8, 1.2, 1.6, 2.0].map((ly, i) => (
          <mesh key={`rung-${i}`} position={[0, ly, -0.8]} castShadow>
            <boxGeometry args={[0.7, 0.06, 0.06]} />
            <meshStandardMaterial color="#9e9e9e" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
        {/* Platform on top */}
        <mesh position={[0, 2.55, -0.5]} castShadow>
          <boxGeometry args={[1.0, 0.1, 0.8]} />
          <meshStandardMaterial color="#4caf50" roughness={0.7} flatShading />
        </mesh>
        {/* Slide surface (angled ramp) */}
        <mesh position={[0, 1.3, 0.6]} rotation={[-0.65, 0, 0]} castShadow>
          <boxGeometry args={[0.7, 3.1, 0.06]} />
          <meshStandardMaterial color="#ffc107" roughness={0.4} metalness={0.5} flatShading />
        </mesh>
        {/* Slide rails */}
        <mesh position={[-0.4, 1.3, 0.6]} rotation={[-0.65, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 3.1, 0.2]} />
          <meshStandardMaterial color="#ff9800" roughness={0.6} metalness={0.4} flatShading />
        </mesh>
        <mesh position={[0.4, 1.3, 0.6]} rotation={[-0.65, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 3.1, 0.2]} />
          <meshStandardMaterial color="#ff9800" roughness={0.6} metalness={0.4} flatShading />
        </mesh>
      </group>

      {/* Sandbox */}
      <group position={[1, 0, 3.5]}>
        {/* Sand box border */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <boxGeometry args={[2.5, 0.25, 2.5]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.9} flatShading />
        </mesh>
        {/* Sand fill */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[2.2, 0.15, 2.2]} />
          <meshStandardMaterial color="#f0d98c" roughness={1.0} flatShading />
        </mesh>
      </group>

      {/* Seesaw */}
      <group position={[-2, 0, 3]}>
        {/* Fulcrum */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <coneGeometry args={[0.3, 0.5, 4]} />
          <meshStandardMaterial color="#9e9e9e" roughness={0.6} metalness={0.5} flatShading />
        </mesh>
        {/* Board */}
        <mesh position={[0, 0.48, 0]} rotation={[0, 0, 0.12]} castShadow>
          <boxGeometry args={[3, 0.08, 0.4]} />
          <meshStandardMaterial color="#e91e63" roughness={0.7} flatShading />
        </mesh>
        {/* Handle left */}
        <mesh position={[-1.3, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 6]} />
          <meshStandardMaterial color="#9e9e9e" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Handle right */}
        <mesh position={[1.3, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 6]} />
          <meshStandardMaterial color="#9e9e9e" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Signboard */}
      <group position={[0, 1.5, -7.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.0, 6]} />
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.0, 0.03]} castShadow>
          <boxGeometry args={[1.8, 0.45, 0.08]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.85} flatShading />
        </mesh>
        <Text position={[0, 1.0, 0.08]} fontSize={0.12} color="#ffffff" fontWeight="bold" anchorX="center" anchorY="middle">
          Playground
        </Text>
      </group>
    </group>
  )
}

// Spawn Arch (Welcome to my portfolio island) at spawn point
export function SpawnArch() {
  const y = getIslandHeight(0, 9)
  return (
    <group position={[0, y, 9]} rotation={[0, 0, 0]}>
      {/* Left Pillar */}
      <group position={[-2.6, 0, 0]}>
        {/* Base */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.8, 0.9]} />
          <meshStandardMaterial color="#4e342e" roughness={0.9} flatShading />
        </mesh>
        {/* Middle Columns (stacked cylinders with some rotation for cartoon feel) */}
        <mesh position={[0, 1.6, 0]} rotation={[0.04, 0.08, -0.04]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.35, 1.6, 6]} />
          <meshStandardMaterial color="#5d4037" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0, 2.8, 0]} rotation={[-0.03, -0.04, 0.03]} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.31, 1.2, 5]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.8} flatShading />
        </mesh>
        {/* Capital */}
        <mesh position={[0, 3.55, 0]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.8]} />
          <meshStandardMaterial color="#4e342e" roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* Right Pillar */}
      <group position={[2.6, 0, 0]}>
        {/* Base */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.8, 0.9]} />
          <meshStandardMaterial color="#4e342e" roughness={0.9} flatShading />
        </mesh>
        {/* Middle Columns */}
        <mesh position={[0, 1.6, 0]} rotation={[-0.04, -0.08, 0.04]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.35, 1.6, 6]} />
          <meshStandardMaterial color="#5d4037" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0, 2.8, 0]} rotation={[0.03, 0.04, -0.03]} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.31, 1.2, 5]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.8} flatShading />
        </mesh>
        {/* Capital */}
        <mesh position={[0, 3.55, 0]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.8]} />
          <meshStandardMaterial color="#4e342e" roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* Crossbar / Lintel */}
      <mesh position={[0, 3.9, 0]} castShadow>
        <boxGeometry args={[6.0, 0.5, 0.7]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} flatShading />
      </mesh>
      
      {/* Decorative center shield / crown */}
      <mesh position={[0, 4.3, 0.05]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.2]} />
        <meshStandardMaterial color="#ffd54f" roughness={0.5} flatShading />
      </mesh>

      {/* Signboard Board (Hanging below the crossbar) */}
      <group position={[0, 2.9, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[4.4, 1.0, 0.15]} />
          <meshStandardMaterial color="#d7ccc8" roughness={0.85} flatShading />
        </mesh>
        {/* Border frame */}
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[4.5, 1.1, 0.04]} />
          <meshStandardMaterial color="#4e342e" />
        </mesh>
        
        {/* Hanging ropes/chains */}
        <mesh position={[-1.6, 0.7, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6]} />
          <meshStandardMaterial color="#212121" roughness={0.9} />
        </mesh>
        <mesh position={[1.6, 0.7, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6]} />
          <meshStandardMaterial color="#212121" roughness={0.9} />
        </mesh>

        {/* Text facing the player spawning at Z = 5 looking in +Z direction (facing -Z) */}
        <Text
          position={[0, 0, -0.09]}
          fontSize={0.24}
          color="#3e2723"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI, 0]}
        >
          Welcome to my portfolio island
        </Text>

        {/* Text facing the other direction (+Z) */}
        <Text
          position={[0, 0, 0.09]}
          fontSize={0.24}
          color="#3e2723"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, 0]}
        >
          Welcome to my portfolio island
        </Text>
      </group>
    </group>
  )
}

