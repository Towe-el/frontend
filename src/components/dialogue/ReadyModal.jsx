import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react';
import { LoadingAnimation } from '../../animations/LoadingAnimation';

const ReadyModal = ({ isOpen, onClose, onSearch }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1001] bg-white flex items-center justify-center"
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
            className="w-[500px] bg-white/90 rounded-2xl shadow-xl p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Thank You for Sharing.
            </h2>
            <p className="text-gray-600 mb-8">
              Sharing what you have what you feel is a powerful first step toward understanding your emotions. Toweel will now spin the emotional wheel and draw three cards for you, along with deeper insights and a detailed summary report.
            </p>
            <p>
              Would you like Toweel to spin the wheel for you?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async()=>{
                setIsLoading(true);
                await onSearch();
                setIsLoading(false);
                onClose();
              }}
              disabled={isLoading}          // disable while loading
              className="w-full py-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Spin the Wheel
            </motion.button>
            {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingAnimation /> Spinning...
            </div>
            ) : (
              "Spin the Wheel"
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ReadyModal