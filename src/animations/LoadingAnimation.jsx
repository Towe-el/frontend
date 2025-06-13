import { motion } from 'framer-motion';

export const LoadingAnimation = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div className="relative w-40 h-40">
        {/* Main circle */}
        <motion.div
          className="absolute inset-0 border-4 border-blue-500 rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Emotion particles */}
        {[...Array(8)].map((_, index) => {
          const angle = (index * 45) * (Math.PI / 180);
          const radius = 60;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={index}
              className="absolute w-4 h-4 bg-blue-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-8px',
                marginTop: '-8px',
                x,
                y,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          );
        })}

        {/* Center text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="text-white font-medium text-lg mb-2"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Analyzing Emotions
            </motion.div>
            <motion.div
              className="text-blue-300 text-sm"
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Please wait...
            </motion.div>
          </div>
        </motion.div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(59, 130, 246, 0.5)',
              '0 0 30px rgba(59, 130, 246, 0.7)',
              '0 0 20px rgba(59, 130, 246, 0.5)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}; 