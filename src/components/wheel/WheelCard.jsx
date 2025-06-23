// eslint-disable-next-line no-unused-vars
import { useTransform, motion } from 'framer-motion';
import EmotionCard from '../emotion-card/EmotionCard';
import { useSelector } from 'react-redux';

const WheelCard = ({ data, index, totalCards, wheelRotation, isHighlighted, onCardClick }) => {
  const selectedCards = useSelector((state) => state.emotion.selectedCards);
  
  // Calculate if this card is selected based on Redux store
  const isSelected = selectedCards.some(card => 
    card.emotion.toLowerCase() === data.emotion.toLowerCase()
  );

  // Use both isHighlighted (from props) and isSelected (from Redux) for highlighting
  const shouldHighlight = isHighlighted || isSelected;

  const anglePerCard = 360 / totalCards;
  const baseAngle = anglePerCard * index;
  const angle = useTransform(wheelRotation, r => r + baseAngle);
  const x = useTransform(angle, a => 400 + 300 * Math.cos((a - 90) * Math.PI / 180));
  const y = useTransform(angle, a => 400 + 300 * Math.sin((a - 90) * Math.PI / 180));
  const rotate = useTransform(angle, a => a);

  return (
    <motion.div
      data-card-index={index}
      className={`emotion-card absolute ${shouldHighlight ? 'card-pulse' : ''}`}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        translateX: "-50%",
        translateY: "-50%",
        rotate,
        transformOrigin: "center center",
        fontSize: "1rem",
        pointerEvents: "auto",
        zIndex: shouldHighlight ? 100 : 1,
      }}
      animate={{ 
        scale: shouldHighlight ? 1.2 : 0.9,
        filter: shouldHighlight ? 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' : 'none'
      }}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut",
        scale: {
          duration: 0.5,
          ease: "easeOut"
        },
        filter: {
          duration: 0.3,
          ease: "easeInOut"
        }
      }}
      onClick={(e) => onCardClick(data, e, index)}
      whileHover={{ scale: shouldHighlight ? 1.25 : 1.05 }}
      whileTap={{ scale: shouldHighlight ? 1.15 : 0.95 }}
    >
      <EmotionCard emotion={data.emotion} definition={data.definition} />
    </motion.div>
  );
};

export default WheelCard; 