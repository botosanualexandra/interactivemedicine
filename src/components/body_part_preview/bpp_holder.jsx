import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Arm from "./bpp_arm.jsx";

function BPP({index, bodyPart}) {
  const currentBodyPart = bodyPart || {};
  const meshRef = useRef();
  const targetScale = useRef(1.3); // Initial scale value
  const currentScale = useRef(1.3); // Initial scale value

  const handleClick = () => {
    console.log(currentBodyPart.name + ' clicked' + index);
    if (window.setOrganSelectedIndex) {
      window.setOrganSelectedIndex(index);
    }
  }

  const handlePointerEnter = () => {
    targetScale.current = 1.4;
    document.body.style.cursor = 'pointer';
  }

  const handlePointerLeave = () => {
    targetScale.current = 1.3;
    document.body.style.cursor = 'default';
  }

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Smooth interpolation towards target scale
      const lerpSpeed = 8; // Adjust this for faster/slower animation
      currentScale.current += (targetScale.current - currentScale.current) * delta * lerpSpeed;
      
      // Apply the smooth scale to the mesh
      meshRef.current.scale.setScalar(currentScale.current);
    }
  });

  return (
    <>
      {index != 1 && (
        <mesh 
          ref={meshRef}
          position={[0, 0, 0]} 
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={currentBodyPart.color || 'red'} transparent opacity={0.5} />
        </mesh>
      )}
      
      {index === 1 && (
        <mesh 
          ref={meshRef}
          position={[0, 0, 0]} 
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <Arm position={[-1, .6, 0]} rotation={[10, 0, .75]} scale={[2.5, 2.5, 2.5]} />
          <meshStandardMaterial color={currentBodyPart.color || 'red'} transparent opacity={0} />
        </mesh>
      )}
    </>
  )
}

export default BPP
