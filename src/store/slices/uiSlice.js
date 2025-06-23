import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showIntro: true,
  showDialogue: false,
  showReady: false,
  showSummary: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowIntro: (state, action) => {
      state.showIntro = action.payload;
    },
    setShowDialogue: (state, action) => {
      state.showDialogue = action.payload;
    },
    setShowReady: (state, action) => {
      state.showReady = action.payload;
    },
    setShowSummary: (state, action) => {
      state.showSummary = action.payload;
    },
    closeAllModals: (state) => {
      state.showIntro = false;
      state.showDialogue = false;
      state.showReady = false;
      state.showSummary = false;
    },
  },
});

export const {
  setShowIntro,
  setShowDialogue,
  setShowReady,
  setShowSummary,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;