import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { clearSharedSetupFromUrl, readSharedSetup } from '@/features/share/share'
import { WorkspaceProvider } from '@/features/workspace'
import '@fontsource-variable/plus-jakarta-sans'
import '@/index.css'

// A shared link (?desk=…&chair=…&item=…) takes priority over the setup saved on this device.
const sharedSetup = readSharedSetup()
if (sharedSetup) clearSharedSetupFromUrl()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorkspaceProvider initialState={sharedSetup ?? undefined}>
      <App />
    </WorkspaceProvider>
  </StrictMode>,
)
