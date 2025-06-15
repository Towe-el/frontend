import { useState, useRef, useEffect } from 'react'
import Wheel from '../components/wheel/Wheel'
import Navbar from '../components/navbar/Navbar'
import ProductIntroModal from '../components/product-intro/ProductIntroModal'
import DialogueModal from '../components/dialogue/DialogueModal'
import ReadyModal from '../components/dialogue/ReadyModal'
import { simulatedEmotionData } from '../data/emotionData'

function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [showDialogue, setShowDialogue] = useState(false);
  const [showReady, setShowReady] = useState(false);
  const [emotionData, setEmotionData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [accumulatedText, setAccumulatedText] = useState('');
  const [highlightedCards, setHighlightedCards] = useState([]);
  const wheelRef = useRef();
  const dialogueRef = useRef();

  const handleGetStarted = () => {
    console.log('Home: Get started clicked');
    setShowIntro(false);
    setShowDialogue(true);
  };

  const handleExplore = () => {
    console.log('Home: Explore clicked');
    setShowIntro(false);
  };

  const handleCloseDialogue = () => {
    console.log('Home: Closing dialogue');
    setShowDialogue(false);
    setShowReady(false);
  };

  const handleCloseReady = () => {
    console.log('Home: Closing ready modal');
    setShowReady(false);
  };

  const handleEmotionsAnalyzed = async (emotions, summaryReport, accumulated_text) => {
    console.log('Home: Emotions analyzed', { emotions, summaryReport });
    try {
      // First update the data
      console.log('Home: Setting emotion data:', emotions);
      setEmotionData(emotions);
      setSummaryData(summaryReport);
      setAccumulatedText(accumulated_text);
      
      // Calculate indices for highlighted cards
      const indices = emotions.map(emotion => {
        const index = simulatedEmotionData.findIndex(card =>
          card.emotion.toLowerCase() === emotion.emotion.toLowerCase()
        );
        console.log('Home: Found index for emotion', { emotion: emotion.emotion, index });
        return index;
      }).filter(index => index !== -1);

      console.log('Home: Setting highlighted cards indices:', indices);
      setHighlightedCards(indices);
      
      // Then close both modals
      console.log('Home: Setting showReady to false');
      setShowReady(false);
      console.log('Home: Setting showDialogue to false');
      setShowDialogue(false);
    } catch (error) {
      console.error('Home: Error handling emotions analysis:', error);
    }
  };

  // Add debug log for emotionData changes
  useEffect(() => {
    console.log('Home: emotionData updated:', emotionData);
  }, [emotionData]);

  const handleSearch = async () => {
    console.log('Home: Starting search');
    if (dialogueRef.current) {
      await dialogueRef.current.handleSearch();
    }
  };

  const clearHighlightedCards = () => {
    console.log('Home: Clearing highlighted cards');
    setHighlightedCards([]);
  };

  console.log('Home: Current state', { 
    showIntro, 
    showDialogue, 
    showReady,
    highlightedCards,
    emotionData 
  });

  return (
    <div className="h-screen w-full overflow-x-hidden">
      <Navbar />
      <div className="relative">
        <div className="h-screen w-full" ref={wheelRef}>
          <Wheel
            emotions={emotionData}
            summary={summaryData}
            showDialogue={showDialogue}
            highlightedCards={highlightedCards}
            onClearHighlightedCards={clearHighlightedCards}
            accumulated_text={accumulatedText}
          />
        </div>
        
        {showIntro && (
          <div className="fixed inset-0 z-[1000]">
            <ProductIntroModal 
              onGetStarted={handleGetStarted}
              onExplore={handleExplore}
            />
          </div>
        )}
      </div>
      
      <DialogueModal
        ref={dialogueRef}
        isOpen={showDialogue}
        onClose={handleCloseDialogue}
        onEmotionsAnalyzed={handleEmotionsAnalyzed}
      />

      <ReadyModal
        isOpen={showReady}
        onClose={handleCloseReady}
        onSearch={handleSearch}
      />
    </div>
  );
}

export default Home;