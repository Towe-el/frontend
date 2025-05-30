import { motion, AnimatePresence } from 'framer-motion'
import EmotionCard from '../emotion-card/EmotionCard'
import { useState, useRef, useEffect } from 'react'

const CardReading = ({ isOpen, onClose, onBackToWheel, emotionData, isLastCard }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const dialogueRef = useRef(null);
  
  const readingSteps = [
    {
      title: "Primary Emotion",
      content: (
        <>
          <p className="text-3xl font-bold text-blue-600">{emotionData?.emotion}</p>
          <p className="text-gray-600 mt-2">Confidence: {(emotionData?.score * 100).toFixed(0)}%</p>
        </>
      )
    },
    {
      title: "What This Means",
      content: (
        <p className="text-gray-700">
          This emotion suggests you're experiencing a significant moment of {emotionData?.emotion.toLowerCase()}. 
          Take a moment to acknowledge this feeling and understand its impact on your current state.
        </p>
      )
    },
    {
      title: "Suggested Actions",
      content: (
        <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
          <li>Take a few deep breaths to center yourself</li>
          <li>Reflect on what triggered this emotion</li>
          <li>Consider sharing your feelings with someone you trust</li>
          <li>Practice mindfulness or meditation</li>
        </ul>
      )
    },
    {
      title: "Understanding Your Emotion",
      content: (
        <p className="text-gray-700">
          {emotionData?.emotion} is a natural response to your current circumstances. 
          It's important to recognize that this emotion is temporary and can be a valuable 
          source of insight into your needs and values.
        </p>
      )
    },
    {
      title: "Moving Forward",
      content: (
        <p className="text-gray-700">
          Remember that emotions are like waves - they come and go. While you're experiencing 
          this {emotionData?.emotion.toLowerCase()}, try to observe it without judgment. 
          This awareness can help you navigate through this feeling with greater ease.
        </p>
      )
    }
  ];

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (dialogueRef.current) {
      if (currentStep === 0) {
        // Scroll to top when moving to next card
        dialogueRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        // Scroll to bottom when new content is added
        dialogueRef.current.scrollTo({
          top: dialogueRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [currentStep]);

  const handleContinue = () => {
    if (currentStep < readingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleNextCard = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1000] backdrop-blur-md flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              duration: 0.5
            }}
            className="rounded-xl p-8 w-[90%] max-w-6xl h-[80vh] bg-white/40 shadow-lg backdrop-blur flex"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
              onClick={onClose}
            >
              ×
            </motion.button>

            {/* Left side - Emotion Card */}
            <div className="w-1/3 flex items-center justify-center pr-8">
              {emotionData && (
                <div className="transform scale-150">
                  <EmotionCard 
                    emotion={emotionData.emotion} 
                    score={emotionData.score} 
                    isModal={true}
                  />
                </div>
              )}
            </div>

            {/* Right side - AI Dialogue */}
            <div className="w-2/3 flex flex-col">
              <h2 className="text-2xl font-semibold mb-6">Your Emotion Reading</h2>
              
              <div 
                ref={dialogueRef}
                className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar"
              >
                {emotionData && (
                  <>
                    {readingSteps.slice(0, currentStep + 1).map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white/60 p-6 rounded-lg"
                      >
                        <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                        {step.content}
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBackToWheel}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Back to Wheel
                </motion.button>
                
                {currentStep < readingSteps.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleContinue}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Continue Reading
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isLastCard 
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isLastCard ? 'Finish Reading' : 'Read Next Card'}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CardReading