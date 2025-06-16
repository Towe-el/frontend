import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Wheel from '../components/wheel/Wheel'
import Navbar from '../components/navbar/Navbar'
import ProductIntroModal from '../components/product-intro/ProductIntroModal'
import DialogueModal from '../components/dialogue/DialogueModal'
import ReadyModal from '../components/dialogue/ReadyModal'
import { simulatedEmotionData } from '../data/emotionData'
import {
  setEmotions,
  setSummaryReport,
  setAccumulatedText,
  setTitle,
  setHighlightedCards,
} from '../store/slices/emotionSlice'
import {
  setShowIntro,
  setShowDialogue,
  setShowReady,
  closeAllModals,
} from '../store/slices/uiSlice'

function Home() {
  const dispatch = useDispatch();
  const wheelRef = useRef();
  const dialogueRef = useRef();

  // Select state from Redux store
  const {
    showIntro,
    showDialogue,
    showReady,
  } = useSelector((state) => state.ui);

  const {
    emotions: emotionData,
    summaryReport: summaryData,
    title,
    accumulatedText,
    highlightedCards,
  } = useSelector((state) => state.emotion);

  const handleGetStarted = () => {
    console.log('Home: Get started clicked');
    dispatch(setShowIntro(false));
    dispatch(setShowDialogue(true));
  };

  const handleExplore = () => {
    console.log('Home: Explore clicked');
    dispatch(setShowIntro(false));
  };

  const handleCloseDialogue = () => {
    console.log('Home: Closing dialogue');
    dispatch(closeAllModals());
  };

  const handleCloseReady = () => {
    console.log('Home: Closing ready modal');
    dispatch(setShowReady(false));
  };

  const handleEmotionsAnalyzed = async (emotions, summaryReport, accumulated_text, title_text) => {
    console.log('Home: Emotions analyzed', { emotions, summaryReport, title_text });
    try {
      // First update the data
      console.log('Home: Setting emotion data:', emotions);
      dispatch(setEmotions(emotions));
      dispatch(setSummaryReport(summaryReport));
      dispatch(setAccumulatedText(accumulated_text));
      dispatch(setTitle(title_text));
      
      // Calculate indices for highlighted cards
      const indices = emotions.map(emotion => {
        const index = simulatedEmotionData.findIndex(card =>
          card.emotion.toLowerCase() === emotion.emotion.toLowerCase()
        );
        console.log('Home: Found index for emotion', { emotion: emotion.emotion, index });
        return index;
      }).filter(index => index !== -1);

      console.log('Home: Setting highlighted cards indices:', indices);
      dispatch(setHighlightedCards(indices));
      
      // Then close both modals
      dispatch(closeAllModals());
    } catch (error) {
      console.error('Home: Error handling emotions analysis:', error);
    }
  };

  const handleSearch = async () => {
    if (dialogueRef.current) {
      await dialogueRef.current.handleEmotionAnalysis();
    }
  };

  console.log('Home: Current state', { 
    showIntro, 
    showDialogue, 
    showReady,
    highlightedCards,
    emotionData,
    title
  });

  return (
    <div className="h-screen w-full overflow-x-hidden">
      <Navbar />
      <div className="relative">
        <div className="h-screen w-full" ref={wheelRef}>
          <Wheel
            emotions={emotionData}
            summary={summaryData}
            title={title}
            showDialogue={showDialogue}
            highlightedCards={highlightedCards}
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
        isOpen={showDialogue}
        onClose={handleCloseDialogue}
        onEmotionsAnalyzed={handleEmotionsAnalyzed}
        ref={dialogueRef}
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