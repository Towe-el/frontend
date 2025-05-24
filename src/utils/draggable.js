import { Draggable } from 'gsap/all';
import { closestPointOnPath, calculateRotationDiff } from './calculatePath';

/**
 * Makes cards draggable with circular motion constraints
 * @param {SVGPathElement} path - The SVG path element
 * @param {HTMLElement[]} cards - Array of card elements
 * @param {Object} wheelOffsetRef - Ref object containing the current wheel offset
 * @param {Function} updateCallback - Callback function to update all card positions
 */
export const makeCardsDraggable = (path, cards, wheelOffsetRef, updateCallback) => {
  if (!path || !cards.length) return;
  
  const totalLength = path.getTotalLength();
  const draggableInstances = [];
  
  cards.forEach((card, cardIndex) => {
    if (!card) return;
    
    // Store the original position of each card relative to the wheel
    const originalCardPosition = cardIndex / cards.length;
    
    // Create a reference to track this card's last position during drag
    const cardDragInfo = { 
      lastProgress: originalCardPosition,
      isDragging: false,
      dragStartTime: 0,
      dragDistance: 0
    };
    
    const draggableInstance = Draggable.create(card, {
      type: "x,y",
      onDragStart: function() {
        // Mark as dragging and record start time
        cardDragInfo.isDragging = true;
        cardDragInfo.dragStartTime = Date.now();
        cardDragInfo.dragDistance = 0;
        
        // Set dragging attribute to prevent click events
        card.setAttribute('data-dragging', 'true');
        card.classList.add('dragging');
        
        // Save current progress at drag start
        cardDragInfo.lastProgress = (originalCardPosition + wheelOffsetRef.current) % 1;
      },
      onDrag: function() {
        // Track total drag distance
        cardDragInfo.dragDistance += Math.abs(this.deltaX) + Math.abs(this.deltaY);
        
        // Get the dragged card's position
        const box = card.getBoundingClientRect();
        const svgBox = path.getBoundingClientRect();
        const x = box.left + box.width/2 - svgBox.left;
        const y = box.top + box.height/2 - svgBox.top;
        
        // Find closest point on path
        const closestLength = closestPointOnPath(path, x, y);
        const newProgress = closestLength / totalLength;
        
        // Calculate how much this specific card has moved
        const rotationDiff = calculateRotationDiff(newProgress, cardDragInfo.lastProgress);
        
        // Update wheel offset
        wheelOffsetRef.current = (wheelOffsetRef.current + rotationDiff + 1) % 1;
        
        // Update this card's last position
        cardDragInfo.lastProgress = newProgress;
        
        // Update all cards with the new wheel position
        updateCallback();
      },
      onDragEnd: function() {
        const dragDuration = Date.now() - cardDragInfo.dragStartTime;
        const isDragGesture = cardDragInfo.dragDistance > 5 || dragDuration > 150;
        
        // Reset dragging state after a brief delay
        setTimeout(() => {
          cardDragInfo.isDragging = false;
          card.removeAttribute('data-dragging');
          card.classList.remove('dragging');
        }, isDragGesture ? 100 : 0);
      },
      // Configure drag behavior
      inertia: false, // Disable inertia for more precise control
      bounds: "body", // Keep within viewport
      edgeResistance: 0.5
    });

    // Store the draggable instance for cleanup
    if (draggableInstance && draggableInstance[0]) {
      card._draggable = draggableInstance[0];
      card._dragInfo = cardDragInfo;
      draggableInstances.push(draggableInstance[0]);
    }
  });
  
  return draggableInstances;
};

/**
 * Gets the current position of a dragged element relative to the SVG container
 * @param {HTMLElement} element - The dragged element
 * @param {SVGPathElement} path - The SVG path element (for container reference)
 * @returns {Object} - Object containing x and y coordinates
 */
export const getDraggedElementPosition = (element, path) => {
  const box = element.getBoundingClientRect();
  const svgBox = path.getBoundingClientRect();
  
  return {
    x: box.left + box.width/2 - svgBox.left,
    y: box.top + box.height/2 - svgBox.top
  };
};

/**
 * Cleanup function to destroy all draggable instances
 * @param {HTMLElement[]} cards - Array of card elements
 */
export const cleanupDraggable = (cards) => {
  cards.forEach(card => {
    if (card && card._draggable) {
      card._draggable.kill();
      delete card._draggable;
      delete card._dragInfo;
      card.removeAttribute('data-dragging');
      card.classList.remove('dragging');
    }
  });
};

/**
 * Check if a card is currently being dragged
 * @param {HTMLElement} card - The card element to check
 * @returns {boolean} - True if the card is being dragged
 */
export const isCardDragging = (card) => {
  return card && card._dragInfo && card._dragInfo.isDragging;
};