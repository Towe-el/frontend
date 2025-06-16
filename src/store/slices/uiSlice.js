import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showIntro: true,
  showDialogue: false,
  showReady: false,
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
    closeAllModals: (state) => {
      state.showIntro = false;
      state.showDialogue = false;
      state.showReady = false;
    },
  },
});

export const {
  setShowIntro,
  setShowDialogue,
  setShowReady,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;