import Arm_Scene from "./Arm_Scene"
import Arm_Overlay from "./Arm_Overlay"
import { ScrollControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

function Arm() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ScrollControls pages={2} damping={0.25}>
        <Arm_Scene />
        <Arm_Overlay />
      </ScrollControls>
    </Canvas>
  )
}

export default Arm
