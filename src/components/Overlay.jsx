import { Scroll } from '@react-three/drei'
import '../App.css'
import { useState, useEffect } from 'react'
import { organs } from "../organs_list";

function Overlay() {
  return (
    <Scroll html style={{ width: '100%' }}>
      <Hero />
      <OverlayOrganInformation />
    </Scroll>
  )
}

function Hero() {
  const [language, setLanguage] = useState('EN')
  
  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail)
    }
    
    // Set initial language
    setLanguage(window.currentLanguage || 'EN')
    
    // Listen for language changes
    window.addEventListener('languageChanged', handleLanguageChange)
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [])
  
  const content = {
    EN: {
      title: "Interactive Medicine",
      subtitle: "Scroll down to learn"
    },
    RO: {
      title: "Medicină Interactivă",
      subtitle: "Derulează în jos pentru a învăța"
    }
  }
  
  return (
    <section className="hero">
      <h1>{content[language].title}</h1>
      <p>{content[language].subtitle}</p>
      <i className="fa-solid fa-arrow-down"></i>
    </section>
  )
}

function OverlayOrganInformation() {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [language, setLanguage] = useState('EN')
  
  useEffect(() => {
    const checkForUpdates = () => {
      if (window.organSelectedIndex !== undefined && window.organSelectedIndex !== selectedIndex) {
        setSelectedIndex(window.organSelectedIndex)
      }
    }
    
    const handleLanguageChange = (event) => {
      setLanguage(event.detail)
    }
    
    // Set initial language
    setLanguage(window.currentLanguage || 'EN')
    
    // Check for updates regularly
    const interval = setInterval(checkForUpdates, 100)
    
    // Also check immediately
    checkForUpdates()
    
    // Listen for language changes
    window.addEventListener('languageChanged', handleLanguageChange)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [selectedIndex])
  
  const organ = selectedIndex >= 0 ? organs[language][selectedIndex] : null
  
  const handleCloseClick = () => {
    if (window.setOrganSelectedIndex) {
      window.setOrganSelectedIndex(-1)
    }
    // Resume rotation and reset camera
    if (window.setIsPaused) {
      window.setIsPaused(false)
    }
  }
  
  return (
    <section className={`organ-info-panel`}>
      <article style={{transform: `translateX(${selectedIndex >= 0 ? '0' : '150%'})`}}>
        <i className="fa-solid fa-xmark" id='close-button' onClick={handleCloseClick}></i>
        <div style={{padding: '5px 20px', minHeight: '0px'}}>
          <h2>{organ?.name || (language === 'EN' ? 'Select an organ' : 'Selectează un organ')}</h2>
          <p>{organ?.description || (language === 'EN' ? 'Click on an organ to learn more about it' : 'Fă clic pe un organ pentru a afla mai multe despre el')}</p>
        </div>
        <button>{language === 'EN' ? 'Learn More' : 'Află Mai Multe'}</button>
      </article>
    </section>
  )
}

export default Overlay
