
import { useFrame, useThree } from "@react-three/fiber"
import React, { useRef, useMemo, useState, useCallback } from "react"
import * as THREE from "three"

// === ROBOTIC ARM CONFIGURATION ===
const ARM_CONFIG = {
  segmentLengths: [2.5, 2], // Two segments: upper arm, forearm
  maxReach: 4.5,
  targetBounds: {
    x: [-4, 4],
    y: [-3, 3], 
    z: [-2, 2]
  },
  colors: {
    base: "#444444",
    upperArm: "#2196F3", // Blue
    forearm: "#4CAF50",  // Green
    joint: "#666666",
    endEffector: "#FF5722",
    targetActive: "yellow",
    targetDragging: "red"
  }
}

function RoboticArm() {
  // === THREE.JS HOOKS ===
  const { camera, gl } = useThree()
  
  // === COMPONENT REFS ===
  const upperArmRef = useRef()  // First segment (was joint1Ref)
  const forearmRef = useRef()   // Second segment (was joint2Ref)
  const targetRef = useRef()    // Draggable target sphere
  
  // === COMPONENT STATE ===
  const [isDragging, setIsDragging] = useState(false)
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(3, 1, 0))
  
  
  // === MOUSE INTERACTION SETUP ===
  // Raycaster converts 2D mouse coords to 3D world position
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const mouseCoords = useMemo(() => new THREE.Vector2(), [])
  
  // Invisible plane for raycasting - determines where mouse "hits" in 3D space
  const dragPlane = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(20, 20)
    const material = new THREE.MeshBasicMaterial({ visible: false })
    const plane = new THREE.Mesh(geometry, material)
    plane.position.set(0, 0, 0)
    plane.lookAt(0, 0, 1)
    return plane
  }, [])
  
  // === MOUSE EVENT HANDLERS ===
  const startDragging = useCallback((event) => {
    event.stopPropagation()
    setIsDragging(true)
    gl.domElement.setPointerCapture(event.pointerId)
  }, [gl])
  
  const updateDragPosition = useCallback((event) => {
    if (!isDragging) return
    
    // Convert mouse position to normalized device coordinates (-1 to 1)
    const rect = gl.domElement.getBoundingClientRect()
    mouseCoords.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouseCoords.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    
    // Cast ray from camera through mouse position
    raycaster.setFromCamera(mouseCoords, camera)
    const intersects = raycaster.intersectObject(dragPlane)
    
    if (intersects.length > 0) {
      const newPosition = intersects[0].point
      
      // Apply boundary constraints to keep target in reasonable area
      newPosition.x = Math.max(ARM_CONFIG.targetBounds.x[0], Math.min(ARM_CONFIG.targetBounds.x[1], newPosition.x))
      newPosition.y = Math.max(ARM_CONFIG.targetBounds.y[0], Math.min(ARM_CONFIG.targetBounds.y[1], newPosition.y))
      newPosition.z = Math.max(ARM_CONFIG.targetBounds.z[0], Math.min(ARM_CONFIG.targetBounds.z[1], newPosition.z))
      
      setTargetPosition(newPosition.clone())
    }
  }, [isDragging, camera, raycaster, mouseCoords, dragPlane])
  
  const stopDragging = useCallback((event) => {
    setIsDragging(false)
    gl.domElement.releasePointerCapture(event.pointerId)
  }, [gl])
  
  // Register mouse event listeners
  React.useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener('pointermove', updateDragPosition)
    canvas.addEventListener('pointerup', stopDragging)
    
    return () => {
      canvas.removeEventListener('pointermove', updateDragPosition)
      canvas.removeEventListener('pointerup', stopDragging)
    }
  }, [gl, updateDragPosition, stopDragging])
  
  
  // === INVERSE KINEMATICS SOLVER ===
  // Uses FABRIK algorithm (Forward And Backward Reaching Inverse Kinematics)
  const solveInverseKinematics = (targetPos) => {
    // Define joint positions: [base, elbow, end-effector]
    const joints = [
      new THREE.Vector3(0, 0, 0),    // Base (shoulder) - fixed
      new THREE.Vector3(2.5, 0, 0), // Elbow joint - moves
      new THREE.Vector3(4.5, 0, 0)  // End effector - tries to reach target
    ]
    
    const target = targetPos.clone()
    const totalArmLength = ARM_CONFIG.segmentLengths.reduce((sum, len) => sum + len, 0)
    const distanceToTarget = joints[0].distanceTo(target)
    
    // If target is too far away, move it to maximum reachable distance
    if (distanceToTarget > totalArmLength) {
      const direction = target.clone().sub(joints[0]).normalize()
      target.copy(joints[0]).add(direction.multiplyScalar(totalArmLength))
    }
    
    // FABRIK algorithm: iteratively solve for joint positions
    const maxIterations = 10
    const tolerance = 0.01
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      // FORWARD REACH: Start from target and work backwards
      joints[joints.length - 1].copy(target)
      for (let i = joints.length - 2; i >= 0; i--) {
        const direction = joints[i].clone().sub(joints[i + 1]).normalize()
        joints[i].copy(joints[i + 1]).add(direction.multiplyScalar(ARM_CONFIG.segmentLengths[i]))
      }
      
      // BACKWARD REACH: Start from base and work forwards
      joints[0].set(0, 0, 0) // Keep base fixed at origin
      for (let i = 1; i < joints.length; i++) {
        const direction = joints[i].clone().sub(joints[i - 1]).normalize()
        joints[i].copy(joints[i - 1]).add(direction.multiplyScalar(ARM_CONFIG.segmentLengths[i - 1]))
      }
      
      // Check if we're close enough to the target
      if (joints[joints.length - 1].distanceTo(target) < tolerance) break
    }
    
    return joints
  }
  
  
  // === ANIMATION LOOP ===
  // Runs every frame to update arm position based on target
  useFrame(() => {
    if (!targetRef.current || !upperArmRef.current || !forearmRef.current) return
    
    // Update target sphere position
    targetRef.current.position.copy(targetPosition)
    
    // Solve inverse kinematics to get joint positions
    const joints = solveInverseKinematics(targetPosition)
    
    // Update upper arm segment (base to elbow)
    const upperArmDirection = joints[1].clone().sub(joints[0])
    const upperArmMidpoint = joints[0].clone().add(upperArmDirection.clone().multiplyScalar(0.5))
    upperArmRef.current.position.copy(upperArmMidpoint)
    upperArmRef.current.lookAt(joints[1])
    upperArmRef.current.rotateX(Math.PI / 2) // Align cylinder with direction
    
    // Update forearm segment (elbow to end-effector)
    const forearmDirection = joints[2].clone().sub(joints[1])
    const forearmMidpoint = joints[1].clone().add(forearmDirection.clone().multiplyScalar(0.5))
    forearmRef.current.position.copy(forearmMidpoint)
    forearmRef.current.lookAt(joints[2])
    forearmRef.current.rotateX(Math.PI / 2) // Align cylinder with direction
  })

  
  // === COMPONENT RENDER ===
  return (
    <group>
      {/* Base Joint (Shoulder) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color={ARM_CONFIG.colors.base} />
      </mesh>
      
      {/* Upper Arm Segment (Shoulder to Elbow) */}
      <mesh ref={upperArmRef}>
        <cylinderGeometry args={[0.07, 0.07, ARM_CONFIG.segmentLengths[0]]} />
        <meshStandardMaterial color={ARM_CONFIG.colors.upperArm} />
      </mesh>
      
      {/* Forearm Segment (Elbow to Wrist) */}
      <mesh ref={forearmRef}>
        <cylinderGeometry args={[0.05, 0.05, ARM_CONFIG.segmentLengths[1]]} />
        <meshStandardMaterial color={ARM_CONFIG.colors.forearm} />
      </mesh>
      
      {/* Joint Spheres and End Effector */}
      <ArmJoints targetPosition={targetPosition} />
      
      {/* Interactive Target Sphere */}
      <mesh 
        ref={targetRef}
        onPointerDown={startDragging}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial 
          color={isDragging ? ARM_CONFIG.colors.targetDragging : ARM_CONFIG.colors.targetActive} 
          emissive={isDragging ? ARM_CONFIG.colors.targetDragging : ARM_CONFIG.colors.targetActive} 
          emissiveIntensity={0.3} 
        />
      </mesh>
    </group>
  )
}

// === ARM JOINTS VISUALIZATION COMPONENT ===
// Renders the elbow joint and end effector spheres
function ArmJoints({ targetPosition }) {
  const jointPositions = useMemo(() => {
    // Recalculate joint positions for visualization
    const joints = [
      new THREE.Vector3(0, 0, 0),    // Base (shoulder)
      new THREE.Vector3(2.5, 0, 0),  // Elbow
      new THREE.Vector3(4.5, 0, 0)   // End effector
    ]
    
    const target = targetPosition.clone()
    const totalLength = ARM_CONFIG.segmentLengths.reduce((sum, len) => sum + len, 0)
    const distanceToTarget = joints[0].distanceTo(target)
    
    // Constrain target to reachable area
    if (distanceToTarget > totalLength) {
      const direction = target.clone().sub(joints[0]).normalize()
      target.copy(joints[0]).add(direction.multiplyScalar(totalLength))
    }
    
    // FABRIK algorithm (same as main solver)
    for (let iteration = 0; iteration < 10; iteration++) {
      // Forward reaching
      joints[joints.length - 1].copy(target)
      for (let i = joints.length - 2; i >= 0; i--) {
        const direction = joints[i].clone().sub(joints[i + 1]).normalize()
        joints[i].copy(joints[i + 1]).add(direction.multiplyScalar(ARM_CONFIG.segmentLengths[i]))
      }
      
      // Backward reaching
      joints[0].set(0, 0, 0) 
      for (let i = 1; i < joints.length; i++) {
        const direction = joints[i].clone().sub(joints[i - 1]).normalize()
        joints[i].copy(joints[i - 1]).add(direction.multiplyScalar(ARM_CONFIG.segmentLengths[i - 1]))
      }
      
      if (joints[joints.length - 1].distanceTo(target) < 0.01) break
    }
    
    return joints
  }, [targetPosition])

  return (
    <>
      {/* Elbow Joint Sphere */}
      <mesh position={jointPositions[1]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color={ARM_CONFIG.colors.joint} />
      </mesh>
      
      {/* End Effector (Wrist/Hand) */}
      <mesh position={jointPositions[2]}>
        <sphereGeometry args={[0.06]} />
        <meshStandardMaterial color={ARM_CONFIG.colors.endEffector} />
      </mesh>
    </>
  )
}

export default RoboticArm