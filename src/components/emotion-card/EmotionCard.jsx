import React from 'react';

const EmotionCard = ({ emotion, score, isModal = false }) => {
  // Dynamic background color based on score
  const getBackgroundColor = (score) => {
    if (score > 0.7) return 'bg-yellow-400'; // Gold
    if (score > 0.5) return 'bg-red-400'; // Tomato
    return 'bg-blue-300'; // Light Blue
  };

  // Dynamic opacity based on score
  const getOpacity = (score) => {
    return score > 0.2 ? 'opacity-100' : 'opacity-50';
  };

  return (
    <div 
      className={`
        ${getBackgroundColor(score)}
        ${getOpacity(score)}
        ${isModal ? 'w-40 h-60' : 'w-25 h-38'}
        flex flex-col items-center justify-center
        rounded-lg m-2.5 shadow-lg
        transition-all duration-300
        ${!isModal ? 'cursor-pointer hover:shadow-xl hover:scale-105' : ''}
      `}
      style={{
        width: isModal ? '160px' : '100px',
        height: isModal ? '240px' : '150px',
      }}
      onClick={isModal ? undefined : (e) => e.stopPropagation()}
    >
      <h3 className={`${isModal ? 'text-2xl mb-3' : 'text-xl mb-2'} font-semibold text-gray-800`}>
        {emotion}
      </h3>
      <p className={`${isModal ? 'text-xl' : 'text-lg'} font-bold text-gray-800 m-0`}>
        {(score * 100).toFixed(0)}%
      </p>
    </div>
  );
};

export default EmotionCard;