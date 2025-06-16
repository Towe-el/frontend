import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  cards: [],
  accumulatedText: '',
  summaryReport: null,
  currentReading: null,
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setSummaryOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setSummaryData: (state, action) => {
      const { cards, accumulatedText, summaryReport } = action.payload;
      state.cards = cards;
      state.accumulatedText = accumulatedText;
      state.summaryReport = summaryReport;
    },
    setCurrentReading: (state, action) => {
      state.currentReading = action.payload;
    },
    resetSummaryState: () => initialState,
  },
});

// const prepareSummaryData = (cards, emotions, accumulatedText) => {
//   return {
//     payload: {
//       cards,
//       accumulatedText,
//       summaryReport: generateSummaryReport(emotions, accumulatedText)
//     }
//   };
// }

export const {
  setSummaryOpen,
  setSummaryData,
  setCurrentReading,
  resetSummaryState,
  // prepareSummaryData
} = summarySlice.actions;

export default summarySlice.reducer; 