
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Box, OrbitControls, ScrollControls, Scroll, useScroll, Stats } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import './Fluide.css'
import MODEL_Sange from '../../components/m_sange'
import { useState, useRef } from 'react';
import MODEL_Inima from '../../components/m_inima'
import * as THREE from 'three'

function Home() {
  const [animationsSpeed, setAnimationsSpeed] = useState(.25);
  const [heartBpm, setHeartBpm] = useState(72); // Default BPM
  const [debugMode, setDebugMode] = useState(false);
  const [debugCamera, setDebugCamera] = useState({
    position: [0, 2, 8],
    lookAt: [0, 0, 0],
    fov: 40
  });
  const [currentSection, setCurrentSection] = useState(0);

  return (
    <>
      <Canvas 
          style={{ height: '100vh' }} 
          camera={{ position: [0, 2, 5], fov: 40 }}
        >
          <ScrollControls pages={6} damping={0.1}>
            <Scene 
              animationsSpeed={animationsSpeed} 
              heartBpm={heartBpm}
              debugMode={debugMode}
              debugCamera={debugCamera}
              setCurrentSection={setCurrentSection}
            />
            <Scroll html style={{ width: '100%' }}>
              <Hero />
              <CeEsteUnFluid />
              <Necesara animationsSpeed={animationsSpeed} setAnimationsSpeed={setAnimationsSpeed}/>
              <CePune setHeartBpm={setHeartBpm} />
              <Presiune />
              <Probleme />
            </Scroll>
          </ScrollControls>
        </Canvas>
        
        {/* Camera Debug Panel - Outside Canvas */}
        <CameraDebugPanel 
          debugMode={debugMode}
          setDebugMode={setDebugMode}
          debugCamera={debugCamera}
          setDebugCamera={setDebugCamera}
          currentSection={currentSection}
        />
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
    { position: [-10.2, 8.0, -0.1], lookAt: [0.0, 0, 0.0], fov: 15 },
    // CePune - Left side angle
    { position: [0.0, 0.0, -3.6], lookAt: [0.0, 0.0, 0.0], fov: 80 },
    // Presiune - Bottom view looking up
    { position: [-5.4, 2.4, -6.0], lookAt: [0.0, 0.0, 0.0], fov: 35 },
    // Probleme - Wide overview
    { position: [0, 6, 12], lookAt: [0, 0, 0], fov: 50 }
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
        luminanceThreshold={0.1}
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
        position={[10, 10, 5]} 
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
    { position: [0, 0, 0], scale: 0 }
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

function Scene({ animationsSpeed, heartBpm, debugMode, debugCamera, setCurrentSection }) {
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
        <MODEL_Sange position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={.9} animationSpeed={combinedAnimationSpeed} />
      </group>

      <group position={[-2.5, 1, 2]} scale={1.5} rotation={[0, 0, 0]}>
        <HeartRig animationsSpeed={animationsSpeed} heartBpm={heartBpm} />
      </group>

      <gridHelper args={[25, 25]} material-transparent={true} material-opacity={0.2} />

      <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
      
      {/* FPS Stats */}
      <Stats />
    </>
  );
}

function Hero() {
  return (
    <figure className="s1hero">
      <h1>curgerea fluideor în corpul uman</h1>
      <p>Fluidele din corpul nostru, cum ar fi sângele și limfa, sunt esențiale pentru transportul substanțelor vitale și menținerea sănătății.</p>
    </figure>
  )
}

function CeEsteUnFluid() {
  return (
    <figure className="ceesteunfluid">
      <h2>1️⃣ Ce este un fluid?</h2>
      <p>Un fluid este o substanță care curge și ia forma 
        vasului în care se află.</p>
      {/* <h3>În corp avem două fluide principale:</h3>
      <article>
        <button>Sângele 🟥</button>
        <button>Limfa 🟩</button>
      </article> */}
      {/* <div style={{ margin: '20px 0' }}>
        <label htmlFor="flow-speed">Viteza curgerii: </label>
        <input 
          type="range" 
          id="flow-speed" 
          min="0.1" 
          max="2" 
          step="0.1" 
          defaultValue="1"
          style={{ margin: '0 10px' }}
          onChange={(e) => setAnimationsSpeed(parseFloat(e.target.value))}
        />
        <span>{animationsSpeed}x</span>
      </div> */}
    </figure>
  )
}

function Necesara({ animationsSpeed, setAnimationsSpeed }){
  return (
    <figure className="necesara">
      <header>
        <h2>2️⃣ De ce este necesară curgerea fluidelor?</h2>
        <p>Un fluid este o substanță care curge și ia forma vasului în care se află.</p>
      </header>

      <div>
        <h3 htmlFor="flow-speed">viteza fluideor</h3>
        <input 
          type="range" 
          id="flow-speed" 
          min="0.1" 
          max="1" 
          step="0.1" 
          defaultValue=".25"
          onChange={(e) => setAnimationsSpeed(parseFloat(e.target.value))}
        />
        {/* <span>{animationsSpeed}x</span> */}
      </div>

      <article>
        <ul>
          <h3>Funcțiile sângelui:</h3>
          <li>Transportă oxigen</li>
          <li>Transportă nutrienți</li>
          <li>Elimină dioxidul de carbon și toxinele</li>
          <li>Transportă hormoni</li>
          <li>Apără organismul</li>
        </ul>

        <ul>
          <h3>Funcțiile limfei:</h3>
          <li>Drenează lichidele din țesuturi</li>
          <li>Apără organismul (sistem imunitar)</li>
          <li>Transportă grăsimi</li>
        </ul>
        </article>
      {/* 👉 Click pe o organ → vezi ce aduce sângele acolo. */}
    </figure>
  )
}

function CePune({ setHeartBpm }){
   const bpms = {
    72: 'Normal', 
    100: 'Light exercise',
    140: 'Moderate exercise',
    180: 'High intensity exercise'
  };

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
        <h2>3️⃣ Ce pune fluidele în mișcare?</h2>
        <p>Fluidele din corpul nostru nu se mișcă de la sine - au nevoie de forțe care să le pună în circulație.</p>
      </header>

      <article>
        <ul>
          <h3>🩸 Sângele:</h3>
          <li>Este pus în mișcare de inimă (pompa).</li>
          <li>Inima creează presiune.</li>
        </ul>

        <ul>
          <h3>💪 Limfa:</h3>
          <li>Nu are pompă proprie.</li>
          <li>Este pusă în mișcare de:</li>
          <li>contracțiile mușchilor</li>
          <li>respirație</li>
          <li>valvele vaselor limfatice</li>
        </ul>
      </article>
      👉 Apasă pe inimă → vezi pulsul și debitul.
      👉 Activează mușchii → vezi limfa cum începe să circule.

      <div style={{ margin: '20px 0' }}>
        <h3>Bătăi Pe Minut: {currentBpm}bpm - {currentDescription}</h3>
        <input 
          type="range" 
          id="bpm-slider" 
          min="0" 
          max={bpmValues.length - 1} 
          step="1" 
          value={selectedBpmIndex}
          style={{ margin: '0 10px' }}
          onChange={(e) => handleBpmChange(parseInt(e.target.value))}
        />
      </div>
    </figure>
  )
}

function Presiune() {
  return (
    <figure className="presiune">
      <h2>4️⃣ Presiunea și viteza de curgere</h2>
      <p>Fluidul curge din zona cu presiune mare spre presiune mică.</p>
      <h3>Viteza depinde de:</h3>
      <ul>
        <li>diametrul vasului</li>
        <li>presiune</li>
        <li>vâscozitate</li>
      </ul>
      👉 Slider pentru diametrul vasului → vezi viteza modificată.
      
    </figure>
  )
}

function Probleme() {
  return (
    <figure className="probleme">
      <h2>5️⃣ Probleme când curgerea este afectată</h2>
      <p>Când curgerea fluidelor este întreruptă sau îngreunată, pot apărea diverse probleme de sănătate care afectează funcționarea organismului.</p>

      <ul>
      <li>🩸 Hipertensiune</li>
      <li>🫀 Tromboză</li>
      <li>💧 Edem (limfa nu circulă)</li>
      <li>Varice</li>
      </ul>

      👉 Click pe fiecare vas → apare explicația + animație.
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

export default Home
