// SVG Animation Utilities

// Calculate the total length of SVG paths
const getPathLength = (path) => {
  return path.getTotalLength();
};

// Animate a single path with drawing effect
const animatePath = (path, duration = 1000, delay = 0) => {
  const length = getPathLength(path);
  
  // Set initial state
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.style.opacity = 1;
  
  // Animate
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

// Animate gratitude hearts
export const animateGratitudeHearts = (svgElement) => {
  if (!svgElement) return;
  
  // Get all heart paths
  const hearts = svgElement.querySelectorAll('#hearts path');
  
  // Animate each heart with a slight delay
  hearts.forEach((heart, index) => {
    // Reverse the order to animate from outer to inner hearts
    const reverseIndex = hearts.length - 1 - index;
    animatePath(heart, 800, reverseIndex * 200);
  });
};

// Reset animation
export const resetGratitudeHearts = (svgElement) => {
  if (!svgElement) return;
  
  const hearts = svgElement.querySelectorAll('#hearts path');
  hearts.forEach(heart => {
    heart.style.strokeDasharray = '';
    heart.style.strokeDashoffset = '';
    heart.style.opacity = '';
  });
}; 