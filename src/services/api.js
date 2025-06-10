const API_BASE_URL = 'https://toweel-backend-1080725638827.europe-west1.run.app';

export const analyzeEmotions = async (text, options = {}) => {
  try {
    const payload = {
      text,
      ...options, // injects optional flags like execute_search
    };

    console.log('Making API request to:', `${API_BASE_URL}/search/`);
    console.log('Request payload:', payload);

    const response = await fetch(`${API_BASE_URL}/search/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(payload),
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Failed to analyze emotions: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);

    const transformedData = {
      emotions: data.results || [],
      needs_more_detail: data.emotion_analysis?.needs_more_detail || false,
      guidance_response: data.guidance_response || null,
      emotion_analysis: data.emotion_analysis || null
    };

    console.log('Transformed data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error in analyzeEmotions:', error);
    throw error;
  }
};