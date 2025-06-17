import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cards: [],
  accumulatedText: '',
  summaryReport: null,
  currentReading: null,
  isHistorical: false,
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setSummaryData: (state, action) => {
      const { cards, accumulatedText, summaryReport, isHistorical } = action.payload;
      state.cards = cards;
      state.accumulatedText = accumulatedText;
      state.summaryReport = summaryReport;
      state.isHistorical = !!isHistorical;
    },
    setCurrentReading: (state, action) => {
      state.currentReading = action.payload;
    },
    resetSummaryState: () => initialState,
  },
});

export const {
  setSummaryData,
  setCurrentReading,
  resetSummaryState,
} = summarySlice.actions;

export default summarySlice.reducer; 