/**
 * Structures the summary report data consistently across the application
 * @param {Object} ragAnalysis - The RAG analysis data from the API
 * @param {Array} emotions - The processed emotions data
 * @returns {Object} Structured summary report
 */
export const structureSummaryReport = (ragAnalysis, emotions = []) => {
  if (!ragAnalysis) {
    return {
      keyInsightsSummary: 'No summary available.',
      keyInsights: [],
      movingForward: [
        'Understanding your emotions is the first step towards emotional well-being.',
        'Consider discussing these feelings with someone you trust.',
        'Remember that it\'s okay to feel this way, and you\'re not alone in your experience.'
      ]
    };
  }

  return {
    keyInsightsSummary: ragAnalysis.summary_report || '',
    keyInsights: ragAnalysis.key_insights || emotions.map(e => e.analysis),
    movingForward: ragAnalysis.moving_forward || [
      'Understanding your emotions is the first step towards emotional well-being.',
      'Consider discussing these feelings with someone you trust.',
      'Remember that it\'s okay to feel this way, and you\'re not alone in your experience.'
    ]
  };
};

/**
 * Creates a reading object with structured data for storage
 * @param {Object} searchResult - The search result from the API
 * @param {Array} emotions - The processed emotions data
 * @param {string} accumulatedText - The accumulated text from the conversation
 * @returns {Object} Structured reading object
 */
export const createReadingObject = (searchResult, emotions, accumulatedText) => {
  return {
    sessionId: searchResult.session_id,
    timestamp: Date.now(),
    title: searchResult.title || 'Untitled',
    accumulated_text: accumulatedText,
    cards: emotions,
    summaryReport: structureSummaryReport(searchResult.rag_analysis, emotions)
  };
}; 