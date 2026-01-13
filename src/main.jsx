import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

import Home from './App.jsx'
import Fluide from './tabs/Fluide/Fluide.jsx'
import NotFoundPage from './NotFoundPage.jsx'

const router = createBrowserRouter([
  { path: '/botosanumedicina', element: <Home /> },
  { path: '/botosanumedicina/circulatia', element: <Fluide /> },
  { path: '*', element: <NotFoundPage /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <RouterProvider router={router} />
  </StrictMode>,
)
