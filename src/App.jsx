import { Scroll } from '@react-three/drei'
import './App.css'
import { useState, useEffect, useRef } from 'react'
import React from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Box, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { animated, useSpring} from '@react-spring/three';

import Model from './components/thumbnails/tbn_curgerea.jsx'
import MODEL_Muscles from './components/thumbnails/tbn_muschi.jsx'
import Model_Parghii from './components/thumbnails/tbn_parghii.jsx'

import textDocument from './TextDocument.jsx'

function Home() {
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [language, setLanguage] = useState(window.currentLanguage === 'EN' ? 'en' : 'ro');
  const allChapters = textDocument.chapters;

  const chapter1SpringData = useSpring({
    scale: selectedChapter === 0 ? [1, 1, 1] : [0, 0, 0],
    config: { mass: 1, tension: 180, friction: 18 }
  });

  const chapter2SpringData = useSpring({
    scale: selectedChapter === 1 ? [1, 1, 1] : [0, 0, 0],
    config: { mass: 1, tension: 180, friction: 18 }
  });

  const chapter3SpringData = useSpring({
    scale: selectedChapter === 2 ? [1, 1, 1] : [0, 0, 0],
    config: { mass: 1, tension: 180, friction: 18 }
  });

  const chapter4SpringData = useSpring({
    scale: selectedChapter === 3 ? [1, 1, 1] : [0, 0, 0],
    config: { mass: 1, tension: 180, friction: 18 }
  });

  function handleNextChapter() {
    setSelectedChapter((prevChapter) => (prevChapter + 1) % allChapters.length);
  }

  function handlePrevChapter() {
    setSelectedChapter((prevChapter) => (prevChapter - 1 + allChapters.length) % allChapters.length);
  }

  useEffect(() => {
    document.title = language === 'en' ? 'The Universe of Knowledge - Home' : 'Universul cunoașterii - Acasă';
  }, [language]);

  useEffect(() => {
    const handler = (e) => setLanguage(e.detail === 'EN' ? 'en' : 'ro');
    window.addEventListener('languageChanged', handler);
    return () => window.removeEventListener('languageChanged', handler);
  }, []);

  useEffect(() => {
    console.log("Selected Chapter:", selectedChapter);
  }, [selectedChapter]);

  useEffect(() => {
    const arrowRight = document.getElementById('arrowRight');
    const arrowLeft = document.getElementById('arrowLeft');

    if (arrowRight) {
      arrowRight.addEventListener('click', handleNextChapter);
    }

    if (arrowLeft) {
      arrowLeft.addEventListener('click', handlePrevChapter);
    }

    return () => {
      if (arrowRight) {
        arrowRight.removeEventListener('click', handleNextChapter);
      }
      if (arrowLeft) {
        arrowLeft.removeEventListener('click', handlePrevChapter);
      }
    };
  }, []);

  const base = import.meta.env.BASE_URL;
  const windowLocations = [`/fluide`, `/muschi`, `/parghii`, `/forta`];
  const navigate = useNavigate();
  return (
    <>
      <section className="hero">
        <h1>{textDocument.hero.title[language]}</h1>
        <p>{textDocument.hero.subtitle[language]}</p>
        <i className="fa-solid fa-arrow-down"></i>
      </section>

      <section className="content">
        <section className="overlay">
          <h1>{allChapters[selectedChapter].title[language]}</h1>
          <p>{allChapters[selectedChapter].desc[language]}</p>
          {selectedChapter !== 3 && (
            <button onClick={() => navigate(windowLocations[selectedChapter])}>
              {allChapters[selectedChapter].button ? allChapters[selectedChapter].button[language] : (language === 'en' ? 'Learn More' : 'Află mai multe')}
            </button>
          )}
          <i className="fa-solid fa-arrow-left" id='arrowLeft'></i>
          <i className="fa-solid fa-arrow-right" id='arrowRight'></i>
        </section>
        <Scene selectedChapter={selectedChapter} setSelectedChapter={setSelectedChapter} 
        chapter1SpringData={chapter1SpringData} chapter2SpringData={chapter2SpringData} 
        chapter3SpringData={chapter3SpringData} chapter4SpringData={chapter4SpringData} 
        language={language}
        />
      </section>
    </>
  )
}

function CameraController({ 
  minAngle = -Math.PI/3, // -60 degrees - you can adjust this
  maxAngle = Math.PI/3,  // +60 degrees - you can adjust this
  panSpeed = 0.3,        // panning speed - you can adjust this
  radius = 6,            // camera distance - you can adjust this
  height = 1.5,          // camera height - you can adjust this
  smoothingFactor = 0.1, // how smooth the direction changes are (0.05-0.2 works well)
  fov = 50               // field of view (default 50)
}) {
  const { camera } = useThree()
  const cameraRef = useRef()
  
  useEffect(() => {
    camera.position.set(2, 1.5, 5)
    camera.lookAt(-3, 0, 0)
    camera.fov = fov
    camera.updateProjectionMatrix()
    cameraRef.current = { 
      angle: 0,           // Current angle
      targetDirection: 1, // Target direction (1 or -1)
      currentDirection: 1, // Current smoothed direction
      time: 0            // For vertical bobbing
    }
  }, [camera, fov])

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

      // Set FOV every frame in case it changes
      if (camera.fov !== fov) {
        camera.fov = fov
        camera.updateProjectionMatrix()
      }
    }
  })

  return null
}

function PostProcessing({enabled = true}) {
  if(!enabled) return null;
  return (
    <EffectComposer>
      <Bloom 
        intensity={1}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.025}
        blendFunction={BlendFunction.ADD}
      />

    </EffectComposer>
  )
}

function Skybox() {
  const sphereRef = useRef()
  
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.01
    }
  })

  // Create gradient material
  const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color(0x0066ff) },
      color2: { value: new THREE.Color(0xff6600) }
    },
    side: THREE.BackSide,
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec3 vPosition;
      void main() {
        float mixValue = (vPosition.y + 1.0) / 2.0;
        gl_FragColor = vec4(mix(color1, color2, mixValue), 1.0);
      }
    `
  })

  return (
    <mesh ref={sphereRef} position={[0, 0, 0]} scale={100}>
      <sphereGeometry args={[1, 32, 32]} />
      <primitive object={gradientMaterial} attach="material" />
    </mesh>
  )
}

function Scene({chapter1SpringData, chapter2SpringData, chapter3SpringData, chapter4SpringData, language}) {
  // Helper to make a group always look at the camera
  function Billboard({ children, ...props }) {
    const group = useRef();
    const { camera } = useThree();
    useFrame(() => {
      if (group.current) {
        group.current.lookAt(camera.position);
      }
    });
    return (
      <group ref={group} {...props}>
        {children}
      </group>
    );
  }

  return (
    <Canvas style={{ height: '100%', width: '100%' }}>
      <CameraController 
        minAngle={-Math.PI/5} 
        maxAngle={Math.PI/5}
        smoothingFactor={0.1}
        panSpeed={.1}
        radius={9}
        height={3}
        fov={50}
      />

      <PostProcessing enabled={true} />

      <ambientLight intensity={2} />
      <directionalLight
        position={[-5, 10, 5]}
        intensity={1.2}
      />

      <group scale={1.3}>
        <animated.group scale={chapter1SpringData.scale}>
          <Model rotation={[0, Math.PI / 2, 0]} />
        </animated.group>

        <animated.group scale={chapter2SpringData.scale}>
          <MODEL_Muscles rotation={[0, Math.PI / 2, 0]} scale={.3} position={[0, 0, 1.25]} />
        </animated.group>

        <animated.group scale={chapter3SpringData.scale}>
          <Model_Parghii rotation={[0, Math.PI / 2, 0]} />
        </animated.group>

        <animated.group scale={chapter4SpringData.scale}>
          <Billboard>
            <Text position={[0, .5, 0]} fontSize={0.4} color="#ffffff" anchorX="center" anchorY="middle">
              {language === 'en' ? 'coming soon' : 'momentan indisponibil'}
            </Text>
          </Billboard>
        </animated.group>
      </group>

      <gridHelper args={[10, 10]} />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
    </Canvas>
  );
}

export default Home
