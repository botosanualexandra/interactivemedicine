
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
      <div style={{
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
      </div>
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
              <Hero/>
              <CeEste/>
              <DeCe/>
              <Tipuri 
              s3_1_ElapsedTime={s3_1_ElapsedTime} 
              setS3_1_ElapsedTime={setS3_1_ElapsedTime} 
              ridicaPeVarfuri={setTriggerVarfuri} 
              ridicaGreutate={setTriggerGreutate} />
              <BratulFortei/>
              <Avantaj/>
              <Ineficiente triggerAruncare={setTriggerAruncare} />
              <Probleme postura={postura} setPostura={setPostura} />
              <Concluzii/>
            </Scroll>
          </ScrollControls>
        </Canvas>
      </article>
    </>
  );
}

function Hero() {
  return (
    <figure className="hero">
      <h1>Parghii</h1>
    </figure>
  );
}

function CeEste(){
  return (
    <figure className="ceeste">
      <h2>1️⃣ Ce este o parghie?</h2>
      <ul>
        <h3>O pârghie este un sistem mecanic care:</h3>
        <li>transmite forța</li>
        <li>mărește sau micșorează forța</li>
        <li>schimbă direcția forței</li>
      </ul>

      <ul>
        <h3>Elemente ale pârghiei:</h3>
        <li>punct de sprijin (fulcrum)</li>
        <li>forță activă (mușchi)</li>
        <li>rezistență (greutate)</li>
      </ul>
    </figure>
  );
}

function DeCe(){
  return (
    <figure className="dece">
      <h2>2️⃣ De ce sunt oasele pârghii?</h2>
      <ul>
        <li>Oasele = brațele pârghiei</li>
        <li>Articulațiile = puncte de sprijin</li>
        <li>Mușchii = forța activă</li>
        <li>Greutatea corpului / obiectelor = rezistența</li>
      </ul>
    </figure>
  );
}

function Tipuri({ s3_1_ElapsedTime, setS3_1_ElapsedTime, ridicaPeVarfuri, ridicaGreutate }){
  return (
    <figure className="tipurii">
      <h2>3️⃣ Tipuri de pârghii în corpul uman</h2>
      <ul>
        <h3>Pârghia de gradul I - (punctul de sprijin între forță și rezistență)</h3>
        <h3>Exemplu:</h3>
        <li>Capul pe coloană</li>
        <li>Gâtul menține poziția capului</li>
        <h3>Avantaj:</h3>
        <li>Schimbă direcția forței</li>
        <h3 style={{marginTop: '20px'}}>Schimbă poziția gatului</h3>
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
        <h3>Pârghia de gradul II - (rezistența între punctul de sprijin și forță)</h3>
        <h3>Exemplu:</h3>
        <li>Ridicarea pe vârfuri</li>
        <li>Glezna = punct de sprijin</li>
        <li>Greutatea corpului = rezistență</li>
        <li>Mușchii gambei = forță</li>
        <h3>Avantaj:</h3>
        <li>Mărește forța</li>

        <button style={{marginTop: '10px'}} onClick={() => {ridicaPeVarfuri(prev => prev + 1)}}>
          ridicate pe varfuri
        </button>
      </ul>

      <ul>
        <h3>Pârghia de gradul III - (forța între punctul de sprijin și rezistență)</h3>
        <h3>Exemplu:</h3>
        <li>Flexia antebrațului</li>
        <li>Cotul = punct de sprijin</li>
        <li>Greutatea corpului = rezistență</li>
        <li>Bicepsul = forță</li>
        <li>Greutatea din mână = rezistență</li>
        <h3>Avantaj:</h3>
        <li>Mărește viteza și amplitudinea mișcării</li>
        <button style={{marginTop: '10px'}} onClick={() => {ridicaGreutate(prev => prev + 1)}}>
          ridica greutate
        </button>
      </ul>
    </figure>
  );
}

function BratulFortei(){
  return (
    <figure className="bratulfortei">
      <h2 style={{marginTop: '0px'}}>4️⃣ Brațul forței și brațul rezistenței</h2>
      <ul>
        <li>Brațul forței = distanța forței față de articulație</li>
        <li>Brațul rezistenței = distanța greutății față de articulație</li>
      </ul>

      <ul>
        <h3>Concluzie:</h3>
        <li>Cu cât brațul forței este mai mic → mușchiul trebuie să producă o forță mai mare.</li>
      </ul>
    </figure>
  );
}

function Avantaj(){
  return (
    <figure className="avantaj">
      <h2 style={{marginTop: '0px'}}>5️⃣ Avantaj mecanic în corpul uman</h2>
      <ul>
        <h3>În corp:</h3>
        <li>De cele mai multe ori avantaj mecanic &lt; 1</li>
        <ul>
          <h3>Corpul sacrifică forța pentru:</h3>
          <li>viteză</li>
          <li>precizie</li>
          <li>amplitudine</li>
        </ul>
      </ul>
    </figure>
  );
}

function Ineficiente( { triggerAruncare } ){
  return (
    <figure className="ineficiente">
      <h2 style={{marginTop: '40px'}}>6️⃣ De ce corpul folosește pârghii „ineficiente”?</h2>
      <ul>
        <h3>Răspuns:</h3>
        <li>Pentru mișcări rapide</li>
        <li>Pentru coordonare fină</li>
        <li>Pentru adaptabilitate</li>
      </ul>

      <ul>
        <h3>Exemplu:</h3>
        <li>Aruncarea</li>
        <li>Scrisul</li>
        <li>Mersul</li>
      </ul>

      <button style={{marginTop: '10px'}} onClick={() => {triggerAruncare(prev => prev + 1)}}>
        arunca
      </button>
    </figure>
  );
}

function Probleme({ postura, setPostura }){
  return (
    <figure className="problemee">
      <h2>7️⃣ Probleme biomecanice legate de pârghii</h2>
      <ul>
        <h3>Exemple:</h3>
        <li>Poziții incorecte</li>
        <li>Greutăți purtate departe de corp</li>
        <li>Suprasolicitarea articulațiilor</li>
      </ul>

      <ul>
        <h3>Aplicație practică:</h3>
        <li>Postura corectă reduce forțele inutile.</li>
      </ul>
      <h3 style={{marginTop: '20px'}}>Corectează postura:
        {postura > .5 ? <p style={{color: 'limegreen'}}>postura corecta</p> : <p style={{color: 'darkred'}}>postura incorecta</p>}</h3>
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

function Concluzii(){
  return (
    <figure className="concluzii">
      <h2>🎯 Concluzie generală</h2>
      <p>Corpul uman este un sistem biomecanic complex, unde:</p>
      <ul>
        <li>mușchii produc forță</li>
        <li>oasele acționează ca pârghii</li>
        <li>articulațiile sunt puncte de sprijin</li>
        <li>iar fluidele mențin viața</li>
      </ul>
    </figure>
  );
}



export default Parghii;