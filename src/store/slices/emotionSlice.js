import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emotions: [],
  summaryReport: null,
  accumulatedText: '',
  title: '',
  highlightedCards: [],
  // Wheel specific states
  selectedEmotion: null,
  selectedCards: [],
  currentReadingIndex: 0,
  currentSummaryReport: null,
  cardClickMode: 'detail', // 'detail' | 'reading'
};

export const emotionSlice = createSlice({
  name: 'emotion',
  initialState,
  reducers: {
    setEmotions: (state, action) => {
      state.emotions = action.payload;
    },
    setSummaryReport: (state, action) => {
      state.summaryReport = action.payload;
    },
    setAccumulatedText: (state, action) => {
      state.accumulatedText = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setHighlightedCards: (state, action) => {
      state.highlightedCards = action.payload;
    },
    clearHighlightedCards: (state) => {
      state.highlightedCards = [];
    },
    // Wheel specific reducers
    setSelectedEmotion: (state, action) => {
      state.selectedEmotion = action.payload;
    },
    setSelectedCards: (state, action) => {
      state.selectedCards = action.payload;
    },
    setCurrentReadingIndex: (state, action) => {
      state.currentReadingIndex = action.payload;
    },
    setCurrentSummaryReport: (state, action) => {
      console.log('Setting currentSummaryReport in emotionSlice:', action.payload);
      state.currentSummaryReport = action.payload;
    },
    setCardClickMode: (state, action) => {
      state.cardClickMode = action.payload;
    },
    resetWheelState: (state) => {
      state.selectedEmotion = null;
      state.selectedCards = [];
      state.currentReadingIndex = 0;
      state.currentSummaryReport = null;
      state.highlightedCards = [];
      state.cardClickMode = 'detail';
    },
  },
});

export const {
  setEmotions,
  setSummaryReport,
  setAccumulatedText,
  setTitle,
  setHighlightedCards,
  clearHighlightedCards,
  setSelectedEmotion,
  setSelectedCards,
  setCurrentReadingIndex,
  setCurrentSummaryReport,
  setCardClickMode,
  resetWheelState,
} = emotionSlice.actions;

export default emotionSlice.reducer;