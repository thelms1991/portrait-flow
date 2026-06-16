import { Plus, Trash2 } from 'lucide-react';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';

interface StepReceptionRequestsProps {
  form: ReturnType<typeof useCoupleIntakeForm>;
}

export default function StepReceptionRequests({ form }: StepReceptionRequestsProps) {
  return (
    <div className="space-y-3">
      <p className="font-jakarta text-sm mb-4" style={{ color: '#2A2420', opacity: 0.5 }}>
        e.g. "First dance", "Table shots", "Couple with venue"
      </p>
      {form.receptionRequests.map((rr, idx) => (
        <div key={idx} className="flex gap-3 items-center group">
          <input
            type="text"
            value={rr}
            onChange={(e) => form.updateString(form.setReceptionRequests, idx, e.target.value)}
            placeholder="Reception portrait or moment..."
            className="flex-1 bg-transparent border-b py-2.5 text-sm font-jakarta outline-none transition-colors placeholder:opacity-40"
            style={{ borderColor: '#D5C8BF', color: '#2A2420' }}
            onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
            onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
          />
          {form.receptionRequests.length > 1 && (
            <button
              onClick={() => form.removeString(form.setReceptionRequests, idx)}
              className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: '#C4837A' }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => form.addString(form.setReceptionRequests)}
        className="flex items-center gap-2 mt-2 font-jakarta text-sm transition-opacity hover:opacity-70"
        style={{ color: '#C4837A' }}
      >
        <Plus size={16} /> Add request
      </button>
    </div>
  );
}
