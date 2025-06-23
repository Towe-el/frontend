import { useSelector } from 'react-redux';
import { PDFDownloadLink } from '@react-pdf/renderer';
import EmotionSummaryDocument from '../../utils/pdfGenerator.jsx';
import EmotionCard from '../emotion-card/EmotionCard';

const SummaryContent = ({ onClose, showSharedContent = true }) => {
  const { accumulatedText, summaryReport, cards } = useSelector((state) => state.summary);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="pdf-content-container relative block bg-white z-[1] min-h-screen p-8">
      {/* Emotion Cards */}
      <div className="flex justify-center gap-20 mb-8">
        {cards && cards.slice(0, 3).map((card) => (
          <div key={card.emotion} className="flex flex-col items-center" style={{ width: '120px', height: 'auto' }}>
            <EmotionCard emotion={card.emotion} definition={card.definition} isModal={true} />
            <div className="text-lg text-center font-bold">{card.percentage ? `${Math.floor(card.percentage)}%` : ''}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[200px_1fr] gap-8">
        {/* Navigation Bar */}
        <div className="sticky top-8 h-fit">
          <nav className="space-y-4">
            {['overall-analysis', 'key-insights', 'moving-forward'].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                className="block text-gray-600 hover:text-blue-500 transition-colors"
              >
                {id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </a>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-center">Your Emotion Reading Summary</h2>

          <div className="space-y-4">
            {showSharedContent && (
              <div id="what-you-shared" className="bg-white/60 p-6 rounded-lg scroll-mt-8">
                <h3 className="text-xl font-medium mb-4">What You Shared</h3>
                <div className="text-gray-700">
                  <p className="whitespace-pre-wrap">
                    {accumulatedText || 'No conversation content available.'}
                  </p>
                </div>
              </div>
            )}

            <div id="overall-analysis" className="bg-white/60 p-6 rounded-lg scroll-mt-8">
              <h3 className="text-xl font-medium mb-4">Overall Analysis</h3>
              {summaryReport?.keyInsightsSummary ? (
                <div className="text-gray-700 space-y-4">
                  {summaryReport.keyInsightsSummary.split('\n\n').map((section, index) => {
                    if (section.startsWith('**') && section.endsWith('**')) {
                      return (
                        <h4 key={index} className="font-bold text-lg">
                          {section.replace(/\*\*/g, '')}
                        </h4>
                      );
                    }
                    if (/^\d+\.\s/.test(section)) {
                      return (
                        <div key={index} className="ml-4">
                          <p>{section}</p>
                        </div>
                      );
                    }
                    return <p key={index}>{section}</p>;
                  })}
                </div>
              ) : (
                summaryReport?.overallAnalysis?.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4">
                    {paragraph}
                  </p>
                ))
              )}
            </div>

            <div id="moving-forward" className="bg-white/60 p-6 rounded-lg scroll-mt-8">
              <h3 className="text-xl font-medium mb-4">Moving Forward</h3>
              {summaryReport?.movingForward?.map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* PDF Download & Close */}
          <div className="mt-6 flex justify-center gap-4">
            <PDFDownloadLink
              document={<EmotionSummaryDocument cards={cards} summaryReport={summaryReport} accumulated_text={accumulatedText} />}
              fileName="emotion-summary.pdf"
              className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              {({ loading }) => (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {loading ? 'Preparing PDF...' : 'Download PDF'}
                </>
              )}
            </PDFDownloadLink>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Close Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryContent;