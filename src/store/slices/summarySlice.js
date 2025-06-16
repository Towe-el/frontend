import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
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
    setSummaryOpen: (state, action) => {
      state.isOpen = action.payload;
    },
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
  setSummaryOpen,
  setSummaryData,
  setCurrentReading,
  resetSummaryState,
  // prepareSummaryData
} = summarySlice.actions;

export default summarySlice.reducer; 