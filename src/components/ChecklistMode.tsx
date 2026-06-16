import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { ShotSection } from '@/types/app';

interface ChecklistModeProps {
  sections: ShotSection[];
  onToggleShot: (sectionId: string, shotId: string) => void;
  onExit: () => void;
}

export default function ChecklistMode({ sections, onToggleShot, onExit }: ChecklistModeProps) {
  const allShots = sections.flatMap((s) => s.shots.map((sh) => ({ ...sh, sectionTitle: s.title, sectionId: s.id })));
  const completed = allShots.filter((s) => s.completed).length;
  const total = allShots.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone = completed === total;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#2A2420' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 pt-safe-top pt-4 pb-4"
        style={{ backgroundColor: '#2A2420' }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onExit}
            className="flex items-center gap-2 font-jakarta text-sm transition-opacity hover:opacity-70"
            style={{ color: '#FAF6F0', opacity: 0.6 }}
          >
            <ArrowLeft size={16} />
            Exit Checklist
          </button>
          <div className="font-jakarta text-sm font-semibold" style={{ color: '#C9A96E' }}>
            {completed}/{total}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="h-1.5 rounded-full mb-1.5" style={{ backgroundColor: '#3D3530' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: '#C4837A' }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="flex justify-between">
            <span className="font-jakarta text-xs" style={{ color: '#FAF6F0', opacity: 0.35 }}>
              {pct}% complete
            </span>
          </div>
        </div>
      </div>

      {/* All done banner */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-2 p-4 rounded-2xl text-center"
            style={{ backgroundColor: '#3D3530' }}
          >
            <p className="font-fraunces text-xl italic" style={{ color: '#C9A96E' }}>
              🎉 Shot list complete!
            </p>
            <p className="font-jakarta text-xs mt-1" style={{ color: '#FAF6F0', opacity: 0.5 }}>
              You got every shot — amazing work!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shot list */}
      <div className="flex-1 px-4 py-4 pb-12 space-y-2 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.id} className="mb-4">
            <p
              className="font-jakarta text-xs tracking-widest uppercase px-1 mb-2"
              style={{ color: '#C9A96E', opacity: 0.7 }}
            >
              {section.title}
            </p>
            <div className="space-y-2">
              {section.shots.map((shot) => (
                <motion.button
                  key={shot.id}
                  onClick={() => onToggleShot(section.id, shot.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: shot.completed ? '#3D3530' : '#332D29',
                    border: `1px solid ${shot.completed ? '#C4837A40' : '#3D3530'}`,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Checkbox */}
                  <div
                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      borderColor: shot.completed ? '#C4837A' : '#6B5E58',
                      backgroundColor: shot.completed ? '#C4837A' : 'transparent',
                    }}
                  >
                    <AnimatePresence>
                      {shot.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <Check size={14} style={{ color: '#FAF6F0' }} strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Label */}
                  <span
                    className="font-grotesk text-sm leading-relaxed transition-all duration-200"
                    style={{
                      color: shot.completed ? '#FAF6F0' : '#FAF6F0',
                      opacity: shot.completed ? 0.45 : 0.85,
                      textDecoration: shot.completed ? 'line-through' : 'none',
                    }}
                  >
                    {shot.description}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
