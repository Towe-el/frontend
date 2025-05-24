/**
 * Path calculation utilities for circular motion path
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