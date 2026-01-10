import React, { useState } from 'react'
import '../App.css'
import { Router } from 'react-router-dom'

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
      {window.location.pathname !== '/botosanumedicina' && (
        <p onClick={() => window.location.href = '/botosanumedicina'}>back</p>
      )}

      <button onClick={toggleLanguage} className="language-toggle">
        {language}
      </button>
    </section>
  )
}

export default Navbar
