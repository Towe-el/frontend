import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import Wheel from '../components/wheel/Wheel'
import Navbar from '../components/navbar/Navbar'
import ProductIntroModal from '../components/product-intro/ProductIntroModal'
import DialogueModal from '../components/dialogue/DialogueModal'
import ReadyModal from '../components/dialogue/ReadyModal'
import Footer from '../components/footer/Footer'
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
  setShowSummary,
} from '../store/slices/uiSlice'
import { resetWheelState } from '../store/slices/emotionSlice'

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

    // Modify the Talk to Toweel button click handler
  const handleTalkToToweel = () => {
    dispatch(setShowDialogue(true));
    // dispatch(setShowSummary(false));
    dispatch(resetWheelState());
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

  useEffect(() => {
    dispatch(resetWheelState());
  }, [dispatch]);

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
            {/* Talk to Toweel Button - Fixed Position */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTalkToToweel}
        className="fixed top-4 right-4 z-[1000] px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors shadow-lg flex items-center gap-2"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000
        }}
      >
        <span className="text-lg">Talk to Toweel</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-5 h-5"
        >
          <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
          <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
        </svg>
      </motion.button>
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
      
      {showDialogue && (
        <DialogueModal
        onClose={()=>dispatch(setShowDialogue(false))}
        onEmotionsAnalyzed={handleEmotionsAnalyzed}
        ref={dialogueRef}
        />
      )
      }

      <ReadyModal
        isOpen={showReady}
        onClose={handleCloseReady}
        onSearch={handleSearch}
      />

      <Footer />
    </div>
  );
}

export default Home;