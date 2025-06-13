import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useAnimation, useMotionValue, motion, animate } from 'framer-motion';
import CardDetailModal from '../emotion-card/CardDetailModal';
import CardReading from '../cardReading/CardReading';
import Summary from '../summary/Summary';
import DialogueModal from '../dialogue/DialogueModal';
import WheelCard from './WheelCard';
import { simulatedEmotionData } from '../../data/emotionData';

const Wheel = forwardRef(({ showDialogue = false }, ref) => {
  console.log('🏗️ Wheel component rendered/re-rendered');

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedCards, setHighlightedCards] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCardReadingOpen, setIsCardReadingOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentReadingIndex, setCurrentReadingIndex] = useState(0);
  const [isDialogueOpen, setIsDialogueOpen] = useState(showDialogue);

  const wheelRotation = useMotionValue(0);
  const controls = useAnimation();
  const containerRef = useRef();
  const lastAngle = useRef(null);

  // Function to handle emotions analysis
  const handleEmotionsAnalyzed = async (emotions) => {
    console.log('🎯 handleEmotionsAnalyzed called with:', emotions);
    console.log('🎯 Emotions type:', typeof emotions);
    console.log('🎯 Emotions is array:', Array.isArray(emotions));
    console.log('🎯 Emotions length:', emotions?.length);
    console.log('🎯 Emotions content:', JSON.stringify(emotions, null, 2));

    if (!emotions || !Array.isArray(emotions) || emotions.length === 0) {
      console.error('❌ Invalid emotions data received:', emotions);
      return;
    }
    
    try {
      console.log('🔍 Starting emotion processing...');
      const indices = emotions.map(emotion => {
        console.log('🔍 Processing emotion:', emotion);
        const index = simulatedEmotionData.findIndex(card =>
          card.emotion.toLowerCase() === emotion.emotion.toLowerCase()
        );
        console.log('🔍 Found index:', index);
        return index;
      }).filter(index => index !== -1);

      console.log('✅ Found indices:', indices);

      if (indices.length === 0) {
        console.error('❌ No matching emotions found in simulatedEmotionData');
        return;
      }

      console.log('🎨 Preparing selected cards...');
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

      console.log('✅ Selected cards prepared:', newSelectedCards);
      setSelectedCards(newSelectedCards);

      console.log('🎬 Starting wheel animation...');
      const currentRotation = wheelRotation.get();
      console.log('🎬 Current rotation:', currentRotation);
      
      await animate(wheelRotation, currentRotation + 360, {
        duration: 2,
        ease: 'easeInOut'
      });
      console.log('✅ Wheel animation completed');

      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('🌟 Setting highlighted cards:', indices);
      setHighlightedCards(indices);
      console.log('✅ All states updated');
    } catch (error) {
      console.error('❌ Error during emotion analysis:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
  };

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

  const handleCardClick = (emotionData, event, index) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (highlightedCards.includes(index)) {
      setSelectedEmotion(emotionData);
      setCurrentReadingIndex(selectedCards.findIndex(card => card.emotion === emotionData.emotion));
      setIsCardReadingOpen(true);
    } else {
      setSelectedEmotion(emotionData);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmotion(null);
  };

  const handleNextCard = () => {
    if (currentReadingIndex < selectedCards.length - 1) {
      setCurrentReadingIndex(prev => prev + 1);
    } else {
      setIsCardReadingOpen(false);
      setIsSummaryOpen(true);
    }
  };

  const handleCloseSummary = () => {
    setIsSummaryOpen(false);
    setCurrentReadingIndex(0);
    setSelectedCards([]);
    setHighlightedCards([]);
  };

  const handleBackToWheel = () => {
    const currentCard = selectedCards[currentReadingIndex];
    const currentCardIndex = simulatedEmotionData.findIndex(
      card => card.emotion === currentCard.emotion
    );
    setHighlightedCards(prev => prev.filter(index => index !== currentCardIndex));
    setIsCardReadingOpen(false);
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
        onBackToWheel={handleBackToWheel}
        emotionData={selectedCards[currentReadingIndex]}
        isLastCard={currentReadingIndex === selectedCards.length - 1}
      />

      <Summary
        isOpen={isSummaryOpen}
        onClose={handleCloseSummary}
        cards={selectedCards}
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