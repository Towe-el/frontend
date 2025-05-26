import { useRef, useState, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import EmotionCard from "../emotion-card/EmotionCard";
import CardDetailModal from '../emotion-card/CardDetailModal';
import DialogueModal from '../dialogue/DialogueModal';
import { simulatedEmotionData } from '../../type/emotionData';

function Reel() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedCards, setHighlightedCards] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

  const wheelRotation = useMotionValue(0);
  const controls = useAnimation();
  const containerRef = useRef();
  const cardsRef = useRef([]);
  const lastAngle = useRef(null);

  const getAngleFromCenter = (x, y, centerX, centerY) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const radians = Math.atan2(dy, dx);
    return radians * (180 / Math.PI);
  };

  const handleCardClick = (emotionData, event) => {
    if (isAnimating) return;
    event?.preventDefault();
    event?.stopPropagation();
    setSelectedEmotion(emotionData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmotion(null);
  };

  const startSpinSequence = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setHighlightedCards([]);

    const newRotation = wheelRotation.get() + 1800;
    await controls.start({
      rotate: newRotation,
      transition: { duration: 5, ease: "easeOut" },
    });
    wheelRotation.set(newRotation);

    const randomIndices = [];
    while (randomIndices.length < 2) {
      const randomIndex = Math.floor(Math.random() * simulatedEmotionData.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
    setHighlightedCards(randomIndices);
    setIsAnimating(false);
    setIsDialogueOpen(true); // show the AI dialogue once the spin is done.
  };

  const resetHighlights = () => {
    setHighlightedCards([]);
  };

  const totalCards = simulatedEmotionData.length;
  const radius = 300;

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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-4 mb-8">
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
        </div>

        <div className="relative w-full h-screen flex items-center justify-center">
          <svg viewBox="0 0 800 800" className="absolute w-[800px] h-[800px] z-0 pointer-events-none">
            <circle cx="400" cy="400" r="300" fill="none" stroke="rgba(0,0,255,0.2)" strokeWidth="2" />
          </svg>

          <div
            ref={containerRef}
            className="absolute w-[800px] h-[800px]"
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
            {simulatedEmotionData.map((data, index) => {
              const anglePerCard = 360 / totalCards;
              const baseAngle = anglePerCard * index;
              const dynamicAngle = useTransform(wheelRotation, r => r + baseAngle);
              const x = useTransform(dynamicAngle, a => 400 + radius * Math.cos((a - 90) * Math.PI / 180));
              const y = useTransform(dynamicAngle, a => 400 + radius * Math.sin((a - 90) * Math.PI / 180));
              const isHighlighted = highlightedCards.includes(index);

              return (
                <motion.div
                  key={index}
                  className={`emotion-card absolute ${isHighlighted ? 'card-pulse' : ''}`}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    translateX: "-50%",
                    translateY: "-50%",
                    rotate: useTransform(dynamicAngle, a => a),
                    transformOrigin: "center center",
                    fontSize: "1rem",
                    pointerEvents: "auto",
                    zIndex: isHighlighted ? 100 : 1,
                  }}
                  animate={{ scale: isHighlighted ? 1.2 : 0.9 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  onClick={(e) => handleCardClick(data, e)}
                  whileHover={{ scale: isHighlighted ? 1.25 : 1.05 }}
                  whileTap={{ scale: isHighlighted ? 1.15 : 0.95 }}
                >
                  <EmotionCard emotion={data.emotion} score={data.score} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <CardDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        emotionData={selectedEmotion}
      />
      <DialogueModal 
      isOpen={isDialogueOpen}
      onClose={()=>setIsDialogueOpen(false)}
      />
    </>
  );
}

export default Reel;