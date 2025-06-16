import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmotionCard from '../components/emotion-card/EmotionCard';
import Navbar from '../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import CardReading from '../components/cardReading/CardReading';
import Summary from '../components/summary/Summary';
import { setSummaryOpen, setSummaryData } from '../store/slices/summarySlice';

const ITEMS_PER_PAGE = 10;

const History = () => {
  const dispatch = useDispatch();
  const [readings, setReadings] = useState([]);
  const [isHistoricalReadingOpen, setIsHistoricalReadingOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState(null);
  const [currentReadingIndex, setCurrentReadingIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Memoize the sorted readings to prevent unnecessary re-sorting
  const sortedReadings = useMemo(() => {
    return [...readings].sort((a, b) => b.timestamp - a.timestamp);
  }, [readings]);

  // Calculate paginated readings
  const paginatedReadings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedReadings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedReadings, currentPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(readings.length / ITEMS_PER_PAGE);
  }, [readings.length]);

  useEffect(() => {
    // Load readings from localStorage
    const loadReadings = () => {
      const savedReadings = localStorage.getItem('emotionReadings');
      if (savedReadings) {
        try {
          const parsedReadings = JSON.parse(savedReadings);
          if (Array.isArray(parsedReadings) && parsedReadings.length > 0) {
            setReadings(parsedReadings);
          } else {
            setReadings([]);
          }
        } catch (error) {
          console.error('Error parsing readings from localStorage:', error);
          setReadings([]);
        }
      } else {
        setReadings([]);
      }
    };

    loadReadings();
    window.addEventListener('storage', loadReadings);
    return () => window.removeEventListener('storage', loadReadings);
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    const weekdayOptions = { weekday: 'long' };
    
    return (
      <>
        <div>{date.toLocaleDateString('en-US', options)}</div>
        <div className="text-gray-500">{date.toLocaleDateString('en-US', weekdayOptions)}</div>
      </>
    );
  };

  const handleReadingClick = (reading) => {
    setSelectedReading(reading);
    setCurrentReadingIndex(0);
    setIsHistoricalReadingOpen(true);
  };

  const handleNextCard = () => {
    if (currentReadingIndex < selectedReading.cards.length - 1) {
      setCurrentReadingIndex(prev => prev + 1);
    } else {
      setIsHistoricalReadingOpen(false);
      // Update Redux state for summary
      dispatch(setSummaryData({
        cards: selectedReading.cards,
        accumulatedText: selectedReading.accumulated_text,
        summaryReport: selectedReading.summaryReport
      }));
      dispatch(setSummaryOpen(true));
    }
  };

  const handleBackToHistory = () => {
    setIsHistoricalReadingOpen(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">My Emotions</h1>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </button>
          </div>
          <div className="border-b border-black mb-8"></div>
          
          {readings.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No readings recorded yet. Complete a reading to see your history here.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedReadings.map((reading) => (
                  <div
                    key={reading.timestamp}
                    className="bg-white/40 backdrop-blur rounded-xl p-4 h-[300px] flex flex-col cursor-pointer hover:bg-white/60 transition-colors relative"
                    onClick={() => handleReadingClick(reading)}
                  >
                    <div className="flex items-start gap-4 h-full">
                      <div className="flex flex-col text-left w-48">
                        <div className="text-sm text-gray-500">
                          {formatDate(reading.timestamp)}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col items-end">
                        <div className="h-full">
                          {reading.title && (
                            <div className="text-xl font-semibold text-gray-800 m-4">
                              {reading.title}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1 items-center mt-4">
                          {reading.cards.map((card, cardIndex) => (
                            <div
                              key={cardIndex}
                              className="transform scale-65 origin-top"
                            >
                              <EmotionCard 
                                emotion={card.emotion} 
                                definition={card.definition} 
                                isModal={true}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-6 right-0 h-[1px] bg-black w-2/3"></div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8 mb-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white/40 backdrop-blur disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/60 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white/40 backdrop-blur disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/60 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedReading && (
        <CardReading 
          isOpen={isHistoricalReadingOpen}
          onClose={handleNextCard}
          onBackToWheel={handleBackToHistory}
          emotionData={selectedReading.cards[currentReadingIndex]}
          isLastCard={currentReadingIndex === selectedReading.cards.length - 1}
        />
      )}
      <Summary />
    </div>
  );
};

export default History;
