import React, { useEffect, useRef } from 'react';
import { animateEmotion, resetEmotionAnimation } from '../../animations/emotionAnimations';
import { GratitudeSvg, ApprovalSvg, DisapprovalSvg, CaringSvg, RealizationSvg, OptimismSvg, ReliefSvg, AdmirationSvg, EmbarrassmentSvg } from '../emotion-svgs';
import AmusementSvg from '../../assets/amusement.svg';
import AngerSvg from '../../assets/anger.svg';
import AnnoyanceSvg from '../../assets/annoyance.svg';
import ConfusionSvg from '../../assets/confusion.svg';
import CuriositySvg from '../../assets/curiosity.svg';
import DesireSvg from '../../assets/desire.svg';
import DisappointmentSvg from '../../assets/disappointment.svg';
import DisgustSvg from '../../assets/disgust.svg';
import ExcitementSvg from '../../assets/excitement.svg';
import FearSvg from '../../assets/fear.svg';
import GriefSvg from '../../assets/grief.svg';
import JoySvg from '../../assets/joy.svg';
import LoveSvg from '../../assets/love.svg';
import NervousnessSvg from '../../assets/nervourseness.svg';
import PrideSvg from '../../assets/pride.svg';
import RemorseSvg from '../../assets/remorse.svg';
import SadnessSvg from '../../assets/sadness.svg';
import SurpriseSvg from '../../assets/surprise.svg';

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
  const isAnimatedEmotion = ['gratitude', 'approval', 'disapproval', 'caring', 'realization', 'optimism', 'relief', 'admiration', 'embarrassment'].includes(emotion.toLowerCase());

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