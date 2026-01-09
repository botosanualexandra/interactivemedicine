
import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { organs } from "../../organs_list";

function Organ({index}) {
  const currentLanguage = window.currentLanguage || 'EN';
  const currentOrgan = organs[currentLanguage][index] || organs['EN'][0];
  const [isHovered, setIsHovered] = useState(false);
  const meshRef = useRef();
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  const handleClick = () => {
    console.log(currentOrgan.name + ' clicked' + index);
    if (window.setOrganSelectedIndex) {
      window.setOrganSelectedIndex(index);
    }
  }

  const handlePointerEnter = () => {
    setIsHovered(true);
    targetScale.current = 1.2;
    document.body.style.cursor = 'pointer';
  }

  const handlePointerLeave = () => {
    setIsHovered(false);
    targetScale.current = 1;
    document.body.style.cursor = 'default';
  }

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth interpolation towards target scale
      const lerpSpeed = 8; // Adjust this for faster/slower animation
      currentScale.current += (targetScale.current - currentScale.current) * delta * lerpSpeed;
      
      // Apply the smooth scale to the mesh
      meshRef.current.scale.setScalar(currentScale.current);
    }
  });

  return (
    <mesh 
      ref={meshRef}
      position={[0, 0, 0]} 
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={currentOrgan.color} />
    </mesh>
  )
}

export default Organ
