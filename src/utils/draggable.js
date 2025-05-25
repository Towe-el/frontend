/**
 * Path calculation utilities for circular motion path (Framer Motion version)
 */

/**
 * Finds the closest point on a path to given coordinates using binary search
 * @param {SVGPathElement} path - The SVG path element
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {number} - Length along the path of the closest point
 */
export const closestPointOnPath = (path, x, y) => {
  let closestDistance = Infinity;
  let closestLength = 0;
  const pathLength = path.getTotalLength();
  
  // Use binary search for more efficient and accurate point detection
  // First pass with coarse sampling
  const coarseSamples = 50;
  let coarseStep = pathLength / coarseSamples;
  
  for(let i = 0; i <= coarseSamples; i++) {
    const length = i * coarseStep;
    const point = path.getPointAtLength(length);
    const dx = x - point.x;
    const dy = y - point.y;
    const distance = dx * dx + dy * dy;
    
    if(distance < closestDistance) {
      closestDistance = distance;
      closestLength = length;
    }
  }
  
  // Second pass with finer sampling around the closest point found
  const range = coarseStep;
  const start = Math.max(0, closestLength - range/2);
  const end = Math.min(pathLength, closestLength + range/2);
  const fineSamples = 30;
  const fineStep = (end - start) / fineSamples;
  
  closestDistance = Infinity; // Reset for second pass
  
  for(let i = 0; i <= fineSamples; i++) {
    const length = start + i * fineStep;
    const point = path.getPointAtLength(length);
    const dx = x - point.x;
    const dy = y - point.y;
    const distance = dx * dx + dy * dy;
    
    if(distance < closestDistance) {
      closestDistance = distance;
      closestLength = length;
    }
  }
  
  return closestLength;
};

/**
 * Calculates the normalized rotation difference between two progress values on a circle
 * Handles crossing the 0/1 boundary (wrapping around the circle)
 * @param {number} newProgress - New progress value (0-1)
 * @param {number} lastProgress - Previous progress value (0-1)
 * @returns {number} - Normalized rotation difference (-0.5 to 0.5)
 */
export const calculateRotationDiff = (newProgress, lastProgress) => {
  let rotationDiff = newProgress - lastProgress;
  
  // Handle crossing the 0/1 boundary (wrapping around the circle)
  if (rotationDiff > 0.5) rotationDiff -= 1;
  if (rotationDiff < -0.5) rotationDiff += 1;
  
  return rotationDiff;
};

/**
 * Initialize card positions on the circular path
 * @param {SVGPathElement} path - The SVG path element
 * @param {Array} cards - Array of card elements
 * @param {number} wheelOffset - Current wheel rotation offset (0-1)
 */
export const initializeCardPositions = (path, cards, wheelOffset = 0) => {
  if (!path || !cards.length) return;
  
  const pathLength = path.getTotalLength();
  
  cards.forEach((card, index) => {
    if (!card) return;
    
    // Calculate position along path (evenly spaced)
    const progress = (index / cards.length + wheelOffset) % 1;
    const length = progress * pathLength;
    const point = path.getPointAtLength(length);
    
    // Set initial position
    card.style.left = `${point.x}px`;
    card.style.top = `${point.y}px`;
  });
};

/**
 * Update all card positions based on current wheel offset
 * @param {SVGPathElement} path - The SVG path element
 * @param {Array} cards - Array of card elements
 * @param {number} wheelOffset - Current wheel rotation offset (0-1)
 */
export const updateAllCardPositions = (path, cards, wheelOffset) => {
  if (!path || !cards.length) return;
  
  const pathLength = path.getTotalLength();
  
  cards.forEach((card, index) => {
    if (!card) return;
    
    // Calculate new position along path
    const progress = (index / cards.length + wheelOffset) % 1;
    const length = progress * pathLength;
    const point = path.getPointAtLength(length);
    
    // Update position
    card.style.left = `${point.x}px`;
    card.style.top = `${point.y}px`;
  });
};

/**
 * Get position data for a card at a specific index and wheel offset
 * @param {SVGPathElement} path - The SVG path element
 * @param {number} index - Card index
 * @param {number} totalCards - Total number of cards
 * @param {number} wheelOffset - Current wheel rotation offset (0-1)
 * @returns {Object} - Object with x, y coordinates and progress
 */
export const getCardPositionData = (path, index, totalCards, wheelOffset = 0) => {
  if (!path) return { x: 0, y: 0, progress: 0 };
  
  const progress = (index / totalCards + wheelOffset) % 1;
  const length = progress * path.getTotalLength();
  const point = path.getPointAtLength(length);
  
  return {
    x: point.x,
    y: point.y,
    progress
  };
};

/**
 * Create smooth rotation animation values for wheel offset
 * @param {number} currentOffset - Current wheel offset (0-1)
 * @param {number} rotations - Number of full rotations to add
 * @param {number} duration - Duration in seconds
 * @returns {Object} - Animation config for Framer Motion
 */
export const createWheelRotationAnimation = (currentOffset, rotations = 5, duration = 5) => {
  const targetOffset = (currentOffset + rotations) % 1;
  
  return {
    wheelOffset: targetOffset,
    transition: {
      duration,
      ease: "easeOut",
      type: "tween"
    }
  };
};