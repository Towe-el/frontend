import gsap from "gsap";
import { MotionPathPlugin, Draggable } from 'gsap/all';

/**
 * GSAP animation utilities for the circular reel component
 */

/**
 * Registers GSAP plugins - should be called once
 */
export const registerGSAPPlugins = () => {
  gsap.registerPlugin(MotionPathPlugin, Draggable);
};

/**
 * Sets initial positions of cards around the circle
 * @param {SVGPathElement} path - The SVG path element
 * @param {HTMLElement[]} cards - Array of card elements
 * @param {number} wheelOffset - Current wheel rotation offset (0-1)
 */
export const initializeCardPositions = (path, cards, wheelOffset = 0) => {
  if (!path || !cards.length) return;
  
  // Show the path
  gsap.set(path, { stroke: "rgba(0, 0, 255, 0.3)", strokeWidth: 2 });

  // Set initial positions of cards evenly along the circle
  cards.forEach((card, index) => {
    // Calculate positions around the circle - even spacing
    const progress = (index / cards.length + wheelOffset) % 1;
    // Place cards at positions along the path with correct orientation
    gsap.set(card, {
      motionPath: {
        path: path,
        align: path,
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
        start: progress,
        end: progress
      }
    });
  });
};

/**
 * Updates all card positions based on wheel offset
 * @param {SVGPathElement} path - The SVG path element
 * @param {HTMLElement[]} cards - Array of card elements
 * @param {number} wheelOffset - Current wheel rotation offset (0-1)
 */
export const updateAllCardPositions = (path, cards, wheelOffset) => {
  if (!path || !cards.length) return;
  
  cards.forEach((card, index) => {
    // Calculate new position with offset while maintaining original spacing
    const progress = (index / cards.length + wheelOffset) % 1;
    
    // Update card position
    gsap.set(card, {
      motionPath: {
        path: path,
        align: path,
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
        start: progress,
        end: progress
      }
    });
  });
};

/**
 * Creates a GSAP timeline for continuous rotation animation
 * @param {Object} wheelOffsetRef - Ref object containing the current wheel offset
 * @param {Function} updateCallback - Callback function to update card positions
 * @param {number} duration - Animation duration in seconds (default: 40)
 * @returns {gsap.Timeline} - GSAP timeline instance
 */
export const createRotationAnimation = (wheelOffsetRef, updateCallback, duration = 40) => {
  const tl = gsap.timeline({ repeat: -1 });
  
  // Update the wheel offset during animation
  tl.to(wheelOffsetRef, {
    current: "+= 1",
    duration: duration,
    ease: "linear",
    onUpdate: updateCallback
  });
  
  return tl;
};