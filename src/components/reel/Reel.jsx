import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import EmotionCard from "../emotion-card/EmotionCard";
import CardDetailModal from '../emotion-card/CardDetailModal';
import { simulatedEmotionData } from '../../type/emotionData';

function Reel() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedCards, setHighlightedCards] = useState([]);
  
  // Motion values for wheel rotation
  const wheelRotation = useMotionValue(0);
  const controls = useAnimation();
  
  // SVG path reference for positioning calculations
  const pathRef = useRef();
  const cardsRef = useRef([]);
  
  // Calculate card positions around the circle
  const getCardPosition = useCallback((index, totalCards, rotation = 0) => {
    const radius = 300; // Match your SVG circle radius
    const centerX = 400; // SVG viewBox center
    const centerY = 400;
    const angleStep = (2 * Math.PI) / totalCards;
    const angle = (index * angleStep) + (rotation * Math.PI / 180);
    
    return {
      x: centerX + radius * Math.cos(angle - Math.PI / 2),
      y: centerY + radius * Math.sin(angle - Math.PI / 2),
    };
  }, []);

  // Handle card click to open modal
  const handleCardClick = (emotionData, event) => {
    // Prevent opening modal during animation
    if (isAnimating) return;
    
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setSelectedEmotion(emotionData);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmotion(null);
  };

  // Spin sequence function
  const startSpinSequence = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setHighlightedCards([]); // Clear any previous highlights
    
    // Spin animation for 5 seconds
    await controls.start({
      rotate: wheelRotation.get() + 1800, // 5 full rotations (360 * 5)
      transition: {
        duration: 5,
        ease: "easeOut"
      }
    });
    
    // Update wheel rotation value
    wheelRotation.set(wheelRotation.get() + 1800);
    
    // Select 2 random cards to highlight
    const randomIndices = [];
    while (randomIndices.length < 2) {
      const randomIndex = Math.floor(Math.random() * simulatedEmotionData.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
    
    setHighlightedCards(randomIndices);
    setIsAnimating(false);
  };

  // Reset highlighted cards
  const resetHighlights = () => {
    setHighlightedCards([]);
  };

  return (
    <>
      {/* Add CSS for glow effects */}
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
      
      {/* Main content - hide when modal is open */}
      <div className={`min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4 ${isModalOpen ? 'hidden' : 'block'}`}>

        {/* Animation control buttons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-4 mb-8">
            <button
              onClick={startSpinSequence}
              disabled={isAnimating}
              className={`px-6 py-3 text-base font-light rounded-lg transition-colors duration-200 ${
                isAnimating 
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isAnimating ? "Spinning..." : "Spin & Select"}
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
        </div>

        {/* SVG Container */}
        <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
          <div className="path-container relative w-full h-full" style={{ overflow: 'visible' }}>
            <svg viewBox="0 0 800 800" className="absolute inset-0 w-full h-full">
              {/* Circle path for reference */}
              <path
                ref={pathRef}
                d="M400,100 A300,300 0 0,1 400,700 A300,300 0 0,1 400,100"
                fill="none"
                stroke="rgba(0, 0, 255, 0.3)"
                strokeWidth="2"
              />
            </svg>

            {/* Animated Cards Container */}
            <motion.div 
              className="cards-container absolute inset-0"
              animate={controls}
              style={{ rotate: wheelRotation }}
            >
              {simulatedEmotionData.map((data, index) => {
                const position = getCardPosition(index, simulatedEmotionData.length);
                const isHighlighted = highlightedCards.includes(index);
                
                return (
                  <motion.div
                    key={index}
                    ref={el => (cardsRef.current[index] = el)}
                    className={`emotion-card absolute ${isHighlighted ? 'card-pulse' : ''}`}
                    style={{
                      left: position.x,
                      top: position.y,
                      transform: "translate(-50%, -50%)",
                      transformOrigin: "center center",
                      fontSize: "1rem",
                      pointerEvents: "auto",
                      zIndex: isHighlighted ? 100 : 1
                    }}
                    animate={{
                      scale: isHighlighted ? 1.2 : 0.9,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut"
                    }}
                    onClick={(e) => handleCardClick(data, e)}
                    whileHover={{ scale: isHighlighted ? 1.25 : 1.05 }}
                    whileTap={{ scale: isHighlighted ? 1.15 : 0.95 }}
                  >
                    <EmotionCard
                      emotion={data.emotion}
                      score={data.score}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Card Modal/Page */}
      <CardDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        emotionData={selectedEmotion}
      />
    </>
  );
}

export default Reel;