import { configureStore } from '@reduxjs/toolkit';
import emotionReducer from './slices/emotionSlice';
import uiReducer from './slices/uiSlice';
import dialogueReducer from './slices/dialogueSlice';

export const store = configureStore({
  reducer: {
    emotion: emotionReducer,
    ui: uiReducer,
    dialogue: dialogueReducer,
  },
});

export default store; 