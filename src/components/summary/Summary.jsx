import { AnimatePresence } from 'framer-motion'
import EmotionCard from '../emotion-card/EmotionCard'
import { useEffect, useRef } from 'react'
import { generateEmotionSummaryPDF } from '../../utils/pdfGenerator'

const Summary = ({ isOpen, onClose, cards }) => {
  const contentRef = useRef(null);

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

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleDownloadPDF = () => {
    generateEmotionSummaryPDF(contentRef);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] backdrop-blur-md">
          <div className="fixed inset-0 bg-white backdrop-blur flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl z-10"
              onClick={onClose}
            >
              ×
            </button>

            <div ref={contentRef} className="h-screen overflow-x-hidden overflow-y-scroll scroll-smooth [perspective:1px] [transform-style:preserve-3d]">
              {/* Parallax Cards Section */}
              <div className="pdf-cards-container flex flex-1 relative z-[-1] h-screen justify-center items-center [transform:translateZ(-1px)_scale(2)] bg-[rgb(250,228,216)]">
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Emotion Cards</h2>
                  <div className="flex justify-center gap-8">
                    {cards.map((card, index) => (
                      <div key={index}>
                        <EmotionCard 
                          emotion={card.emotion} 
                          definition={card.definition} 
                          isModal={true}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-15 right-15 text-gray-500 text-md animate-bounce">
                    Keep scrolling ↓
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="pdf-content-container relative block bg-white z-[1] min-h-screen p-8">
                <div className="grid grid-cols-[200px_1fr] gap-8">
                  {/* Navigation Bar */}
                  <div className="sticky top-8 h-fit">
                    <nav className="space-y-4">
                      <a 
                        href="#overall-analysis" 
                        onClick={(e) => handleNavClick(e, 'overall-analysis')}
                        className="block text-gray-600 hover:text-blue-500 transition-colors"
                      >
                        Overall Analysis
                      </a>
                      <a 
                        href="#key-insights" 
                        onClick={(e) => handleNavClick(e, 'key-insights')}
                        className="block text-gray-600 hover:text-blue-500 transition-colors"
                      >
                        Key Insights
                      </a>
                      <a 
                        href="#moving-forward" 
                        onClick={(e) => handleNavClick(e, 'moving-forward')}
                        className="block text-gray-600 hover:text-blue-500 transition-colors"
                      >
                        Moving Forward
                      </a>
                    </nav>
                  </div>

                  {/* Main Content */}
                  <div>
                    <h2 className="text-2xl font-semibold mb-8 text-center">Your Emotion Reading Summary</h2>

                    <div className="space-y-4">
                      <div id="overall-analysis" className="bg-white/60 p-6 rounded-lg scroll-mt-8 transition-opacity duration-300">
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
                        <p className="text-gray-700 mb-4">
                          The depth of your emotional experience shows a remarkable capacity for self-reflection and 
                          emotional intelligence. This combination of feelings often emerges during periods of 
                          transformation and personal development.
                        </p>
                        <p className="text-gray-700 mb-4">
                          Understanding these emotions in context can provide valuable insights into your current 
                          life situation and help guide your future decisions. Each emotion serves a specific 
                          purpose in your psychological well-being.
                        </p>
                        <p className="text-gray-700 mb-4">
                          The way these emotions interact with each other creates a unique emotional ecosystem 
                          that influences your thoughts, behaviors, and relationships. This emotional complexity 
                          is a sign of a rich inner life and emotional maturity.
                        </p>
                      </div>

                      <div id="key-insights" className="bg-white/60 p-6 rounded-lg scroll-mt-8 transition-opacity duration-300">
                        <h3 className="text-xl font-medium mb-4">Key Insights</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                          <li>Your emotions are interconnected and influence each other in complex ways</li>
                          <li>There's a balance between different emotional states that contributes to your overall well-being</li>
                          <li>These feelings provide valuable insights into your current life situation</li>
                          <li>Each emotion serves a purpose in your emotional well-being</li>
                          <li>The intensity of your emotions indicates a deep capacity for feeling and understanding</li>
                          <li>Your emotional responses show a pattern of growth and self-awareness</li>
                          <li>The combination of these emotions suggests a period of significant personal development</li>
                          <li>Your emotional landscape reflects both immediate reactions and deeper psychological patterns</li>
                          <li>These feelings can serve as valuable guides for future decision-making</li>
                          <li>The way you experience these emotions shows a sophisticated emotional intelligence</li>
                        </ul>
                        <p className="text-gray-700 mt-4">
                          These insights can help you better understand your emotional patterns and use them 
                          to enhance your personal growth and relationships. Each insight builds upon the others 
                          to create a comprehensive picture of your emotional state.
                        </p>
                      </div>

                      <div id="moving-forward" className="bg-white/60 p-6 rounded-lg scroll-mt-8 transition-opacity duration-300">
                        <h3 className="text-xl font-medium mb-4">Moving Forward</h3>
                        <p className="text-gray-700 mb-4">
                          Consider how these emotions work together in your life. They can guide you toward 
                          greater self-understanding and emotional balance. Remember that each emotion is 
                          temporary and serves a purpose in your journey.
                        </p>
                        <p className="text-gray-700 mb-4">
                          As you move forward, use these emotional insights to inform your decisions and 
                          relationships. The awareness you've gained can help you navigate future challenges 
                          with greater clarity and emotional intelligence.
                        </p>
                        <p className="text-gray-700 mb-4">
                          Your emotional journey is unique to you, and these feelings are valuable tools 
                          for personal growth. Embrace them as part of your ongoing development and use 
                          them to build stronger connections with others.
                        </p>
                        <p className="text-gray-700 mb-4">
                          Remember that emotional awareness is a skill that can be developed and refined 
                          over time. Each experience contributes to your emotional intelligence and helps 
                          you better understand yourself and others.
                        </p>
                        <p className="text-gray-700 mb-4">
                          The combination of emotions you're experiencing suggests a period of significant 
                          personal growth. Use this opportunity to reflect on your values, goals, and 
                          relationships, and consider how these emotions can guide your next steps.
                        </p>
                        <p className="text-gray-700">
                          As you continue your journey, remember that emotional balance is not about 
                          eliminating difficult emotions, but about understanding and working with them 
                          in a way that promotes growth and well-being.
                        </p>
                      </div>
                    </div>

                    {/* Close and Download Buttons */}
                    <div className="mt-6 flex justify-center gap-4">
                      <button
                        onClick={handleDownloadPDF}
                        className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download PDF
                      </button>
                      <button
                        onClick={onClose}
                        className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                      >
                        Close Summary
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Summary