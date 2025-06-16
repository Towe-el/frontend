'use client'

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, useAnimate, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { analyzeEmotions } from '../../services/api'
import { API_BASE_URL } from '../../services/api'
import { checkMicrophonePermission, startRecording } from '../../utils/speechToText'
import { LoadingAnimation } from '../../animations/LoadingAnimation'
import ReadyModal from './ReadyModal'
import LogoImage2 from '../../assets/LogoImage2.png'
import { structureSummaryReport, createReadingObject } from '../../utils/summaryReportUtils'
import { analyzeEmotionData } from '../../services/emotionAnalysis'
import {
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
} from '../../store/slices/dialogueSlice'

const LoadingDots = () => {
  return (
    <div className="flex gap-1 items-center">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

const initialAiMessages = [
  { sender: 'ai', text: "Hello, I'm Toweel. I'm here to explore your emotions with you. How are you feeling right now?" }
]

const SendIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-5 h-5"
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
)

const MicrophoneIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-5 h-5"
  >
    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
  </svg>
)

const DownloadIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-5 h-5"
  >
    <path d="M12 15.713L18.01 9.7c.439-.439 1.151-.439 1.59 0s.439 1.151 0 1.59l-6.705 6.705c-.439.439-1.151.439-1.59 0L4.4 11.29c-.439-.439-.439-1.151 0-1.59s1.151-.439 1.59 0L12 15.713z" />
  </svg>
)

const DialogueModal = forwardRef(({ isOpen, onClose, onEmotionsAnalyzed }, ref) => {
  const dispatch = useDispatch();
  const mediaRecorderRef = useRef(null);
  const [scope, animate] = useAnimate();
  const containerRef = useRef(null);
  const processingRef = useRef(false);

  // Select state from Redux store
  const {
    messages,
    input,
    pendingResponse,
    showHistory,
    isRecording,
    hasPermission,
    initialAnalysis,
    // eslint-disable-next-line no-unused-vars
    needsMoreDetail,
    // eslint-disable-next-line no-unused-vars
    showReadyModal,
    sessionId,
  } = useSelector((state) => state.dialogue);

  // Reset processing state when modal opens
  useEffect(() => {
    if (isOpen) {
      processingRef.current = false;
      dispatch(resetDialogueState());

      // Fetch session_id from new API
      fetch(`${API_BASE_URL}/search/session`)
        .then(res => res.json())
        .then(data => {
          if(data.session_id){
            console.log('📦 New session ID:', data.session_id);
            dispatch(setSessionId(data.session_id));
          }
        })
        .catch(err => {
          console.error('❌ Failed to get session ID', err);
        });
    }
  }, [isOpen, dispatch]);

  // Check microphone permission on mount
  useEffect(() => {
    if (isOpen) {
      checkMicrophonePermission().then(permission => {
        dispatch(setHasPermission(permission));
      });
    }
  }, [isOpen, dispatch]);

  // Handle AI response and emotion analysis
  useEffect(() => {
    if (!pendingResponse || !sessionId || processingRef.current) return;

    const analyzeEmotionsFromText = async () => {
      try {
        processingRef.current = true;
        const lastUserMessage = messages.filter(msg => msg.sender === 'user').pop()?.text;
        if (!lastUserMessage) return;

        const result = await analyzeEmotions(lastUserMessage, sessionId);
        const ready = result.ready_for_search === true;
        const isGuidanceReady = result.guidance_response?.toLowerCase().includes("ready for analysis");
        const hasText = !!result.accumulated_text;

        console.log('API Response:', result);
        dispatch(setInitialAnalysis(result));

        const moreDetail = result.needs_more_detail === true;
        dispatch(setNeedsMoreDetail(moreDetail));

        if (result.guidance_response) {
          dispatch(addMessage({ sender: 'ai', text: result.guidance_response }));
        }

        if (!moreDetail && (ready || isGuidanceReady) && sessionId && hasText) {
          console.log('✅ ✅ Ready for search (fallback via guidance), showing ReadyModal');
          setTimeout(() => dispatch(setShowReadyModal(true)), 300);
        } else {
          console.log('⚠️ Not ready for search:', {
            needsMoreDetail: moreDetail,
            readyForSearch: ready,
            hasSessionId: !!sessionId
          });
        }

      } catch (error) {
        console.error('❌ Error analyzing emotions:', error);

        const fallbackMessage = error.message.includes('Network')
          ? "I'm having trouble connecting to the network. Please check your connection and try again."
          : "I'm sorry, I had trouble analyzing your emotions. Could you try again?";

        dispatch(addMessage({ sender: 'ai', text: fallbackMessage }));
      } finally {
        dispatch(setPendingResponse(false));
        dispatch(setHasProcessedMessage(true));
        processingRef.current = false;
      }
    };

    analyzeEmotionsFromText();
  }, [pendingResponse, sessionId, messages, dispatch]);

  const handleSearch = async () => {
    if (!sessionId || !initialAnalysis) {
      console.warn('❌ Cannot run search: missing sessionId or analysis');
      return;
    }

    try {
      console.log('🔍 Starting search with session id:', sessionId);
      console.log('🔍 Initial analysis:', initialAnalysis);
      
      const searchResult = await analyzeEmotions(messages[messages.length - 1].text, 
        sessionId,
        {
          execute_search: true,
          accumulated_text: initialAnalysis.accumulated_text
        });

      console.log('✅ Search result received:', searchResult);

      if (searchResult.rag_analysis?.enriched_emotion_stats) {
        // Transform the enriched_emotion_stats array into the expected format
        const emotions = searchResult.rag_analysis.enriched_emotion_stats.map(item => ({
          emotion: item.label || item.emotion,
          percentage: item.percentage || 0,
          count: item.count || 0,
          analysis: item.analysis || '',
          quote: item.quote || ''
        }));

        // Create summary report using the utility function
        const summaryReport = structureSummaryReport(searchResult.rag_analysis, emotions);

        console.log('✅ Processed emotions:', emotions);
        console.log('✅ Processed summary report:', summaryReport);

        if (onEmotionsAnalyzed) {
          // Close ReadyModal first
          dispatch(setShowReadyModal(false));
          
          // Then call onEmotionsAnalyzed
          await onEmotionsAnalyzed(emotions, summaryReport, initialAnalysis.accumulated_text);
          console.log('✅ onEmotionsAnalyzed called successfully');

          // Create reading object using the utility function
          const newReading = createReadingObject(searchResult, emotions, initialAnalysis.accumulated_text);

          // Save to localStorage
          const prev = JSON.parse(localStorage.getItem('emotionReadings') || '[]');
          localStorage.setItem('emotionReadings', JSON.stringify([...prev, newReading]));

          console.log('💾 Saved session to localStorage');

          // Close DialogueModal
          onClose();
        } else {
          console.warn('❌ onEmotionsAnalyzed callback not defined');
        }
      } else {
        console.log('❌ No enriched emotion stats found in rag_analysis');
        console.log('Available rag_analysis keys:', 
          searchResult.rag_analysis ? 
          Object.keys(searchResult.rag_analysis) : 
          'rag_analysis is null/undefined'
        );
      }
    } catch (error) {
      console.error('❌ Error during search execution:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      dispatch(addMessage({ 
        sender: 'ai', 
        text: "I'm sorry, I had trouble searching for similar experiences. Could you try again?" 
      }));
    } finally {
      dispatch(setPendingResponse(false));
      dispatch(setInitialAnalysis(null));
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || pendingResponse || processingRef.current) return;
  
    dispatch(setPendingResponse(true));
    dispatch(setHasProcessedMessage(false));
    dispatch(setNeedsMoreDetail(false));
    
    dispatch(addMessage({ sender: 'user', text: input }));
    dispatch(setInput(''));
  };

  const handleStartRecording = async () => {
    try {
      const recorder = await startRecording(
        // onInterimResult callback
        (transcript) => {
          dispatch(setInput(transcript));
        },
        // onFinalResult callback
        (transcript) => {
          dispatch(setInput(transcript));
        }
      );
      mediaRecorderRef.current = recorder;
      dispatch(setIsRecording(true));
    } catch (error) {
      console.error('Error starting recording:', error);
      dispatch(addMessage({ 
        sender: 'ai', 
        text: "I'm sorry, I couldn't access your microphone. Please check your permissions and try again." 
      }));
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      dispatch(setIsRecording(false));
      // Send the final transcript if there's any input
      if (input.trim()) {
        dispatch(addMessage({ sender: 'user', text: input }));
        dispatch(setPendingResponse(true));
        dispatch(setInput('')); // Clear the input box immediately after sending
      }
    }
  };

  const scrollToBottom = async () => {
    const container = containerRef.current;
    if (container) {
      await animate(container, {
        scrollTop: container.scrollHeight
      }, { duration: 0.6, ease: [0.17, 0.67, 0.83, 0.67] });
    }
  };

  // Scroll to bottom when messages change or when pending response changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, pendingResponse, isOpen]);

  // Handle initial AI message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      dispatch(setMessages([...initialAiMessages]));
    }
  }, [isOpen, messages.length, dispatch]);

  // Function to format message text with bold and line breaks
  const formatMessageText = (text) => {
    if (!text) return '';
    
    // Split text into lines
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Check if line should be bold (starts and ends with *)
      if (line.trim().startsWith('*') && line.trim().endsWith('*')) {
        const boldText = line.trim().slice(1, -1);
        return (
          <div key={index} className="font-bold">
            {boldText}
          </div>
        );
      }
      return <div key={index}>{line}</div>;
    });
  };

  const handleClose = () => {
    console.log('DialogueModal: Close button clicked');
    dispatch(resetDialogueState());
    onClose();
  };

  const handleEmotionAnalysis = async () => {
    try {
      if (!sessionId || !initialAnalysis) {
        console.warn('❌ Cannot run emotion analysis: missing sessionId or analysis');
        return;
      }

      const lastMessage = messages[messages.length - 1]?.text;
      if (!lastMessage) {
        console.warn('❌ No message found for emotion analysis');
        return;
      }

      console.log('🔍 Starting emotion analysis with:', {
        sessionId,
        lastMessage,
        initialAnalysis
      });

      const result = await analyzeEmotionData(lastMessage, sessionId, initialAnalysis);

      if (!result) {
        console.warn('❌ No result returned from emotion analysis');
        return;
      }

      if (result && onEmotionsAnalyzed) {
        // Close ReadyModal first
        dispatch(setShowReadyModal(false));
        
        // Then call onEmotionsAnalyzed
        await onEmotionsAnalyzed(result.emotions, result.summaryReport, result.accumulatedText);
        console.log('✅ onEmotionsAnalyzed called successfully');

        // Save to localStorage
        const prev = JSON.parse(localStorage.getItem('emotionReadings') || '[]');
        localStorage.setItem('emotionReadings', JSON.stringify([...prev, result.reading]));

        console.log('💾 Saved session to localStorage');

        // Close DialogueModal
        onClose();
      }
    } catch (error) {
      console.error('❌ Error during emotion analysis:', error);
      dispatch(addMessage({ 
        sender: 'ai', 
        text: "I'm sorry, I had trouble analyzing your emotions. Could you try again?" 
      }));
    } finally {
      dispatch(setPendingResponse(false));
      dispatch(setInitialAnalysis(null));
    }
  };

  // Expose both functions through ref
  useImperativeHandle(ref, () => ({
    handleSearch,
    handleEmotionAnalysis
  }));

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] backdrop-blur-md flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full h-full flex flex-col bg-white/40 shadow-lg backdrop-blur"
              ref={scope}
            >
              <div className="flex justify-between items-center p-4">
                <button
                  className="text-gray-500 hover:text-black text-5xl m-8"
                  onClick={handleClose}
                >
                  ×
                </button>
              </div>

              <div className="flex-1 flex w-full flex-col items-center justify-center px-4 -mt-[120px]">
                <div className="w-[80%] flex gap-4">
                  {/* Previous Answers Section */}
                  <div className="w-1/4 bg-white/50 p-4 rounded-lg h-[60vh] overflow-y-auto">
                    <h3 className="text-sm font-semibold mb-3 text-gray-700">Your shared</h3>
                    <div className="space-y-2">
                      {messages
                        .filter(msg => msg.sender === 'user')
                        .map((msg, idx) => (
                          <div
                            key={idx}
                            className="text-sm text-gray-600 bg-gray-100 p-2 rounded w-full"
                          >
                            {msg.text}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Main Dialogue Section */}
                  <div className='w-full'>
                    <div
                      ref={containerRef}
                      className={`${showHistory ? 'h-[60vh]' : 'h-auto'} overflow-y-auto mb-4 bg-white/50 p-4 rounded-lg space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
                    >
                      {showHistory ? (
                        messages
                          .filter(msg => msg.sender === 'ai')
                          .map((msg, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col items-start w-full"
                            >
                              <span className="text-xs text-gray-500 mb-1">
                                Toweel
                              </span>
                              <div
                                className="px-4 py-2 text-base text-gray-800 w-full"
                              >
                                {formatMessageText(msg.text)}
                              </div>
                            </div>
                          ))
                      ) : (
                        messages.length > 0 && (
                          <>
                            {messages
                              .filter(msg => msg.sender === 'ai')
                              .slice(-1)
                              .map((msg, idx) => (
                                <div
                                  key={idx}
                                  className="flex flex-col items-start w-full mb-6"
                                >
                                  {idx === 0 && (
                                    <img
                                      src={LogoImage2}
                                      alt="Toweel Logo"
                                      className="w-126 h-44 mb-4 pl-35"
                                    />
                                  )}
                                  <div
                                    className="px-4 py-2 text-xl font-semibold text-gray-800 w-full"
                                  >
                                    {formatMessageText(msg.text)}
                                  </div>
                                </div>
                              ))}
                          </>
                        )
                      )}
                      {pendingResponse && (
                        <div
                          className="flex flex-col items-start w-full"
                        >
                          <div
                            className="px-4 py-2 text-base text-gray-800 w-[80%]"
                          >
                            <LoadingDots />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-[80%] flex flex-col gap-2 mt-4">
                      <div className="relative">
                        <textarea
                          className="w-full bg-white/60 rounded-lg px-3 py-2 text-base min-h-[200px] resize-none border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none pr-24"
                          value={input}
                          onChange={(e) => dispatch(setInput(e.target.value))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          placeholder={isRecording ? "Listening..." : "Type your message..."}
                          disabled={pendingResponse}
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                          {hasPermission && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={isRecording ? handleStopRecording : handleStartRecording}
                              className={`p-2 rounded-full ${
                                isRecording 
                                  ? 'bg-red-500 hover:bg-red-600' 
                                  : 'bg-blue-500 hover:bg-blue-600'
                              } text-white`}
                              disabled={pendingResponse}
                            >
                              <MicrophoneIcon />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={sendMessage}
                            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!input.trim() || pendingResponse}
                          >
                            <SendIcon />
                          </motion.button>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => dispatch(setShowHistory(!showHistory))}
                        className="text-sm text-gray-600 hover:text-gray-800 self-center"
                      >
                        {showHistory ? 'Hide History' : 'Check History'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ReadyModal onSearch={handleEmotionAnalysis} onClose={onClose} />
    </>
  );
});

export default DialogueModal;