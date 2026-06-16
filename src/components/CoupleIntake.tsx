import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { WeddingData, Person } from '@/types/app';

interface CoupleIntakeProps {
  onComplete: (data: WeddingData) => void;
  onBack: () => void;
}

const TOTAL_STEPS = 6;

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function PersonRow({
  person,
  onChange,
  onRemove,
  namePlaceholder,
  relationshipPlaceholder,
}: {
  person: Person;
  onChange: (updated: Person) => void;
  onRemove: () => void;
  namePlaceholder?: string;
  relationshipPlaceholder?: string;
}) {
  return (
    <div className="flex gap-3 items-center group">
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          value={person.name}
          onChange={(e) => onChange({ ...person, name: e.target.value })}
          placeholder={namePlaceholder ?? 'Full name'}
          className="flex-1 bg-transparent border-b py-2.5 text-sm font-jakarta outline-none transition-colors placeholder:opacity-40 focus:border-b-2"
          style={{
            borderColor: '#D5C8BF',
            color: '#2A2420',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
          onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
        />
        <input
          type="text"
          value={person.relationship}
          onChange={(e) => onChange({ ...person, relationship: e.target.value })}
          placeholder={relationshipPlaceholder ?? 'Relationship'}
          className="w-40 bg-transparent border-b py-2.5 text-sm font-jakarta outline-none transition-colors placeholder:opacity-40"
          style={{
            borderColor: '#D5C8BF',
            color: '#2A2420',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
          onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
        />
      </div>
      <button
        onClick={onRemove}
        className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        style={{ color: '#C4837A' }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function CoupleIntake({ onComplete, onBack }: CoupleIntakeProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [brideFirstName, setBrideFirstName] = useState('');
  const [brideLastName, setBrideLastName] = useState('');
  const [groomFirstName, setGroomFirstName] = useState('');
  const [groomLastName, setGroomLastName] = useState('');
  const [bridesmaids, setBridesmaids] = useState<Person[]>([{ id: generateId(), name: '', relationship: '' }]);
  const [groomsmen, setGroomsmen] = useState<Person[]>([{ id: generateId(), name: '', relationship: '' }]);
  const [brideFamily, setBrideFamily] = useState<Person[]>([{ id: generateId(), name: '', relationship: '' }]);
  const [groomFamily, setGroomFamily] = useState<Person[]>([{ id: generateId(), name: '', relationship: '' }]);
  const [specialGroupings, setSpecialGroupings] = useState<string[]>(['']);
  const [receptionRequests, setReceptionRequests] = useState<string[]>(['']);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!brideFirstName.trim()) newErrors.brideFirstName = 'Required';
      if (!groomFirstName.trim()) newErrors.groomFirstName = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const clean = (arr: Person[]) => arr.filter((p) => p.name.trim());
    const cleanStrings = (arr: string[]) => arr.filter((s) => s.trim());
    onComplete({
      brideFirstName: brideFirstName.trim(),
      brideLastName: brideLastName.trim(),
      groomFirstName: groomFirstName.trim(),
      groomLastName: groomLastName.trim(),
      bridesmaids: clean(bridesmaids),
      groomsmen: clean(groomsmen),
      brideFamily: clean(brideFamily),
      groomFamily: clean(groomFamily),
      specialGroupings: cleanStrings(specialGroupings),
      receptionRequests: cleanStrings(receptionRequests),
    });
  };

  const addPerson = (setter: React.Dispatch<React.SetStateAction<Person[]>>) => {
    setter((prev) => [...prev, { id: generateId(), name: '', relationship: '' }]);
  };

  const updatePerson = (
    setter: React.Dispatch<React.SetStateAction<Person[]>>,
    id: string,
    updated: Person
  ) => {
    setter((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const removePerson = (
    setter: React.Dispatch<React.SetStateAction<Person[]>>,
    id: string
  ) => {
    setter((prev) => prev.filter((p) => p.id !== id));
  };

  const addString = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, '']);
  };

  const updateString = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    idx: number,
    val: string
  ) => {
    setter((prev) => prev.map((s, i) => (i === idx ? val : s)));
  };

  const removeString = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    idx: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== idx));
  };

  const stepTitles = [
    'Names of the Happy Couple',
    'The Bridesmaids',
    'The Groomsmen',
    'Immediate Family',
    'Special Groupings',
    'Reception Requests',
  ];

  const stepSubtitles = [
    'These names will be used throughout your entire shot list.',
    `Who will be standing by ${brideFirstName || 'the bride'}?`,
    `Who will be standing by ${groomFirstName || 'the groom'}?`,
    'Add immediate family from both sides.',
    'Any specific groupings you want to make sure we capture?',
    'Any special portraits you want at the reception?',
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#FAF6F0' }}
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={step === 1 ? onBack : () => setStep((s) => s - 1)}
          className="flex items-center gap-1.5 font-jakarta text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: '#2A2420', opacity: 0.55 }}
        >
          <ArrowLeft size={16} />
          {step === 1 ? 'Back' : 'Previous step'}
        </button>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-jakarta text-xs tracking-widest uppercase" style={{ color: '#C9A96E' }}>
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>
          <div className="h-0.5 rounded-full" style={{ backgroundColor: '#E8DDD6' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: '#C4837A' }}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-fraunces text-3xl italic font-light mb-1.5" style={{ color: '#2A2420' }}>
              {stepTitles[step - 1]}
            </h1>
            <p className="font-jakarta text-sm" style={{ color: '#2A2420', opacity: 0.5 }}>
              {stepSubtitles[step - 1]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg mx-auto"
          >
            {/* Step 1: Names */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <label className="block font-jakarta text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A96E' }}>
                    Bride / Partner 1
                  </label>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={brideFirstName}
                        onChange={(e) => setBrideFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full bg-transparent border-b py-3 text-base font-jakarta outline-none transition-colors placeholder:opacity-40"
                        style={{ borderColor: errors.brideFirstName ? '#E07070' : '#D5C8BF', color: '#2A2420' }}
                        onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
                        onBlur={(e) => (e.target.style.borderColor = errors.brideFirstName ? '#E07070' : '#D5C8BF')}
                      />
                      {errors.brideFirstName && (
                        <p className="font-jakarta text-xs mt-1" style={{ color: '#E07070' }}>{errors.brideFirstName}</p>
                      )}
                    </div>
                    <input
                      type="text"
                      value={brideLastName}
                      onChange={(e) => setBrideLastName(e.target.value)}
                      placeholder="Last name (optional)"
                      className="w-full bg-transparent border-b py-3 text-base font-jakarta outline-none transition-colors placeholder:opacity-40"
                      style={{ borderColor: '#D5C8BF', color: '#2A2420' }}
                      onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
                      onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-jakarta text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A96E' }}>
                    Groom / Partner 2
                  </label>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={groomFirstName}
                        onChange={(e) => setGroomFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full bg-transparent border-b py-3 text-base font-jakarta outline-none transition-colors placeholder:opacity-40"
                        style={{ borderColor: errors.groomFirstName ? '#E07070' : '#D5C8BF', color: '#2A2420' }}
                        onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
                        onBlur={(e) => (e.target.style.borderColor = errors.groomFirstName ? '#E07070' : '#D5C8BF')}
                      />
                      {errors.groomFirstName && (
                        <p className="font-jakarta text-xs mt-1" style={{ color: '#E07070' }}>{errors.groomFirstName}</p>
                      )}
                    </div>
                    <input
                      type="text"
                      value={groomLastName}
                      onChange={(e) => setGroomLastName(e.target.value)}
                      placeholder="Last name (optional)"
                      className="w-full bg-transparent border-b py-3 text-base font-jakarta outline-none transition-colors placeholder:opacity-40"
                      style={{ borderColor: '#D5C8BF', color: '#2A2420' }}
                      onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
                      onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Bridesmaids */}
            {step === 2 && (
              <div className="space-y-3">
                <div className="flex gap-3 mb-2">
                  <span className="flex-1 font-jakarta text-xs tracking-widest uppercase opacity-40" style={{ color: '#2A2420' }}>Name</span>
                  <span className="w-40 font-jakarta text-xs tracking-widest uppercase opacity-40" style={{ color: '#2A2420' }}>Relationship</span>
                  <span className="w-7" />
                </div>
                {bridesmaids.map((bm) => (
                  <PersonRow
                    key={bm.id}
                    person={bm}
                    onChange={(u) => updatePerson(setBridesmaids, bm.id, u)}
                    onRemove={() => removePerson(setBridesmaids, bm.id)}
                    namePlaceholder="e.g. Sarah"
                    relationshipPlaceholder="e.g. MOH, Sister"
                  />
                ))}
                <button
                  onClick={() => addPerson(setBridesmaids)}
                  className="flex items-center gap-2 mt-2 font-jakarta text-sm transition-opacity hover:opacity-70"
                  style={{ color: '#C4837A' }}
                >
                  <Plus size={16} /> Add bridesmaid
                </button>
              </div>
            )}

            {/* Step 3: Groomsmen */}
            {step === 3 && (
              <div className="space-y-3">
                <div className="flex gap-3 mb-2">
                  <span className="flex-1 font-jakarta text-xs tracking-widest uppercase opacity-40" style={{ color: '#2A2420' }}>Name</span>
                  <span className="w-40 font-jakarta text-xs tracking-widest uppercase opacity-40" style={{ color: '#2A2420' }}>Relationship</span>
                  <span className="w-7" />
                </div>
                {groomsmen.map((gm) => (
                  <PersonRow
                    key={gm.id}
                    person={gm}
                    onChange={(u) => updatePerson(setGroomsmen, gm.id, u)}
                    onRemove={() => removePerson(setGroomsmen, gm.id)}
                    namePlaceholder="e.g. James"
                    relationshipPlaceholder="e.g. Best Man, Brother"
                  />
                ))}
                <button
                  onClick={() => addPerson(setGroomsmen)}
                  className="flex items-center gap-2 mt-2 font-jakarta text-sm transition-opacity hover:opacity-70"
                  style={{ color: '#C4837A' }}
                >
                  <Plus size={16} /> Add groomsman
                </button>
              </div>
            )}

            {/* Step 4: Immediate Family */}
            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <label className="block font-jakarta text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A96E' }}>
                    {brideFirstName || 'Bride'}'s Family
                  </label>
                  <div className="space-y-3">
                    {brideFamily.map((fm) => (
                      <PersonRow
                        key={fm.id}
                        person={fm}
                        onChange={(u) => updatePerson(setBrideFamily, fm.id, u)}
                        onRemove={() => removePerson(setBrideFamily, fm.id)}
                        namePlaceholder="e.g. Margaret"
                        relationshipPlaceholder="e.g. Mother of Bride"
                      />
                    ))}
                    <button
                      onClick={() => addPerson(setBrideFamily)}
                      className="flex items-center gap-2 font-jakarta text-sm transition-opacity hover:opacity-70"
                      style={{ color: '#C4837A' }}
                    >
                      <Plus size={16} /> Add family member
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-jakarta text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A96E' }}>
                    {groomFirstName || 'Groom'}'s Family
                  </label>
                  <div className="space-y-3">
                    {groomFamily.map((fm) => (
                      <PersonRow
                        key={fm.id}
                        person={fm}
                        onChange={(u) => updatePerson(setGroomFamily, fm.id, u)}
                        onRemove={() => removePerson(setGroomFamily, fm.id)}
                        namePlaceholder="e.g. Robert"
                        relationshipPlaceholder="e.g. Father of Groom"
                      />
                    ))}
                    <button
                      onClick={() => addPerson(setGroomFamily)}
                      className="flex items-center gap-2 font-jakarta text-sm transition-opacity hover:opacity-70"
                      style={{ color: '#C4837A' }}
                    >
                      <Plus size={16} /> Add family member
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Special Groupings */}
            {step === 5 && (
              <div className="space-y-3">
                <p className="font-jakarta text-sm mb-4" style={{ color: '#2A2420', opacity: 0.5 }}>
                  e.g. "Bride + College friends", "Groom + Cousins", etc.
                </p>
                {specialGroupings.map((sg, idx) => (
                  <div key={idx} className="flex gap-3 items-center group">
                    <input
                      type="text"
                      value={sg}
                      onChange={(e) => updateString(setSpecialGroupings, idx, e.target.value)}
                      placeholder="Describe the group..."
                      className="flex-1 bg-transparent border-b py-2.5 text-sm font-jakarta outline-none transition-colors placeholder:opacity-40"
                      style={{ borderColor: '#D5C8BF', color: '#2A2420' }}
                      onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
                      onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
                    />
                    {specialGroupings.length > 1 && (
                      <button
                        onClick={() => removeString(setSpecialGroupings, idx)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: '#C4837A' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addString(setSpecialGroupings)}
                  className="flex items-center gap-2 mt-2 font-jakarta text-sm transition-opacity hover:opacity-70"
                  style={{ color: '#C4837A' }}
                >
                  <Plus size={16} /> Add grouping
                </button>
              </div>
            )}

            {/* Step 6: Reception Requests */}
            {step === 6 && (
              <div className="space-y-3">
                <p className="font-jakarta text-sm mb-4" style={{ color: '#2A2420', opacity: 0.5 }}>
                  e.g. "First dance", "Table shots", "Couple with venue"
                </p>
                {receptionRequests.map((rr, idx) => (
                  <div key={idx} className="flex gap-3 items-center group">
                    <input
                      type="text"
                      value={rr}
                      onChange={(e) => updateString(setReceptionRequests, idx, e.target.value)}
                      placeholder="Reception portrait or moment..."
                      className="flex-1 bg-transparent border-b py-2.5 text-sm font-jakarta outline-none transition-colors placeholder:opacity-40"
                      style={{ borderColor: '#D5C8BF', color: '#2A2420' }}
                      onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
                      onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
                    />
                    {receptionRequests.length > 1 && (
                      <button
                        onClick={() => removeString(setReceptionRequests, idx)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: '#C4837A' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addString(setReceptionRequests)}
                  className="flex items-center gap-2 mt-2 font-jakarta text-sm transition-opacity hover:opacity-70"
                  style={{ color: '#C4837A' }}
                >
                  <Plus size={16} /> Add request
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div className="px-6 pb-10 pt-4 max-w-lg mx-auto w-full">
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-jakarta text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
          style={{ backgroundColor: '#C4837A', color: '#FAF6F0' }}
        >
          {step < TOTAL_STEPS ? (
            <>
              Continue
              <ChevronRight size={16} />
            </>
          ) : (
            'Generate My Shot List →'
          )}
        </button>
        {(step === 2 || step === 3 || step === 4) && (
          <button
            onClick={handleNext}
            className="w-full mt-3 font-jakarta text-sm text-center transition-opacity hover:opacity-70"
            style={{ color: '#2A2420', opacity: 0.45 }}
          >
            Skip this step
          </button>
        )}
      </div>
    </div>
  );
}
