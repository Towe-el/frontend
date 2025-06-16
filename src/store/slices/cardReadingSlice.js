import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  showSummary: false,
  currentEmotionData: null,
  isLastCard: false,
};

export const cardReadingSlice = createSlice({
  name: 'cardReading',
  initialState,
  reducers: {
    openCardReading: (state, action) => {
      state.isOpen = true;
      state.currentEmotionData = action.payload;
    },
    closeCardReading: (state) => {
      state.isOpen = false;
      state.currentEmotionData = null;
    },
    setShowSummary: (state, action) => {
      state.showSummary = action.payload;
    },
    setIsLastCard: (state, action) => {
      state.isLastCard = action.payload;
    },
    resetCardReadingState: (state) => {
      return initialState;
    },
  },
});

export const {
  openCardReading,
  closeCardReading,
  setShowSummary,
  setIsLastCard,
  resetCardReadingState,
} = cardReadingSlice.actions;

export default cardReadingSlice.reducer; 