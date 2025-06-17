import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import CardDetailModal from '../emotion-card/CardDetailModal';
import CardReading from '../cardReading/CardReading';
import Summary from '../summary/Summary';
import DialogueModal from '../dialogue/DialogueModal';
import WheelCard from './WheelCard';
import { simulatedEmotionData } from '../../data/emotionData';
import {
  setSelectedEmotion,
  setSelectedCards,
  setCurrentReadingIndex,
  setCurrentSummaryReport,
  setCardClickMode,
} from '../../store/slices/emotionSlice';
import { setSummaryData } from '../../store/slices/summarySlice';
import { setShowSummary } from '../../store/slices/uiSlice';

const Wheel = forwardRef(({ showDialogue = false, highlightedCards = [], emotions = [], accumulated_text = '', summary }, ref) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCardReadingOpen, setIsCardReadingOpen] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(showDialogue);

  const wheelRotation = useMotionValue(0);
  const controls = useAnimation();
  const containerRef = useRef();
  const lastAngle = useRef(null);

  // Select state from Redux store
  const {
    selectedEmotion,
    selectedCards,
    currentReadingIndex,
    currentSummaryReport,
    cardClickMode,
  } = useSelector((state) => state.emotion);

  // Add debug logs for state changes
  useEffect(() => {
    console.log('Wheel: State updated:', {
      selectedEmotion,
      selectedCards,
      currentReadingIndex,
      currentSummaryReport,
      accumulated_text
    });
  }, [selectedEmotion, selectedCards, currentReadingIndex, currentSummaryReport, accumulated_text]);

  // Add effect to handle showDialogue prop changes
  useEffect(() => {
    console.log('Wheel: showDialogue prop changed:', showDialogue);
    setIsDialogueOpen(showDialogue);
  }, [showDialogue]);

  // Effect to handle selected cards changes
  useEffect(() => {
    console.log('Wheel: selectedCards changed:', selectedCards);
  }, [selectedCards]);

  // Effect to handle currentSummaryReport changes
  useEffect(() => {
    console.log('Wheel: currentSummaryReport changed:', currentSummaryReport);
  }, [currentSummaryReport]);

  // Effect to handle emotions prop changes
  useEffect(() => {
    console.log('Wheel: Emotions prop received:', emotions);
    if (emotions && Array.isArray(emotions)) {
      const newSelectedCards = emotions.map(emotion => {
        const matchingCard = simulatedEmotionData.find(card =>
          card.emotion.toLowerCase() === emotion.emotion.toLowerCase()
        );
        if (!matchingCard) {
          console.error('❌ No matching card found for emotion:', emotion.emotion);
          return null;
        }
        return {
          ...matchingCard,
          percentage: emotion.percentage,
          quote: emotion.quote,
          analysis: emotion.analysis
        };
      }).filter(card => card !== null);

      console.log('Wheel: Setting selected cards:', newSelectedCards);
      dispatch(setSelectedCards(newSelectedCards));
    }
  }, [emotions, dispatch]);

  // Expose handleEmotionsAnalyzed through the ref
  useImperativeHandle(ref, () => ({
    handleEmotionsAnalyzed
  }));

  const getAngleFromCenter = (x, y, centerX, centerY) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const radians = Math.atan2(dy, dx);
    return radians * (180 / Math.PI);
  };

  const handleCardClick = (data) => {
    const idx = selectedCards.findIndex(card => card.emotion === data.emotion);
    if (idx !== -1) {
      // 高亮卡牌，进入读卡页面，emotionData 用 selectedCards[idx]
      setIsCardReadingOpen(true);
      dispatch(setSelectedEmotion(selectedCards[idx]));
      dispatch(setCurrentReadingIndex(idx));
    } else {
      // 非高亮卡牌，弹出细节弹窗
      setIsModalOpen(true);
      dispatch(setSelectedEmotion(data));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(setSelectedEmotion(null));
  };

  const handleNextCard = () => {
    console.log('🌀 handleNextCard called');

    if (currentReadingIndex < selectedCards.length - 1) {
      const nextIndex = currentReadingIndex + 1;
      const nextCard = selectedCards[nextIndex];

      console.log('➡️ Moving to card index:', nextIndex, nextCard);

      dispatch(setSelectedEmotion({
        emotion: nextCard.emotion,
        definition: nextCard.definition,
        percentage: nextCard.percentage || 0,
        bgColor: nextCard.bgColor,
        textColor: nextCard.textColor,
        analysis: nextCard.analysis || '',
        quote: nextCard.quote || ''
      }));

      dispatch(setCurrentReadingIndex(nextIndex));
    } else {
      console.log('✅ Last card read. Opening summary.');
      dispatch(setShowSummary(true));
      setIsCardReadingOpen(false);
    }

    dispatch(setSummaryData({
      cards: selectedCards,
      accumulatedText: accumulated_text,
      summaryReport: summary,
      isHistorical: false
    }));
  };

  const handleCloseSummary = () => {
    dispatch(setShowSummary(false));
    dispatch(setCurrentReadingIndex(0));
    dispatch(setSelectedCards([]));
    dispatch(setCurrentSummaryReport(null));
    dispatch(setCardClickMode('detail'));
    console.log('Set cardClickMode to detail (handleCloseSummary)');
  };

  const handleAllCardsRead = () => {
    setIsCardReadingOpen(false);
  };

  // Combine the handlers
  const handleSummaryClose = () => {
    handleCloseSummary();
    handleAllCardsRead();
  };

  // Function to handle emotions analysis
  const handleEmotionsAnalyzed = async (emotions, summaryReport, newAccumulatedText) => {
    try {
      console.log('handleEmotionsAnalyzed called', { emotions, summaryReport, newAccumulatedText });
      if (!emotions || !Array.isArray(emotions) || emotions.length === 0) {
        console.error('❌ Invalid emotions data received:', emotions);
        return;
      }

      // Match emotions with simulated cards
      const newSelectedCards = emotions.map(emotion => {
        const matchingCard = simulatedEmotionData.find(card =>
          card.emotion.toLowerCase() === emotion.emotion.toLowerCase()
        );
        if (!matchingCard) {
          console.error('❌ No matching card found for emotion:', emotion.emotion);
          return null;
        }
        return {
          ...matchingCard,
          percentage: emotion.percentage,
          quote: emotion.quote,
          analysis: emotion.analysis
        };
      }).filter(card => card !== null);

      // Save into Redux (💡关键步骤)
      dispatch(setCurrentSummaryReport(summaryReport)); // 可保留
      dispatch(setSelectedCards(newSelectedCards));
      dispatch(setSummaryData({
        cards: newSelectedCards,
        accumulatedText: newAccumulatedText,
        summaryReport: summaryReport,
        isHistorical: false
      }));

      // Save to localStorage
      const newReading = {
        timestamp: Date.now(),
        cards: newSelectedCards,
        summaryReport: summaryReport,
        accumulated_text: newAccumulatedText,
      };
      const prev = JSON.parse(localStorage.getItem('emotionReadings') || '[]');
      localStorage.setItem('emotionReadings', JSON.stringify([...prev, newReading]));

      // Close dialogue and begin card reading
      dispatch(setCardClickMode('reading'));
      console.log('Set cardClickMode to reading');
      setIsCardReadingOpen(true);
      setIsModalOpen(false);
      setIsDialogueOpen(false);

      // Start with first card
      dispatch(setSelectedEmotion({
        emotion: newSelectedCards[0].emotion,
        definition: newSelectedCards[0].definition,
        percentage: newSelectedCards[0].percentage || 0,
        bgColor: newSelectedCards[0].bgColor,
        textColor: newSelectedCards[0].textColor,
        analysis: newSelectedCards[0].analysis || '',
        quote: newSelectedCards[0].quote || ''
      }));
      dispatch(setCurrentReadingIndex(0));

      console.log('✅ Emotion analysis handled successfully');

    } catch (error) {
      console.error('❌ Error during emotion analysis:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
  };

  // Modify the Talk to Toweel button click handler
  const handleTalkToToweel = () => {
    setIsDialogueOpen(true);
    // Reset other modal states
    setIsModalOpen(false);
    setIsCardReadingOpen(false);
    dispatch(setShowSummary(false));
  };

  return (
    <>
      <style>{`        .card-glow {
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
        }
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.6));
          }
        }
        .card-pulse {
          animation: pulse-glow 2s infinite;
        }
      `}</style>

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

      <div className={`min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4 ${isModalOpen ? 'hidden' : 'block'}`}>
        <div className="relative w-full h-screen">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.div
              ref={containerRef}
              className="absolute w-[800px] h-[800px] z-10 cursor-grab wheel-container"
              style={{ rotate: wheelRotation }}
              onPointerDown={(e) => {
                controls.stop();
                e.target.setPointerCapture(e.pointerId);
                setIsDragging(true);
                const bounds = containerRef.current.getBoundingClientRect();
                const cx = bounds.left + bounds.width / 2;
                const cy = bounds.top + bounds.height / 2;
                lastAngle.current = getAngleFromCenter(e.clientX, e.clientY, cx, cy);
              }}
              onPointerMove={(e) => {
                if (!isDragging) return;
                const bounds = containerRef.current.getBoundingClientRect();
                const cx = bounds.left + bounds.width / 2;
                const cy = bounds.top + bounds.height / 2;
                const currentAngle = getAngleFromCenter(e.clientX, e.clientY, cx, cy);
                const delta = currentAngle - lastAngle.current;
                wheelRotation.set(wheelRotation.get() + delta);
                lastAngle.current = currentAngle;
              }}
              onPointerUp={() => {
                setIsDragging(false);
                lastAngle.current = null;
              }}
            >
              {simulatedEmotionData.map((data, index) => (
                <WheelCard
                  key={index}
                  data={data}
                  index={index}
                  totalCards={simulatedEmotionData.length}
                  wheelRotation={wheelRotation}
                  isHighlighted={highlightedCards.includes(index)}
                  onCardClick={() => handleCardClick(data)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <CardDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        emotionData={selectedEmotion}
      />

      <CardReading
        isOpen={isCardReadingOpen}
        onClose={handleNextCard}
        onBackToWheel={() => {
          console.log('Wheel: Back to wheel clicked, current emotion:', selectedEmotion);
          setIsCardReadingOpen(false);
        }}
        emotionData={selectedEmotion}
        isLastCard={currentReadingIndex === selectedCards.length - 1}
      />

      <Summary
       />

      <DialogueModal
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        onEmotionsAnalyzed={handleEmotionsAnalyzed}
      />
    </>
  );
});

export default Wheel;
