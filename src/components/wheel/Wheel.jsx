import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import CardDetailModal from '../emotion-card/CardDetailModal';
import CardReading from '../cardReading/CardReading';
import Summary from '../summary/Summary';
import WheelCard from './WheelCard';
import { simulatedEmotionData } from '../../data/emotionData';
import {
  setSelectedEmotion,
  setSelectedCards,
  setCurrentReadingIndex,
  setCurrentSummaryReport,
  setCardClickMode,
  clearHighlightedCards,
} from '../../store/slices/emotionSlice';
import { setSummaryData } from '../../store/slices/summarySlice';
import { setShowSummary } from '../../store/slices/uiSlice';

const Wheel = forwardRef(({ highlightedCards = [], emotions = [], accumulated_text = '', summary }, ref) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCardReadingOpen, setIsCardReadingOpen] = useState(false);

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

  // 关闭单张卡阅读
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 读下一张卡，或者进入总结
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

    dispatch(setShowSummary(true))
    setIsCardReadingOpen(false)
  };

  const handleCloseSummary = () => {
    dispatch(setShowSummary(false));
    dispatch(setCurrentReadingIndex(0));
    dispatch(setSelectedCards([]));
    dispatch(setCurrentSummaryReport(null));
    dispatch(setCardClickMode('detail'));
    dispatch(setSelectedEmotion(null));
    dispatch(clearHighlightedCards());
    console.log('Set cardClickMode to detail (handleCloseSummary)');
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
      // setIsDialogueOpen(false);

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
          dispatch(clearHighlightedCards());
        }}
        emotionData={selectedEmotion}
        isLastCard={currentReadingIndex === selectedCards.length - 1}
      />

      <Summary
        onClose={handleCloseSummary}
       />
    </>
  );
});

export default Wheel;
