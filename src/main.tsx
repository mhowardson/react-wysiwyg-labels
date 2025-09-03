import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LabelDesigner from './index.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">React Label Designer - Development</h1>
      <LabelDesigner
        ui="tailwind"
        enableTemplates={true}
        enableVariables={true}
        enableImageUpload={true}
      />
    </div>
  </StrictMode>,
)