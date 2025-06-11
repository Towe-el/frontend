import { AnimatePresence } from 'framer-motion'
import EmotionCard from '../emotion-card/EmotionCard'
import { useEffect, useRef } from 'react'

const Summary = ({ isOpen, onClose, cards }) => {
  const containerRef = useRef(null);
  const cardsRef = useRef(null);
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Save reading to localStorage
      const savedReadings = localStorage.getItem('emotionReadings');
      const readings = savedReadings ? JSON.parse(savedReadings) : [];
      
      const newReading = {
        timestamp: Date.now(),
        cards: cards
      };
      
      // Add new reading to the beginning of the array
      readings.unshift(newReading);
      
      // Keep only the last 50 readings
      const trimmedReadings = readings.slice(0, 50);
      
      localStorage.setItem('emotionReadings', JSON.stringify(trimmedReadings));
    }
  }, [isOpen, cards]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && cardsRef.current && cardsContainerRef.current) {
        const scrollPosition = containerRef.current.scrollTop;
        const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;
        const scrollPercentage = scrollPosition / maxScroll;
        
        // Scale down cards as user scrolls
        const scale = Math.max(0.5, 1 - (scrollPercentage * 0.5));
        cardsRef.current.style.transform = `scale(${scale})`;
        cardsRef.current.style.transition = 'transform 0.2s ease-out';

        // Adjust container heights
        const cardsContainerHeight = Math.max(100, 300 * (1 - scrollPercentage * 0.7));
        cardsContainerRef.current.style.height = `${cardsContainerHeight}px`;
        cardsContainerRef.current.style.transition = 'height 0.2s ease-out';
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] backdrop-blur-md flex items-center justify-center"
        >
          <div
            className="fixed inset-0 bg-white backdrop-blur flex flex-col p-8"
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl z-10"
              onClick={onClose}
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-8 text-center">Your Emotion Reading Summary</h2>

            {/* Cards Row */}
            <div 
              ref={cardsContainerRef}
              className="flex justify-center gap-8 mb-8 transition-all duration-200"
              style={{ height: '300px' }}
            >
              <div 
                ref={cardsRef}
                className="flex justify-center gap-8 transition-transform duration-200"
              >
                {cards.map((card, index) => (
                  <div
                    key={index}
                  >
                    <EmotionCard 
                      emotion={card.emotion} 
                      definition={card.definition} 
                      isModal={true}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Section */}
            <div 
              ref={containerRef}
              className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar"
            >
              <div
                className="bg-white/60 p-6 rounded-lg"
              >
                <h3 className="text-xl font-medium mb-4">Overall Analysis</h3>
                <p className="text-gray-700 mb-4">
                  Your emotional journey reveals a complex interplay of feelings. The combination of{' '}
                  {cards.map((card, index) => (
                    <span key={index}>
                      {index === cards.length - 1 ? ' and ' : index > 0 ? ', ' : ''}
                      <span className="font-semibold">{card.emotion.toLowerCase()}</span>
                    </span>
                  ))} suggests a rich emotional landscape.
                </p>
                <p className="text-gray-700 mb-4">
                  These emotions together indicate a period of significant personal growth and self-awareness. 
                  Each emotion contributes to your current state, creating a unique emotional signature.
                </p>
              </div>

              <div
                className="bg-white/60 p-6 rounded-lg"
              >
                <h3 className="text-xl font-medium mb-4">Key Insights</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Your emotions are interconnected and influence each other</li>
                  <li>There's a balance between different emotional states</li>
                  <li>These feelings provide valuable insights into your current life situation</li>
                  <li>Each emotion serves a purpose in your emotional well-being</li>
                </ul>
              </div>

              <div
                className="bg-white/60 p-6 rounded-lg"
              >
                <h3 className="text-xl font-medium mb-4">Moving Forward</h3>
                <p className="text-gray-700">
                  Consider how these emotions work together in your life. They can guide you toward 
                  greater self-understanding and emotional balance. Remember that each emotion is 
                  temporary and serves a purpose in your journey.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Summary