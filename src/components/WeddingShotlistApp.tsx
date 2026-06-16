import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import RoleSelection from './RoleSelection';
import CoupleIntakeForm from './CoupleIntakeForm';
import GeneratingScreen from './GeneratingScreen';
import PhotographerWorkspace from './PhotographerWorkspace';
import ChecklistMode from './ChecklistMode';
import ExportPanel from './ExportPanel';
import { AppView, WeddingData, ShotSection, UserRole } from '@/types/app';
import { generateShotList } from '@/lib/shotlistGenerator';

// Demo data for photographers who jump straight in
const DEMO_DATA: WeddingData = {
  brideFirstName: 'Elizabeth',
  brideLastName: 'Anderson',
  groomFirstName: 'Tim',
  groomLastName: 'Collins',
  bridesmaids: [
    { id: '1', name: 'Rachel', relationship: 'Maid of Honor' },
    { id: '2', name: 'Sophie', relationship: 'Sister' },
    { id: '3', name: 'Mia', relationship: 'Best Friend' },
  ],
  groomsmen: [
    { id: '4', name: 'Jake', relationship: 'Best Man' },
    { id: '5', name: 'Connor', relationship: 'Brother' },
    { id: '6', name: 'Noah', relationship: 'Friend' },
  ],
  brideFamily: [
    { id: '7', name: 'Margaret', relationship: 'Mother of Bride' },
    { id: '8', name: 'Steve', relationship: 'Father of Bride' },
    { id: '9', name: 'David', relationship: 'Brother of Bride' },
  ],
  groomFamily: [
    { id: '10', name: 'Patricia', relationship: 'Mother of Groom' },
    { id: '11', name: 'Robert', relationship: 'Father of Groom' },
  ],
  specialGroupings: ['Elizabeth + College Friends', 'Tim + Work Colleagues'],
  receptionRequests: ['First dance', 'Cake cutting', 'Table shots with grandparents'],
};

function slideVariants(direction: 'forward' | 'back') {
  return {
    initial: { opacity: 0, x: direction === 'forward' ? 32 : -32 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'forward' ? -32 : 32 },
  };
}

export default function WeddingShotlistApp() {
  const [view, setView] = useState<AppView>('role-selection');
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [sections, setSections] = useState<ShotSection[]>([]);
  const [showExport, setShowExport] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'couple') {
      setView('couple-intake');
    } else {
      // Photographer goes straight to workspace with demo data
      const generated = generateShotList(DEMO_DATA);
      setSections(generated);
      setView('photographer-workspace');
    }
  };

  const handleIntakeComplete = (data: WeddingData) => {
    setWeddingData(data);
    setView('generating');
  };

  const handleGenerationComplete = useCallback(() => {
    if (weddingData) {
      const generated = generateShotList(weddingData);
      setSections(generated);
    }
    setView('photographer-workspace');
  }, [weddingData]);

  const handleToggleShot = (sectionId: string, shotId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              shots: s.shots.map((sh) =>
                sh.id === shotId ? { ...sh, completed: !sh.completed } : sh
              ),
            }
          : s
      )
    );
  };

  return (
    <div className="relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        {view === 'role-selection' && (
          <motion.div
            key="role-selection"
            {...slideVariants('back')}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <RoleSelection onSelect={handleRoleSelect} />
          </motion.div>
        )}

        {view === 'couple-intake' && (
          <motion.div
            key="couple-intake"
            {...slideVariants('forward')}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <CoupleIntakeForm
              onComplete={handleIntakeComplete}
              onBack={() => setView('role-selection')}
            />
          </motion.div>
        )}

        {view === 'generating' && (
          <motion.div
            key="generating"
            {...slideVariants('forward')}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <GeneratingScreen onComplete={handleGenerationComplete} />
          </motion.div>
        )}

        {view === 'photographer-workspace' && (
          <motion.div
            key="photographer-workspace"
            {...slideVariants('forward')}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <PhotographerWorkspace
              sections={sections}
              onSectionsChange={setSections}
              onChecklistMode={() => setView('checklist-mode')}
              onExport={() => setShowExport(true)}
            />
          </motion.div>
        )}

        {view === 'checklist-mode' && (
          <motion.div
            key="checklist-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChecklistMode
              sections={sections}
              onToggleShot={handleToggleShot}
              onExit={() => setView('photographer-workspace')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Panel (overlays workspace) */}
      {showExport && (
        <ExportPanel
          sections={sections}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
