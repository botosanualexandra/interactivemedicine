import { Scroll } from '@react-three/drei'
import './App.css'
import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Box, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom';

function Home() {
  return (
    <>
      <section className="hero">
        <h1>Interactive Medicine</h1>
        <p>Scroll down to learn</p>
        <i className="fa-solid fa-arrow-down"></i>
      </section>

      <Scene />
    </>
  )
}

function CameraController({ 
  minAngle = -Math.PI/3, // -60 degrees - you can adjust this
  maxAngle = Math.PI/3,  // +60 degrees - you can adjust this
  panSpeed = 0.3,        // panning speed - you can adjust this
  radius = 6,            // camera distance - you can adjust this
  height = 1.5,          // camera height - you can adjust this
  smoothingFactor = 0.1  // how smooth the direction changes are (0.05-0.2 works well)
}) {
  const { camera } = useThree()
  const cameraRef = useRef()
  
  useEffect(() => {
    camera.position.set(2, 1.5, 5)
    camera.lookAt(-3, 0, 0)
    camera.updateProjectionMatrix()
    cameraRef.current = { 
      angle: 0,           // Current angle
      targetDirection: 1, // Target direction (1 or -1)
      currentDirection: 1, // Current smoothed direction
      time: 0            // For vertical bobbing
    }
  }, [camera])

  useFrame((state, delta) => {
    if (cameraRef.current) {
      const { angle, targetDirection, currentDirection } = cameraRef.current
      
      // Smoothly interpolate the current direction towards the target direction
      const directionDiff = targetDirection - currentDirection
      cameraRef.current.currentDirection += directionDiff * smoothingFactor
      
      // Update angle based on smoothed direction and speed
      const newAngle = angle + (cameraRef.current.currentDirection * delta * panSpeed)
      
      // Check if we've hit the limits and set target direction
      if (newAngle >= maxAngle) {
        cameraRef.current.angle = maxAngle
        cameraRef.current.targetDirection = -1  // Target reverse direction
      } else if (newAngle <= minAngle) {
        cameraRef.current.angle = minAngle
        cameraRef.current.targetDirection = 1   // Target forward direction
      } else {
        cameraRef.current.angle = newAngle
      }
      
      // Update time for vertical bobbing
      cameraRef.current.time += delta * 0.5
      
      // Calculate camera position using clamped angle
      const currentAngle = cameraRef.current.angle
      const x = Math.cos(currentAngle) * radius
      const z = Math.sin(currentAngle) * radius
      const y = height + Math.sin(cameraRef.current.time) * 0.5
      
      camera.position.set(x, y, z)
      
      // Always look at the center where the boxes are
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}

function Scene() {
  return (
    <Canvas style={{ height: '100vh'}}>
      <CameraController 
        minAngle={-Math.PI/2} 
        maxAngle={Math.PI/2}
        smoothingFactor={0.1}
        panSpeed={0.1}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {/* <Model position={[0, 0, 0]} /> */}

      <gridHelper args={[10, 10]} />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
    </Canvas>
  );
}

export default Home
