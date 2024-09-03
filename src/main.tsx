import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import GameField from "./gameField.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <GameField/>
  </StrictMode>,
)
