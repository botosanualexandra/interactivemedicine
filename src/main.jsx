import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

import Home from './App.jsx'
import Fluide from './tabs/Fluide/Fluide.jsx'
import Muschi from './tabs/Muschi/Muschi.jsx'
import Parghii from './tabs/Parghii/Parghii.jsx'
import NotFoundPage from './NotFoundPage.jsx'


function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function MobileBlocker() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(255,255,255,1)',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: '#222',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <img src="/banner_big.png" alt="Universul Cunoașterii" style={{ width: 600, marginBottom: 24 }} />
      <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>Nu este disponibil pe mobil</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: 24 }}>
        Acest site nu este optimizat pentru dispozitive mobile.<br />
        Vă rugăm să accesați de pe un calculator sau laptop pentru cea mai bună experiență.
      </p>
      <span style={{ fontSize: '1rem', color: '#888' }}>This website is not intended for mobile. Please switch to desktop.</span>
    </div>
  );
}

function AppRoot() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);
  if (isMobile) return <MobileBlocker />;
  return (
    <StrictMode>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fluide" element={<Fluide />} />
          <Route path="/muschi" element={<Muschi />} />
          <Route path="/parghii" element={<Parghii />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<AppRoot />)
