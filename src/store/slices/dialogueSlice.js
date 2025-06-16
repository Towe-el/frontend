import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  input: '',
  pendingResponse: false,
  showHistory: false,
  isRecording: false,
  hasPermission: null,
  initialAnalysis: null,
  hasProcessedMessage: false,
  needsMoreDetail: false,
  showReadyModal: false,
  sessionId: null,
};

export const dialogueSlice = createSlice({
  name: 'dialogue',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setInput: (state, action) => {
      state.input = action.payload;
    },
    setPendingResponse: (state, action) => {
      state.pendingResponse = action.payload;
    },
    setShowHistory: (state, action) => {
      state.showHistory = action.payload;
    },
    setIsRecording: (state, action) => {
      state.isRecording = action.payload;
    },
    setHasPermission: (state, action) => {
      state.hasPermission = action.payload;
    },
    setInitialAnalysis: (state, action) => {
      state.initialAnalysis = action.payload;
    },
    setHasProcessedMessage: (state, action) => {
      state.hasProcessedMessage = action.payload;
    },
    setNeedsMoreDetail: (state, action) => {
      state.needsMoreDetail = action.payload;
    },
    setShowReadyModal: (state, action) => {
      state.showReadyModal = action.payload;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
    resetDialogueState: (state) => {
      state.messages = [];
      state.input = '';
      state.pendingResponse = false;
      state.showHistory = false;
      state.isRecording = false;
      state.hasPermission = null;
      state.initialAnalysis = null;
      state.hasProcessedMessage = false;
      state.needsMoreDetail = false;
      state.showReadyModal = false;
      state.sessionId = null;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setInput,
  setPendingResponse,
  setShowHistory,
  setIsRecording,
  setHasPermission,
  setInitialAnalysis,
  setHasProcessedMessage,
  setNeedsMoreDetail,
  setShowReadyModal,
  setSessionId,
  resetDialogueState,
} = dialogueSlice.actions;

export default dialogueSlice.reducer; 