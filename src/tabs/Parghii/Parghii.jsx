
import './Parghii.css';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Box, OrbitControls, ScrollControls, Scroll, useScroll, Stats, Text } from '@react-three/drei';
import * as THREE from 'three';
import textDocument from './TextDocument';
import { useState, useRef, useEffect } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Model } from '../../components/m_parghii.jsx';

const cameraStates = [ //totalul slidelor + 3
  { position: [-5, 3, 5], lookAt: [0, .0, 0], fov: 60 },
  { position: [2, 2, 3], lookAt: [.25, .5, 0], fov: 34 },
  { position: [4, 2, 1], lookAt: [-1, 1, 1], fov: 55 },

  { position: [1, 1, -1], lookAt: [-1, 2, 0], fov: 60 },
  { position: [2, 0, 8], lookAt: [0, 2, 0], fov: 45 },
  { position: [-20, 3, 25], lookAt: [-9, 1, 0], fov: 10 },

  { position: [5, -3, -5], lookAt: [0, 1.25, 0], fov: 90 },
  { position: [-4, 3, 7], lookAt: [0, 1.25, 0], fov: 50 },

  { position: [2, 0, 15], lookAt: [0, 0, 0], fov: 40 },

  { position: [-1, 1.3, 5], lookAt: [2, 4, 0], fov: 75 },

  { position: [0, 1.5, 2], lookAt: [.1, 1.5, 0], fov: 25 },
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
{/* 
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.001, 0.001]}
      /> */}
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

function Scene({ currentPage, s3_1_ElapsedTime, triggerVarfuri, postura, triggerGreutate, triggerAruncare }) {
  return (
    <>
      <CameraController />
      <ambientLight intensity={3} />
      <directionalLight
        position={[-5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Model 
        currentPage={currentPage} 
        s3_1_ElapsedTime={s3_1_ElapsedTime} 
        triggerVarfuri={triggerVarfuri} 
        postura={postura} 
        triggerGreutate={triggerGreutate} 
        triggerAruncare={triggerAruncare} />
      <PostProcessing enabled={true} />
      <Skybox />
    </>
  );
}

function Parghii() {
  const [currentPage, setCurrentPage] = useState(1);
  const [language, setLanguage] = useState(window.currentLanguage === 'EN' ? 'en' : 'ro');

  useEffect(() => {
    const handler = (e) => setLanguage(window.currentLanguage === 'EN' ? 'en' : 'ro');
    window.addEventListener('languageChanged', handler);
    return () => window.removeEventListener('languageChanged', handler);
  }, []);

  useEffect(() => {
    document.title = language === 'en' ? 'Levers - Bones' : 'Parghii - Oasele';
  }, [language]);

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

  const [s3_1_ElapsedTime, setS3_1_ElapsedTime] = useState(.3);
  const [triggerVarfuri, setTriggerVarfuri] = useState(0);
  const [triggerGreutate, setTriggerGreutate] = useState(0);
  const [postura, setPostura] = useState(0);
  const [triggerAruncare, setTriggerAruncare] = useState(0);
  
  useEffect(() => {
    console.log(s3_1_ElapsedTime);
  }, [s3_1_ElapsedTime]);

  return (
    <>
      {/* <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        marginLeft: '200px',
        background: 'rgba(0,0,0,0.85)',
        color: 'white',
        padding: '0.5rem 1rem',
        fontSize: '1.1rem',
        textAlign: 'left'
      }}>
        current page - {currentPage}
      </div> */}
      <article className="Parghii">
        <Canvas style={{ height: '100vh' }} camera={{ position: [0, 2, 5], fov: 40 }}>
          <ScrollControls pages={cameraStates.length} damping={0.1}>
            <PageTracker />
            <Scene 
            currentPage={currentPage} 
            s3_1_ElapsedTime={s3_1_ElapsedTime} 
            triggerVarfuri={triggerVarfuri} 
            postura={postura} 
            triggerGreutate={triggerGreutate} 
            triggerAruncare={triggerAruncare} />

            <Scroll html style={{ width: '100%' }}>
              <Hero language={language}/>
              <CeEste language={language}/>
              <DeCe language={language}/>
              <Tipuri 
                language={language}
                s3_1_ElapsedTime={s3_1_ElapsedTime} 
                setS3_1_ElapsedTime={setS3_1_ElapsedTime} 
                ridicaPeVarfuri={setTriggerVarfuri} 
                ridicaGreutate={setTriggerGreutate} />
              <BratulFortei language={language}/>
              <Avantaj language={language}/>
              <Ineficiente language={language} triggerAruncare={setTriggerAruncare} />
              <Probleme language={language} postura={postura} setPostura={setPostura} />
              <Concluzii language={language}/>
            </Scroll>
          </ScrollControls>
        </Canvas>
      </article>
    </>
  );
}

function Hero({ language }) {
  return (
    <figure className="hero">
      <h1>{textDocument[language].hero.title}</h1>
    </figure>
  );
}

function CeEste({ language }){
  return (
    <figure className="ceeste">
      <h2>{textDocument[language].ceEste.title}</h2>
      <ul>
        <h3>{textDocument[language].ceEste.desc}</h3>
        {textDocument[language].ceEste.list.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <ul>
        <h3>{textDocument[language].ceEste.elements}</h3>
        {textDocument[language].ceEste.elementsList.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </figure>
  );
}

function DeCe({ language }){
  return (
    <figure className="dece">
      <h2>{textDocument[language].deCe.title}</h2>
      <ul>
        {textDocument[language].deCe.list.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </figure>
  );
}

function Tipuri({ language, s3_1_ElapsedTime, setS3_1_ElapsedTime, ridicaPeVarfuri, ridicaGreutate }){
  const t = textDocument[language].tipuri;
  return (
    <figure className="tipurii">
      <h2>{t.title}</h2>
      <ul>
        <h3>{t.grad1}</h3>
        <h3>{t.grad1Ex}</h3>
        {t.grad1List.map((item, i) => <li key={i}>{item}</li>)}
        <h3>{t.grad1Adv}</h3>
        {t.grad1AdvList.map((item, i) => <li key={i}>{item}</li>)}
        <h3 style={{marginTop: '20px'}}>{t.grad1Pos}</h3>
        <input
          type="range"
          min={0}
          max={0.65}
          step={0.05}
          value={s3_1_ElapsedTime}
          onChange={e => {setS3_1_ElapsedTime(e.target.value)}}
          style={{ width: '100%' }}
        />
      </ul>
      <ul>
        <h3>{t.grad2}</h3>
        <h3>{t.grad2Ex}</h3>
        {t.grad2List.map((item, i) => <li key={i}>{item}</li>)}
        <h3>{t.grad2Adv}</h3>
        {t.grad2AdvList.map((item, i) => <li key={i}>{item}</li>)}
        <button style={{marginTop: '10px'}} onClick={() => {ridicaPeVarfuri(prev => prev + 1)}}>
          {t.grad2Btn}
        </button>
      </ul>
      <ul>
        <h3>{t.grad3}</h3>
        <h3>{t.grad3Ex}</h3>
        {t.grad3List.map((item, i) => <li key={i}>{item}</li>)}
        <h3>{t.grad3Adv}</h3>
        {t.grad3AdvList.map((item, i) => <li key={i}>{item}</li>)}
        <button style={{marginTop: '10px'}} onClick={() => {ridicaGreutate(prev => prev + 1)}}>
          {t.grad3Btn}
        </button>
      </ul>
    </figure>
  );
}

function BratulFortei({ language }){
  const t = textDocument[language].bratulFortei;
  return (
    <figure className="bratulfortei">
      <h2 style={{marginTop: '20px'}}>{t.title}</h2>
      <ul>
        {t.list.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <ul>
        <h3>{t.concluzie}</h3>
        {t.concluzieList.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </figure>
  );
}

function Avantaj({ language }){
  const t = textDocument[language].avantaj;
  return (
    <figure className="avantaj">
      <h2 style={{marginTop: '0px'}}>{t.title}</h2>
      <ul>
        <h3>{t.inCorp}</h3>
        {t.list.map((item, i) => <li key={i}>{item}</li>)}
        <ul>
          <h3>{t.sacrificiu}</h3>
          {t.sacrificiuList.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </ul>
    </figure>
  );
}

function Ineficiente({ language, triggerAruncare }){
  const t = textDocument[language].ineficiente;
  return (
    <figure className="ineficiente">
      <h2 style={{marginTop: '8rem'}}>{t.title}</h2>
      <ul>
        <h3>{t.raspuns}</h3>
        {t.list.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <ul>
        <h3>{t.exemplu}</h3>
        {t.exempluList.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <button style={{marginTop: '10px'}} onClick={() => {triggerAruncare(prev => prev + 1)}}>
        {t.btn}
      </button>
    </figure>
  );
}

function Probleme({ language, postura, setPostura }){
  const t = textDocument[language].probleme;
  return (
    <figure className="problemee">
      <h2>{t.title}</h2>
      <ul>
        <h3>{t.exemple}</h3>
        {t.exempleList.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <ul>
        <h3>{t.aplicatie}</h3>
        {t.aplicatieList.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <h3 style={{marginTop: '20px'}}>{t.corecteaza}
        {postura > .5 ? <p style={{color: 'limegreen'}}>{t.corecta}</p> : <p style={{color: 'darkred'}}>{t.incorecta}</p>}</h3>
      <input
        type="range"
        min={0}
        max={1.6}
        step={0.05}
        value={postura}
        onChange={e => {setPostura(e.target.value)}}
        style={{ width: '100%' }}
      />
    </figure>
  );
}

function Concluzii({ language }){
  const t = textDocument[language].concluzii;
  return (
    <figure className="concluzii">
      <h2>{t.title}</h2>
      <p>{t.desc}</p>
      <ul>
        {t.list.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </figure>
  );
}



export default Parghii;