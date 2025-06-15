import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { useAnimation, useMotionValue, motion } from 'framer-motion';
import CardDetailModal from '../emotion-card/CardDetailModal';
import CardReading from '../cardReading/CardReading';
import Summary from '../summary/Summary';
import DialogueModal from '../dialogue/DialogueModal';
import WheelCard from './WheelCard';
import { simulatedEmotionData } from '../../data/emotionData';

const Wheel = forwardRef(({ showDialogue = false, highlightedCards = [], onClearHighlightedCards, emotions = [], accumulated_text = '' }, ref) => {

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCardReadingOpen, setIsCardReadingOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentReadingIndex, setCurrentReadingIndex] = useState(0);
  const [isDialogueOpen, setIsDialogueOpen] = useState(showDialogue);
  const [currentSummaryReport, setCurrentSummaryReport] = useState(null);

  const wheelRotation = useMotionValue(0);
  const controls = useAnimation();
  const containerRef = useRef();
  const lastAngle = useRef(null);

  // Add effect to handle showDialogue prop changes
  useEffect(() => {
    setIsDialogueOpen(showDialogue);
  }, [showDialogue]);

  // Effect to handle card highlighting
  useEffect(() => {
    console.log('Wheel: Highlighted cards changed', { highlightedCards });
    if (highlightedCards.length > 0 && !isModalOpen && !isCardReadingOpen && !isSummaryOpen && !isDialogueOpen) {
      console.log('Wheel: Cards should be highlighted now');
    }
  }, [highlightedCards, isModalOpen, isCardReadingOpen, isSummaryOpen, isDialogueOpen]);

  // Add effect to handle emotions prop changes
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
      setSelectedCards(newSelectedCards);
    }
  }, [emotions]);

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

  const handleCardClick = (card) => {
    console.log('Wheel: Card clicked:', card);
    const matchingCard = selectedCards.find(c => c.emotion === card.emotion);
    console.log('Wheel: Matching card found:', matchingCard);
    
    if (matchingCard) {
      console.log('Wheel: Using matching card data:', matchingCard);
      const emotionData = {
        emotion: matchingCard.emotion,
        definition: matchingCard.definition,
        percentage: matchingCard.percentage || 0,
        bgColor: matchingCard.bgColor,
        textColor: matchingCard.textColor,
        analysis: matchingCard.analysis || '',
        quote: matchingCard.quote || ''
      };
      console.log('Wheel: Setting selected emotion:', emotionData);
      setSelectedEmotion(emotionData);
      setCurrentReadingIndex(selectedCards.findIndex(c => c.emotion === card.emotion));
      setIsCardReadingOpen(true);
    } else {
      console.log('Wheel: Creating new emotion data from card:', card);
      const emotionData = {
        emotion: card.emotion,
        definition: card.definition,
        percentage: card.percentage || 0,
        bgColor: card.bgColor,
        textColor: card.textColor,
        analysis: card.analysis || '',
        quote: card.quote || ''
      };
      console.log('Wheel: Setting selected emotion:', emotionData);
      setSelectedEmotion(emotionData);
      setCurrentReadingIndex(0);
      setIsCardReadingOpen(true);
    }
  };

  // Add debug logs for state changes
  useEffect(() => {
    console.log('Wheel: selectedEmotion updated:', selectedEmotion);
  }, [selectedEmotion]);

  useEffect(() => {
    console.log('Wheel: selectedCards updated:', selectedCards);
  }, [selectedCards]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmotion(null);
  };

  const handleNextCard = () => {
    console.log('Wheel: Moving to next card, current index:', currentReadingIndex);
    if (currentReadingIndex < selectedCards.length - 1) {
      const nextIndex = currentReadingIndex + 1;
      const nextCard = selectedCards[nextIndex];
      console.log('Wheel: Setting next card:', nextCard);
      setSelectedEmotion({
        emotion: nextCard.emotion,
        definition: nextCard.definition,
        percentage: nextCard.percentage || 0,
        bgColor: nextCard.bgColor,
        textColor: nextCard.textColor,
        analysis: nextCard.analysis || '',
        quote: nextCard.quote || ''
      });
      setCurrentReadingIndex(nextIndex);
    } else {
      console.log('Wheel: Last card reached, closing reading');
      setIsCardReadingOpen(false);
      setIsSummaryOpen(true);
    }
  };

  const handleCloseSummary = () => {
    setIsSummaryOpen(false);
    setCurrentReadingIndex(0);
    setSelectedCards([]);
    onClearHighlightedCards(); // Use the prop to clear highlights
    setCurrentSummaryReport(null);
  };

  const handleAllCardsRead = () => {
    onClearHighlightedCards();
    setIsCardReadingOpen(false);
  };

  // Combine the handlers
  const handleSummaryClose = () => {
    handleCloseSummary();
    handleAllCardsRead();
  };

  const handleBackToWheel = () => {
    setIsCardReadingOpen(false);
    onClearHighlightedCards();
  };

  // Function to handle emotions analysis
  const handleEmotionsAnalyzed = async (emotions, summaryReport, newAccumulatedText) => {
    try {
      // Store the summary report
      setCurrentSummaryReport(summaryReport);

      if (!emotions || !Array.isArray(emotions) || emotions.length === 0) {
        console.error('❌ Invalid emotions data received:', emotions);
        return;
      }

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

      setSelectedCards(newSelectedCards);

      // Save to localStorage
      const newReading = {
        timestamp: Date.now(),
        cards: newSelectedCards,
        summaryReport: summaryReport,
        accumulated_text: newAccumulatedText,
      };

      const prev = JSON.parse(localStorage.getItem('emotionReadings') || '[]');
      localStorage.setItem('emotionReadings', JSON.stringify([...prev, newReading]));

      // Close the dialogue modal
      setIsDialogueOpen(false);

      // Open card reading
      setIsCardReadingOpen(true);
      setSelectedEmotion({
        emotion: newSelectedCards[0].emotion,
        definition: newSelectedCards[0].definition,
        percentage: newSelectedCards[0].percentage || 0,
        bgColor: newSelectedCards[0].bgColor,
        textColor: newSelectedCards[0].textColor,
        analysis: newSelectedCards[0].analysis || '',
        quote: newSelectedCards[0].quote || ''
      });
      setCurrentReadingIndex(0);

    } catch (error) {
      console.error('❌ Error during emotion analysis:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
  };

  // Function to clear card effects
  const clearCardEffects = () => {
    onClearHighlightedCards();
  };

  // Modify the Talk to Toweel button click handler
  const handleTalkToToweel = () => {
    setIsDialogueOpen(true);
    // Reset other modal states
    setIsModalOpen(false);
    setIsCardReadingOpen(false);
    setIsSummaryOpen(false);
  };

  return (
    <>
      <style>{`
        .card-glow {
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
                  onCardClick={handleCardClick}
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
        isOpen={isSummaryOpen}
        onClose={handleSummaryClose}
        cards={selectedCards}
        summaryReport={currentSummaryReport}
        accumulated_text={accumulated_text}
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