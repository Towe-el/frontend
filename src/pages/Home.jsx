import { useState, useRef } from 'react'
import Wheel from '../components/wheel/Wheel'
import Navbar from '../components/navbar/Navbar'
import ProductIntroModal from '../components/product-intro/ProductIntroModal'
import DialogueModal from '../components/dialogue/DialogueModal'
import Assistant from '../components/assistant/Assistant'

function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [showDialogue, setShowDialogue] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)
  const wheelRef = useRef();

  const handleGetStarted = () => {
    setShowIntro(false)
    setShowDialogue(true)
  }

  const handleExplore = () => {
    setShowIntro(false)
    setShowAssistant(true)
  }

  const handleCloseDialogue = () => {
    setShowDialogue(false)
  }

  const handleOpenDialogue = () => {
    setShowDialogue(true)
  }

  const handleEmotionsAnalyzed = (emotions) => {
    console.log('Emotions analyzed in Home:', emotions);
    // Call the Wheel's handleEmotionsAnalyzed through the ref
    if (wheelRef.current) {
      console.log('Calling Wheel handleEmotionsAnalyzed');
      wheelRef.current.handleEmotionsAnalyzed(emotions);
    } else {
      console.error('Wheel ref is not available');
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <Navbar />
      <div className="h-[calc(100vh-64px)] w-full">
        <Wheel
          ref={wheelRef}
          showDialogue={false}
        />
      </div>
      <ProductIntroModal 
        isOpen={showIntro}
        onGetStarted={handleGetStarted}
        onExplore={handleExplore}
      />
      <DialogueModal 
        isOpen={showDialogue}
        onClose={handleCloseDialogue}
        onEmotionsAnalyzed={handleEmotionsAnalyzed}
      />
      {showAssistant && <Assistant onOpenDialogue={handleOpenDialogue} />}
    </div>
  )
}

export default Home