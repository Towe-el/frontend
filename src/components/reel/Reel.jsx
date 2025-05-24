import { useEffect, useRef, useState } from 'react';
import EmotionCard from "../emotion-card/EmotionCard";
import CardDetailModal from '../emotion-card/CardDetailModal';
import { simulatedEmotionData } from '../../type/emotionData';
import { 
  registerGSAPPlugins, 
  initializeCardPositions, 
  updateAllCardPositions, 
  createRotationAnimation 
} from '../../utils/gsapAnima';
import { makeCardsDraggable, cleanupDraggable, isCardDragging } from '../../utils/draggable';

function Reel() {
  const cardsRef = useRef([]);
  const pathRef = useRef();
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const animationRef = useRef(null);
  const wheelOffsetRef = useRef(0); // Store the wheel's current rotation offset
  const draggableInstancesRef = useRef([]);

  useEffect(() => {
    registerGSAPPlugins();

    // Position cards initially without animation
    handleInitializeCardPositions();
    handleMakeCardsDraggable();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      // Clean up draggable instances
      cleanupDraggable(cardsRef.current);
    };
  }, []);
  
  // Wrapper function to handle card initialization
  const handleInitializeCardPositions = () => {
    initializeCardPositions(pathRef.current, cardsRef.current, wheelOffsetRef.current);
  };
  
  // Wrapper function to handle making cards draggable
  const handleMakeCardsDraggable = () => {
    const instances = makeCardsDraggable(
      pathRef.current, 
      cardsRef.current, 
      wheelOffsetRef, 
      handleUpdateAllCardPositions
    );
    draggableInstancesRef.current = instances || [];
  };
  
  // Wrapper function to handle updating all card positions
  const handleUpdateAllCardPositions = () => {
    updateAllCardPositions(pathRef.current, cardsRef.current, wheelOffsetRef.current);
  };

  // Handle card click to open modal - one click
  const handleCardClick = (emotionData, event, cardElement) => {
    // Check if the card is currently being dragged
    if (isCardDragging(cardElement)) {
      return; // Don't open modal if dragging
    }
    
    // Check if this element has the dragging attribute (safety check)
    if (cardElement && cardElement.getAttribute('data-dragging') === 'true') {
      return; // Don't open modal if marked as dragging
    }
    
    // Prevent event bubbling
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

  // Function to start/stop animation
  const toggleAnimation = () => {
    const path = pathRef.current;
    const cards = cardsRef.current;
    
    if (!path || !cards.length) return;
    
    if (isAnimating) {
      // Stop animation
      if (animationRef.current) {
        // Get current position from the timeline
        const currentPos = animationRef.current.progress();
        animationRef.current.kill();
        animationRef.current = null;
        
        // Ensure the wheel stays at the current position after stopping
        handleUpdateAllCardPositions();
      }
      
      setIsAnimating(false);
    } else {
      // Start animation - animate all cards together to maintain spacing
      const timeline = createRotationAnimation(
        wheelOffsetRef, 
        handleUpdateAllCardPositions, 
        40
      );
      
      animationRef.current = timeline;
      setIsAnimating(true);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4">

        {/* Animation control button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={toggleAnimation}
            className={`mb-8 px-6 py-3 text-base font-light rounded-lg transition-colors duration-200 ${
              isAnimating 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isAnimating ? "Stop Animation" : "Start Animation"}
          </button>
        </div>

        {/* SVG Container */}
        <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
          <div 
            className="path-container relative w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <svg
              viewBox="0 0 800 800"
              className="absolute inset-0 w-full h-full"
            >
              {/* Larger circle path centered in viewbox */}
              <path
                ref={pathRef}
                d="M400,100 A300,300 0 0,1 400,700 A300,300 0 0,1 400,100"
                fill="none"
                stroke="rgba(0, 0, 255, 0.3)"
                strokeWidth="2"
              />
            </svg>

            {/* Render Emotion Cards */}
            <div className="cards-container absolute inset-0">
              {simulatedEmotionData.map((data, index) => (
                <div
                  key={index}
                  ref={el => (cardsRef.current[index] = el)}
                  className="emotion-card absolute"
                  style={{
                    transform: "translate(-50%, -50%) scale(0.9)",
                    transformOrigin: "center center",
                    fontSize: "1rem",
                    pointerEvents: "auto" // Ensure pointer events are enabled
                  }}
                  onClick={(e) => {
                    // Add a small delay to ensure drag state is properly set
                    setTimeout(() => {
                      handleCardClick(data, e, cardsRef.current[index]);
                    }, 10);
                  }}
                >
                  <EmotionCard
                    emotion={data.emotion}
                    score={data.score}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Modal - Outside the main container */}
      <CardDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        emotionData={selectedEmotion}
      />
    </>
  );
}

export default Reel;