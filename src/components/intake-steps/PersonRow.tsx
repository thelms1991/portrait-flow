import { Trash2 } from 'lucide-react';
import { Person } from '@/types/app';

interface PersonRowProps {
  person: Person;
  onChange: (updated: Person) => void;
  onRemove: () => void;
  namePlaceholder?: string;
  relationshipPlaceholder?: string;
  relationshipOptions?: string[];
}

export function PersonRow({
  person,
  onChange,
  onRemove,
  namePlaceholder,
  relationshipPlaceholder,
  relationshipOptions,
}: PersonRowProps) {
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
        {relationshipOptions ? (
          <select
            value={person.relationship}
            onChange={(e) => onChange({ ...person, relationship: e.target.value })}
            className="w-40 bg-transparent border-b py-2.5 text-sm font-jakarta outline-none transition-colors"
            style={{
              borderColor: '#D5C8BF',
              color: '#2A2420',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
            onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
          >
            <option value="">Select role...</option>
            {relationshipOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
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
        )}
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
