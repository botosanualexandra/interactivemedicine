import { Canvas } from '@react-three/fiber'


function Arm_Scene() {
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.4} />
      
      
      {/* Background plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#333" transparent opacity={0.1} />
      </mesh>
    </>
  )
}

export default Arm_Scene
