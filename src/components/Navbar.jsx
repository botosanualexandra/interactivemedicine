import React, { useState } from 'react'
import { Scroll } from '@react-three/drei'
import '../App.css'

function Navbar() {
  const [language, setLanguage] = useState('EN')

  const toggleLanguage = () => {
    const newLanguage = language === 'EN' ? 'RO' : 'EN'
    setLanguage(newLanguage)
    // Set global language for other components to access
    window.currentLanguage = newLanguage
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLanguage }))
  }

  // Initialize global language
  React.useEffect(() => {
    window.currentLanguage = language
  }, [])

  return (
    <section className="navbar">
      <button onClick={toggleLanguage} className="language-toggle">
        {language}
      </button>
    </section>
  )
}

export default Navbar
