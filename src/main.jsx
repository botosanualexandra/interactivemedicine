import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'

import Navbar from './components/Navbar.jsx'

import Arm from './screens/arm/Arm.jsx'
import NotFoundPage from './NotFoundPage.jsx'

const router = createBrowserRouter([
  { path: '/botosanumedicina', element: <App /> },
  { path: '*', element: <NotFoundPage /> },
  { path: '/botosanumedicina/arm', element: <Arm /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <RouterProvider router={router} />
  </StrictMode>,
)
