
import './Muschi.css';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Box, OrbitControls, ScrollControls, Scroll, useScroll, Stats, Text } from '@react-three/drei';
import * as THREE from 'three';
import MODEL_Muscles from '../../components/m_muscles';
import textDocument from './TextDocument';
import { useState, useRef, useEffect } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

export const muschiContext = createContext();

const cameraStates = [
  { position: [-5, 0, 5], lookAt: [0, .0, 0], fov: 60 },
  { position: [0, 0, 5], lookAt: [.15, .3, 0], fov: 35 },
  { position: [-5, 7, 4], lookAt: [-3, 0, 0], fov: 45 },
  { position: [-3, -2, 6], lookAt: [-2, 0, 0], fov: 60 },
  { position: [-12, 9, 6], lookAt: [-3, 2, 0], fov: 30 },
  { position: [-3, 1, 6], lookAt: [-2, 0, 0], fov: 60 },
  { position: [-3, 3, 7], lookAt: [0, 1, 0], fov: 40 },
];

function CameraController() {
  const { camera } = useThree();
  const scroll = useScroll();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    const pages = cameraStates.length - 1;
    const scrollPos = scroll.offset * pages;
    let page = Math.floor(scrollPos);
    let nextPage = Math.min(page + 1, pages);
    const t = scrollPos - page;

    // Guard against out-of-bounds
    page = Math.max(0, Math.min(page, pages));
    nextPage = Math.max(0, Math.min(nextPage, pages));

    // Lerp position
    const posA = new THREE.Vector3(...cameraStates[page].position);
    const posB = new THREE.Vector3(...cameraStates[nextPage].position);
    const basePos = new THREE.Vector3().lerpVectors(posA, posB, t);

    // Oscillate X position (panning)
    timeRef.current += delta;
    const PAN_AMPLITUDE = 0.5; // max pan distance
    const PAN_SPEED = 0.5; // lower is slower
    const panOffset = Math.sin(timeRef.current * PAN_SPEED) * PAN_AMPLITUDE;
    camera.position.set(basePos.x + panOffset, basePos.y, basePos.z);

    // Lerp lookAt
    const lookA = new THREE.Vector3(...cameraStates[page].lookAt);
    const lookB = new THREE.Vector3(...cameraStates[nextPage].lookAt);
    const lookAt = lookA.clone().lerp(lookB, t);
    camera.lookAt(lookAt);

    // Lerp fov
    camera.fov = THREE.MathUtils.lerp(cameraStates[page].fov, cameraStates[nextPage].fov, t);
    camera.updateProjectionMatrix();
  });
  return null;
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

function Scene({ currentPage, selectedArmType, sendImpulse, elapsedTime }) {

  return (
    <>
      <CameraController />
      <ambientLight intensity={1} />
      <directionalLight
        position={[-5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <MuscleModelRig currentPage={currentPage} selectedArmType={selectedArmType} 
      sendImpulse={sendImpulse} elapsedTime={elapsedTime}
      />
      <PostProcessing enabled={true} />
      <Skybox />
    </>
  );
}

function MuscleModelRig({ currentPage, selectedArmType, sendImpulse, elapsedTime }) {
  // You can use currentPage here to control animation, visibility, etc.
  return (
    <group>
      <MODEL_Muscles position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}
       currentPage={currentPage} selectedArmType={selectedArmType} sendImpulse={sendImpulse} elapsedTime={elapsedTime} />
    </group>
  );
}

function Muschi() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArmType, setSelectedArmType] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const sendImpulse = useRef();
  const [focusedGroup, setFocusedGroup] = useState(null);
  const [language, setLanguage] = useState(window.currentLanguage === 'EN' ? 'en' : 'ro');

  useEffect(() => {
    const handler = (e) => setLanguage(e.detail === 'EN' ? 'en' : 'ro');
    window.addEventListener('languageChanged', handler);
    return () => window.removeEventListener('languageChanged', handler);
  }, []);

  // Custom hook to track scroll page
  function PageTracker() {
    const scroll = useScroll();
    const PAGE_OFFSET = 0.4; // Change this value for earlier/later switching
    useFrame(() => {
      if (!scroll) return;
      const pages = cameraStates.length;
      const offset = scroll.offset * (pages - 1) - PAGE_OFFSET;
      const page = Math.max(1, Math.min(pages, Math.round(offset) + 1)); // Clamp between 1 and pages
      setCurrentPage(page);
    });
    return null;
  }

  // Disable scroll when a group is focused
  const scrollEnabled = focusedGroup === null;
  return (
    <muschiContext.Provider value={{ focusedGroup, setFocusedGroup }}>
      <article className="Muschi">
        <Canvas style={{ height: '100vh' }} camera={{ position: [0, 2, 5], fov: 40 }}>
          <ScrollControls pages={cameraStates.length} damping={0.1} enabled={scrollEnabled}>
            <PageTracker />
            <Scene currentPage={currentPage} selectedArmType={selectedArmType} sendImpulse={sendImpulse} elapsedTime={elapsedTime}
                  />
            <Scroll html style={{ width: '100%' }}>
              <Hero language={language} />
              <CeEste focusedGroup={focusedGroup} setFocusedGroup={setFocusedGroup} language={language} />
              <CeEsteContractia language={language} />
              <Structura selectedArmType={selectedArmType} setSelectedArmType={setSelectedArmType} language={language} />
              <CumApare sendImpulse={() => sendImpulse.current()} language={language} />
              <Forta setElapsedTime={setElapsedTime} language={language} />
            </Scroll>
          </ScrollControls>
        </Canvas>
      </article>
    </muschiContext.Provider>
  );
}

function Hero({ language }) {
  return (
    <figure className="hero">
      <h1>{textDocument.hero[language]}</h1>
    </figure>
  );
}

function CeEste({ focusedGroup = 'left', setFocusedGroup, language }) {
  const info = textDocument.ceEste.info;
  const groupKey = focusedGroup || 'default';
  return (
    <figure id='ceeste_muschi'>
      <h1>{textDocument.ceEste.title[language]}</h1>
      <article>
        <ul>
          <h3>{textDocument.ceEste.organ[language]}</h3>
          <li>{textDocument.ceEste.produce_forta[language]}</li>
          <li>{textDocument.ceEste.produce_miscare[language]}</li>
          <li>{textDocument.ceEste.mentine_postura[language]}</li>
        </ul>
        <ul>
          <h3>{textDocument.ceEste.tipuri[language]}</h3>
          <li>{textDocument.ceEste.scheletici[language]}</li>
          <li>{textDocument.ceEste.cardiac[language]}</li>
          <li>{textDocument.ceEste.netezi[language]}</li>
        </ul>
      </article>
      <section className='muschi_panel' id={focusedGroup ? 'muschi_panel_visible' : 'muschi_panel_hidden'}>
        <h1>{info[groupKey]?.title?.[language] || ''}</h1>
        <p>
          {info[groupKey]?.description?.[language] || info.default[language]}
        </p>
        <i className="fa-solid fa-xmark" onClick={() => setFocusedGroup(null)}></i>
        <button onClick={() => setFocusedGroup(null)}>{textDocument.ceEste.close[language]}</button>
      </section>

      {focusedGroup && <section className='close_panel' onClick={() => setFocusedGroup(null)}></section>}
    </figure>
  );
}

function CeEsteContractia({ language }) {
  return (
    <figure >
      <h1>{textDocument.ceEsteContractia.title[language]}</h1>
      <p>{textDocument.ceEsteContractia.desc[language]}</p>
      <ul>
        <h3>{textDocument.ceEsteContractia.poate[language]}</h3>
        <li>{textDocument.ceEsteContractia.scurteze[language]}</li>
        <li>{textDocument.ceEsteContractia.ramana[language]}</li>
        <li>{textDocument.ceEsteContractia.alungeasca[language]}</li>
      </ul>
    </figure>
  );
}

function Structura({ selectedArmType, setSelectedArmType, language }){
    return (
    <figure id='structura_muschiului'>
      <h1>{textDocument.structura.title[language]}</h1>
      <article>
        <ul>
          <h3>{textDocument.structura.izotonica.title[language]}</h3>
          <li>{textDocument.structura.izotonica.scurteaza[language]}</li>
          <li>{textDocument.structura.izotonica.miscare[language]}</li>
          <li><button onClick={() => setSelectedArmType(1)} 
          id={selectedArmType === 1 ? "struct_btn_selected" : ""}>{textDocument.structura.izotonica.vizualizare[language]}</button></li>
        </ul>
        <ul>
          <h3>{textDocument.structura.izometrica.title[language]}</h3>
          <li>{textDocument.structura.izometrica.neschimba[language]}</li>
          <li>{textDocument.structura.izometrica.forta[language]}</li>
          <li><button onClick={() => setSelectedArmType(2)}
            id={selectedArmType === 2 ? "struct_btn_selected" : ""}>{textDocument.structura.izometrica.vizualizare[language]}</button></li>
        </ul>
        <ul>
          <h3>{textDocument.structura.excentrica.title[language]}</h3>
          <li>{textDocument.structura.excentrica.alungeste[language]}</li>
          <li>{textDocument.structura.excentrica.exemplu[language]}</li>
          <li><button onClick={() => setSelectedArmType(3)}
            id={selectedArmType === 3 ? "struct_btn_selected" : ""}>{textDocument.structura.excentrica.vizualizare[language]}</button></li>
        </ul>
      </article>
    </figure>
  );
}

function CumApare({ sendImpulse, language }){
    return (
      <figure id='cumapare'>
        <h1>{textDocument.cumApare.title[language]}</h1>
        <ol>
          <h3>{textDocument.cumApare.izotonica[language]}</h3>
          {textDocument.cumApare.steps.map((step, idx) => (
            <li key={idx}>{step[language]}</li>
          ))}
          <li><button onClick={() => {sendImpulse()}}>{textDocument.cumApare.sendImpulse[language]}</button></li>
        </ol>
      </figure>
    );
}

function Forta({ setElapsedTime, language }){
    return (
    <figure id='forta_musculara'>
      <h1>{textDocument.forta.title[language]}</h1>
      <ul>
        <h3>{textDocument.forta.ceDetermina[language]}</h3>
        <li>{textDocument.forta.dimensiune[language]}</li>
        <li>{textDocument.forta.numarFibre[language]}</li>
        <li>{textDocument.forta.antrenament[language]}</li>
        <h3>{textDocument.forta.numarActive[language]}</h3>
        <input
          id="fibersSlider"
          type="range"
          min={5}
          max={100}
          defaultValue={5}
          onChange={e => {setElapsedTime(e.target.value)
          }}
        />
      </ul>
    </figure>
  );
}

export default Muschi;