import { Plus } from 'lucide-react';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';
import { PersonRow } from './PersonRow';

const BRIDESMAID_ROLES = [
  'Maid of Honor',
  'Matron of Honor',
  'Bridesmaid',
  'Junior Bridesmaid',
  'Flower Girl',
  'Other',
];

interface StepBridesmaidProps {
  form: ReturnType<typeof useCoupleIntakeForm>;
}

export default function StepBridesmaids({ form }: StepBridesmaidProps) {
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
      {form.bridesmaids.map((bm) => (
        <PersonRow
          key={bm.id}
          person={bm}
          onChange={(u) => form.updatePerson(form.setBridesmaids, bm.id, u)}
          onRemove={() => form.removePerson(form.setBridesmaids, bm.id)}
          namePlaceholder="e.g. Sarah"
          relationshipOptions={BRIDESMAID_ROLES}
        />
      ))}
      <button
        onClick={() => form.addPerson(form.setBridesmaids)}
        className="flex items-center gap-2 mt-2 font-jakarta text-sm transition-opacity hover:opacity-70"
        style={{ color: '#C4837A' }}
      >
        <Plus size={16} /> Add bridesmaid
      </button>
    </div>
  );
}
