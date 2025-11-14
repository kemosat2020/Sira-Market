import React, { useEffect, useRef } from 'react';

interface FlyingProductAnimationProps {
  product: { imageUrl: string; startRect: DOMRect } | null;
  onAnimationEnd: () => void;
}

const FlyingProductAnimation: React.FC<FlyingProductAnimationProps> = ({ product, onAnimationEnd }) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!product || !imgRef.current) return;

    const { startRect } = product;
    const img = imgRef.current;

    // Set initial position
    img.style.left = `${startRect.left}px`;
    img.style.top = `${startRect.top}px`;
    img.style.width = `${startRect.width}px`;
    img.style.height = `${startRect.height}px`;
    img.style.opacity = '1';
    img.style.transform = 'scale(1)';


    const cartIcon = document.getElementById('cart-icon-target');
    if (!cartIcon) {
        onAnimationEnd();
        return;
    };

    const endRect = cartIcon.getBoundingClientRect();

    // Trigger animation by setting the end state after a short delay
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            img.style.left = `${endRect.left + endRect.width / 2 - 10}px`;
            img.style.top = `${endRect.top + endRect.height / 2 - 10}px`;
            img.style.width = `20px`;
            img.style.height = `20px`;
            img.style.opacity = '0';
            img.style.transform = 'scale(0.2)';
            img.style.borderRadius = '50%';
        });
    });

    const animationDuration = 500; // Must match transition duration in style
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [product, onAnimationEnd]);

  if (!product) {
    return null;
  }

  return (
    <img
      ref={imgRef}
      src={product.imageUrl}
      alt="Flying product"
      className="fixed z-50 rounded-lg object-cover"
      style={{
        transition: 'left 0.5s cubic-bezier(0.29, 0.53, 0.9, 0.28), top 0.5s cubic-bezier(0.29, 0.53, 0.9, 0.28), width 0.5s ease-in-out, height 0.5s ease-in-out, opacity 0.5s ease-in-out, transform 0.5s ease-in-out, border-radius 0.5s ease-in-out',
        willChange: 'left, top, width, height, opacity, transform, border-radius',
      }}
    />
  );
};

export default FlyingProductAnimation;
