import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

import Home from './App.jsx'
import Fluide from './tabs/Fluide/Fluide.jsx'
import Muschi from './tabs/Muschi/Muschi.jsx'
import Parghii from './tabs/Parghii/Parghii.jsx'
import NotFoundPage from './NotFoundPage.jsx'

createRoot(document.getElementById('root')).render(
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
  </StrictMode>,
)
