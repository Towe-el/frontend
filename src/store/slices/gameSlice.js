import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emotions: [],
  selectedCards: [],
  summaryReport: null,
  accumulatedText: ''
};

const emotionSlice = createSlice({
  name: 'emotion',
  initialState,
  reducers: {
    setEmotions(state, action) {
      state.emotions = action.payload;
    },
    setSelectedCards(state, action) {
      state.selectedCards = action.payload;
    },
    setSummaryReport(state, action) {
      state.summaryReport = action.payload;
    },
    setAccumulatedText(state, action) {
      state.accumulatedText = action.payload;
    },
    resetEmotionState(state) {
      return initialState;
    }
  }
});

export const {
  setEmotions,
  setSelectedCards,
  setSummaryReport,
  setAccumulatedText,
  resetEmotionState
} = emotionSlice.actions;

export default emotionSlice.reducer;