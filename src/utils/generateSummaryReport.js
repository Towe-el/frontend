export function generateSummaryReport(emotions, searchResult, userInput = '') {
  if (!searchResult?.rag_analysis) {
    return {
      overallAnalysis: ['No analysis available.'],
      keyInsights: [],
      keyInsightsSummary: 'No meaningful emotional data was generated.',
      movingForward: ['Try expressing more about your experience.']
    };
  }

  return {
    inputText: userInput,
    overallAnalysis: [
      `Based on your input, we've identified ${emotions.length} primary emotions that you're experiencing.`,
      emotions.map(e => `${e.emotion} (${Math.floor(e.percentage)}%)`).join(', '),
      "Let's explore what these emotions mean for you."
    ],
    keyInsights: emotions.map(e => e.analysis),
    keyInsightsSummary: searchResult.rag_analysis.summary_report || 'These emotions suggest a complex emotional state that we can help you navigate.',
    movingForward: searchResult.rag_analysis.moving_forward || [
      'Understanding your emotions is the first step toward emotional well-being.',
      'Consider discussing these feelings with someone you trust.',
      "Remember that it's okay to feel this way, and you're not alone in your experience."
    ]
  };
}