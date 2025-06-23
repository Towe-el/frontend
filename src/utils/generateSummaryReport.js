export function generateSummaryReport(emotions = [], searchResult = {}, userInput = '') {
  const rag = searchResult?.rag_analysis;

  // 安全提取 summary 段落文本（字符串或 fallback）
  const summaryText =
    typeof rag?.summary_report === 'string' && rag.summary_report.trim().length > 0
      ? rag.summary_report
      : 'These emotions suggest a complex emotional state that we can help you navigate.';

  // 安全提取 forward 建议（数组或 fallback）
  const forwardText = Array.isArray(rag?.moving_forward) && rag.moving_forward.length > 0
    ? rag.moving_forward
    : [
        'Understanding your emotions is the first step toward emotional well-being.',
        'Consider discussing these feelings with someone you trust.',
        "Remember that it's okay to feel this way, and you're not alone in your experience."
      ];

  // 构造结构化的报告对象
  const summaryReport = {
    inputText: userInput || '',
    timestamp: Date.now(),

    overallAnalysis: [
      `Based on your input, we've identified ${emotions.length} primary emotions that you're experiencing.`,
      emotions.map(e => `${e.emotion} (${Math.floor(e.percentage)}%)`).join(', '),
      "Let's explore what these emotions mean for you."
    ],

    keyInsights: emotions.map(e => e.analysis || 'No analysis available.'),
    keyInsightsSummary: summaryText,
    movingForward: forwardText,

    emotions: emotions.map(e => ({
      emotion: e.emotion,
      percentage: e.percentage,
      analysis: e.analysis,
      quote: e.quote
    }))
  };

  return summaryReport;
}