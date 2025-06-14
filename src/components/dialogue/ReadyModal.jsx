import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react';
import { LoadingAnimation } from '../../animations/LoadingAnimation';
import Navbar from '../navbar/Navbar';
import LogoImage1 from '../../assets/LogoImage1.png';

const BackIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-6 h-6"
  >
    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
  </svg>
)

const ReadyModal = ({ isOpen, onClose, onSearch }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSpinClick = async () => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    try {
      // Call onSearch but don't close modal yet
      await onSearch();
      // Keep loading state until wheel animation completes
      // The modal will be closed by the parent component after wheel animation
    } catch (error) {
      console.error('Error during search:', error);
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1001] bg-white flex flex-col"
        >
          <Navbar />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-24 left-8 text-gray-500 hover:text-gray-700 transition-colors z-10"
          >
            <BackIcon />
          </motion.button>
          <div className="flex-1 flex items-center justify-center p-8">
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
              className="w-full max-w-[600px] rounded-2xl p-8"
            >
              <motion.img
                src={LogoImage1}
                alt="Toweel Logo"
                className="w-126 h-64 mx-auto mb-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <h2 className="text-5xl text-gray-800 mb-4">
                Thank you for Sharing.
              </h2>
              <p className="text-gray-600 mb-8">
                Sharing what you have what you feel is a powerful first step toward understanding your emotions. Toweel will now spin the emotional wheel and draw three cards for you, along with deeper insights and a detailed summary report.
              </p>
              <p className="text-gray-700 mb-8">
                Would you like Toweel to spin the wheel for you?
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSpinClick}
                disabled={isLoading}
                className="w-full py-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingAnimation /> Analyzing your emotions...
                  </div>
                ) : (
                  "Spin the Wheel"
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ReadyModal