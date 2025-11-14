
import React, { useState, useEffect, useRef } from 'react';
import ArrowUpIcon from './icons/ArrowUpIcon.tsx';
import ArrowDownIcon from './icons/ArrowDownIcon.tsx';
import { useTranslation } from '../i18n/index.tsx';

interface ScrollButtonsProps {
  scrollContainerId: string;
}

const ScrollButtons: React.FC<ScrollButtonsProps> = ({ scrollContainerId }) => {
  const { t } = useTranslation();
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(true);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Give time for the DOM to update with the new ID
    const timer = setTimeout(() => {
        const container = document.getElementById(scrollContainerId);
        if (container) {
            containerRef.current = container;
            const toggleVisibility = () => {
                const { scrollTop, scrollHeight, clientHeight } = container;
                setShowUp(scrollTop > 200);
                // Show down arrow if not at the bottom
                setShowDown(scrollHeight - scrollTop - clientHeight > 50);
            };
            
            toggleVisibility(); // Check on mount
            container.addEventListener('scroll', toggleVisibility, { passive: true });
            
            return () => {
                container.removeEventListener('scroll', toggleVisibility);
            };
        }
    }, 100); // Small delay to ensure the container with the correct ID is available

    return () => clearTimeout(timer);

  }, [scrollContainerId]);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  const hasButtons = showUp || showDown;

  return (
    <div
      className={`fixed bottom-6 start-6 z-40 transition-opacity duration-300 ${
        hasButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col space-y-2">
        {showUp && (
          <button
            onClick={scrollToTop}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-transform transform hover:scale-110"
            aria-label={t('scrollButtons.scrollToTop')}
          >
            <ArrowUpIcon className="w-6 h-6" />
          </button>
        )}
        {showDown && (
          <button
            onClick={scrollToBottom}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-transform transform hover:scale-110"
            aria-label={t('scrollButtons.scrollToBottom')}
          >
            <ArrowDownIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ScrollButtons;