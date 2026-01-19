import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import './App.css'
import { AIFrameShapeUtil } from './shapes/AIFrameShape'
import { MainLayout } from './components/Layout/MainLayout'

const customShapeUtils = [AIFrameShapeUtil]

function App() {
    return (
        <div style={{ position: 'fixed', inset: 0 }}>
            <Tldraw 
                shapeUtils={customShapeUtils} 
                hideUi
                licenseKey={import.meta.env.VITE_TLDRAW_LICENSE_KEY}
                cameraOptions={{
                    zoomSteps: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 4, 8],
                }}
                onMount={(editor) => {
                    editor.setCamera({ x: 0, y: 0, z: 0.04 })
                    // Delay focus to ensure it sticks after initial render
                    setTimeout(() => {
                        editor.focus()
                    }, 100)
                }}
                autoFocus
            >
                <MainLayout />
            </Tldraw>
        </div>
    )
}

export default App;
