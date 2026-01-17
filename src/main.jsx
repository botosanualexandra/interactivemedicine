import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

import Home from './App.jsx'
import Fluide from './tabs/Fluide/Fluide.jsx'
import Muschi from './tabs/Muschi/Muschi.jsx'
import Parghii from './tabs/Parghii/Parghii.jsx'
import NotFoundPage from './NotFoundPage.jsx'

const router = createBrowserRouter([
  { path: '/botosanumedicina', element: <Home /> },
  { path: '/botosanumedicina/circulatia', element: <Fluide /> },
  { path: '/botosanumedicina/muschi', element: <Muschi /> },
  { path: '/botosanumedicina/parghii', element: <Parghii /> },
  { path: '*', element: <NotFoundPage /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <RouterProvider router={router} />
  </StrictMode>,
)
