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
                cameraOptions={{
                    zoomSteps: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 4, 8],
                }}
            >
                <MainLayout />
            </Tldraw>
        </div>
    )
}

export default App;
