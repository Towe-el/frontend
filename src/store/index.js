import { configureStore } from '@reduxjs/toolkit';
import emotionReducer from './slices/emotionSlice';
import uiReducer from './slices/uiSlice';
import dialogueReducer from './slices/dialogueSlice';
import summaryReducer from './slices/summarySlice';

export const store = configureStore({
  reducer: {
    emotion: emotionReducer,
    ui: uiReducer,
    dialogue: dialogueReducer,
    summary: summaryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 