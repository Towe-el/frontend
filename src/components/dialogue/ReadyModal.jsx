import { AnimatePresence } from 'framer-motion'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingAnimation } from '../../animations/LoadingAnimation';
import Navbar from '../navbar/Navbar';
import LogoImage1 from '../../assets/LogoImage1.png';
import { setShowReadyModal } from '../../store/slices/dialogueSlice';
import { setSelectedCards, setCurrentSummaryReport, setCardClickMode } from '../../store/slices/emotionSlice';
import { setSummaryData } from '../../store/slices/summarySlice';
import { setShowSummary } from '../../store/slices/uiSlice';
import { simulatedEmotionData } from '../../data/emotionData';

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

const ReadyModal = ({ onSearch, onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const showReadyModal = useSelector((state) => state.dialogue.showReadyModal);

  const handleClose = () => {
    console.log('ReadyModal: Close button clicked');
    dispatch(setShowReadyModal(false));
    if (onClose) {
      onClose();
    }
  };

  const handleSearch = async () => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    try {
      console.log('ReadyModal: Starting emotion analysis');
      const result = await onSearch();
      
      if (result && result.emotions) {
        console.log('ReadyModal: Emotion analysis result received:', {
          emotions: result.emotions,
          summary_report: result.summary_report,
          accumulated_text: result.accumulated_text
        });
        
        // Map the emotions to cards and update Redux store
        const newSelectedCards = result.emotions.map(emotion => {
          const matchingCard = simulatedEmotionData.find(card =>
            card.emotion.toLowerCase() === emotion.emotion.toLowerCase()
          );
          if (!matchingCard) {
            console.error('❌ No matching card found for emotion:', emotion.emotion);
            return null;
          }
          return {
            ...matchingCard,
            percentage: emotion.percentage,
            quote: emotion.quote,
            analysis: emotion.analysis
          };
        }).filter(card => card !== null);

        console.log('ReadyModal: Setting selected cards:', newSelectedCards);
        // Update Redux store with the new cards and summary
        dispatch(setSelectedCards(newSelectedCards));
        
        if (result.summary_report) {
          console.log('ReadyModal: Setting summary report to Redux:', result.summary_report);
          dispatch(setCurrentSummaryReport(result.summary_report));
          // Update summary state in Redux
          const summaryData = {
            cards: newSelectedCards,
            accumulatedText: result.accumulated_text || '',
            summaryReport: result.summary_report
          };
          console.log('ReadyModal: Setting summary data to Redux:', summaryData);
          dispatch(setSummaryData(summaryData));
          dispatch(setShowSummary(true));
        } else {
          console.warn('ReadyModal: No summary_report found in result');
        }

        // Save to localStorage
        const newReading = {
          timestamp: Date.now(),
          cards: newSelectedCards,
          summaryReport: result.summary_report,
          accumulated_text: result.accumulated_text || '',
        };
        console.log('ReadyModal: Saving reading to localStorage:', newReading);

        const prev = JSON.parse(localStorage.getItem('emotionReadings') || '[]');
        localStorage.setItem('emotionReadings', JSON.stringify([...prev, newReading]));

        // Set card click mode to reading and close the ready modal
        dispatch(setCardClickMode('reading'));
        dispatch(setShowReadyModal(false));
        
        // Close the dialogue modal as well
        if (onClose) {
          onClose();
        }
      } else {
        console.warn('ReadyModal: No emotions data in result:', result);
      }
    } catch (error) {
      console.error('ReadyModal: Error during emotion analysis:', error);
      setIsLoading(false);
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {showReadyModal && (
        <div
          className="fixed inset-0 z-[1001] bg-white flex flex-col"
        >
          <Navbar />
          <button
            onClick={handleClose}
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
                  "Spin the Wheel"
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