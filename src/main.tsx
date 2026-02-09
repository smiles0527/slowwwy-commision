import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { registerGSAPPlugins } from '@animations/gsap-utils'
import '@styles/global.css'

// Initialize GSAP configuration
registerGSAPPlugins()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
