import { ScrollControls, useScroll } from "@react-three/drei"
import React from "react"
import RoboticArm from "./RoboticArm"
import { useFrame, useThree } from "@react-three/fiber"
import Overlay from "./Overlay.jsx"
import Organ from "./organs/Organ.jsx"

function CameraController() {
  const { camera } = useThree()
  const scroll = useScroll()
  const initialY = 15
  const normalFOV = 110
  const zoomedFOV = 40
  const currentLookTarget = React.useRef({ x: 0, y: 0, z: 0 })

  const [organSelectedIndex, setOrganSelectedIndex] = React.useState(-1);
  window.setOrganSelectedIndex = setOrganSelectedIndex;
  window.organSelectedIndex = organSelectedIndex;
  
  useFrame((state, delta) => {
    const scrollProgress = scroll.offset
    camera.position.y = -scrollProgress * 10 + initialY
    
    // Animate FOV based on pause state
    const targetFOV = window.isPaused ? zoomedFOV : normalFOV
    const fovDifference = targetFOV - camera.fov
    
    if (Math.abs(fovDifference) > 0.1) {
      camera.fov += fovDifference * delta * 4 // Smooth FOV transition
      camera.updateProjectionMatrix()
    }
    
    // Smooth lookAt target based on organ selection
    const targetLookAt = window.organSelectedIndex >= 0 ? { x: 1.5, y: 0, z: 0 } : { x: 0, y: 2, z: 0 }
    
    // Smoothly interpolate lookAt target
    currentLookTarget.current.x += (targetLookAt.x - currentLookTarget.current.x) * delta * 3
    currentLookTarget.current.y += (targetLookAt.y - currentLookTarget.current.y) * delta * 3
    currentLookTarget.current.z += (targetLookAt.z - currentLookTarget.current.z) * delta * 3
    
    camera.lookAt(currentLookTarget.current.x, currentLookTarget.current.y, currentLookTarget.current.z)
  })
  
  return null
}

function RotatingHearts() {
  const groupRef = React.useRef()
  const heartRefs = React.useRef([])
  const randomOffsets = React.useRef([])
  const [isPaused, setIsPaused] = React.useState(false)
  window.isPaused = isPaused;
  window.setIsPaused = setIsPaused;
  const radius = 4
  const organCount = 6
  
  // Generate random rotation offsets once
  React.useEffect(() => {
    randomOffsets.current = Array.from({ length: organCount }, () => ({
      x: (Math.random() - 0.5) * 0.4,
      y: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.4
    }))
  }, [organCount])
  
  const handleOrganClick = (index) => {
    if (organSelectedIndex === index) {
      // Deselect and resume rotation
      setOrganSelectedIndex(-1)
      setIsPaused(false)
    } else {
      // Select organ and pause rotation
      setOrganSelectedIndex(index)
      setIsPaused(true)
    }
  }
  
  useFrame((state, delta) => {
    if (groupRef.current && !isPaused) {
      groupRef.current.rotation.y += delta * 0.3 // Slow rotation
    }
      
    // Handle heart rotation, position, and scale
    heartRefs.current.forEach((heartRef, index) => {
      if (heartRef && randomOffsets.current[index]) {
        const offset = randomOffsets.current[index]
        
        if (window.organSelectedIndex === index) {
          // Move selected organ to world center (0, 0, 0)
          heartRef.parent.position.x += (0 - heartRef.parent.position.x) * delta * 3
          heartRef.parent.position.y += (0 - heartRef.parent.position.y) * delta * 3
          heartRef.parent.position.z += (0 - heartRef.parent.position.z) * delta * 3
          
          // Scale up the selected organ
          const targetScale = 1.5
          heartRef.scale.x += (targetScale - heartRef.scale.x) * delta * 4
          heartRef.scale.y += (targetScale - heartRef.scale.y) * delta * 4
          heartRef.scale.z += (targetScale - heartRef.scale.z) * delta * 4
          
          // Apply normal local rotations
          heartRef.rotation.x = offset.x
          heartRef.rotation.y = -groupRef.current.rotation.y + offset.y
          heartRef.rotation.z = offset.z
        } else {
          // Return to original circle position, but move up if any organ is selected
          const angle = (index / organCount) * Math.PI * 2
          const originalX = Math.cos(angle) * radius
          const originalZ = Math.sin(angle) * radius
          const targetY = window.organSelectedIndex >= 0 ? 5 : 0 // Move up when any organ is selected
          
          heartRef.parent.position.x += (originalX - heartRef.parent.position.x) * delta * 3
          heartRef.parent.position.y += (targetY - heartRef.parent.position.y) * delta * 3
          heartRef.parent.position.z += (originalZ - heartRef.parent.position.z) * delta * 3
          
          // Scale back to normal
          const targetScale = 1.0
          heartRef.scale.x += (targetScale - heartRef.scale.x) * delta * 4
          heartRef.scale.y += (targetScale - heartRef.scale.y) * delta * 4
          heartRef.scale.z += (targetScale - heartRef.scale.z) * delta * 4
          
          // Apply normal rotations
          heartRef.rotation.x = offset.x
          heartRef.rotation.y = -groupRef.current.rotation.y + offset.y
          heartRef.rotation.z = offset.z
        }
      }
    })
  })
  
  return (
    <group ref={groupRef} rotation={[Math.PI / 1.5, 0, 0]}>
      {Array.from({ length: organCount }, (_, i) => {
        const angle = (i / organCount) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <group 
            key={i} 
            position={[x, 0, z]}
            onClick={() => handleOrganClick(i)}
          >
            <group ref={(el) => heartRefs.current[i] = el}>
              <Organ index={i}/>
            </group>
          </group>
        )
      })}
    </group>
  )
}

function Experience() {
  const { camera } = useThree()
  
  React.useEffect(() => {
    camera.fov = 60
    camera.updateProjectionMatrix()
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      <ScrollControls pages={2} damping={0.25}>
        <Overlay />
        <CameraController />

        {/* <RoboticArm/> */}

        <RotatingHearts />
      </ScrollControls>
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </>
  )
}

export default Experience
