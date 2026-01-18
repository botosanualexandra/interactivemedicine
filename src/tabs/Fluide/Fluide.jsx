
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Box, OrbitControls, ScrollControls, Scroll, useScroll, Stats } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import './Fluide.css'
import MODEL_Sange from '../../components/m_sange'
import { useState, useRef } from 'react';
import text from './TextDocument';
import MODEL_Inima from '../../components/m_inima'
import * as THREE from 'three'
import MODEL_Arm from '../../components/m_arm'
import { useEffect } from 'react';

function Fluide() {
  const [animationsSpeed, setAnimationsSpeed] = useState(.25);
  const [heartBpm, setHeartBpm] = useState(72); // Default BPM
  const [animationTime, setAnimationTime] = useState(0); // Animation time control
  const [debugMode, setDebugMode] = useState(false);
  const [debugCamera, setDebugCamera] = useState({
    position: [0, 2, 8],
    lookAt: [0, 0, 0],
    fov: 40
  });
  const [currentSection, setCurrentSection] = useState(0);
  const [language, setLanguage] = useState(window.currentLanguage === 'EN' ? 'en' : 'ro');

  useEffect(() => {
    const handler = () => {
      setLanguage(window.currentLanguage === 'EN' ? 'en' : 'ro');
    };
    window.addEventListener('languageChanged', handler);
    return () => window.removeEventListener('languageChanged', handler);
  }, []);

  useEffect(() => {
    document.title = language === 'en' ? 'Fluids' : 'Fluide';
  }, [language]);

  return (
    <>
      <Canvas 
          style={{ height: '100vh' }} 
          camera={{ position: [0, 2, 5], fov: 40 }}
        >
          <ScrollControls pages={5} damping={0.1}>
            <Scene 
              animationsSpeed={animationsSpeed} 
              heartBpm={heartBpm}
              animationTime={animationTime}
              debugMode={debugMode}
              debugCamera={debugCamera}
              setCurrentSection={setCurrentSection}
            />
            <Scroll html style={{ width: '100%' }}>
              <Hero language={language} />
              <CeEsteUnFluid language={language} />
              <Necesara language={language} animationsSpeed={animationsSpeed} setAnimationsSpeed={setAnimationsSpeed}/>
              <CePune language={language} setHeartBpm={setHeartBpm} setAnimationTime={setAnimationTime} animationTime={animationTime} />
              {/* <Presiune /> */}
              {/* <Probleme /> */}
            </Scroll>
          </ScrollControls>
        </Canvas>
        {/* <Stats /> */}
        {/* Camera Debug Panel - Outside Canvas */}
        {/* <CameraDebugPanel 
          debugMode={debugMode}
          setDebugMode={setDebugMode}
          debugCamera={debugCamera}
          setDebugCamera={setDebugCamera}
          currentSection={currentSection}
        /> */}
    </>
  )
}

function CameraRig({ debugMode, debugCamera, setCurrentSection }) {
  const { camera } = useThree()
  const scroll = useScroll()
  
  // Define camera positions for each section
  const cameraPositions = [
    // Hero - Front view
    { position: [0, 2, 8], lookAt: [0, 0, 0], fov: 40 },
    // CeEsteUnFluid - Close up right side
    { position: [-2, 0.9, 4.8], lookAt: [0, .3, -0.9], fov: 45 },
    // Necesara - Top down view
    { position: [-10.2, 8.0, -0.1], lookAt: [0.0, 0, .2], fov: 15 },
    // CePune - Left side angle
    { position: [0.0, 0.0, -3.6], lookAt: [0.0, 0.0, 0.0], fov: 80 },
    // Presiune - Bottom view looking up
    { position: [-9.3, 1, -3.0], lookAt: [0.0, 1.7, 0.0], fov: 45 },
    // Probleme - Wide overview
  ]
  
  useFrame(() => {
    // If in debug mode, use debug camera values
    if (debugMode) {
      camera.position.set(...debugCamera.position)
      camera.fov = debugCamera.fov
      camera.updateProjectionMatrix()
      camera.lookAt(...debugCamera.lookAt)
      return
    }
    
    // Guard clause: ensure scroll is available and has offset property
    if (!scroll || typeof scroll.offset !== 'number' || !camera) {
      return
    }
    
    try {
      const offset = Math.max(0, Math.min(1, scroll.offset)) // Clamp offset between 0 and 1
      
      // Calculate which section we're in and interpolation factor
      const sectionCount = cameraPositions.length
      const sectionProgress = offset * (sectionCount - 1)
      const currentSection = Math.floor(sectionProgress)
      const nextSection = Math.min(currentSection + 1, sectionCount - 1)
      const lerpFactor = Math.max(0, Math.min(1, sectionProgress - currentSection)) // Clamp lerp factor
      
      // Update current section for debug panel
      setCurrentSection(currentSection)
      
      // Ensure we have valid indices
      if (currentSection < 0 || currentSection >= sectionCount || 
          nextSection < 0 || nextSection >= sectionCount) {
        return
      }
      
      // Get current and next camera configurations
      const current = cameraPositions[currentSection]
      const next = cameraPositions[nextSection]
      
      // Validate camera position data
      if (!current || !next || !current.position || !next.position || 
          !current.lookAt || !next.lookAt) {
        return
      }
      
      // Smooth interpolation function
      const smoothstep = (t) => t * t * (3 - 2 * t)
      const smoothLerpFactor = smoothstep(lerpFactor)
      
      // Lerp between positions with bounds checking
      const lerpedPosition = [
        current.position[0] + (next.position[0] - current.position[0]) * smoothLerpFactor,
        current.position[1] + (next.position[1] - current.position[1]) * smoothLerpFactor,
        current.position[2] + (next.position[2] - current.position[2]) * smoothLerpFactor
      ]
      
      const lerpedLookAt = [
        current.lookAt[0] + (next.lookAt[0] - current.lookAt[0]) * smoothLerpFactor,
        current.lookAt[1] + (next.lookAt[1] - current.lookAt[1]) * smoothLerpFactor,
        current.lookAt[2] + (next.lookAt[2] - current.lookAt[2]) * smoothLerpFactor
      ]
      
      const lerpedFov = current.fov + (next.fov - current.fov) * smoothLerpFactor
      
      // Validate calculated values before applying
      if (lerpedPosition.some(val => !isFinite(val)) || 
          lerpedLookAt.some(val => !isFinite(val)) || 
          !isFinite(lerpedFov)) {
        return
      }
      
      // Apply to camera
      camera.position.set(...lerpedPosition)
      camera.fov = Math.max(10, Math.min(120, lerpedFov)) // Clamp FOV to reasonable range
      camera.updateProjectionMatrix()
      camera.lookAt(...lerpedLookAt)
    } catch (error) {
      // Silently handle any errors to prevent crashes during scrolling
      console.warn('CameraRig update error:', error)
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
        luminanceThreshold={0.3}
        luminanceSmoothing={0.025}
        blendFunction={BlendFunction.ADD}
      />

      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.001, 0.001]}
      />
    </EffectComposer>
  )
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight 
        position={[-10, 10, 5]} 
        intensity={2}
      />
      <pointLight position={[10, 10, 10]} intensity={0.4} />
      {/* Additional fill light for better overall illumination */}
      <pointLight position={[-5, 5, -5]} intensity={0.2} color="#4080ff" />
    </>
  )
}

function HeartRig({ animationsSpeed, heartBpm = 72 }) {
  const scroll = useScroll()
  const heartRef = useRef()
  
  // Define heart positions for each section
  const heartPositions = [
    // Hero - Off screen
    { position: [0, 0, 0], scale: 0 },
    // CeEsteUnFluid - Still hidden
    { position: [0, 0, 0], scale: 0 },
    // Necesara - Start appearing
    { position: [0, 0, 0], scale: 0 },
    // CePune - Heart visible and prominent
    { position: [0, 0, 0], scale: 1 },
    // Presiune - Heart center stage
    { position: [0, 0, 0], scale: 0 },
    // Probleme - Heart fading away
  ]
  
  useFrame(() => {
    if (!scroll || !heartRef.current || typeof scroll.offset !== 'number') {
      return
    }
    
    try {
      const offset = Math.max(0, Math.min(1, scroll.offset))
      
      // Calculate which section we're in
      const sectionCount = heartPositions.length
      const sectionProgress = offset * (sectionCount - 1)
      const currentSection = Math.floor(sectionProgress)
      const nextSection = Math.min(currentSection + 1, sectionCount - 1)
      const lerpFactor = Math.max(0, Math.min(1, sectionProgress - currentSection))
      
      // Ensure valid indices
      if (currentSection < 0 || currentSection >= sectionCount || 
          nextSection < 0 || nextSection >= sectionCount) {
        return
      }
      
      const current = heartPositions[currentSection]
      const next = heartPositions[nextSection]
      
      if (!current || !next) return
      
      // Smooth interpolation
      const smoothstep = (t) => t * t * (3 - 2 * t)
      const smoothLerpFactor = smoothstep(lerpFactor)
      
      // Lerp position
      const lerpedPosition = [
        current.position[0] + (next.position[0] - current.position[0]) * smoothLerpFactor,
        current.position[1] + (next.position[1] - current.position[1]) * smoothLerpFactor,
        current.position[2] + (next.position[2] - current.position[2]) * smoothLerpFactor
      ]
      
      // Lerp scale
      const lerpedScale = current.scale + (next.scale - current.scale) * smoothLerpFactor
      
      // Apply to heart
      heartRef.current.position.set(...lerpedPosition)
      heartRef.current.scale.setScalar(lerpedScale)
      
    } catch (error) {
      console.warn('HeartRig update error:', error)
    }
  })
  
  return (
    <group ref={heartRef}>
      <MODEL_Inima rotation={[0, 90, 0]} bpm={heartBpm} />
    </group>
  )
}

function ArmRig({ animationTime }) {
  const scroll = useScroll()
  const armRef = useRef()
  
  // Define heart positions for each section
  const armPositions = [
    // Hero - Off screen
    { position: [0, 0, 0], scale: 0 },
    // CeEsteUnFluid - Still hidden
    { position: [0, 0, 0], scale: 0 },
    // Necesara - Start appearing
    { position: [0, 0, 0], scale: 0 },
    // CePune - Heart visible and prominent
    { position: [0, 0, 0], scale: 0 },
    // Presiune - Heart center stage
    { position: [0, 0, 0], scale: 1 },
    // Probleme - Heart fading away
  ]
  
  useFrame(() => {
    if (!scroll || !armRef.current || typeof scroll.offset !== 'number') {
      return
    }
    
    try {
      const offset = Math.max(0, Math.min(1, scroll.offset))
      
      // Calculate which section we're in
      const sectionCount = armPositions.length
      const sectionProgress = offset * (sectionCount - 1)
      const currentSection = Math.floor(sectionProgress)
      const nextSection = Math.min(currentSection + 1, sectionCount - 1)
      const lerpFactor = Math.max(0, Math.min(1, sectionProgress - currentSection))
      
      // Ensure valid indices
      if (currentSection < 0 || currentSection >= sectionCount || 
          nextSection < 0 || nextSection >= sectionCount) {
        return
      }
      
      const current = armPositions[currentSection]
      const next = armPositions[nextSection]
      
      if (!current || !next) return
      
      // Smooth interpolation
      const smoothstep = (t) => t * t * (3 - 2 * t)
      const smoothLerpFactor = smoothstep(lerpFactor)
      
      // Lerp position
      const lerpedPosition = [
        current.position[0] + (next.position[0] - current.position[0]) * smoothLerpFactor,
        current.position[1] + (next.position[1] - current.position[1]) * smoothLerpFactor,
        current.position[2] + (next.position[2] - current.position[2]) * smoothLerpFactor
      ]
      
      // Lerp scale
      const lerpedScale = current.scale + (next.scale - current.scale) * smoothLerpFactor
      
      // Apply to heart
      armRef.current.position.set(...lerpedPosition)
      armRef.current.scale.setScalar(lerpedScale)
      
    } catch (error) {
      console.warn('ArmRig update error:', error)
    }
  })
  
  return (
    <group ref={armRef}>
      <MODEL_Arm position={[0, -0.1, 0]} rotation={[0, Math.PI / 2, 0]} scale={.8} animationTime={animationTime}/>
    </group>
  )
}

function Skybox() {
  const { scene } = useThree()
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

function Scene({ animationsSpeed, heartBpm, animationTime, debugMode, debugCamera, setCurrentSection }) {
  // Calculate combined animation speed: base speed * BPM multiplier
  // Normal BPM (72) = 1.0x multiplier, other BPMs scale proportionally
  const bpmMultiplier = heartBpm / 72 * 2;
  const combinedAnimationSpeed = animationsSpeed * bpmMultiplier;
  
  return (
    <>
      <CameraRig 
        debugMode={debugMode}
        debugCamera={debugCamera}
        setCurrentSection={setCurrentSection}
      />
      <PostProcessing enabled={true} />
      <Lighting />

      <group rotation={[0, -45, 0]} position={[0, -.1, 0]}>
        <MODEL_Sange position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={.9} animationSpeed={combinedAnimationSpeed}  />
        <ArmRig animationTime={animationTime} />
      </group>

      <group position={[-2.5, 1, 2]} scale={1.5} rotation={[0, 0, 0]}>
        <HeartRig animationsSpeed={animationsSpeed} heartBpm={heartBpm} />
      </group>


      <gridHelper args={[25, 25]} material-transparent={true} material-opacity={0.01} />

      <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />

      <Skybox />
      
      {/* FPS Stats */}
    </>
  );
}

function Hero({ language }) {
  return (
    <figure className="s1hero">
      <h1>{text[language].hero.title}</h1>
      <p>{text[language].hero.desc}</p>
    </figure>
  )
}

function CeEsteUnFluid({ language }) {
  return (
    <figure className="ceesteunfluid">
      <h2>{text[language].ceEsteUnFluid.title}</h2>
      <p>{text[language].ceEsteUnFluid.desc}</p>
    </figure>
  )
}

function Necesara({ language, animationsSpeed, setAnimationsSpeed }){
  return (
    <figure className="necesara">
      <header>
        <h2>{text[language].necesara.title}</h2>
        <p>{text[language].necesara.desc}</p>
      </header>

      <div>
        <h3 htmlFor="flow-speed">{text[language].necesara.viteza}</h3>
        <input 
          type="range" 
          id="flow-speed" 
          min="0.1" 
          max="1" 
          step="0.1" 
          defaultValue=".25"
          onChange={(e) => setAnimationsSpeed(parseFloat(e.target.value))}
        />
      </div>

      <article>
        <ul>
          <h3>{text[language].necesara.functiiSange}</h3>
          {text[language].necesara.functiiSangeList.map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <ul>
          <h3>{text[language].necesara.functiiLimfa}</h3>
          {text[language].necesara.functiiLimfaList.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </article>
    </figure>
  )
}

function CePune({ language, setHeartBpm, setAnimationTime, animationTime }){
  const bpms = text[language].bpmDesc;
  const [selectedBpmIndex, setSelectedBpmIndex] = useState(0);
  const bpmValues = Object.keys(bpms).map(Number);
  const currentBpm = bpmValues[selectedBpmIndex];
  const currentDescription = bpms[currentBpm];

  const handleBpmChange = (index) => {
    setSelectedBpmIndex(index);
    setHeartBpm(bpmValues[index]);
  };

  return (
    <figure className="cepune">
      <header>
        <h2>{text[language].cePune.title}</h2>
        <p>{text[language].cePune.desc}</p>
      </header>

      <article>
        <ul>
          <h3>{text[language].cePune.sange}</h3>
          {text[language].cePune.sangeList.map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h3>{text[language].cePune.bpm} {currentBpm}bpm - {currentDescription}</h3>
        <input 
          type="range" 
          id="bpm-slider" 
          min="0" 
          max={bpmValues.length - 1} 
          step="1" 
          value={selectedBpmIndex}
          style={{ marginBottom: '10px' }}
          onChange={(e) => handleBpmChange(parseInt(e.target.value))}
        />
      </article>

      <article>
        <ul>
          <h3>{text[language].cePune.limfa}</h3>
          {text[language].cePune.limfaList.map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <h3>{text[language].cePune.control}</h3>
        <input 
          type="range" 
          min="0" 
          max="2" // Animation duration in seconds
          step="0.01"
          value={animationTime || 0}
          onChange={(e) => {
            setAnimationTime(parseFloat(e.target.value))
            handleBpmChange(parseInt(e.target.value))
          }}
        />
      </article>
    </figure>
  )
}


function CameraDebugPanel({ debugMode, setDebugMode, debugCamera, setDebugCamera, currentSection }) {
  const sectionNames = [
    'Hero', 'CeEsteUnFluid', 'Necesara', 'CePune', 
    'Presiune', 'Tipuri', 'Fizica', 'Probleme'
  ]

  const handlePositionChange = (axis, value) => {
    setDebugCamera(prev => ({
      ...prev,
      position: prev.position.map((val, idx) => 
        axis === idx ? parseFloat(value) : val
      )
    }))
  }

  const handleLookAtChange = (axis, value) => {
    setDebugCamera(prev => ({
      ...prev,
      lookAt: prev.lookAt.map((val, idx) => 
        axis === idx ? parseFloat(value) : val
      )
    }))
  }

  const handleFovChange = (value) => {
    setDebugCamera(prev => ({
      ...prev,
      fov: parseFloat(value)
    }))
  }

  const copyToClipboard = () => {
    const cameraConfig = `{ position: [${debugCamera.position.map(v => v.toFixed(1)).join(', ')}], lookAt: [${debugCamera.lookAt.map(v => v.toFixed(1)).join(', ')}], fov: ${debugCamera.fov} }`
    navigator.clipboard.writeText(cameraConfig)
    alert('Camera configuration copied to clipboard!')
  }

  if (!debugMode) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <button 
          onClick={() => setDebugMode(true)}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🎥 Camera Debug
        </button>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      fontSize: '14px',
      minWidth: '300px',
      fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>🎥 Camera Debug</h3>
        <button 
          onClick={() => setDebugMode(false)}
          style={{
            background: '#f44336',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Current Section: </strong>
        <span style={{ color: '#4CAF50' }}>{currentSection} - {sectionNames[currentSection]}</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '10px 0 5px 0' }}>Position:</h4>
        {['X', 'Y', 'Z'].map((axis, idx) => (
          <div key={axis} style={{ marginBottom: '8px' }}>
            <label style={{ display: 'inline-block', width: '20px' }}>{axis}:</label>
            <input
              type="range"
              min="-20"
              max="20"
              step="0.1"
              value={debugCamera.position[idx]}
              onChange={(e) => handlePositionChange(idx, e.target.value)}
              style={{ width: '150px', marginLeft: '10px', marginRight: '10px' }}
            />
            <input
              type="number"
              step="0.1"
              value={debugCamera.position[idx].toFixed(1)}
              onChange={(e) => handlePositionChange(idx, e.target.value)}
              style={{ width: '60px', background: '#333', color: 'white', border: '1px solid #555' }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '10px 0 5px 0' }}>Look At:</h4>
        {['X', 'Y', 'Z'].map((axis, idx) => (
          <div key={axis} style={{ marginBottom: '8px' }}>
            <label style={{ display: 'inline-block', width: '20px' }}>{axis}:</label>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.1"
              value={debugCamera.lookAt[idx]}
              onChange={(e) => handleLookAtChange(idx, e.target.value)}
              style={{ width: '150px', marginLeft: '10px', marginRight: '10px' }}
            />
            <input
              type="number"
              step="0.1"
              value={debugCamera.lookAt[idx].toFixed(1)}
              onChange={(e) => handleLookAtChange(idx, e.target.value)}
              style={{ width: '60px', background: '#333', color: 'white', border: '1px solid #555' }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '10px 0 5px 0' }}>FOV:</h4>
        <input
          type="range"
          min="10"
          max="120"
          step="1"
          value={debugCamera.fov}
          onChange={(e) => handleFovChange(e.target.value)}
          style={{ width: '150px', marginRight: '10px' }}
        />
        <input
          type="number"
          min="10"
          max="120"
          value={Math.round(debugCamera.fov)}
          onChange={(e) => handleFovChange(e.target.value)}
          style={{ width: '60px', background: '#333', color: 'white', border: '1px solid #555' }}
        />
      </div>

      <button 
        onClick={copyToClipboard}
        style={{
          background: '#2196F3',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          width: '100%',
          marginTop: '10px'
        }}
      >
        📋 Copy Camera Config
      </button>
    </div>
  )
}

export default Fluide
