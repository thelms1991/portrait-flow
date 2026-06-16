import { Plus } from 'lucide-react';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';
import { PersonRow } from './PersonRow';

const GROOMSMAN_ROLES = [
  'Best Man',
  'Groomsman',
  'Ring Bearer',
  'Junior Groomsman',
  'Other',
];

interface StepGroomsmenProps {
  form: ReturnType<typeof useCoupleIntakeForm>;
}

export default function StepGroomsmen({ form }: StepGroomsmenProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3 mb-2">
        <span className="flex-1 font-jakarta text-xs tracking-widest uppercase opacity-40" style={{ color: '#2A2420' }}>
          Name
        </span>
        <span className="w-40 font-jakarta text-xs tracking-widest uppercase opacity-40" style={{ color: '#2A2420' }}>
          Role
        </span>
        <span className="w-7" />
      </div>
      {form.groomsmen.map((gm) => (
        <PersonRow
          key={gm.id}
          person={gm}
          onChange={(u) => form.updatePerson(form.setGroomsmen, gm.id, u)}
          onRemove={() => form.removePerson(form.setGroomsmen, gm.id)}
          namePlaceholder="e.g. James"
          relationshipOptions={GROOMSMAN_ROLES}
        />
      ))}
      <button
        onClick={() => form.addPerson(form.setGroomsmen)}
        className="flex items-center gap-2 mt-2 font-jakarta text-sm transition-opacity hover:opacity-70"
        style={{ color: '#C4837A' }}
      >
        <Plus size={16} /> Add groomsman
      </button>
    </div>
  );
}
