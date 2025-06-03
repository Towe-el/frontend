import { useTransform, motion } from 'framer-motion';
import EmotionCard from '../emotion-card/EmotionCard';

const WheelCard = ({ data, index, totalCards, wheelRotation, isHighlighted, onCardClick }) => {
  const anglePerCard = 360 / totalCards;
  const baseAngle = anglePerCard * index;
  const angle = useTransform(wheelRotation, r => r + baseAngle);
  const x = useTransform(angle, a => 400 + 300 * Math.cos((a - 90) * Math.PI / 180));
  const y = useTransform(angle, a => 400 + 300 * Math.sin((a - 90) * Math.PI / 180));
  const rotate = useTransform(angle, a => a);

  return (
    <motion.div
      className={`emotion-card absolute ${isHighlighted ? 'card-pulse' : ''}`}
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
        zIndex: isHighlighted ? 100 : 1,
      }}
      animate={{ scale: isHighlighted ? 1.2 : 0.9 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onClick={(e) => onCardClick(data, e, index)}
      whileHover={{ scale: isHighlighted ? 1.25 : 1.05 }}
      whileTap={{ scale: isHighlighted ? 1.15 : 0.95 }}
    >
      <EmotionCard emotion={data.emotion} score={data.score} />
    </motion.div>
  );
};

export default WheelCard; 