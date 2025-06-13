import { motion, AnimatePresence } from 'framer-motion'
import EmotionCard from '../emotion-card/EmotionCard'
import { useRef, useEffect } from 'react'

const CardReading = ({ isOpen, onClose, onBackToWheel, emotionData, isLastCard, summaryReport }) => {
  const dialogueRef = useRef(null);
  
  const readingSteps = [
    {
      title: "Primary Emotion",
      content: (
        <>
          <p className="text-3xl font-bold" style={{ color: emotionData?.textColor || '#2563EB' }}>{emotionData?.emotion || 'Unknown'}</p>
          <p className="text-xl mt-4 leading-relaxed" style={{ color: emotionData?.textColor || '#374151' }}>{emotionData?.definition || 'No definition available'}</p>
          {emotionData?.percentage && (
            <p className="text-lg mt-2 text-gray-600">
              Intensity: <span className="font-semibold">{emotionData.percentage}%</span>
            </p>
          )}
        </>
      )
    },
    {
      title: "Your Words",
      content: (
        <div className="space-y-4">
          {emotionData?.quote && (
            <div className="bg-white/30 p-4 rounded-lg">
              <p className="italic text-lg" style={{ color: emotionData?.textColor || '#374151' }}>
                "{emotionData.quote}"
              </p>
            </div>
          )}
          {emotionData?.analysis && (
            <div className="mt-4">
              <p className="text-lg" style={{ color: emotionData?.textColor || '#374151' }}>
                {emotionData.analysis}
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      title: "What This Means",
      content: (
        <p style={{ color: emotionData?.textColor || '#374151' }}>
          This emotion suggests you're experiencing a significant moment of {(emotionData?.emotion || 'emotion').toLowerCase()}. 
          Take a moment to acknowledge this feeling and understand its impact on your current state.
        </p>
      )
    },
    {
      title: "Suggested Actions",
      content: (
        <ul className="text-left list-disc list-inside space-y-2" style={{ color: emotionData?.textColor || '#374151' }}>
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
        <p style={{ color: emotionData?.textColor || '#374151' }}>
          {emotionData?.emotion || 'This emotion'} is a natural response to your current circumstances. 
          It's important to recognize that this emotion is temporary and can be a valuable 
          source of insight into your needs and values.
        </p>
      )
    },
    {
      title: "Moving Forward",
      content: (
        <p style={{ color: emotionData?.textColor || '#374151' }}>
          Remember that emotions are like waves - they come and go. While you're experiencing 
          this {(emotionData?.emotion || 'emotion').toLowerCase()}, try to observe it without judgment. 
          This awareness can help you navigate through this feeling with greater ease.
        </p>
      )
    }
  ];

  // Auto-scroll to top when modal opens
  useEffect(() => {
    if (dialogueRef.current) {
      dialogueRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [isOpen]);

  const handleNextCard = () => {
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
            className="fixed inset-0 backdrop-blur flex"
            style={{ 
              backgroundColor: emotionData?.bgColor || 'rgba(255, 255, 255, 0.4)',
              opacity: 0.9
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl z-10"
              onClick={onClose}
            >
              ×
            </motion.button>

            {/* Left side - Emotion Card */}
            <div className="w-1/3 flex items-center justify-center p-8">
              {emotionData && (
                <div className="transform scale-150">
                  <EmotionCard 
                    emotion={emotionData.emotion} 
                    definition={emotionData.definition} 
                    isModal={true}
                  />
                </div>
              )}
            </div>

            {/* Right side - AI Dialogue */}
            <div className="w-2/3 flex flex-col p-8">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: emotionData?.textColor || '#1F2937' }}>Your Emotion Reading</h2>
              
              <div 
                ref={dialogueRef}
                className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar"
              >
                {emotionData && (
                  <>
                    {readingSteps.map((step, index) => (
                      <div
                        key={index}
                        className="p-6 rounded-lg"
                      >
                        <h3 className="text-xl font-medium mb-2" style={{ color: emotionData?.textColor || '#1F2937' }}>{step.title}</h3>
                        {step.content}
                      </div>
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
                  className="px-6 py-3 rounded-lg font-medium transition-colors"
                  style={{ 
                    backgroundColor: emotionData?.textColor || '#6B7280',
                    color: emotionData?.bgColor || '#FFFFFF',
                    opacity: 0.5
                  }}
                >
                  Back to Wheel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextCard}
                  className="px-6 py-3 rounded-lg font-medium transition-colors"
                  style={{ 
                    backgroundColor: emotionData?.textColor || (isLastCard ? '#10B981' : '#3B82F6'),
                    color: emotionData?.bgColor || '#FFFFFF',
                    opacity: 0.8
                  }}
                >
                  {isLastCard ? 'Finish Reading' : 'Read Next Card'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CardReading