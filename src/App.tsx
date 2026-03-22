import { useState, useRef, useEffect } from 'react'
import './App.css'

interface TattooDesign {
  id: string
  name: string
  image: string
  category: string
}

const SAMPLE_TATTOOS: TattooDesign[] = [
  { id: '1', name: 'Dragon', image: '🐉', category: 'Traditional' },
  { id: '2', name: 'Rose', image: '🌹', category: 'Floral' },
  { id: '3', name: 'Skull', image: '💀', category: 'Gothic' },
  { id: '4', name: 'Phoenix', image: '🔥', category: 'Mythical' },
  { id: '5', name: 'Butterfly', image: '🦋', category: 'Nature' },
  { id: '6', name: 'Wolf', image: '🐺', category: 'Animal' },
  { id: '7', name: 'Moon', image: '🌙', category: 'Celestial' },
  { id: '8', name: 'Anchor', image: '⚓', category: 'Nautical' },
]

function App() {
  const [selectedTattoo, setSelectedTattoo] = useState<TattooDesign | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [overlayPosition, setOverlayPosition] = useState({ x: 50, y: 50 })
  const [overlaySize, setOverlaySize] = useState(100)
  const [isDragging, setIsDragging] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraActive(true)
        setCapturedImage(null)
      }
    } catch (err) {
      console.error('Camera access denied:', err)
      alert('Camera access is required to preview tattoos. Please grant permission.')
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL('image/png')
        setCapturedImage(imageData)
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
        setCameraActive(false)
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const savePreview = () => {
    const previewCanvas = document.createElement('canvas')
    const img = new Image()
    
    img.onload = () => {
      previewCanvas.width = img.width
      previewCanvas.height = img.height
      
      const ctx = previewCanvas.getContext('2d')
      if (ctx && selectedTattoo) {
        ctx.drawImage(img, 0, 0)
        
        // Draw tattoo overlay
        ctx.font = `${overlaySize}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Add shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        ctx.shadowBlur = 10
        
        const x = (overlayPosition.x / 100) * img.width
        const y = (overlayPosition.y / 100) * img.height
        ctx.fillText(selectedTattoo.image, x, y)
        
        // Download
        const link = document.createElement('a')
        link.download = `tattoo-preview-${selectedTattoo.name.toLowerCase()}.png`
        link.href = previewCanvas.toDataURL('image/png')
        link.click()
      }
    }
    
    if (capturedImage) {
      img.src = capturedImage
    }
  }

  const handleOverlayMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      
      setOverlayPosition({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y))
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎨 AI Tattoo Preview</h1>
        <p>Visualize your tattoo before the ink!</p>
      </header>

      <main className="main">
        <section className="tattoo-selection">
          <h2>Choose a Design</h2>
          <div className="tattoo-grid">
            {SAMPLE_TATTOOS.map(tattoo => (
              <button
                key={tattoo.id}
                className={`tattoo-card ${selectedTattoo?.id === tattoo.id ? 'selected' : ''}`}
                onClick={() => setSelectedTattoo(tattoo)}
              >
                <div className="tattoo-icon">{tattoo.image}</div>
                <div className="tattoo-name">{tattoo.name}</div>
                <div className="tattoo-category">{tattoo.category}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="preview-section">
          <h2>Preview on Your Body</h2>
          
          {!cameraActive && !capturedImage && (
            <div className="preview-placeholder">
              <button 
                className="btn-primary" 
                onClick={startCamera}
                disabled={!selectedTattoo}
              >
                {selectedTattoo ? '📸 Start Camera' : '⬆️ Select a tattoo first'}
              </button>
            </div>
          )}

          {cameraActive && (
            <div className="camera-view">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="video-feed"
              />
              <button className="btn-capture" onClick={capturePhoto}>
                📸 Capture
              </button>
            </div>
          )}

          {capturedImage && selectedTattoo && (
            <div 
              className="preview-container"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img 
                src={capturedImage} 
                alt="Preview" 
                className="captured-image"
              />
              <div
                className="tattoo-overlay"
                style={{
                  left: `${overlayPosition.x}%`,
                  top: `${overlayPosition.y}%`,
                  fontSize: `${overlaySize}px`,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleOverlayMouseDown}
              >
                {selectedTattoo.image}
              </div>
              
              <div className="controls">
                <label>
                  Size:
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={overlaySize}
                    onChange={(e) => setOverlaySize(Number(e.target.value))}
                  />
                </label>
                <button className="btn-secondary" onClick={retakePhoto}>
                  🔄 Retake
                </button>
                <button className="btn-primary" onClick={savePreview}>
                  💾 Save Preview
                </button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </section>

        <section className="features">
          <h2>✨ Features</h2>
          <ul>
            <li>🎨 Browse curated tattoo designs by category</li>
            <li>📸 Use your camera to capture placement area</li>
            <li>🖱️ Drag & resize tattoo overlay in real-time</li>
            <li>💾 Save and share your preview</li>
            <li>🔒 All processing happens locally - your photos never leave your device</li>
          </ul>
        </section>

        <section className="cta">
          <h2>Ready to get inked?</h2>
          <p>Find a trusted artist near you and show them your preview!</p>
          <button className="btn-cta">🔍 Find Local Artists (Coming Soon)</button>
        </section>
      </main>

      <footer className="footer">
        <p>AI Tattoo Preview • MVP Demo • Built with React + TypeScript</p>
        <p className="disclaimer">⚠️ This is a preview tool. Always consult with a professional tattoo artist.</p>
      </footer>
    </div>
  )
}

export default App
