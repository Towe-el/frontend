'use client'

import mockMessages from '../../type/mockMessages.json'
import { useState, useRef, useEffect } from 'react'
import { motion, useAnimate } from 'framer-motion'

const DialogueModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [mockIndex, setMockIndex] = useState(0)
  const [scope, animate] = useAnimate()
  const containerRef = useRef(null)

  const scrollToBottom = async () => {
    const container = containerRef.current
    if (container) {
      await animate(container, { scrollTop: container.scrollHeight }, {
        duration: 0.6,
        ease: [0.17, 0.67, 0.83, 0.67]
      })
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { sender: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    await scrollToBottom()

    // Simulate AI typing
    setTimeout(() => {
      if (mockIndex < mockMessages.length) {
        const aiMessage = mockMessages[mockIndex]
        setMessages(prev => [...prev, { sender: 'ai', text: aiMessage.text }])
        setMockIndex(prev => prev + 1)
      } else {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: "I'm out of mock responses — try refreshing or changing the topic!"
        }])
      }
    }, 800)
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen])

  if (!isOpen) return <></>

  return (
    <div className="fixed inset-x-0 top-[32px] bottom-0 z-[999] backdrop-blur-md flex items-center justify-center">
      <div className="rounded-xl p-6 w-[90%] max-w-2xl flex flex-col bg-white/40 shadow-lg backdrop-blur" ref={scope}>
        <button className="self-end text-gray-500 hover:text-black mb-2 text-xl" onClick={onClose}>×</button>
        <h2 className="text-lg font-semibold mb-4">Talk to Toweel</h2>

        <motion.div
          ref={containerRef}
          className="flex-1 overflow-y-auto max-h-[300px] mb-4 bg-white/50 p-2 rounded space-y-3"
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
              <div className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow bg-white/60 rounded px-3 py-2 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
                }
            }}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default DialogueModal