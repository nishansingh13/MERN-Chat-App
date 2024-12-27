import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '../src/index.css'
import Wrap from './Wrap.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Wrap />
  </StrictMode>,
)
