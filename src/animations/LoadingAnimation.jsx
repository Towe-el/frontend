import { motion } from 'framer-motion';

export const LoadingAnimation = () => {
  return (
    <div className="relative w-6 h-6">
      {/* Main circle */}
      <motion.div
        className="absolute inset-0 border-2 border-white rounded-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
        }}
        animate={{
          boxShadow: [
            '0 0 10px rgba(255, 255, 255, 0.5)',
            '0 0 15px rgba(255, 255, 255, 0.7)',
            '0 0 10px rgba(255, 255, 255, 0.5)',
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}; 