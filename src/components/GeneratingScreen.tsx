import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface GeneratingScreenProps {
  onComplete: () => void;
}

const LINES = [
  'Organizing your wedding party...',
  'Building couple portraits...',
  'Grouping family combinations...',
  'Structuring bridal party shots...',
  'Adding special groupings...',
  'Finalizing your shot list...',
];

export default function GeneratingScreen({ onComplete }: GeneratingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#FAF6F0' }}
    >
      {/* Animated ring */}
      <motion.div
        className="relative mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 rounded-full border-2"
          style={{ borderColor: '#E8DDD6' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 w-20 h-20 rounded-full border-2 border-t-transparent border-l-transparent"
          style={{ borderColor: '#C4837A' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center font-fraunces text-2xl italic"
          style={{ color: '#C4837A' }}
        >
          ✦
        </div>
      </motion.div>

      <motion.h2
        className="font-fraunces text-3xl italic font-light mb-3 text-center"
        style={{ color: '#2A2420' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Crafting your shot list...
      </motion.h2>
      <motion.p
        className="font-jakarta text-sm mb-12 text-center"
        style={{ color: '#2A2420', opacity: 0.45 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Applying professional portrait grouping logic
      </motion.p>

      <div className="space-y-3 w-full max-w-xs">
        {LINES.map((line, i) => (
          <motion.div
            key={line}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.35, duration: 0.4 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: '#C4837A' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.35, duration: 0.3 }}
            />
            <span className="font-jakarta text-sm" style={{ color: '#2A2420', opacity: 0.6 }}>
              {line}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
