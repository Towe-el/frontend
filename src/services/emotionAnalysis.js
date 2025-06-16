import { analyzeEmotions } from './api';
import { structureSummaryReport, createReadingObject } from '../utils/summaryReportUtils';

export const analyzeEmotionData = async (text, sessionId, initialAnalysis) => {
  if (!sessionId || !initialAnalysis) {
    console.warn('❌ Cannot run emotion analysis: missing sessionId or analysis');
    return null;
  }

  try {
    console.log('🔍 Starting emotion analysis with session id:', sessionId);
    console.log('🔍 Initial analysis:', initialAnalysis);
    console.log('🔍 Text to analyze:', text);
    
    // Ensure we have all required data
    if (!text || !initialAnalysis.accumulated_text) {
      console.warn('❌ Missing required data for emotion analysis:', {
        hasText: !!text,
        hasAccumulatedText: !!initialAnalysis.accumulated_text
      });
      return null;
    }

    const searchResult = await analyzeEmotions(text, sessionId, {
      execute_search: true,
      accumulated_text: initialAnalysis.accumulated_text
    });

    console.log('✅ Emotion analysis result received:', searchResult);

    if (!searchResult || !searchResult.rag_analysis) {
      console.warn('❌ Invalid search result:', searchResult);
      return null;
    }

    if (searchResult.rag_analysis?.enriched_emotion_stats) {
      // Transform the enriched_emotion_stats array into the expected format
      const emotions = searchResult.rag_analysis.enriched_emotion_stats.map(item => ({
        emotion: item.label || item.emotion,
        percentage: item.percentage || 0,
        count: item.count || 0,
        analysis: item.analysis || '',
        quote: item.quote || ''
      }));

      // Create summary report using the utility function
      const summaryReport = structureSummaryReport(searchResult.rag_analysis, emotions);

      console.log('✅ Processed emotions:', emotions);
      console.log('✅ Processed summary report:', summaryReport);

      // Create reading object using the utility function
      const newReading = createReadingObject(searchResult, emotions, initialAnalysis.accumulated_text);

      return {
        emotions,
        summaryReport,
        reading: newReading,
        accumulatedText: initialAnalysis.accumulated_text
      };
    } else {
      console.log('❌ No enriched emotion stats found in rag_analysis');
      console.log('Available rag_analysis keys:', 
        searchResult.rag_analysis ? 
        Object.keys(searchResult.rag_analysis) : 
        'rag_analysis is null/undefined'
      );
      return null;
    }
  } catch (error) {
    console.error('❌ Error during emotion analysis:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response
    });
    throw error;
  }
}; 