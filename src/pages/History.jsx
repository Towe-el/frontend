import { useState, useEffect } from 'react';
import EmotionCard from '../components/emotion-card/EmotionCard';
import Navbar from '../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import CardReading from '../components/cardReading/CardReading';
import Summary from '../components/summary/Summary';

const History = () => {
  const [readings, setReadings] = useState([]);
  const [isHistoricalReadingOpen, setIsHistoricalReadingOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState(null);
  const [currentReadingIndex, setCurrentReadingIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Load readings from localStorage
    const savedReadings = localStorage.getItem('emotionReadings');
    if (savedReadings) {
      setReadings(JSON.parse(savedReadings));
    }
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getKeywords = (emotions) => {
    const keywords = {
      happiness: ['Joy', 'Contentment', 'Fulfillment'],
      joy: ['Delight', 'Pleasure', 'Cheer'],
      excitement: ['Enthusiasm', 'Eagerness', 'Thrill'],
      contentment: ['Satisfaction', 'Peace', 'Tranquility'],
      amusement: ['Entertainment', 'Fun', 'Delight'],
      love: ['Affection', 'Care', 'Connection'],
      pride: ['Achievement', 'Confidence', 'Dignity'],
      optimism: ['Hope', 'Positivity', 'Confidence'],
      calmness: ['Peace', 'Serenity', 'Composure'],
      satisfaction: ['Fulfillment', 'Contentment', 'Gratification'],
      relief: ['Ease', 'Comfort', 'Release'],
      interest: ['Curiosity', 'Engagement', 'Attention'],
      anticipation: ['Expectation', 'Eagerness', 'Excitement'],
      surprise: ['Astonishment', 'Amazement', 'Wonder'],
      nostalgia: ['Reminiscence', 'Memory', 'Longing'],
      hope: ['Optimism', 'Faith', 'Aspiration'],
      anxiety: ['Worry', 'Unease', 'Concern'],
      confusion: ['Uncertainty', 'Bewilderment', 'Disorientation'],
      doubt: ['Uncertainty', 'Skepticism', 'Hesitation'],
      boredom: ['Monotony', 'Tedium', 'Restlessness'],
      sadness: ['Sorrow', 'Melancholy', 'Grief'],
      disappointment: ['Letdown', 'Frustration', 'Regret'],
      embarrassment: ['Shame', 'Humiliation', 'Discomfort'],
      guilt: ['Remorse', 'Regret', 'Responsibility'],
      anger: ['Frustration', 'Irritation', 'Rage'],
      frustration: ['Annoyance', 'Irritation', 'Disappointment'],
      disgust: ['Revulsion', 'Aversion', 'Repulsion'],
      fear: ['Anxiety', 'Terror', 'Apprehension']
    };

    return emotions.flatMap(emotion => keywords[emotion.emotion.toLowerCase()] || []);
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
      setIsSummaryOpen(true);
    }
  };

  const handleBackToHistory = () => {
    setIsHistoricalReadingOpen(false);
  };

  const handleCloseSummary = () => {
    setIsSummaryOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </button>
            <h1 className="text-3xl font-semibold text-center">Your Reading History</h1>
            <div className="w-[120px]"></div> {/* Spacer for balance */}
          </div>
          
          {readings.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No readings recorded yet. Complete a reading to see your history here.
            </div>
          ) : (
            <div className="space-y-4">
              {readings.map((reading) => (
                <div
                  key={reading.timestamp}
                  className="bg-white/40 backdrop-blur rounded-xl p-4 shadow-lg h-[300px] flex flex-col cursor-pointer hover:bg-white/60 transition-colors"
                  onClick={() => handleReadingClick(reading)}
                >
                  <div className="flex items-start gap-4 h-full">
                    {/* Left side - Cards */}
                    <div className="flex gap-4 items-center">
                      {reading.cards.map((card, cardIndex) => (
                        <div
                          key={cardIndex}
                          className="transform scale-65 origin-top"
                        >
                          <EmotionCard 
                            emotion={card.emotion} 
                            score={card.score} 
                            isModal={true}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Right side - Timestamp and Keywords */}
                    <div className="flex-1 flex flex-col h-full">
                      <h2 className="text-lg font-medium mb-3">
                        Reading from {formatDate(reading.timestamp)}
                      </h2>
                      
                      <div className="flex-1 bg-white/60 p-3 rounded-lg overflow-y-auto custom-scrollbar">
                        <div className="flex flex-wrap gap-2">
                          {getKeywords(reading.cards).map((keyword, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedReading && (
        <>
          <CardReading 
            isOpen={isHistoricalReadingOpen}
            onClose={handleNextCard}
            onBackToWheel={handleBackToHistory}
            emotionData={selectedReading.cards[currentReadingIndex]}
            isLastCard={currentReadingIndex === selectedReading.cards.length - 1}
          />
          <Summary
            isOpen={isSummaryOpen}
            onClose={handleCloseSummary}
            cards={selectedReading.cards}
          />
        </>
      )}
    </div>
  );
};

export default History;
