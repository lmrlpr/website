import type React from 'react';
import { motion } from 'framer-motion';

type GradientBackgroundProps = React.ComponentProps<'div'> & {
  gradients?: string[];
  animationDuration?: number;
  animationDelay?: number;
  overlay?: boolean;
  overlayOpacity?: number;
};

const DEFAULT_GRADIENTS = [
  'linear-gradient(135deg, #F4A259 0%, #D7832F 100%)',
  'linear-gradient(135deg, #ECD8C8 0%, #F4A259 100%)',
  'linear-gradient(135deg, #F5EFE6 0%, #D7832F 100%)',
  'linear-gradient(135deg, #D7832F 0%, #ECD8C8 100%)',
  'linear-gradient(135deg, #F4A259 0%, #D7832F 100%)',
];

export function GradientBackground({
  children,
  className = '',
  gradients = DEFAULT_GRADIENTS,
  animationDuration = 8,
  animationDelay = 0.5,
  overlay = false,
  overlayOpacity = 0.3,
}: GradientBackgroundProps) {
  return (
    <div className={`w-full relative min-h-screen overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{ background: gradients[0] }}
        animate={{ background: gradients }}
        transition={{
          delay: animationDelay,
          duration: animationDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      {children && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
