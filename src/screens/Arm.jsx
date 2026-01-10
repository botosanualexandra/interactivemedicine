import { Canvas } from '@react-three/fiber'


function Arm() {
  return (
    <>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={'orange'} />
        </mesh>
      </Canvas>
    </>
  )
}

export default Arm
