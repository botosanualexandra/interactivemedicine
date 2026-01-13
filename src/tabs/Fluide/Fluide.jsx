
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Box, OrbitControls, ScrollControls, Scroll, useScroll, Stats } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import './Fluide.css'
import MODEL_Sange from '../../components/m_sange'

function Home() {
  return (
    <Canvas 
        style={{ height: '100vh' }} 
        camera={{ position: [0, 2, 5], fov: 40 }}
      >
        <ScrollControls pages={8} damping={0.1}>
          <Scene />
          <Scroll html style={{ width: '100%' }}>
            <Hero />
            <CeEsteUnFluid />
            <Necesara />
            <CePune />
            <Presiune />
            <Tipuri />
            <Fizica />
            <Probleme />
          </Scroll>
        </ScrollControls>
      </Canvas>
  )
}

function CameraRig() {
  const { camera } = useThree()
  const scroll = useScroll()
  
  useFrame(() => {
    const offset = scroll.offset // 0 to 1 based on scroll position
    
    // Animate camera position based on scroll
    camera.position.x = Math.sin(offset * Math.PI * 2) * 5
    camera.position.y = 2 + offset * 3 // Move camera up as we scroll
    camera.position.z = Math.cos(offset * Math.PI * 2) * 5

    camera.fov = 40
    camera.updateProjectionMatrix()
    
    // Always look at the center
    camera.lookAt(0, 0, 0)
  })
  
  return null
}


function PostProcessing({enabled = true}) {

  if(!enabled) return null;

  return (
    <EffectComposer>
      <Bloom 
        intensity={0.3}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.025}
        blendFunction={BlendFunction.ADD}
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


function Scene() {
  return (
    <>
      <CameraRig />
      <PostProcessing enabled={false} />
      <Lighting />

      <group rotation={[0, -45, 0]} position={[0, 0, 0]}>
        <MODEL_Sange position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={.9}/>
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
      <p>Un fluid este o substanță care curge și ia forma vasului în care se află.</p>
      <h3>În corp avem două fluide principale:</h3>
      <ul>
        <li>Sângele 🩸</li>
        <li>Limfa 💧</li>
      </ul>
      👉 Animație cu lichid care curge prin tuburi; utilizatorul poate schimba viteza.
    </figure>
  )
}

function Necesara(){
  return (
    <figure className="necesara">
      <header>
        <h2>2️⃣ De ce este necesară curgerea fluidelor?</h2>
        <p>Un fluid este o substanță care curge și ia forma vasului în care se află.</p>
      </header>

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
      👉 Click pe o organ → vezi ce aduce sângele acolo.
    </figure>
  )
}

function CePune(){
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

function Tipuri() {
  return (
    <figure className="tipuri">
      <h2>5️⃣ Tipuri de vase și rolul lor</h2>
      {/* <p>Fluidul curge din zona cu presiune mare spre presiune mică.</p> */}

      <article>
        <ul>
          <h3>🟥 Artere:</h3>
          <li>duc sângele de la inimă</li>
          <li>presiune mare</li>
        </ul>

        <ul>
          <h3>🟦 Vene:</h3>
          <li>aduc sângele înapoi</li>
          <li>valve</li>
        </ul>

        <ul>
          <h3>🟨 Capilare:</h3>
          <li>schimbul de oxigen și nutrienți</li>
        </ul>
      </article>

      👉 Click pe fiecare vas → apare explicația + animație.
    </figure>
  )
}

function Fizica() {
  return (
    <figure className="fizica">
      <h2>6️⃣ Legile fizicii aplicate</h2>
      <p>Fluidul curge din zona cu presiune mare spre presiune mică.</p>

      <h3>Legea lui Poiseuille:</h3>
      <ul>
        <li>diametrul vasului</li>
        <li>presiune</li>
        <li>vâscozitate</li>
      </ul>

      👉 Îngustezi un vas → vezi cum scade debitul.
    </figure>
  )
}

function Probleme() {
  return (
    <figure className="probleme">
      <h2>7️⃣ Probleme când curgerea este afectată</h2>
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

export default Home
