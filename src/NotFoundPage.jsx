import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '10px' }}>
      <h1>Page not found ❌ </h1>
      <Link to="/" style={{ 
        padding: '12px 24px',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'background-color 0.2s',
        border: 'none',
        cursor: 'pointer'
      }}>Go to Home</Link>
    </div>
  )
}

export default NotFoundPage
