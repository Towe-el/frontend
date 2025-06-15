import { AnimatePresence } from 'framer-motion'
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

  const handleSearch = async () => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    try {
      await onSearch();
      // Close modal immediately after search is complete
      onClose();
    } catch (error) {
      console.error('Error during search:', error);
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[1001] bg-white flex flex-col"
        >
          <Navbar />
          <button
            onClick={onClose}
            className="absolute top-24 left-8 text-gray-500 hover:text-gray-700 transition-colors z-10"
          >
            <BackIcon />
          </button>
          <div className="flex-1 flex items-center justify-center p-8">
            <div
              className="w-full max-w-[600px] rounded-2xl p-8"
            >
              <img
                src={LogoImage1}
                alt="Toweel Logo"
                className="w-126 h-64 mx-auto mb-8"
              />
              <h2 className="text-5xl text-gray-800 mb-4">
                Thank you for Sharing.
              </h2>
              <p className="text-gray-600 mb-8">
                Sharing what you feel is a powerful first step toward understanding your emotions. Toweel will now analyze your emotions and highlight relevant cards for you, along with deeper insights and a detailed summary report.
              </p>
              <p className="text-gray-700 mb-8">
                Would you like Toweel to analyze your emotions?
              </p>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full py-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingAnimation /> Analyzing your emotions...
                  </div>
                ) : (
                  "Analyze Emotions"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ReadyModal