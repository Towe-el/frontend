import { useEffect } from 'react';
import EmotionCard from './EmotionCard';

const CardDetailModal = ({ isOpen, onClose, emotionData }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !emotionData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          backgroundColor: emotionData.bgColor || 'rgba(255, 255, 255, 0.5)',
          opacity: 0.9
        }}
      />
      
      {/* Modal Content */}
      <div 
        className="relative z-10 max-w-4xl w-full mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          position: 'relative', 
          zIndex: 1000
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-20 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close modal"
          style={{ position: 'absolute', zIndex: 1001 }}
        >
          <svg 
            className="w-5 h-5 text-gray-600" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-row items-center justify-center gap-30 p-8">
          {/* Emotion Card */}
          <div className="transform scale-150">
            <EmotionCard
              emotion={emotionData.emotion} 
              definition={emotionData.definition}
              isModal={true}
            />
          </div>
          
          {/* Emotion definition */}
          <div className="flex-1">
            <p 
              className="text-2xl font-bold leading-relaxed"
              style={{ color: emotionData.textColor || '#1F2937' }}
            >
              {emotionData.definition}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;