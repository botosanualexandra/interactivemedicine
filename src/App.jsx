import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience.jsx'
import './App.css'
import Navbar from './components/Navbar.jsx'

function App() {

  return (
    <>
      <Navbar />
      <Canvas>
        <Experience />
      </Canvas>
    </>
  )
}

export default App
