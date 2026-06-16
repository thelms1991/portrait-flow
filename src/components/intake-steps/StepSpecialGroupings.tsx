import { Plus, Trash2 } from 'lucide-react';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';

interface StepSpecialGroupingsProps {
  form: ReturnType<typeof useCoupleIntakeForm>;
}

export default function StepSpecialGroupings({ form }: StepSpecialGroupingsProps) {
  return (
    <div className="space-y-3">
      <p className="font-jakarta text-sm mb-4" style={{ color: '#2A2420', opacity: 0.5 }}>
        e.g. "Bride + College friends", "Groom + Cousins", etc.
      </p>
      {form.specialGroupings.map((sg, idx) => (
        <div key={idx} className="flex gap-3 items-center group">
          <input
            type="text"
            value={sg}
            onChange={(e) => form.updateString(form.setSpecialGroupings, idx, e.target.value)}
            placeholder="Describe the group..."
            className="flex-1 bg-transparent border-b py-2.5 text-sm font-jakarta outline-none transition-colors placeholder:opacity-40"
            style={{ borderColor: '#D5C8BF', color: '#2A2420' }}
            onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
            onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
          />
          {form.specialGroupings.length > 1 && (
            <button
              onClick={() => form.removeString(form.setSpecialGroupings, idx)}
              className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: '#C4837A' }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => form.addString(form.setSpecialGroupings)}
        className="flex items-center gap-2 mt-2 font-jakarta text-sm transition-opacity hover:opacity-70"
        style={{ color: '#C4837A' }}
      >
        <Plus size={16} /> Add grouping
      </button>
    </div>
  );
}
