// Custom hook for detecting scroll direction
import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 10) {
        // Scrolling down and past threshold
        setScrollDirection('down');
      } else if (scrollTop < lastScrollTop && scrollTop > 10) {
        // Scrolling up and past threshold
        setScrollDirection('up');
      }
      
      setLastScrollTop(scrollTop > 0 ? scrollTop : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', onScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollTop]);

  return scrollDirection;
}