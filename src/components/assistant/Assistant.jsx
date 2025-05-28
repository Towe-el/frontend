import React from 'react'
import { motion } from 'framer-motion'

function Assistant({ onOpenDialogue }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenDialogue}
        className="w-16 h-16 bg-gray-400 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-500 transition-colors"
      >
        <span className="text-white text-2xl">AI</span>
      </motion.button>
    </motion.div>
  )
}

export default Assistant