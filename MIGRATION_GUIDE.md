# Migration Guide: Legacy to Diverse Wedding Support

## Overview

This guide helps you update existing components and code to use the new diverse wedding support system while maintaining backward compatibility.

---

## Phase 1: Minimal Changes (Works Today)

No changes needed! All existing code continues to work:

```typescript
// This still works exactly as before
const weddingData: WeddingData = {
  brideFirstName: 'Jennifer',
  brideLastName: 'Davis',
  groomFirstName: 'Michael',
  groomLastName: 'Johnson',
  bridesmaids: [...],
  groomsmen: [...],
  brideFamily: [...],
  groomFamily: [...],
  // ... rest
};
```

**Action:** No code changes required to maintain functionality.

---

## Phase 2: Adding Wedding Type (Recommended)

Add wedding type detection to your components:

### Before
```typescript
// Hardcoded labels
export function CoupleHeader({ weddingData }: Props) {
  return (
    <h1>
      {weddingData.brideFirstName} & {weddingData.groomFirstName}
    </h1>
  );
}
```

### After
```typescript
import { getPartnerLabels } from '@/lib/diverseFamilyUtils';

export function CoupleHeader({ weddingData }: Props) {
  const { partner1Label, partner2Label } = getPartnerLabels(weddingData);
  
  return (
    <h1>
      {weddingData.partner1FirstName || weddingData.brideFirstName} ({partner1Label}) &{' '}
      {weddingData.partner2FirstName || weddingData.groomFirstName} ({partner2Label})
    </h1>
  );
}
```

---

## Phase 3: Updating Forms (Medium Effort)

### Update Wedding Type Selection

```typescript
// Add to role selection or intake flow
import { WeddingType } from '@/types/app';

export function WeddingTypeSelector() {
  const [type, setType] = React.useState<WeddingType>('traditional');

  return (
    <div>
      <h2>Wedding Type</h2>
      <select value={type} onChange={(e) => setType(e.target.value as WeddingType)}>
        <option value="traditional">Traditional (Bride & Groom)</option>
        <option value="two-brides">Two Brides</option>
        <option value="two-grooms">Two Grooms</option>
        <option value="same-sex">Same-Sex (Custom)</option>
        <option value="non-binary">Non-Binary Partners</option>
        <option value="custom">Custom Roles</option>
      </select>
    </div>
  );
}
```

### Update Partner Input Fields

```typescript
// Old approach
export function BrideGroomStep() {
  return (
    <>
      <input placeholder="Bride First Name" />
      <input placeholder="Bride Last Name" />
      <input placeholder="Groom First Name" />
      <input placeholder="Groom Last Name" />
    </>
  );
}

// New approach - flexible
export function PartnersStep({ weddingType }: Props) {
  const labels = getPartnerLabels({ weddingType } as WeddingData);

  return (
    <>
      <input placeholder={`${labels.partner1Label} First Name`} />
      <input placeholder={`${labels.partner1Label} Last Name`} />
      <input placeholder={`${labels.partner2Label} First Name`} />
      <input placeholder={`${labels.partner2Label} Last Name`} />
    </>
  );
}
```

---

## Phase 4: Updating Family Handling (Important)

### Update Family Addition Form

```typescript
// Old - hardcoded family sides
export function AddFamilyMember() {
  const [side, setSide] = React.useState<'bride' | 'groom'>('bride');
  const [relationship, setRelationship] = React.useState('');

  const add = () => {
    if (side === 'bride') {
      weddingData.brideFamily.push({
        id: uuid(),
        name: 'Name',
        relationship,
      });
    }
  };

  return <form>{/* ... */}</form>;
}

// New - flexible approach
import { getFamilyLabels, getPersonDisplayLabel } from '@/lib/diverseFamilyUtils';

export function AddFamilyMember({ weddingData }: Props) {
  const [side, setSide] = React.useState<'family1' | 'family2' | 'shared'>('family1');
  const [relationship, setRelationship] = React.useState('');
  const [customLabel, setCustomLabel] = React.useState('');

  const familyLabels = getFamilyLabels(weddingData);
  const sideOptions = [
    { value: 'family1', label: familyLabels.family1Label },
    { value: 'family2', label: familyLabels.family2Label },
    { value: 'shared', label: familyLabels.sharedFamilyLabel },
  ];

  const add = () => {
    const person: Person = {
      id: uuid(),
      name: 'Name',
      relationship,
      customLabel: customLabel || undefined,
    };

    if (side === 'family1') {
      weddingData.partner1Family.push(person);
    } else if (side === 'family2') {
      weddingData.partner2Family.push(person);
    } else {
      weddingData.sharedFamily?.push(person);
    }
  };

  return (
    <form>
      <select value={side} onChange={(e) => setSide(e.target.value as any)}>
        {sideOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        placeholder="Relationship (e.g., Mother, Sister, Aunt)"
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
      />
      <input
        placeholder="Custom label (optional, e.g., 'Mom')"
        value={customLabel}
        onChange={(e) => setCustomLabel(e.target.value)}
      />
      <button onClick={add}>Add Family Member</button>
    </form>
  );
}
```

### Update Attendants Form

```typescript
// Old - gendered approach
export function AddAttendant({ side }: { side: 'bride' | 'groom' }) {
  return (
    <form>
      <input placeholder={side === 'bride' ? 'Bridesmaid Name' : 'Groomsman Name'} />
      <select>
        <option>Bridesmaid</option>
        <option>Maid of Honor</option>
      </select>
    </form>
  );
}

// New - inclusive approach
export function AddAttendant({ weddingData, side }: Props) {
  const labels = getAttendantLabels(weddingData);
  const sideLabel = side === 'side1' ? labels.side1AttendantLabel : labels.side2AttendantLabel;

  return (
    <form>
      <input placeholder={`${sideLabel} Name`} />
      <select>
        <option>Attendant</option>
        <option>Best Person</option>
        <option>Honor Attendant</option>
        <option>Custom Role...</option>
      </select>
    </form>
  );
}
```

---

## Phase 5: Updating Display Components

### Update Shot List Display

```typescript
// Old - assumes bride/groom structure
export function ShotCard({ shot }: Props) {
  // Hard to show custom labels or different structures
  return <div>{shot.description}</div>;
}

// New - flexible
import { formatRelationshipDisplay } from '@/lib/diverseFamilyUtils';

export function ShotCard({ shot, person, context }: Props) {
  const displayLabel = person 
    ? formatRelationshipDisplay(person, weddingData, context)
    : shot.description;

  return <div>{displayLabel}</div>;
}
```

### Update Family Section Headers

```typescript
// Old - hardcoded
export function FamilySections() {
  return (
    <>
      <section>
        <h3>Bride's Family</h3>
      </section>
      <section>
        <h3>Groom's Family</h3>
      </section>
    </>
  );
}

// New - dynamic
import { getFamilyLabels, getAllFamilyMembers } from '@/lib/diverseFamilyUtils';

export function FamilySections({ weddingData }: Props) {
  const labels = getFamilyLabels(weddingData);
  const { family1, family2, shared } = getAllFamilyMembers(weddingData);

  return (
    <>
      {family1.length > 0 && (
        <section>
          <h3>{labels.family1Label}</h3>
          {family1.map((person) => (
            <PersonRow key={person.id} person={person} />
          ))}
        </section>
      )}
      {family2.length > 0 && (
        <section>
          <h3>{labels.family2Label}</h3>
          {family2.map((person) => (
            <PersonRow key={person.id} person={person} />
          ))}
        </section>
      )}
      {shared.length > 0 && (
        <section>
          <h3>{labels.sharedFamilyLabel}</h3>
          {shared.map((person) => (
            <PersonRow key={person.id} person={person} />
          ))}
        </section>
      )}
    </>
  );
}
```

---

## Phase 6: Updating Exports (Recommended)

### PDF Export Update

```typescript
// Old - hardcoded structure
export function generatePDF(weddingData: WeddingData) {
  return `
    <h1>Wedding Portrait Shot List</h1>
    <h2>Bride: ${weddingData.brideFirstName}</h2>
    <h2>Groom: ${weddingData.groomFirstName}</h2>
    <h3>Bride's Family</h3>
    ${weddingData.brideFamily.map(...)}
  `;
}

// New - flexible
import { getPartnerLabels, getFamilyLabels, getAllFamilyMembers } from '@/lib/diverseFamilyUtils';

export function generatePDF(weddingData: WeddingData) {
  const partnerLabels = getPartnerLabels(weddingData);
  const familyLabels = getFamilyLabels(weddingData);
  const { family1, family2, shared } = getAllFamilyMembers(weddingData);

  return `
    <h1>Wedding Portrait Shot List</h1>
    <h2>${partnerLabels.partner1Label}: ${weddingData.partner1FirstName || weddingData.brideFirstName}</h2>
    <h2>${partnerLabels.partner2Label}: ${weddingData.partner2FirstName || weddingData.groomFirstName}</h2>
    ${family1.length > 0 ? `<h3>${familyLabels.family1Label}</h3>${family1.map(...)}` : ''}
    ${family2.length > 0 ? `<h3>${familyLabels.family2Label}</h3>${family2.map(...)}` : ''}
    ${shared.length > 0 ? `<h3>${familyLabels.sharedFamilyLabel}</h3>${shared.map(...)}` : ''}
  `;
}
```

### Mobile Checklist Update

```typescript
// Old - assumes standard structure
function getMobileChecklist(weddingData: WeddingData) {
  const items = [
    ...weddingData.bridesmaids,
    ...weddingData.groomsmen,
    ...weddingData.brideFamily,
    ...weddingData.groomFamily,
  ];
  // ...
}

// New - supports all structures
import { getAllFamilyMembers, getAttendantLabels } from '@/lib/diverseFamilyUtils';

function getMobileChecklist(weddingData: WeddingData) {
  const { family1, family2, shared } = getAllFamilyMembers(weddingData);
  const attendantLabels = getAttendantLabels(weddingData);

  const items = [
    ...(weddingData.side1Attendants || weddingData.bridesmaids || []),
    ...(weddingData.side2Attendants || weddingData.groomsmen || []),
    ...family1,
    ...family2,
    ...shared,
  ];
  // ...
}
```

---

## Phase 7: Testing Different Scenarios

### Add Test Cases

```typescript
// Test traditional wedding (unchanged)
test('traditional wedding still works', () => {
  const data = createTraditionalWedding();
  expect(data.brideFirstName).toBeDefined();
  expect(data.groomFirstName).toBeDefined();
});

// Test two brides
test('two brides wedding', () => {
  const data = createTwoBridesWedding();
  expect(data.weddingType).toBe('two-brides');
  const labels = getPartnerLabels(data);
  expect(labels.partner1Label).toBe('Bride');
  expect(labels.partner2Label).toBe('Co-Bride');
});

// Test blended family
test('blended family with multiple parents', () => {
  const data = createBlendedWedding();
  expect(isBlendedWedding(data)).toBe(true);
  expect(hasMultipleParents(data.partner1Family)).toBe(true);
});

// Test custom labels
test('custom relationship labels respected', () => {
  const person: Person = {
    id: '1',
    name: 'Patricia',
    relationship: 'Step-Mother',
    customLabel: 'Stepmom (Mom\'s Wife)',
  };
  expect(person.customLabel).toBeDefined();
});
```

---

## Phase 8: Migration Utilities

### Migrate Legacy Data

```typescript
import { migrateWeddingDataToNewFormat } from '@/lib/diverseFamilyUtils';

// When loading old data from storage
const oldData = loadFromStorage('wedding');
const newData = migrateWeddingDataToNewFormat(oldData);

// Now you can use new fields while keeping old ones
console.log(newData.partner1FirstName); // From brideFirstName
console.log(newData.side1Attendants); // From bridesmaids
```

### Create Data Adapter

```typescript
export function weddingDataAdapter(data: any): WeddingData {
  // Try new format first
  if (data.partner1FirstName) {
    return data as WeddingData;
  }

  // Fall back to migration
  return migrateWeddingDataToNewFormat(data);
}

// Use everywhere you load data
const weddingData = weddingDataAdapter(loadData());
```

---

## Migration Checklist

### Quick (Day 1)
- [ ] Read documentation
- [ ] No code changes needed (backward compatible)
- [ ] Test existing workflows still work

### Medium (Week 1)
- [ ] Add wedding type field
- [ ] Update labels to use `getPartnerLabels()`
- [ ] Update attendant labels
- [ ] Test with different wedding types

### Comprehensive (Week 2-3)
- [ ] Update all family handling code
- [ ] Support custom relationship labels
- [ ] Update PDF/export generation
- [ ] Update mobile checklist
- [ ] Update timeline view
- [ ] Add comprehensive tests

### Optional (Week 4+)
- [ ] UI improvements for wedding type selection
- [ ] Enhanced form validation
- [ ] Additional export formats
- [ ] Analytics for diverse families

---

## Troubleshooting

### Issue: "Property 'brideFirstName' does not exist"

**Solution:** Use adapter pattern:
```typescript
const brideName = weddingData.brideFirstName || weddingData.partner1FirstName;
```

### Issue: Attendants not showing

**Solution:** Check both old and new fields:
```typescript
const attendants = weddingData.side1Attendants || weddingData.bridesmaids || [];
```

### Issue: Custom labels not appearing

**Solution:** Remember to check `customLabel` first:
```typescript
const label = person.customLabel || person.relationship;
```

### Issue: Blended families not grouping correctly

**Solution:** Use utility functions:
```typescript
if (isBlendedWedding(weddingData)) {
  // Handle complex family structure
}
```

---

## Common Patterns

### Pattern 1: Safely Access New/Old Fields
```typescript
function getPartner1Name(data: WeddingData): string {
  return data.partner1FirstName || data.brideFirstName || '';
}

function getAllAttendants(data: WeddingData): Person[] {
  return data.side1Attendants || data.bridesmaids || [];
}
```

### Pattern 2: Dynamic Labels
```typescript
function getSectionHeader(data: WeddingData, index: 0 | 1 | 2): string {
  if (index === 0) return getFamilyLabels(data).family1Label;
  if (index === 1) return getFamilyLabels(data).family2Label;
  return getFamilyLabels(data).sharedFamilyLabel;
}
```

### Pattern 3: Safe Enumeration
```typescript
function forAllFamilyMembers(
  data: WeddingData,
  callback: (person: Person, side: 'family1' | 'family2' | 'shared') => void
) {
  const { family1, family2, shared } = getAllFamilyMembers(data);
  family1.forEach((p) => callback(p, 'family1'));
  family2.forEach((p) => callback(p, 'family2'));
  shared.forEach((p) => callback(p, 'shared'));
}
```

---

## Timeline

| Phase | Effort | Impact | Timeline |
|-------|--------|--------|----------|
| Phase 1 | None | 0% | Already done |
| Phase 2 | Low | 20% | Days |
| Phase 3 | Medium | 40% | 1-2 weeks |
| Phase 4 | Medium | 60% | 1-2 weeks |
| Phase 5 | Medium | 80% | 1-2 weeks |
| Phase 6 | Low | 90% | Days |
| Phase 7 | Low | 95% | Days |
| Phase 8 | Low | 100% | Days |

---

## Resources

- `DIVERSE_FAMILY_SUPPORT.md` - Complete specification
- `DIVERSE_FAMILY_EXAMPLES.md` - Real-world examples
- `DIVERSE_FAMILY_QUICK_REFERENCE.md` - Quick lookup
- `src/lib/diverseFamilyUtils.ts` - Utility functions
- `src/lib/relationshipRecognition.ts` - Relationship engine
- `src/types/app.ts` - Type definitions
