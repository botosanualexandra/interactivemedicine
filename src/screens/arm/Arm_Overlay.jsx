import { Scroll } from '@react-three/drei'
import './Arm.css'

function Arm_Overlay() {
  return (
    <Scroll html style={{ width: '100%' }}>
      <section className="arm-section">
        <h1>Human Arm Anatomy</h1>
        <p>Explore the complex structure of the human arm</p>
      </section>
      
      <section className="arm-section">
        <h2>Arm Structure</h2>
        <p>
          The human arm is a complex structure composed of bones, muscles, nerves, and blood vessels 
          that work together to provide strength, flexibility, and dexterity. It consists of three main 
          sections: the upper arm (humerus), forearm (radius and ulna), and hand.
        </p>
      </section>
    </Scroll>
  )
}

export default Arm_Overlay
