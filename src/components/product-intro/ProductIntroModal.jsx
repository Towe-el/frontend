import { motion } from 'framer-motion'
import BannerImage from '../../assets/BannerImage.png'

const ProductIntroModal = ({ onGetStarted }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b white">
      <div className="w-full max-w-[90rem] px-2 flex flex-row items-center justify-between m-10">
        {/* Left side - Text content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/2 text-left"
        >
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold mb-8 text-gray-800 leading-tight"
          >
            Emotions guide you.
            Toweel help you listen.
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl"
          >
            Sometimes, it's hard to put your feelings into words. Talk to Towheel, name, and understand what you're feeling.
          </motion.p>

          <div className="flex flex-row">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="w-50% px-8 py-4 bg-green-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-lg"
            >
              Talk to Toweel
            </motion.button>
          </div>
        </motion.div>

        {/* Right side - Banner Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-2/3 flex justify-center"
        >
          <img 
            src={BannerImage} 
            alt="Emotion Wheel Banner" 
            className="w-full h-auto object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 text-gray-500 animate-bounce"
        >
          Scroll Down To Explore↓
        </motion.div>
      </div>
    </div>
  )
}

export default ProductIntroModal 