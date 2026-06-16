import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';

interface StepWeddingInfoProps {
  form: ReturnType<typeof useCoupleIntakeForm>;
  onBrideFirstNameChange: (value: string) => void;
  onBrideLastNameChange: (value: string) => void;
  onGroomFirstNameChange: (value: string) => void;
  onGroomLastNameChange: (value: string) => void;
  onWeddingDateChange: (value: string) => void;
  onCeremonyLocationChange: (value: string) => void;
  onReceptionLocationChange: (value: string) => void;
  errors: Record<string, string>;
}

export default function StepWeddingInfo({
  form,
  onBrideFirstNameChange,
  onBrideLastNameChange,
  onGroomFirstNameChange,
  onGroomLastNameChange,
  onWeddingDateChange,
  onCeremonyLocationChange,
  onReceptionLocationChange,
  errors,
}: StepWeddingInfoProps) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block font-jakarta text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A96E' }}>
          Bride / Partner 1
        </label>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={form.brideFirstName}
              onChange={(e) => onBrideFirstNameChange(e.target.value)}
              placeholder="First name"
              className="w-full bg-transparent border-b py-3 text-base font-jakarta outline-none transition-colors placeholder:opacity-40"
              style={{ borderColor: errors.brideFirstName ? '#E07070' : '#D5C8BF', color: '#2A2420' }}
              onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
              onBlur={(e) => (e.target.style.borderColor = errors.brideFirstName ? '#E07070' : '#D5C8BF')}
            />
            {errors.brideFirstName && (
              <p className="font-jakarta text-xs mt-1" style={{ color: '#E07070' }}>
                {errors.brideFirstName}
              </p>
            )}
          </div>
          <input
            type="text"
            value={form.brideLastName}
            onChange={(e) => onBrideLastNameChange(e.target.value)}
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
              value={form.groomFirstName}
              onChange={(e) => onGroomFirstNameChange(e.target.value)}
              placeholder="First name"
              className="w-full bg-transparent border-b py-3 text-base font-jakarta outline-none transition-colors placeholder:opacity-40"
              style={{ borderColor: errors.groomFirstName ? '#E07070' : '#D5C8BF', color: '#2A2420' }}
              onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
              onBlur={(e) => (e.target.style.borderColor = errors.groomFirstName ? '#E07070' : '#D5C8BF')}
            />
            {errors.groomFirstName && (
              <p className="font-jakarta text-xs mt-1" style={{ color: '#E07070' }}>
                {errors.groomFirstName}
              </p>
            )}
          </div>
          <input
            type="text"
            value={form.groomLastName}
            onChange={(e) => onGroomLastNameChange(e.target.value)}
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
          Wedding Date
        </label>
        <input
          type="date"
          value={form.weddingDate}
          onChange={(e) => onWeddingDateChange(e.target.value)}
          placeholder="Select date"
          className="w-full bg-transparent border-b py-3 text-base font-jakarta outline-none transition-colors placeholder:opacity-40"
          style={{ borderColor: '#D5C8BF', color: '#2A2420' }}
          onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
          onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
        />
      </div>
      <div>
        <label className="block font-jakarta text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A96E' }}>
          Ceremony Location
        </label>
        <input
          type="text"
          value={form.ceremonyLocation}
          onChange={(e) => onCeremonyLocationChange(e.target.value)}
          placeholder="Church, venue name, etc."
          className="w-full bg-transparent border-b py-3 text-base font-jakarta outline-none transition-colors placeholder:opacity-40"
          style={{ borderColor: '#D5C8BF', color: '#2A2420' }}
          onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
          onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
        />
      </div>
      <div>
        <label className="block font-jakarta text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A96E' }}>
          Reception Location
        </label>
        <input
          type="text"
          value={form.receptionLocation}
          onChange={(e) => onReceptionLocationChange(e.target.value)}
          placeholder="Venue name, ballroom, etc."
          className="w-full bg-transparent border-b py-3 text-base font-jakarta outline-none transition-colors placeholder:opacity-40"
          style={{ borderColor: '#D5C8BF', color: '#2A2420' }}
          onFocus={(e) => (e.target.style.borderColor = '#C4837A')}
          onBlur={(e) => (e.target.style.borderColor = '#D5C8BF')}
        />
      </div>
    </div>
  );
}
