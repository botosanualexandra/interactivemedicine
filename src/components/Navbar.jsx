import React, { useState } from 'react'
import './Navbar.css'
import { useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const [language, setLanguage] = useState('RO')
  const location = useLocation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLanguage = language === 'EN' ? 'RO' : 'EN'
    setLanguage(newLanguage)
    window.currentLanguage = newLanguage
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLanguage }))
  }

  // Initialize global language
  React.useEffect(() => {
    window.currentLanguage = language
  }, [])

  return (
    <section className="navbar">
      {location.pathname !== '/' && (
        <article className="back-button" onClick={() => navigate('/')}> 
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
