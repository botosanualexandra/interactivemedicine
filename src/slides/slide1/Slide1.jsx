
import './Slide1.css';
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Box, OrbitControls, Text } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom';
import MODEL_Sange from '../../components/m_sange'

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
    <Canvas>
      <CameraController 
        minAngle={-Math.PI/2} 
        maxAngle={Math.PI/2}
        smoothingFactor={0.1}
        panSpeed={0.1}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <group rotation={[0, 90, 0]}>
        {/* <MODEL_Sange position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={.9}/> */}
      </group>

      <gridHelper args={[10, 10]} />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
    </Canvas>
  );
}

function Slide1() {
  const navigate = useNavigate();

  function handleLearnMore() {
    navigate('/botosanumedicina/circulatia');
    window.location.reload();
  }

  return (
    <div className="overlay-container">
      <article>
        <h2>curgerea fluidelor</h2>
        <p>Curgerea fluidelor este procesul prin care lichidele și gazele se 
        deplasează sub acțiunea diferitelor forțe, cum ar fi gravitația, presiunea sau 
        forțele de frecare. Acest fenomen este fundamental în multe procese biologice și industriale.</p>
        <button onClick={handleLearnMore}>Learn More</button>
      </article>
      <Scene />
    </div>
  );
}


export default Slide1;