import { useState } from 'react'
import Reel from '../components/reel/Reel'
import Navbar from '../components/navbar/Navbar'
import ProductIntroModal from '../components/product-intro/ProductIntroModal'
import DialogueModal from '../components/dialogue/DialogueModal'
import Assistant from '../components/assistant/Assistant'

function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [showDialogue, setShowDialogue] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)

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

  return (
    <div className="h-screen w-full overflow-hidden">
      <Navbar />
      <div className="h-[calc(100vh-64px)] w-full">
        <Reel showDialogue={false} />
      </div>
      <ProductIntroModal 
        isOpen={showIntro}
        onGetStarted={handleGetStarted}
        onExplore={handleExplore}
      />
      <DialogueModal 
        isOpen={showDialogue}
        onClose={handleCloseDialogue}
      />
      {showAssistant && <Assistant onOpenDialogue={handleOpenDialogue} />}
    </div>
  )
}

export default Home