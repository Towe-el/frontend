import { useState, useRef, useEffect } from 'react'
import Wheel from '../components/wheel/Wheel'
import Navbar from '../components/navbar/Navbar'
import ProductIntroModal from '../components/product-intro/ProductIntroModal'
import DialogueModal from '../components/dialogue/DialogueModal'
import Assistant from '../components/assistant/Assistant'

function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [showDialogue, setShowDialogue] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [emotionData, setEmotionData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const wheelRef = useRef();
  const [shouldScroll, setShouldScroll] = useState(false);

  const handleGetStarted = () => {
    setShowIntro(false);
    setShowDialogue(true);
  };

  const handleExplore = () => {
    setShowIntro(false);
    setShowAssistant(true);
  };

  const handleCloseDialogue = () => {
    setShowDialogue(false);
  };

  const handleOpenDialogue = () => {
    setShowDialogue(true);
  };

  const handleEmotionsAnalyzed = (emotions, summaryReport) => {
    setEmotionData(emotions);
    setSummaryData(summaryReport);
    setShouldScroll(true);

    console.log('Emotions analyzed in Home:', emotions);
    console.log('Summary report in Home:', summaryReport);
  };

  // Separate effect for handling scroll
  useEffect(() => {
    if (shouldScroll && wheelRef.current) {
      console.log('📌 Attempting to scroll to wheel');
      
      const scrollToWheel = () => {
        if (wheelRef.current) {
          const wheelElement = wheelRef.current;
          const wheelPosition = wheelElement.getBoundingClientRect().top + window.pageYOffset;
          
          window.scrollTo({
            top: wheelPosition,
            behavior: 'smooth'
          });
          
          console.log('📌 Scrolled to wheel position:', wheelPosition);
        }
      };

      // Try multiple times to ensure scroll works
      scrollToWheel();
      const attempts = [100, 300, 500].map(delay => 
        setTimeout(scrollToWheel, delay)
      );
      
      // Reset scroll trigger
      setShouldScroll(false);
      
      return () => attempts.forEach(clearTimeout);
    }
  }, [shouldScroll]);

  return (
    <div className="h-screen w-full overflow-x-hidden">
      <Navbar />
      <div className="relative">
        {/* Intro Section */}
        <div className={`h-screen w-full transition-transform duration-500 ${showIntro ? 'translate-y-0' : '-translate-y-full'}`}>
          <ProductIntroModal 
            isOpen={showIntro}
            onGetStarted={handleGetStarted}
            onExplore={handleExplore}
          />
        </div>
        
        {/* Wheel Section */}
        <div className="h-screen w-full" ref={wheelRef}>
          <Wheel
            emotions={emotionData}
            summary={summaryData}
            showDialogue={false}
          />
        </div>
      </div>
      
      <DialogueModal
        isOpen={showDialogue}
        onClose={handleCloseDialogue}
        onEmotionsAnalyzed={handleEmotionsAnalyzed}
      />
      {showAssistant && <Assistant onOpenDialogue={handleOpenDialogue} />}
    </div>
  );
}

export default Home;