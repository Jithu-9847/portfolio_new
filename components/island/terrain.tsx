"use client"

import React, { useMemo, useRef, useEffect } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

// Winding paths from center [0,0] to each of the 10 zones
export const PATHS: Record<string, [number, number][]> = {
  about: [[0, 0], [-30, 20], [-60, 10], [-80, 50]],
  skills: [[0, 0], [20, 30], [40, 50], [60, 80]],
  projects: [[0, 0], [-20, -30], [-40, -60], [-50, -90]],
  experience: [[0, 0], [30, -20], [60, -40], [90, -70]],
  education: [[0, 0], [-30, -10], [-60, -30], [-90, -40]],
  achievements: [[0, 0], [10, -30], [-10, -65], [0, -95], [10, -120]],
  resume: [[0, 0], [-15, 40], [15, 80], [0, 110]],
  contact: [[0, 0], [40, 20], [70, 45], [110, 60]],
  tech: [[0, 0], [-40, 0], [-80, 20], [-110, 10]],
  socials: [[0, 0], [20, 40], [10, 80], [40, 120]],
}

// Helper: Distance from a point to a line segment
export function distToSegmentWithPoint(
  px: number, pz: number,
  ax: number, az: number,
  bx: number, bz: number
): { dist: number; point: [number, number] } {
  const dx = bx - ax
  const dz = bz - az
  const l2 = dx * dx + dz * dz
  if (l2 === 0) return { dist: Math.sqrt((px - ax) ** 2 + (pz - az) ** 2), point: [ax, az] }
  let t = ((px - ax) * dx + (pz - az) * dz) / l2
  t = Math.max(0, Math.min(1, t))
  const projX = ax + t * dx
  const projZ = az + t * dz
  return {
    dist: Math.sqrt((px - projX) ** 2 + (pz - projZ) ** 2),
    point: [projX, projZ],
  }
}

// Find closest path, distance, and projected point
export function getDistanceToPathsWithPoint(x: number, z: number) {
  let minDistance = Infinity
  let closestPoint: [number, number] = [0, 0]
  let closestZone = ""

  for (const [zoneId, points] of Object.entries(PATHS)) {
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i]
      const p2 = points[i + 1]
      const { dist, point } = distToSegmentWithPoint(x, z, p1[0], p1[1], p2[0], p2[1])
      if (dist < minDistance) {
        minDistance = dist
        closestPoint = point
        closestZone = zoneId
      }
    }
  }

  return { distance: minDistance, closestPoint, zoneId: closestZone }
}

// Pseudo-random hash for value noise
function hash2d(x: number, z: number) {
  const sx = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453123
  return sx - Math.floor(sx)
}

// 2D Value Noise
function noise2d(x: number, z: number) {
  const ix = Math.floor(x)
  const iz = Math.floor(z)
  const fx = x - ix
  const fz = z - iz

  const ux = fx * fx * (3.0 - 2.0 * fx)
  const uz = fz * fz * (3.0 - 2.0 * fz)

  const a = hash2d(ix, iz)
  const b = hash2d(ix + 1, iz)
  const c = hash2d(ix, iz + 1)
  const d = hash2d(ix + 1, iz + 1)

  return a * (1 - ux) * (1 - uz) +
         b * ux * (1 - uz) +
         c * (1 - ux) * uz +
         d * ux * uz
}

// Fractional Brownian Motion (fBm) noise
function fbm(x: number, z: number, octaves = 4) {
  let value = 0.0
  let amplitude = 0.5
  let frequency = 1.0
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2d(x * frequency, z * frequency)
    amplitude *= 0.5
    frequency *= 2.0
  }
  return value
}

// Calculate base height (before path carving)
export function getBaseHeight(x: number, z: number): number {
  const d = Math.sqrt(x * x + z * z)
  if (d > 185) return -20.0 // deep ocean floor

  // Smooth island mask
  const mask = Math.pow(Math.max(0, 1 - d / 185), 1.2)

  // Base landscape
  const baseNoise = fbm(x * 0.007, z * 0.007, 4)
  let h = (baseNoise * 42 - 8) * mask // heights between -8 and +34

  // Mountain Peak (Achievements)
  const distToPeak = Math.sqrt((x - 10) ** 2 + (z + 120) ** 2)
  if (distToPeak < 65) {
    const peakInfluence = Math.pow(Math.max(0, 1 - distToPeak / 65), 1.6)
    h += peakInfluence * 55 // huge peak scaling up to ~75 height
  }

  // Lighthouse Cliff (Contact)
  const distToLighthouse = Math.sqrt((x - 110) ** 2 + (z - 60) ** 2)
  if (distToLighthouse < 45) {
    const cliffInfluence = Math.pow(Math.max(0, 1 - distToLighthouse / 45), 1.2)
    h += cliffInfluence * 10 // lowered lighthouse cliff
  }

  // Waterfall Cliff (Experience)
  const distToExperience = Math.sqrt((x - 90) ** 2 + (z + 70) ** 2)
  if (distToExperience < 40) {
    const expInfluence = Math.pow(Math.max(0, 1 - distToExperience / 40), 1.5)
    h += expInfluence * 15
  }

  // Ocean floor adjustment
  if (h < -4) {
    h = -4 + (h + 4) * 0.4
  }

  return h
}

// Final height including path carving
export function getIslandHeight(x: number, z: number): number {
  let baseHeight = getBaseHeight(x, z)

  // Flatten the Experience zone plateau (originally a waterfall/cliff) so the blacksmith workshop sits flat
  const distToExperience = Math.sqrt((x - 90) ** 2 + (z + 70) ** 2)
  if (distToExperience < 11) {
    const targetH = getBaseHeight(90, -70)
    const t = distToExperience / 11 // 0 at center, 1 at edge
    const smoothT = t * t * (3 - 2 * t)
    baseHeight = smoothT * baseHeight + (1 - smoothT) * targetH
  }

  // Flatten the About zone (Botanical Garden) so the grand garden sits flat
  const distToAbout = Math.sqrt((x - (-80)) ** 2 + (z - 50) ** 2)
  if (distToAbout < 13) {
    const targetH = getBaseHeight(-80, 50)
    const t = distToAbout / 13 // 0 at center, 1 at edge
    const smoothT = t * t * (3 - 2 * t)
    baseHeight = smoothT * baseHeight + (1 - smoothT) * targetH
  }

  // Flatten the Lighthouse zone (Contact) so the lighthouse base sits flat
  const distToLighthousePlatform = Math.sqrt((x - 110) ** 2 + (z - 60) ** 2)
  if (distToLighthousePlatform < 8) {
    const targetH = getBaseHeight(110, 60)
    const t = distToLighthousePlatform / 8
    const smoothT = t * t * (3 - 2 * t)
    baseHeight = smoothT * baseHeight + (1 - smoothT) * targetH
  }

  // Flatten the Farming Land area so the plowed field sits flat
  const distToFarm = Math.sqrt((x - 60) ** 2 + (z - 15) ** 2)
  if (distToFarm < 10) {
    const targetH = getBaseHeight(60, 15)
    const t = distToFarm / 10
    const smoothT = t * t * (3 - 2 * t)
    baseHeight = smoothT * baseHeight + (1 - smoothT) * targetH
  }

  // Flatten the Playground area so the equipment sits flat
  const distToPlayground = Math.sqrt((x - (-90)) ** 2 + (z - (-60)) ** 2)
  if (distToPlayground < 9) {
    const targetH = getBaseHeight(-90, -60)
    const t = distToPlayground / 9
    const smoothT = t * t * (3 - 2 * t)
    baseHeight = smoothT * baseHeight + (1 - smoothT) * targetH
  }

  // Flatten the Temple area so it sits flat
  const distToTemple = Math.sqrt((x - (-45)) ** 2 + (z - 45) ** 2)
  if (distToTemple < 10) {
    const targetH = getBaseHeight(-45, 45)
    const t = distToTemple / 10
    const smoothT = t * t * (3 - 2 * t)
    baseHeight = smoothT * baseHeight + (1 - smoothT) * targetH
  }

  // Create a dip for the Pond area
  const distToPond = Math.sqrt((x - 45) ** 2 + (z - (-45)) ** 2)
  if (distToPond < 12) {
    const targetH = getBaseHeight(45, -45)
    // The pond edge will be flat, but the inner part will dip down
    const t = distToPond / 12
    const smoothT = t * t * (3 - 2 * t)
    
    // Dip is deeper at the center (t=0)
    const dipDepth = Math.max(0, 1.8 * (1 - t * 1.5))
    const pondFloorHeight = targetH - dipDepth
    
    baseHeight = smoothT * baseHeight + (1 - smoothT) * pondFloorHeight
  }

  // Flatten the Windmill area so it sits flat
  const distToWindmill = Math.sqrt((x - 70) ** 2 + (z - (-20)) ** 2)
  if (distToWindmill < 8) {
    const targetH = getBaseHeight(70, -20)
    const t = distToWindmill / 8
    const smoothT = t * t * (3 - 2 * t)
    baseHeight = smoothT * baseHeight + (1 - smoothT) * targetH
  }

  // Flatten the Mystic Ruins area so it sits flat
  const distToRuins = Math.sqrt((x - (-70)) ** 2 + (z - (-10)) ** 2)
  if (distToRuins < 10) {
    const targetH = getBaseHeight(-70, -10)
    const t = distToRuins / 10
    const smoothT = t * t * (3 - 2 * t)
    baseHeight = smoothT * baseHeight + (1 - smoothT) * targetH
  }

  // Flatten the Campfire Site area so it sits flat
  const distToCampfire = Math.sqrt((x - 20) ** 2 + (z - (-80)) ** 2)
  if (distToCampfire < 7) {
    const targetH = getBaseHeight(20, -80)
    const t = distToCampfire / 7
    const smoothT = t * t * (3 - 2 * t)
    baseHeight = smoothT * baseHeight + (1 - smoothT) * targetH
  }

  const { distance, closestPoint } = getDistanceToPathsWithPoint(x, z)

  // Smooth flattening on paths
  if (distance < 5.0) {
    const pathBaseHeight = getBaseHeight(closestPoint[0], closestPoint[1])
    const t = distance / 5.0 // 0 = center of path, 1 = edge
    
    // Interpolate heights
    let height = t * baseHeight + (1 - t) * pathBaseHeight
    // Indent path slightly for realistic gravel trail look
    height -= (1 - t) * 0.25
    return height
  }

  return baseHeight
}

// Generate vertex color based on height, slope, and paths
export function getTerrainColor(x: number, y: number, z: number): THREE.Color {
  const color = new THREE.Color()
  const { distance } = getDistanceToPathsWithPoint(x, z)

  if (y < -2.2) {
    // Underwater bed color
    color.setRGB(0.22, 0.28, 0.25)
  } else if (y < 0.6) {
    // Shore sand
    color.setRGB(0.88, 0.81, 0.64)
  } else if (distance < 2.5 && y < 35) {
    // Winding path gravel color
    const t = Math.max(0, distance / 2.5)
    // Blend path brown and grass green
    const r = 0.52 * (1 - t) + 0.3 * t
    const g = 0.43 * (1 - t) + 0.46 * t
    const b = 0.33 * (1 - t) + 0.25 * t
    color.setRGB(r, g, b)
  } else {
    // Vegetation/Rock/Snow
    if (y > 45) {
      // Snowy mountain tops
      color.setRGB(0.96, 0.96, 0.98)
    } else if (y > 22) {
      // Mountain rocks
      const n = hash2d(Math.floor(x * 1.5), Math.floor(z * 1.5)) * 0.08
      color.setRGB(0.46 + n, 0.46 + n, 0.48 + n)
    } else {
      // Grass fields
      const n = hash2d(Math.floor(x * 0.4), Math.floor(z * 0.4)) * 0.06
      color.setRGB(0.3 + n, 0.48 + n, 0.26 + n)
    }
  }

  return color
}

// Terrain geometry config
const GRID_SIZE = 180
const WORLD_SIZE = 400

export function Terrain() {
  const geomRef = useRef<THREE.BufferGeometry>(null)

  const { positionArray, colorArray, indexArray } = useMemo(() => {
    const halfSize = WORLD_SIZE / 2
    const step = WORLD_SIZE / GRID_SIZE

    const positions: number[] = []
    const colors: number[] = []

    for (let i = 0; i <= GRID_SIZE; i++) {
      const z = -halfSize + i * step
      for (let j = 0; j <= GRID_SIZE; j++) {
        const x = -halfSize + j * step
        const y = getIslandHeight(x, z)
        positions.push(x, y, z)

        const col = getTerrainColor(x, y, z)
        colors.push(col.r, col.g, col.b)
      }
    }

    const indices: number[] = []
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const row1 = i * (GRID_SIZE + 1)
        const row2 = (i + 1) * (GRID_SIZE + 1)

        const a = row1 + j
        const b = row1 + j + 1
        const c = row2 + j
        const d = row2 + j + 1

        // Triangle 1
        indices.push(a, c, b)
        // Triangle 2
        indices.push(b, c, d)
      }
    }

    return {
      positionArray: new Float32Array(positions),
      colorArray: new Float32Array(colors),
      indexArray: new Uint32Array(indices),
    }
  }, [])

  return (
    <group>
      {/* Visual Terrain Mesh */}
      <mesh receiveShadow castShadow>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[positionArray, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colorArray, 3]}
          />
          <bufferAttribute
            attach="index"
            args={[indexArray, 1]}
          />
        </bufferGeometry>
        <meshStandardMaterial
          vertexColors
          flatShading
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      {/* Animated Grass Field */}
      <GrassField />
    </group>
  )
}

export function GrassField() {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const grassData = useMemo(() => {
    const temp: { x: number; y: number; z: number; scale: number; rotY: number; windOffset: number }[] = []
    const count = 5000

    // Seeded random function for consistent grass placement
    let seed = 98765
    function random() {
      const x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }

    for (let i = 0; i < 30000; i++) {
      if (temp.length >= count) break

      const rx = (random() - 0.5) * 280
      const rz = (random() - 0.5) * 280
      const ry = getIslandHeight(rx, rz)

      // Only spawn on grassy elevations and away from paths
      if (ry >= 0.8 && ry <= 18) {
        const { distance } = getDistanceToPathsWithPoint(rx, rz)
        if (distance >= 2.5) {
          const scale = 0.55 + random() * 0.65
          const rotY = random() * Math.PI * 2
          const windOffset = random() * 50
          temp.push({ x: rx, y: ry, z: rz, scale, rotY, windOffset })
        }
      }
    }
    return temp
  }, [])

  const tempObject = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()

    grassData.forEach((grass, i) => {
      const { x, y, z, scale, rotY, windOffset } = grass

      tempObject.position.set(x, y - 0.02, z) // Slightly insert into terrain to ground the base

      // Natural waving motion
      const swayX = Math.sin(time * 1.6 + windOffset) * 0.06
      const swayZ = Math.cos(time * 1.3 + windOffset) * 0.05

      tempObject.rotation.set(swayX, rotY, swayZ)
      tempObject.scale.set(scale, scale, scale)

      tempObject.updateMatrix()
      meshRef.current!.setMatrixAt(i, tempObject.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  useEffect(() => {
    if (!meshRef.current) return
    const color = new THREE.Color()
    grassData.forEach((grass, i) => {
      // Natural HSL color variance (greens, lime greens, forest greens)
      const rand = Math.sin(i * 12.34) * 0.5 + 0.5
      if (rand < 0.3) {
        color.setHSL(0.26 + rand * 0.04, 0.75, 0.28) // deep grass green
      } else if (rand < 0.7) {
        color.setHSL(0.30 + rand * 0.05, 0.80, 0.38) // bright lawn green
      } else {
        color.setHSL(0.24 + rand * 0.06, 0.70, 0.32) // olive forest green
      }
      meshRef.current!.setColorAt(i, color)
    })
    meshRef.current.instanceColor!.needsUpdate = true
  }, [grassData])

  return (
    <instancedMesh
      ref={meshRef}
      args={[null as any, null as any, grassData.length]}
      castShadow
      receiveShadow
    >
      <coneGeometry args={[0.07, 0.38, 3]} />
      <meshStandardMaterial
        roughness={0.9}
        metalness={0.05}
        flatShading
      />
    </instancedMesh>
  )
}
