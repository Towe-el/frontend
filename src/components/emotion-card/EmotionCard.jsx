import React from 'react';
import AdmirationSvg from '../../assets/admiration.svg';
import AmusementSvg from '../../assets/amusement.svg';
import AngerSvg from '../../assets/anger.svg';
import AnnoyanceSvg from '../../assets/annoyance.svg';
import ApprovalSvg from '../../assets/approval.svg';
import CaringSvg from '../../assets/caring.svg';
import ConfusionSvg from '../../assets/confusion.svg';
import CuriositySvg from '../../assets/curiosity.svg';
import DesireSvg from '../../assets/desire.svg';
import DisapprovalSvg from '../../assets/disapproval.svg';
import DisappointmentSvg from '../../assets/disappointment.svg';
import DisgustSvg from '../../assets/disgust.svg';
import EmbarrassmentSvg from '../../assets/embarrassmeent.svg';
import ExcitementSvg from '../../assets/excitement.svg';
import FearSvg from '../../assets/fear.svg';
import GriefSvg from '../../assets/grief.svg';
import GratitudeSvg from '../../assets/gratitude.svg';
import JoySvg from '../../assets/joy.svg';
import LoveSvg from '../../assets/love.svg';
import NervousnessSvg from '../../assets/nervourseness.svg';
import OptimismSvg from '../../assets/optimism.svg';
import PrideSvg from '../../assets/pride.svg';
import RealizationSvg from '../../assets/realization.svg';
import ReliefSvg from '../../assets/relief.svg';
import RemorseSvg from '../../assets/remorse.svg';
import SadnessSvg from '../../assets/sadness.svg';
import SurpriseSvg from '../../assets/surprise.svg';

const EmotionCard = ({ emotion, isModal = false }) => {
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

    return emotionMap[emotion.toLowerCase()] || OptimismSvg; // Default fallback
  };

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
      <img 
        src={getEmotionSvg(emotion)} 
        alt={emotion}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default EmotionCard;