import { AnimatePresence } from 'framer-motion'
import EmotionCard from '../emotion-card/EmotionCard'
import { useEffect, useRef } from 'react'
import { generateEmotionSummaryPDF } from '../../utils/pdfGenerator'

const Summary = ({ isOpen, onClose, cards, summaryReport }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Save reading to localStorage
      const savedReadings = localStorage.getItem('emotionReadings');
      const readings = savedReadings ? JSON.parse(savedReadings) : [];
      
      const newReading = {
        timestamp: Date.now(),
        cards: cards,
        summaryReport: summaryReport
      };
      
      // Add new reading to the beginning of the array
      readings.unshift(newReading);
      
      // Keep only the last 50 readings
      const trimmedReadings = readings.slice(0, 50);
      
      localStorage.setItem('emotionReadings', JSON.stringify(trimmedReadings));
    }
  }, [isOpen, cards, summaryReport]);

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
                        {summaryReport?.overallAnalysis?.map((paragraph, index) => (
                          <p key={index} className="text-gray-700 mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      <div id="key-insights" className="bg-white/60 p-6 rounded-lg scroll-mt-8 transition-opacity duration-300">
                        <h3 className="text-xl font-medium mb-4">Key Insights</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                          {summaryReport?.keyInsights?.map((insight, index) => (
                            <li key={index}>{insight}</li>
                          ))}
                        </ul>
                        {summaryReport?.keyInsightsSummary && (
                          <p className="text-gray-700 mt-4">
                            {summaryReport.keyInsightsSummary}
                          </p>
                        )}
                      </div>

                      <div id="moving-forward" className="bg-white/60 p-6 rounded-lg scroll-mt-8 transition-opacity duration-300">
                        <h3 className="text-xl font-medium mb-4">Moving Forward</h3>
                        {summaryReport?.movingForward?.map((paragraph, index) => (
                          <p key={index} className="text-gray-700 mb-4">
                            {paragraph}
                          </p>
                        ))}
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