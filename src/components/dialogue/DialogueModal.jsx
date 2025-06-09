'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useAnimate, AnimatePresence } from 'framer-motion'
import { analyzeEmotions } from '../../services/api'

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
  { sender: 'ai', text: "Hello, I'm Toweel." },
  { sender: 'ai', text: "I'm here to explore your emotions with you." },
  { sender: 'ai', text: "How are you feeling right now?" }
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

const DialogueModal = ({ isOpen, onClose, onEmotionsAnalyzed }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [initialDone, setInitialDone] = useState(false)
  const [pendingResponse, setPendingResponse] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [scope, animate] = useAnimate()
  const containerRef = useRef(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMessages([])
      setInput('')
      setInitialDone(false)
      setPendingResponse(false)
    }
  }, [isOpen])

  const scrollToBottom = async () => {
    const container = containerRef.current
    if (container) {
      await animate(container, {
        scrollTop: container.scrollHeight
      }, { duration: 0.6, ease: [0.17, 0.67, 0.83, 0.67] })
    }
  }

  // Handle AI response and emotion analysis
  useEffect(() => {
    if (pendingResponse) {
      const analyzeEmotionsFromText = async () => {
        try {
          // Get the last user message
          const lastUserMessage = messages.find(msg => msg.sender === 'user')?.text
          if (!lastUserMessage) return

          console.log('Sending message to API:', lastUserMessage)

          // Call the emotion analysis API
          const result = await analyzeEmotions(lastUserMessage)
          console.log('API Response:', result)
          
          // Add AI response with only the guidance message
          if (result.guidance_response) {
            setMessages(prev => [
              ...prev,
              { 
                sender: 'ai', 
                text: result.guidance_response
              }
            ])
          }

          // Pass the emotions to the parent component silently
          if (onEmotionsAnalyzed) {
            console.log('Passing emotions to parent:', result.emotions)
            onEmotionsAnalyzed(result.emotions)
          }

          setPendingResponse(false)
        } catch (error) {
          console.error('Error analyzing emotions:', error)
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response
          })
          setMessages(prev => [
            ...prev,
            { 
              sender: 'ai', 
              text: "I'm sorry, I had trouble analyzing your emotions. Could you try again?" 
            }
          ])
          setPendingResponse(false)
        }
      }

      analyzeEmotionsFromText()
    }
  }, [pendingResponse, messages, onEmotionsAnalyzed])

  // Scroll to bottom when messages change or when pending response changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100)
    }
  }, [messages, pendingResponse, isOpen])

  // Handle initial AI message sequence
  useEffect(() => {
    if (isOpen && messages.length === 0 && !initialDone) {
      initialAiMessages.forEach((msg, idx) => {
        setTimeout(() => {
          setMessages(prev => [...prev, msg])
          if (idx === initialAiMessages.length - 1) setInitialDone(true)
        }, 800 * idx)
      })
    }
  }, [isOpen, initialDone, messages.length])

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

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { sender: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setPendingResponse(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1000] backdrop-blur-md flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              duration: 0.5
            }}
            className="w-full h-full flex flex-col bg-white/40 shadow-lg backdrop-blur"
            ref={scope}
          >
            <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-semibold">Talk to Toweel</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-500 hover:text-black text-xl"
                onClick={onClose}
              >
                ×
              </motion.button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <motion.div
                ref={containerRef}
                className={`w-[60%] ${showHistory ? 'h-[60vh]' : 'h-auto'} overflow-y-auto mb-4 bg-white/50 p-4 rounded-lg space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
              >
                {showHistory ? (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} w-full`}
                    >
                      <span className="text-xs text-gray-500 mb-1">
                        {msg.sender === 'user' ? 'You' : 'Toweel'}
                      </span>
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`px-4 py-2 rounded-lg text-sm w-full ${
                          msg.sender === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {msg.sender === 'ai' ? formatMessageText(msg.text) : msg.text}
                      </motion.div>
                    </motion.div>
                  ))
                ) : (
                  messages.length > 0 && (
                    <>
                      {messages
                        .filter(msg => msg.sender === 'ai')
                        .slice(-2)
                        .map((msg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-start w-full mb-3"
                          >
                            <span className="text-xs text-gray-500 mb-1">Toweel</span>
                            <motion.div
                              initial={{ scale: 0.95 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none w-full"
                            >
                              {formatMessageText(msg.text)}
                            </motion.div>
                          </motion.div>
                        ))}
                    </>
                  )
                )}
                {pendingResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-start w-full"
                  >
                    <span className="text-xs text-gray-500 mb-1">Toweel</span>
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none w-full"
                    >
                      <LoadingDots />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              <div className="w-[60%] flex flex-col gap-2">
                <div className="relative">
                  <textarea
                    className="w-full bg-white/60 rounded-lg px-3 py-2 text-base min-h-[200px] resize-none border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none pr-12"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Type your message..."
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    className="absolute bottom-3 right-3 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!input.trim()}
                  >
                    <SendIcon />
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm text-gray-600 hover:text-gray-800 self-center"
                >
                  {showHistory ? 'Hide History' : 'Check History'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DialogueModal