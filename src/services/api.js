export const API_BASE_URL = 'https://toweel-backend-1080725638827.europe-west1.run.app';

export const analyzeEmotions = async (text, sessionId, options = {}) => {
  try {
    const payload = {
      text,
      session_id: sessionId,
      ...options,
    };


    const endpoint = options.execute_search ? '/search/execute' : '/search/';

    // Build headers object
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin
    };

    // Only add session-id header if we have one AND it's needed
    if (sessionId) {
      headers['session-id'] = sessionId;
    } else if (options.execute_search) {
      // Only throw error if sessionId is required for this specific endpoint
      throw new Error('Session ID is required for search execution but not provided');
    }

    

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Failed to analyze emotions: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // For the initial /search/ call, the backend might return a session_id
    // Check both response body and headers for session_id
    const responseSessionId = data.session_id || response.headers.get('session-id');
    if (options.execute_search) {
      // For search execute, return the raw data since structure might be different
      return {
        ...data,
        session_id: responseSessionId || sessionId
      };
    } else {
      // Original transformation for regular /search/ endpoint
      const transformedData = {
        emotions: data.results || [],
        needs_more_detail: data.emotion_analysis?.needs_more_detail || false,
        guidance_response: data.guidance_response || null,
        emotion_analysis: data.emotion_analysis || null,
        accumulated_text: data.accumulated_text || null,
        rag_analysis: data.rag_analysis || null,
        session_id: responseSessionId || sessionId // Include session_id in response
      };
      return transformedData;
    }
  } catch (error) {
    console.error('Error in analyzeEmotions:', error);
    throw error;
  }
};