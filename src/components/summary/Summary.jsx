import { AnimatePresence } from 'framer-motion'
import EmotionCard from '../emotion-card/EmotionCard'
import { useEffect, useRef } from 'react'
import EmotionSummaryDocument from '../../utils/pdfGenerator.jsx'
import { PDFDownloadLink } from '@react-pdf/renderer'
import SummaryContent from './SummaryContent.jsx'

const Summary = ({ isOpen, onClose, cards, accumulated_text, summaryReport }) => {
  const contentRef = useRef(null);

  // Function to check for duplicate records using timestamp
  const isDuplicateRecord = (readings, newReading) => {
    // Consider it a duplicate if there's a reading with the same timestamp
    return readings.some(reading => reading.timestamp === newReading.timestamp);
  };

  useEffect(() => {
    if (isOpen && summaryReport) {
      // Save reading to localStorage
      const savedReadings = localStorage.getItem('emotionReadings');
      console.log('Current saved readings:', savedReadings);
      const readings = savedReadings ? JSON.parse(savedReadings) : [];
      
      // Create new reading object with the passed summaryReport
      const newReading = {
        timestamp: Date.now(),
        cards: cards,
        summaryReport: summaryReport,
        accumulated_text: accumulated_text,
      };

      console.log('New reading to be added:', newReading);

      // Check for duplicates before adding
      if (!isDuplicateRecord(readings, newReading)) {
        // Add new reading to the beginning of the array
        readings.unshift(newReading);
        console.log('Updated readings array:', readings);
        
        // Keep only the last 50 readings
        const trimmedReadings = readings.slice(0, 50);
        
        // Save to localStorage
        localStorage.setItem('emotionReadings', JSON.stringify(trimmedReadings));
        console.log('Saved to localStorage:', trimmedReadings);
        
        // Trigger storage event for other tabs
        window.dispatchEvent(new Event('storage'));
      } else {
        console.log('Duplicate record found with timestamp:', newReading.timestamp);
      }
    }
  }, [isOpen, summaryReport, cards, accumulated_text]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] backdrop-blur-md flex items-center justify-center">
          <div className="w-full h-full bg-white/40 backdrop-blur flex">
            <SummaryContent
              accumulated_text={accumulated_text}
              summaryReport={summaryReport}
              cards={cards}
              onClose={onClose}
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Summary;