import { motion } from 'framer-motion';
import { Heart, Camera } from 'lucide-react';
import { UserRole } from '@/types/app';

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
}

export default function RoleSelection({ onSelect }: RoleSelectionProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ backgroundColor: '#FAF6F0' }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-14 z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-px" style={{ backgroundColor: '#C9A96E' }} />
          <span className="text-xs tracking-[0.2em] uppercase font-jakarta" style={{ color: '#C9A96E' }}>
            Wedding Portrait
          </span>
          <div className="w-8 h-px" style={{ backgroundColor: '#C9A96E' }} />
        </div>
        <h1
          className="text-5xl md:text-6xl font-fraunces italic font-light leading-tight mb-4"
          style={{ color: '#2A2420' }}
        >
          Shotlist Builder
        </h1>
        <p className="font-jakarta text-base" style={{ color: '#2A2420', opacity: 0.55 }}>
          Create a beautifully organized portrait shot list — together.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl z-10">
        <motion.button
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onSelect('couple')}
          className="group relative flex flex-col items-center text-center p-10 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E8DDD6',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: '#FAF0EC' }}
          >
            <Heart size={28} style={{ color: '#C4837A' }} />
          </div>
          <h2 className="font-fraunces text-2xl font-light mb-2" style={{ color: '#2A2420' }}>
            I'm a Couple
          </h2>
          <p className="font-jakarta text-sm leading-relaxed" style={{ color: '#2A2420', opacity: 0.55 }}>
            Share your wedding party details and we'll build your perfect shot list together.
          </p>
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-3/4"
            style={{ backgroundColor: '#C4837A' }}
          />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onSelect('photographer')}
          className="group relative flex flex-col items-center text-center p-10 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E8DDD6',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: '#F5F0E8' }}
          >
            <Camera size={28} style={{ color: '#C9A96E' }} />
          </div>
          <h2 className="font-fraunces text-2xl font-light mb-2" style={{ color: '#2A2420' }}>
            I'm a Photographer
          </h2>
          <p className="font-jakarta text-sm leading-relaxed" style={{ color: '#2A2420', opacity: 0.55 }}>
            Jump straight into the workspace to build and manage a professional shot list.
          </p>
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-3/4"
            style={{ backgroundColor: '#C9A96E' }}
          />
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-10 font-jakarta text-xs z-10"
        style={{ color: '#2A2420', opacity: 0.35 }}
      >
        No account required · Free forever
      </motion.p>
    </div>
  );
}
