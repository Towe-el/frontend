// Emotion Animation Utilities

// Base animation functions
const getPathLength = (path) => {
  if (!path || typeof path.getTotalLength !== 'function') return 0;
  return path.getTotalLength();
};

const animatePath = (path, duration = 1000, delay = 0) => {
  if (!path || typeof path.getTotalLength !== 'function') return;
  
  const length = getPathLength(path);
  
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.style.opacity = 1;
  
  path.animate([
    { strokeDashoffset: length },
    { strokeDashoffset: 0 }
  ], {
    duration: duration,
    delay: delay,
    easing: 'ease-in-out',
    fill: 'forwards'
  });
};

// Animation configurations for each emotion
const animationConfigs = {
  gratitude: {
    selector: '#hearts path',
    duration: 800,
    delay: 200,
    reverse: true, // animate from outer to inner
  },
  disapproval: {
    selector: '#x line',
    duration: 600,
    delay: 100,
    reverse: false
  },
  approval: {
    selector: '#checkmark path',
    duration: 600,
    delay: 100,
    reverse: false, // animate from bottom to top
  },
  caring: {
    selector: '#lotus path',
    duration: 800,
    delay: 150,
    reverse: false
  },
  realization: {
    selector: '#vector path',
    duration: 600,
    delay: 50,
    reverse: false // animate from center outward
  },
  optimism: {
    selector: '#shines path',
    duration: 600,
    delay: 100,
    reverse: false // animate rays one by one
  },
  relief: {
    selector: '#cloud',
    duration: 3000,
    delay: 0,
    reverse: false, // gentle floating animation
    transform: true // indicate this is a transform animation
  },
  admiration: {
    selector: '#star',
    duration: 2000,
    delay: 0,
    reverse: false,
    animation: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, 0],
      opacity: [1, 0.8, 1]
    }
  },
  embarrassment: {
    selector: '#spiral',
    duration: 3000,
    delay: 0,
    reverse: false,
    transform: true,
    animation: {
      rotate: [0, 360],
      scale: [1, 1.05, 1]
    }
  },
  confusion: {
    selector: '#confusion_question_mark',
    duration: 2000,
    delay: 0,
    reverse: false,
    transform: true,
    animation: {
      rotate: [-15, 15, -15],
      scale: [1, 1.1, 1]
    }
  },
  // Add configurations for other emotions here
  // Example:
  // joy: {
  //   selector: '#sparkles path',
  //   duration: 600,
  //   delay: 100,
  //   reverse: false,
  // },
};

// Generic animation function that works for all emotions
export const animateEmotion = (svgElement, emotion) => {
  if (!svgElement || !animationConfigs[emotion]) return;
  
  const config = animationConfigs[emotion];
  const elements = svgElement.querySelectorAll(config.selector);
  
  elements.forEach((element, index) => {
    if (config.transform) {
      // For transform animations (like floating or rotating)
      const keyframes = [];
      if (config.animation) {
        // Handle complex animations with multiple properties
        const frames = [];
        for (let i = 0; i < config.animation.rotate.length; i++) {
          const frame = {};
          if (config.animation.rotate) {
            frame.transform = `rotate(${config.animation.rotate[i]}deg)`;
          }
          if (config.animation.scale) {
            frame.transform = `${frame.transform || ''} scale(${config.animation.scale[i]})`;
          }
          if (config.animation.opacity) {
            frame.opacity = config.animation.opacity[i];
          }
          frames.push(frame);
        }
        keyframes.push(...frames);
      } else {
        // Simple floating animation
        keyframes.push(
          { transform: 'translateY(0)' },
          { transform: 'translateY(-10px)' },
          { transform: 'translateY(0)' }
        );
      }

      element.animate(keyframes, {
        duration: config.duration,
        delay: index * config.delay,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    } else {
      // For path animations
      const actualIndex = config.reverse ? elements.length - 1 - index : index;
      animatePath(element, config.duration, actualIndex * config.delay);
    }
  });
};

// Reset animation for any emotion
export const resetEmotionAnimation = (svgElement, emotion) => {
  if (!svgElement || !animationConfigs[emotion]) return;
  
  const elements = svgElement.querySelectorAll(animationConfigs[emotion].selector);
  elements.forEach(element => {
    element.style.strokeDasharray = '';
    element.style.strokeDashoffset = '';
    element.style.opacity = '';
    element.style.transform = '';
  });
};

// Individual emotion animation functions (for backward compatibility)
export const animateGratitudeHearts = (svgElement) => {
  animateEmotion(svgElement, 'gratitude');
};

export const resetGratitudeHearts = (svgElement) => {
  resetEmotionAnimation(svgElement, 'gratitude');
}; 