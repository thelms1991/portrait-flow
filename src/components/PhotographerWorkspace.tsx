import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Download,
  CheckSquare,
  Share2,
} from 'lucide-react';
import { ShotSection, ShotCard } from '@/types/app';

interface PhotographerWorkspaceProps {
  sections: ShotSection[];
  onSectionsChange: (sections: ShotSection[]) => void;
  onChecklistMode: () => void;
  onExport: () => void;
}

function generateId() {
  return `shot-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  couple: '#C4837A',
  bridesmaids: '#D4A0B0',
  groomsmen: '#8B9DB5',
  'bridal-party': '#C4837A',
  'bride-family': '#B89BB0',
  'groom-family': '#9BADB5',
  'special-requests': '#C9A96E',
  reception: '#C9A96E',
};

export default function PhotographerWorkspace({
  sections,
  onSectionsChange,
  onChecklistMode,
  onExport,
}: PhotographerWorkspaceProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [addingToSection, setAddingToSection] = useState<string | null>(null);
  const [newShotValue, setNewShotValue] = useState('');
  const [copied, setCopied] = useState(false);
  const dragItem = useRef<{ sectionId: string; shotId: string } | null>(null);
  const dragOverItem = useRef<{ sectionId: string; shotId: string } | null>(null);

  const totalShots = sections.reduce((sum, s) => sum + s.shots.length, 0);
  const completedShots = sections.reduce(
    (sum, s) => sum + s.shots.filter((sh) => sh.completed).length,
    0
  );

  const toggleSection = (id: string) => {
    onSectionsChange(
      sections.map((s) => (s.id === id ? { ...s, collapsed: !s.collapsed } : s))
    );
  };

  const startEdit = (shot: ShotCard) => {
    setEditingId(shot.id);
    setEditValue(shot.description);
  };

  const saveEdit = (sectionId: string) => {
    onSectionsChange(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              shots: s.shots.map((sh) =>
                sh.id === editingId ? { ...sh, description: editValue } : sh
              ),
            }
          : s
      )
    );
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const deleteShot = (sectionId: string, shotId: string) => {
    onSectionsChange(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, shots: s.shots.filter((sh) => sh.id !== shotId) }
          : s
      )
    );
  };

  const addShot = (sectionId: string) => {
    if (!newShotValue.trim()) {
      setAddingToSection(null);
      return;
    }
    onSectionsChange(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              shots: [
                ...s.shots,
                { id: generateId(), description: newShotValue.trim(), completed: false, custom: true },
              ],
            }
          : s
      )
    );
    setNewShotValue('');
    setAddingToSection(null);
  };

  const handleDragStart = (sectionId: string, shotId: string) => {
    dragItem.current = { sectionId, shotId };
  };

  const handleDragEnter = (sectionId: string, shotId: string) => {
    dragOverItem.current = { sectionId, shotId };
  };

  const handleDragEnd = () => {
    if (!dragItem.current || !dragOverItem.current) return;
    const from = dragItem.current;
    const to = dragOverItem.current;

    if (from.sectionId === to.sectionId && from.shotId === to.shotId) return;

    const newSections = sections.map((s) => ({ ...s, shots: [...s.shots] }));
    const fromSection = newSections.find((s) => s.id === from.sectionId)!;
    const toSection = newSections.find((s) => s.id === to.sectionId)!;

    const shotIdx = fromSection.shots.findIndex((sh) => sh.id === from.shotId);
    const [shot] = fromSection.shots.splice(shotIdx, 1);

    const toIdx = toSection.shots.findIndex((sh) => sh.id === to.shotId);
    toSection.shots.splice(toIdx, 0, shot);

    onSectionsChange(newSections);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#F5F0EA' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 md:px-6 py-4 border-b flex items-center justify-between"
        style={{ backgroundColor: '#F5F0EA', borderColor: '#E0D5CC' }}
      >
        <div>
          <h1 className="font-fraunces text-xl italic font-light" style={{ color: '#2A2420' }}>
            Shot List
          </h1>
          <p className="font-jakarta text-xs mt-0.5" style={{ color: '#2A2420', opacity: 0.45 }}>
            {totalShots} shots · {sections.length} sections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border flex items-center gap-1.5 font-jakarta text-xs transition-all hover:shadow"
            style={{ borderColor: '#E0D5CC', backgroundColor: '#FFFFFF', color: '#2A2420' }}
          >
            {copied ? <Check size={14} style={{ color: '#C4837A' }} /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={onChecklistMode}
            className="p-2.5 rounded-xl border flex items-center gap-1.5 font-jakarta text-xs transition-all hover:shadow"
            style={{ borderColor: '#E0D5CC', backgroundColor: '#FFFFFF', color: '#2A2420' }}
          >
            <CheckSquare size={14} />
            <span className="hidden sm:inline">Checklist</span>
          </button>
        </div>
      </div>

      {/* Progress strip */}
      {completedShots > 0 && (
        <div className="px-4 md:px-6 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid #E0D5CC' }}>
          <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: '#E8DDD6' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: '#C4837A' }}
              animate={{ width: `${(completedShots / totalShots) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="font-jakarta text-xs flex-shrink-0" style={{ color: '#C4837A' }}>
            {completedShots}/{totalShots} done
          </span>
        </div>
      )}

      {/* Sections */}
      <div className="flex-1 px-4 md:px-6 py-4 pb-32 max-w-2xl mx-auto w-full space-y-3">
        {sections.map((section) => {
          const accentColor = CATEGORY_COLORS[section.category] ?? '#C4837A';

          return (
            <div
              key={section.id}
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E8DDD6' }}
            >
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-black/[0.01]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-1 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="font-jakarta font-semibold text-sm" style={{ color: '#2A2420' }}>
                    {section.title}
                  </span>
                  <span
                    className="text-xs font-jakarta px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    {section.shots.length}
                  </span>
                </div>
                {section.collapsed ? (
                  <ChevronDown size={16} style={{ color: '#2A2420', opacity: 0.4 }} />
                ) : (
                  <ChevronUp size={16} style={{ color: '#2A2420', opacity: 0.4 }} />
                )}
              </button>

              {/* Shot cards */}
              <AnimatePresence initial={false}>
                {!section.collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t divide-y" style={{ borderColor: '#F0EAE4', borderTop: `1px solid #F0EAE4` }}>
                      {section.shots.map((shot) => (
                        <div
                          key={shot.id}
                          draggable
                          onDragStart={() => handleDragStart(section.id, shot.id)}
                          onDragEnter={() => handleDragEnter(section.id, shot.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => e.preventDefault()}
                          className="flex items-start gap-2 px-4 py-3 group hover:bg-[#FAF6F0] transition-colors"
                          style={{ borderColor: '#F0EAE4' }}
                        >
                          {/* Drag handle */}
                          <div className="mt-1 opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing transition-opacity flex-shrink-0">
                            <GripVertical size={14} style={{ color: '#2A2420' }} />
                          </div>

                          {/* Content */}
                          {editingId === shot.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <input
                                autoFocus
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEdit(section.id);
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                                className="flex-1 bg-transparent border-b text-sm font-grotesk py-1 outline-none"
                                style={{ borderColor: '#C4837A', color: '#2A2420' }}
                              />
                              <button onClick={() => saveEdit(section.id)}>
                                <Check size={14} style={{ color: '#C4837A' }} />
                              </button>
                              <button onClick={cancelEdit}>
                                <X size={14} style={{ color: '#2A2420', opacity: 0.4 }} />
                              </button>
                            </div>
                          ) : (
                            <span
                              className="flex-1 text-sm font-grotesk leading-relaxed pt-0.5"
                              style={{ color: '#2A2420' }}
                            >
                              {shot.description}
                            </span>
                          )}

                          {/* Actions */}
                          {editingId !== shot.id && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                              <button
                                onClick={() => startEdit(shot)}
                                className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
                              >
                                <Pencil size={13} style={{ color: '#2A2420', opacity: 0.5 }} />
                              </button>
                              <button
                                onClick={() => deleteShot(section.id, shot.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={13} style={{ color: '#C4837A', opacity: 0.6 }} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add shot inline */}
                      {addingToSection === section.id ? (
                        <div className="px-4 py-3 flex items-center gap-2" style={{ borderTop: '1px solid #F0EAE4' }}>
                          <div
                            className="w-1 h-4 rounded-full flex-shrink-0 opacity-40"
                            style={{ backgroundColor: accentColor }}
                          />
                          <input
                            autoFocus
                            type="text"
                            value={newShotValue}
                            onChange={(e) => setNewShotValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') addShot(section.id);
                              if (e.key === 'Escape') {
                                setAddingToSection(null);
                                setNewShotValue('');
                              }
                            }}
                            placeholder="Describe the shot..."
                            className="flex-1 bg-transparent text-sm font-grotesk outline-none placeholder:opacity-40"
                            style={{ color: '#2A2420' }}
                          />
                          <button
                            onClick={() => addShot(section.id)}
                            className="text-xs font-jakarta px-2.5 py-1 rounded-lg"
                            style={{ backgroundColor: '#C4837A', color: '#FAF6F0' }}
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setAddingToSection(null);
                              setNewShotValue('');
                            }}
                          >
                            <X size={14} style={{ color: '#2A2420', opacity: 0.4 }} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingToSection(section.id)}
                          className="w-full flex items-center gap-2 px-4 py-3 font-jakarta text-xs transition-colors hover:bg-[#FAF6F0]"
                          style={{ color: '#2A2420', opacity: 0.4, borderTop: '1px solid #F0EAE4' }}
                        >
                          <Plus size={13} />
                          Add shot
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Export FAB */}
      <button
        onClick={onExport}
        className="fixed bottom-6 right-6 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl font-jakarta text-sm font-semibold transition-all hover:scale-105 active:scale-95 z-30"
        style={{ backgroundColor: '#C4837A', color: '#FAF6F0' }}
      >
        <Download size={16} style={{ color: '#C9A96E' }} />
        Export
      </button>
    </div>
  );
}
