import { useRef, useState } from 'react';
import { useAnimation, useMotionValue, motion } from 'framer-motion';
import CardDetailModal from '../emotion-card/CardDetailModal';
import CardReading from '../cardReading/CardReading';
import Summary from '../summary/Summary';
import DialogueModal from '../dialogue/DialogueModal';
import WheelCard from './WheelCard';
import { simulatedEmotionData } from '../../data/emotionData';

function Wheel({ showDialogue = false }) {
  const [isAnimating, setIsAnimating] = useState(false);
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

  const getAngleFromCenter = (x, y, centerX, centerY) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const radians = Math.atan2(dy, dx);
    return radians * (180 / Math.PI);
  };

  const handleCardClick = (emotionData, event, index) => {
    if (isAnimating) return;
    event?.preventDefault();
    event?.stopPropagation();
    
    if (highlightedCards.includes(index)) {
      // If it's a highlighted card, start the reading sequence
      setSelectedEmotion(emotionData);
      setCurrentReadingIndex(selectedCards.findIndex(card => card.emotion === emotionData.emotion));
      setIsCardReadingOpen(true);
    } else {
      // If it's not a highlighted card, show the detail modal
      setSelectedEmotion(emotionData);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmotion(null);
  };

  const handleEmotionsAnalyzed = async (emotions, searchResult) => {
    console.log('Received emotions:', emotions);
    
    // Find the indices of the emotions in the simulated data
    const indices = emotions.map(emotion => 
      simulatedEmotionData.findIndex(card => card.emotion.toLowerCase() === emotion.emotion.toLowerCase())
    ).filter(index => index !== -1);

    console.log('Found emotion indices:', indices);

    // Update the wheel with the analyzed emotions
    setHighlightedCards(indices);
    setSelectedCards(emotions.map(emotion => {
      const matchingCard = simulatedEmotionData.find(card => 
        card.emotion.toLowerCase() === emotion.emotion.toLowerCase()
      );
      return matchingCard || { emotion: emotion.emotion };
    }));
    
    // Stop spinning animation gradually
    const currentRotation = wheelRotation.get();
    console.log('Stopping wheel at rotation:', currentRotation);
    
    await controls.start({
      rotate: currentRotation + 360,
      transition: { duration: 2, ease: "easeInOut" },
    });
    
    setIsAnimating(false);
    
    // Start the card reading sequence
    setIsCardReadingOpen(true);
  };

  const startSpinSequence = async () => {
    if (isAnimating) return;
    console.log('Starting spin sequence');
    setIsAnimating(true);
    setHighlightedCards([]);
    setSelectedCards([]);
    setCurrentReadingIndex(0);

    // Reset rotation to ensure clean animation
    const currentRotation = wheelRotation.get();
    console.log('Current rotation before reset:', currentRotation);
    wheelRotation.set(currentRotation % 360);

    // Start continuous spinning
    const spin = () => {
      if (!isAnimating) {
        console.log('Animation stopped');
        return;
      }
      
      const currentRotation = wheelRotation.get();
      const newRotation = currentRotation + 360;
      
      console.log('Spinning wheel:', { currentRotation, newRotation });
      
      controls.start({
        rotate: newRotation,
        transition: { duration: 1, ease: "linear" },
      }).then(() => {
        wheelRotation.set(newRotation);
        
        // Continue spinning if still animating
        if (isAnimating) {
          requestAnimationFrame(spin);
        }
      }).catch(error => {
        console.error('Error in spin animation:', error);
      });
    };

    // Start the spin animation
    spin();

    // For random spin, select cards after 5 seconds
    setTimeout(() => {
      // Randomly select 2-3 cards
      const numCards = Math.floor(Math.random() * 2) + 2; // Random number between 2 and 3
      const randomIndices = [];
      while (randomIndices.length < numCards) {
        const randomIndex = Math.floor(Math.random() * simulatedEmotionData.length);
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }

      const selectedEmotions = randomIndices.map(index => simulatedEmotionData[index]);
      setSelectedCards(selectedEmotions);
      setHighlightedCards(randomIndices);
      
      // Stop spinning animation gradually
      const finalRotation = wheelRotation.get();
      controls.start({
        rotate: finalRotation + 360,
        transition: { duration: 2, ease: "easeInOut" },
      }).then(() => {
        setIsAnimating(false);
      });
    }, 5000);
  };

  const handleNextCard = () => {
    if (currentReadingIndex < selectedCards.length - 1) {
      // Move to next card
      setCurrentReadingIndex(prev => prev + 1);
    } else {
      // Show summary instead of closing
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

  const resetHighlights = () => {
    setHighlightedCards([]);
    setSelectedCards([]);
    setCurrentReadingIndex(0);
  };

  const handleBackToWheel = () => {
    // Remove the current card from highlighted cards
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

        @media (max-width: 768px) {
          .wheel-container {
            transform: scale(0.7) translateY(-20%);
          }
          .emotion-card {
            transform: scale(0.8);
          }
          .controls-container {
            padding-top: 1rem;
          }
        }
      `}</style>

      <div className={`min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4 ${isModalOpen ? 'hidden' : 'block'}`}>
        <div className="relative w-full h-screen">
          {/* Controls Layer */}
          <div className="absolute top-0 left-0 right-0 z-50 flex justify-center controls-container">
            {!isCardReadingOpen && (
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDialogueOpen(true)}
                  className="px-6 py-3 text-base font-light rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                >
                  Talk to Toweel
                </button>
                <button
                  onClick={startSpinSequence}
                  disabled={isAnimating}
                  className={`px-6 py-3 text-base font-light rounded-lg transition-colors duration-200 ${
                    isAnimating ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {isAnimating ? "Spinning..." : "Spin & Start"}
                </button>
                {highlightedCards.length > 0 && (
                  <button
                    onClick={resetHighlights}
                    className="px-6 py-3 text-base font-light rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-200"
                  >
                    Reset Selection
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Wheel Layer */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 800 800" className="absolute w-[800px] h-[800px] z-0 pointer-events-none">
              <circle cx="400" cy="400" r="300" fill="none" stroke="rgba(0,0,255,0.2)" strokeWidth="2" />
            </svg>

            <motion.div
              ref={containerRef}
              className="absolute w-[800px] h-[800px] z-10 cursor-grab wheel-container"
              animate={controls}
              style={{ rotate: wheelRotation }}
              onPointerDown={(e) => {
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
        onClose={() => {
          console.log('Dialogue modal closing, starting spin');
          // Use the same spin sequence as the Spin & Start button
          startSpinSequence();
          // Then close the modal
          setIsDialogueOpen(false);
        }}
        onEmotionsAnalyzed={handleEmotionsAnalyzed}
      />
    </>
  );
}

export default Wheel;