import { BrowserRouter as Router, } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FrappeProvider } from 'frappe-react-sdk'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FrappeProvider>
      <Router>
        <App />
      </Router>
    </FrappeProvider>

  </StrictMode>,
)
