import React, { useEffect, useRef } from 'react';
import { animateEmotion, resetEmotionAnimation } from '../../animations/emotionAnimations';
import { GratitudeSvg, ApprovalSvg, DisapprovalSvg, CaringSvg, RealizationSvg, OptimismSvg, ReliefSvg, AdmirationSvg, EmbarrassmentSvg, ConfusionSvg, DisappointmentSvg, SadnessSvg, GriefSvg, RemorseSvg, NervousnessSvg, AnnoyanceSvg, DisgustSvg, FearSvg, AngerSvg, SurpriseSvg, DesireSvg, CuriositySvg, PrideSvg, AmusementSvg, JoySvg, ExcitementSvg, LoveSvg } from '../emotion-svgs';

const EmotionCard = ({ emotion, isModal = false }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (isModal && svgRef.current) {
      // Start animation when modal opens
      animateEmotion(svgRef.current, emotion.toLowerCase());
    }

    // Cleanup animation when component unmounts or modal closes
    return () => {
      if (svgRef.current) {
        resetEmotionAnimation(svgRef.current, emotion.toLowerCase());
      }
    };
  }, [isModal, emotion]);

  // Get the appropriate SVG based on emotion
  const getEmotionSvg = (emotion) => {
    const emotionMap = {
      'admiration': AdmirationSvg,
      'amusement': AmusementSvg,
      'anger': AngerSvg,
      'annoyance': AnnoyanceSvg,
      'approval': ApprovalSvg,
      'caring': CaringSvg,
      'confusion': ConfusionSvg,
      'curiosity': CuriositySvg,
      'desire': DesireSvg,
      'disapproval': DisapprovalSvg,
      'disappointment': DisappointmentSvg,
      'disgust': DisgustSvg,
      'embarrassment': EmbarrassmentSvg,
      'excitement': ExcitementSvg,
      'fear': FearSvg,
      'grief': GriefSvg,
      'gratitude': GratitudeSvg,
      'joy': JoySvg,
      'love': LoveSvg,
      'nervousness': NervousnessSvg,
      'optimism': OptimismSvg,
      'pride': PrideSvg,
      'realization': RealizationSvg,
      'relief': ReliefSvg,
      'remorse': RemorseSvg,
      'sadness': SadnessSvg,
      'surprise': SurpriseSvg
    };

    return emotionMap[emotion.toLowerCase()];
  };

  const EmotionComponent = getEmotionSvg(emotion);
  const isAnimatedEmotion = ['gratitude', 'approval', 'disapproval', 'caring', 'realization', 'optimism', 'relief', 'admiration', 'embarrassment', 'confusion', 'disappointment', 'sadness', 'grief', 'remorse', 'nervousness', 'annoyance', 'disgust', 'fear', 'anger', 'surprise', 'desire', 'curiosity', 'pride', 'amusement', 'joy', 'excitement', 'love'].includes(emotion.toLowerCase());

  return (
    <div 
      className={`
        flex items-center justify-center
        transition-all duration-300
        ${!isModal ? 'cursor-pointer hover:scale-105' : ''}
      `}
      style={{
        width: isModal ? '260px' : '100px',
        height: isModal ? '400px' : '150px',
      }}
    >
      {isAnimatedEmotion ? (
        <div ref={svgRef} className="w-full h-full">
          <EmotionComponent className="w-full h-full" />
        </div>
      ) : (
        <img 
          src={EmotionComponent} 
          alt={emotion}
          className="w-full h-full object-contain shadow-xl"
        />
      )}
    </div>
  );
};

export default EmotionCard;