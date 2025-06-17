import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SummaryContent from './SummaryContent.jsx'
import { setShowSummary } from '../../store/slices/uiSlice'

const Summary = ({ onClose }) => {
  console.log("🎉 SummaryContent mounted");

  const dispatch = useDispatch();
  const showSummary = useSelector((state) => state.ui.showSummary);
  const summaryState = useSelector((state) => state.summary) || {
    cards: [],
    accumulatedText: '',
    summaryReport: null
  };

  // Add debug logs for state
  useEffect(() => {
    console.log('Summary: Current state:', {
      showSummary,
      summaryState,
      cards: summaryState.cards,
      summaryReport: summaryState.summaryReport,
      accumulatedText: summaryState.accumulatedText,
      isHistorical: summaryState.isHistorical
    });

    // 检查 summaryReport 的结构
    if (summaryState.summaryReport) {
      console.log('Summary: summaryReport structure:', {
        hasKeyInsights: !!summaryState.summaryReport.keyInsights,
        hasKeyInsightsSummary: !!summaryState.summaryReport.keyInsightsSummary,
        hasMovingForward: !!summaryState.summaryReport.movingForward,
        fullReport: summaryState.summaryReport
      });
    }
  }, [showSummary, summaryState]);

  // Function to check for duplicate records using timestamp
  const isDuplicateRecord = (readings, newReading) => {
    return readings.some(reading => reading.timestamp === newReading.timestamp);
  };

  useEffect(() => {
    if (showSummary && summaryState.summaryReport && !summaryState.isHistorical) {
      console.log('Summary: Saving reading to localStorage');
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

      console.log('Summary: New reading object:', newReading);

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
  }, [showSummary, summaryState.summaryReport, summaryState.cards, summaryState.accumulatedText, summaryState.isHistorical]);

  const handleClose = () => {
    dispatch(setShowSummary(false));
    if (onClose) {
      onClose(); // 调用父组件传入的清理函数
    }
  };

  return (
    <AnimatePresence>
      {showSummary && (
        <div className="fixed inset-0 z-[1000] backdrop-blur-md flex items-center justify-center">
          <div className="w-full h-full bg-white backdrop-blur flex relative">
            <div className="w-full h-[100vh] bg-white rounded-lg overflow-y-auto relative">
              {/* Back Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-black/20 transition-colors"
              >
                x
              </button>
              <SummaryContent
                accumulated_text={summaryState.accumulatedText}
                summaryReport={summaryState.summaryReport}
                cards={summaryState.cards}
                onClose={handleClose}
              />
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Summary;