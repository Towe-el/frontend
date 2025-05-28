'use client'

import mockMessages from '../../type/mockMessages.json'
import { useState, useRef, useEffect } from 'react'
import { motion, useAnimate, AnimatePresence } from 'framer-motion'

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

const DialogueModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [mockIndex, setMockIndex] = useState(0)
  const [initialDone, setInitialDone] = useState(false)
  const [pendingResponse, setPendingResponse] = useState(false)
  const [scope, animate] = useAnimate()
  const containerRef = useRef(null)

  // Reset mockIndex when modal opens
  useEffect(() => {
    console.log('Modal open effect running, isOpen:', isOpen)
    if (isOpen) {
      setMockIndex(0)
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

  // Handle AI response
  useEffect(() => {
    if (pendingResponse) {
      console.log('Setting up AI response timeout')
      const timeoutId = setTimeout(() => {
        console.log('Timeout callback executed')
        console.log('Current mockIndex:', mockIndex)
        console.log('Available mock messages:', mockMessages)
        
        if (!mockMessages || !Array.isArray(mockMessages)) {
          console.error('mockMessages is not an array:', mockMessages)
          setPendingResponse(false)
          return
        }

        const aiMessage = mockMessages[mockIndex] || {
          sender: 'ai',
          text: "I'm out of mock responses — try refreshing or changing the topic!"
        }
        console.log('Selected AI message:', aiMessage)
        
        setMessages(prev => {
          console.log('Updating messages with AI response')
          return [...prev, aiMessage]
        })
        setMockIndex(prev => prev + 1)
        setPendingResponse(false)
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [pendingResponse, mockIndex])

  // Scroll to bottom when messages change or when pending response changes
  useEffect(() => {
    if (isOpen) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(scrollToBottom, 100)
    }
  }, [messages, pendingResponse, isOpen])

  // Handle initial AI message sequence
  useEffect(() => {
    console.log('Initial message effect running')
    if (isOpen && messages.length === 0 && !initialDone) {
      console.log('Starting initial messages sequence')
      initialAiMessages.forEach((msg, idx) => {
        setTimeout(() => {
          console.log('Adding initial message:', msg)
          setMessages(prev => [...prev, msg])
          if (idx === initialAiMessages.length - 1) setInitialDone(true)
        }, 800 * idx)
      })
    }
  }, [isOpen, initialDone, messages.length])

  const sendMessage = async () => {
    console.log('sendMessage function called')
    if (!input.trim()) return

    console.log('Adding user message:', input)
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
          className="fixed inset-x-0 top-[32px] bottom-0 z-[1000] backdrop-blur-md flex items-center justify-center"
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
            className="rounded-xl p-6 w-[90%] max-w-2xl h-[80vh] flex flex-col bg-white/40 shadow-lg backdrop-blur"
            ref={scope}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="self-end text-gray-500 hover:text-black mb-2 text-xl"
              onClick={onClose}
            >
              ×
            </motion.button>
            <h2 className="text-lg font-semibold mb-4">Talk to Toweel</h2>

            <motion.div
              ref={containerRef}
              className="flex-1 overflow-y-auto mb-4 bg-white/50 p-4 rounded-lg space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-xs text-gray-500 mb-1">
                    {msg.sender === 'user' ? 'You' : 'Toweel'}
                  </span>
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                </motion.div>
              ))}
              {pendingResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-start"
                >
                  <span className="text-xs text-gray-500 mb-1">Toweel</span>
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none"
                  >
                    <LoadingDots />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            <div className="flex gap-2 mt-auto">
              <input
                type="text"
                className="flex-grow bg-white/60 rounded px-3 py-2 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
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
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DialogueModal