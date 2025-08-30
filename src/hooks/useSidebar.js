/**
 * Custom hook for managing sidebar state and interactions
 * Handles visibility, click outside, and touch gestures
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export const useSidebar = (initialVisible = false) => {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const sidebarRef = useRef(null);

  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => setIsVisible(prev => !prev), []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        hide();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, hide]);

  // Handle touch/swipe gestures for mobile
  useEffect(() => {
    if (!isVisible || !sidebarRef.current) return;

    const sidebar = sidebarRef.current;
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = false;
    };

    const handleTouchMove = (e) => {
      if (!isSwiping) {
        const deltaX = Math.abs(e.touches[0].clientX - startX);
        const deltaY = Math.abs(e.touches[0].clientY - startY);
        
        // Start swiping if horizontal movement is greater than vertical
        if (deltaX > 10 && deltaX > deltaY) {
          isSwiping = true;
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (isSwiping) {
        const deltaX = e.changedTouches[0].clientX - startX;
        const deltaY = Math.abs(e.changedTouches[0].clientY - startY);
        
        // Close sidebar if swiped left with sufficient distance and minimal vertical movement
        if (deltaX < -50 && deltaY < 100) {
          hide();
        }
      }
    };

    sidebar.addEventListener('touchstart', handleTouchStart, { passive: true });
    sidebar.addEventListener('touchmove', handleTouchMove, { passive: true });
    sidebar.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      sidebar.removeEventListener('touchstart', handleTouchStart);
      sidebar.removeEventListener('touchmove', handleTouchMove);
      sidebar.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isVisible, hide]);

  return {
    isVisible,
    show,
    hide,
    toggle,
    sidebarRef
  };
};
