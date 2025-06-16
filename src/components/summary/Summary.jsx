import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SummaryContent from './SummaryContent.jsx'
import { setSummaryOpen } from '../../store/slices/summarySlice'

const Summary = () => {
  const dispatch = useDispatch();
  const summaryState = useSelector((state) => state.summary) || {
    isOpen: false,
    cards: [],
    accumulatedText: '',
    summaryReport: null
  };

  // Function to check for duplicate records using timestamp
  const isDuplicateRecord = (readings, newReading) => {
    return readings.some(reading => reading.timestamp === newReading.timestamp);
  };

  useEffect(() => {
    if (summaryState.isOpen && summaryState.summaryReport) {
      // Save reading to localStorage
      const savedReadings = localStorage.getItem('emotionReadings');
      const readings = savedReadings ? JSON.parse(savedReadings) : [];
      
      // Create new reading object
      const newReading = {
        timestamp: Date.now(),
        cards: summaryState.cards,
        summaryReport: summaryState.summaryReport,
        accumulated_text: summaryState.accumulatedText,
      };

      // Check for duplicates before adding
      if (!isDuplicateRecord(readings, newReading)) {
        // Add new reading to the beginning of the array
        readings.unshift(newReading);
        
        // Keep only the last 50 readings
        const trimmedReadings = readings.slice(0, 50);
        
        // Save to localStorage
        localStorage.setItem('emotionReadings', JSON.stringify(trimmedReadings));
        
        // Trigger storage event for other tabs
        window.dispatchEvent(new Event('storage'));
      }
    }
  }, [summaryState.isOpen, summaryState.summaryReport, summaryState.cards, summaryState.accumulatedText]);

  const handleClose = () => {
    dispatch(setSummaryOpen(false));
  };

  return (
    <AnimatePresence>
      {summaryState.isOpen && (
        <div className="fixed inset-0 z-[1000] backdrop-blur-md flex items-center justify-center">
          <div className="w-full h-full bg-white/40 backdrop-blur flex">
            <SummaryContent
              accumulated_text={summaryState.accumulatedText}
              summaryReport={summaryState.summaryReport}
              cards={summaryState.cards}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Summary;