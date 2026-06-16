/**
 * CoupleIntakeForm - Refactored multi-step form with separated concerns
 * This version uses a custom hook for state management and presentational step components
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { WeddingData, Person } from '@/types/app';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';
import StepWeddingInfo from './intake-steps/StepWeddingInfo';
import StepBridesmaids from './intake-steps/StepBridesmaids';
import StepGroomsmen from './intake-steps/StepGroomsmen';
import StepFamily from './intake-steps/StepFamily';
import StepSpecialGroupings from './intake-steps/StepSpecialGroupings';
import StepReceptionRequests from './intake-steps/StepReceptionRequests';

interface CoupleIntakeFormProps {
  onComplete: (data: WeddingData) => void;
  onBack: () => void;
}

const TOTAL_STEPS = 6;

const stepTitles = [
  'Names of the Happy Couple',
  'The Bridesmaids',
  'The Groomsmen',
  'Immediate Family',
  'Special Groupings',
  'Reception Requests',
];

export default function CoupleIntakeForm({ onComplete, onBack }: CoupleIntakeFormProps) {
  const [step, setStep] = useState(1);
  const form = useCoupleIntakeForm();

  const stepSubtitles = [
    'These names will be used throughout your entire shot list.',
    `Who will be standing by ${form.brideFirstName || 'the bride'}?`,
    `Who will be standing by ${form.groomFirstName || 'the groom'}?`,
    'Add immediate family from both sides.',
    'Any specific groupings you want to make sure we capture?',
    'Any special portraits you want at the reception?',
  ];

  const handleNext = () => {
    if (!form.validate(step)) return;
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      form.submit(onComplete);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onBack();
    } else {
      setStep((s) => s - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepWeddingInfo
            form={form}
            onBrideFirstNameChange={form.setBrideFirstName}
            onBrideLastNameChange={form.setBrideLastName}
            onGroomFirstNameChange={form.setGroomFirstName}
            onGroomLastNameChange={form.setGroomLastName}
            onWeddingDateChange={form.setWeddingDate}
            onCeremonyLocationChange={form.setCeremonyLocation}
            onReceptionLocationChange={form.setReceptionLocation}
            errors={form.errors}
          />
        );
      case 2:
        return <StepBridesmaids form={form} />;
      case 3:
        return <StepGroomsmen form={form} />;
      case 4:
        return <StepFamily form={form} />;
      case 5:
        return <StepSpecialGroupings form={form} />;
      case 6:
        return <StepReceptionRequests form={form} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#FAF6F0' }}
    >
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={handleBack}
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
            {renderStep()}
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
