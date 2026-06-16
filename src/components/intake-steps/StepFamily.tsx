import { Plus } from 'lucide-react';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';
import { PersonRow } from './PersonRow';

const FAMILY_RELATIONSHIPS = [
  'Mother',
  'Father',
  'Brother',
  'Sister',
  'Grandmother',
  'Grandfather',
  'Aunt',
  'Uncle',
  'Cousin',
  'Family Friend',
  'Other',
];

interface StepFamilyProps {
  form: ReturnType<typeof useCoupleIntakeForm>;
}

export default function StepFamily({ form }: StepFamilyProps) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block font-jakarta text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A96E' }}>
          {form.brideFirstName || 'Bride'}'s Family
        </label>
        <div className="space-y-3">
          {form.brideFamily.map((fm) => (
            <PersonRow
              key={fm.id}
              person={fm}
              onChange={(u) => form.updatePerson(form.setBrideFamily, fm.id, u)}
              onRemove={() => form.removePerson(form.setBrideFamily, fm.id)}
              namePlaceholder="e.g. Margaret"
              relationshipOptions={FAMILY_RELATIONSHIPS}
            />
          ))}
          <button
            onClick={() => form.addPerson(form.setBrideFamily)}
            className="flex items-center gap-2 font-jakarta text-sm transition-opacity hover:opacity-70"
            style={{ color: '#C4837A' }}
          >
            <Plus size={16} /> Add family member
          </button>
        </div>
      </div>
      <div>
        <label className="block font-jakarta text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A96E' }}>
          {form.groomFirstName || 'Groom'}'s Family
        </label>
        <div className="space-y-3">
          {form.groomFamily.map((fm) => (
            <PersonRow
              key={fm.id}
              person={fm}
              onChange={(u) => form.updatePerson(form.setGroomFamily, fm.id, u)}
              onRemove={() => form.removePerson(form.setGroomFamily, fm.id)}
              namePlaceholder="e.g. Robert"
              relationshipOptions={FAMILY_RELATIONSHIPS}
            />
          ))}
          <button
            onClick={() => form.addPerson(form.setGroomFamily)}
            className="flex items-center gap-2 font-jakarta text-sm transition-opacity hover:opacity-70"
            style={{ color: '#C4837A' }}
          >
            <Plus size={16} /> Add family member
          </button>
        </div>
      </div>
    </div>
  );
}
