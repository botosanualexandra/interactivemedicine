import React, { useState } from 'react'
import './Navbar.css'
import { Router } from 'react-router-dom'

function Navbar() {
  const [language, setLanguage] = useState('RO')

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

  const [showBack, setShowBack] = useState(window.location.pathname !== '/botosanumedicina')

  React.useEffect(() => {
    const handleTabChange = () => {
      // You can customize this logic to check for tab or route
      setShowBack(window.location.pathname !== '/botosanumedicina')
    }
    window.addEventListener('tabChanged', handleTabChange)
    window.addEventListener('popstate', handleTabChange)
    return () => {
      window.removeEventListener('tabChanged', handleTabChange)
      window.removeEventListener('popstate', handleTabChange)
    }
  }, [])

  return (
    <section className="navbar">
      {showBack && (
        <article className="back-button" onClick={() => window.location.href = '/botosanumedicina'}>
          <i className="fa-solid fa-angle-left"></i>
        </article>
      )}
      <button onClick={toggleLanguage} className="language-toggle">
        {language}
      </button>
    </section>
  )
}

export default Navbar
