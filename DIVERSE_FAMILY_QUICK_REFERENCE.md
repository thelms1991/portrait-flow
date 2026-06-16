# Diverse Wedding Support - Quick Reference

## 🚀 Quick Start

### For Two Brides
```typescript
const weddingData: WeddingData = {
  weddingType: 'two-brides',
  partner1FirstName: 'Sarah',
  partner1Gender: 'female',
  partner2FirstName: 'Emily',
  partner2Gender: 'female',
  // ... rest of data
};
```

### For Two Grooms
```typescript
const weddingData: WeddingData = {
  weddingType: 'two-grooms',
  partner1FirstName: 'James',
  partner1Gender: 'male',
  partner2FirstName: 'Marcus',
  partner2Gender: 'male',
  // ... rest of data
};
```

### For Non-Binary
```typescript
const weddingData: WeddingData = {
  weddingType: 'non-binary',
  partner1FirstName: 'Casey',
  partner1Role: 'Partner',
  partner2FirstName: 'Riley',
  partner2Role: 'Partner',
  // ... rest of data
};
```

### For Custom Labels
```typescript
const person: Person = {
  id: '1',
  name: 'Patricia',
  relationship: 'Step-Mother',
  customLabel: 'Stepmom (Mom\'s Wife)', // Override display label
};
```

---

## 📋 Supported Relationship Types

| Type | Description | Examples |
|------|-------------|----------|
| `partner` | Generic partner | Casey, Morgan |
| `co-bride` | Second bride | Emily, Laura |
| `co-groom` | Second groom | Marcus, James |
| `mother` | Mother | "Mom", "Ma", "Mum" |
| `father` | Father | "Dad", "Pa", "Pops" |
| `co-mother` | Additional mother | "Mom 2", "Stepmom" |
| `co-father` | Additional father | "Dad 2", "Stepdad" |
| `adoptive-mother` | Adoptive mother | "Adoptive Mom" |
| `adoptive-father` | Adoptive father | "Adoptive Dad" |
| `step-mother` | Step-mother | "Stepmom" |
| `step-father` | Step-father | "Stepdad" |
| `sister` | Sister | "Sis", "Sister" |
| `brother` | Brother | "Bro", "Brother" |
| `sibling` | Sibling (generic) | "Sibling" |
| `attendant` | Wedding attendant | Any side |
| `side1-attendant` | Partner 1's attendant | - |
| `side2-attendant` | Partner 2's attendant | - |
| `best-person` | Best person role | Gender-neutral |
| `honor-attendant` | Honor attendant | Gender-neutral |
| `aunt` | Aunt | "Auntie", "Aunty" |
| `uncle` | Uncle | "Uncle", "Unk" |
| `cousin` | Cousin | "Cuz" |
| `grandparent` | Grandparent | "Grandma", "Grandpa" |

---

## 🎯 Key Differences from Traditional

| Aspect | Traditional | Diverse Support |
|--------|-----------|-----------------|
| Partners | `bride`, `groom` | `partner1`, `partner2` + custom roles |
| Attendants | `bridesmaids`, `groomsmen` | `side1Attendants`, `side2Attendants` |
| Family | `brideFamily`, `groomFamily` | `partner1Family`, `partner2Family` + `sharedFamily` |
| Parents | "Mother/Father of Bride/Groom" | `mother`, `co-mother`, `step-mother`, `adoptive-mother` |
| Custom Labels | Not supported | `person.customLabel` field |
| Family Types | Assumed traditional | `weddingType` + detection functions |

---

## 🔄 Workflow: Adding New Attendee

```typescript
// 1. Create person with flexible relationship
const newAttendee: Person = {
  id: uuid(),
  name: 'Casey',
  relationship: 'Best Person', // Not gendered!
  customLabel: undefined, // Optional
};

// 2. Add to appropriate attendant list
weddingData.side1Attendants.push(newAttendee);

// 3. Shot list auto-generates with correct labels
// No need to worry about "bridesmaid" vs "groomsman"
```

---

## 🔄 Workflow: Adding Family Members

```typescript
// Blended family with multiple parents
const parent1: Person = {
  id: uuid(),
  name: 'Margaret',
  relationship: 'Mother',
  customLabel: 'Mom',
};

const parent2: Person = {
  id: uuid(),
  name: 'Susan',
  relationship: 'Co-Mother',
  customLabel: 'Stepmom',
};

// Add to appropriate family list
weddingData.partner1Family.push(parent1);
weddingData.partner1Family.push(parent2);

// System automatically handles multiple parents!
// No assumptions about parent count or configuration
```

---

## 🏷️ Custom Label Pattern

Use custom labels for:
- **Nicknames**: `relationship: 'Mother'`, `customLabel: 'Mom'`
- **Clarification**: `relationship: 'Step-Father'`, `customLabel: 'Stepdad (Mom\'s Husband)'`
- **Special roles**: `relationship: 'Grandmother'`, `customLabel: 'Grandma (Mentor & Friend)'`
- **Relationships**: `relationship: 'Sister'`, `customLabel: 'Best Friend (Sister)'`

**Display code:**
```typescript
const label = person.customLabel || person.relationship;
```

---

## 🔍 Detecting Family Structure

```typescript
import {
  isBlendedWedding,
  hasMultipleParents,
  hasAdoptiveFamily,
  hasStepFamily,
} from '@/lib/diverseFamilyUtils';

// Check wedding complexity
if (isBlendedWedding(weddingData)) {
  // Handle complex family portraits
}

// Check specific structures
if (hasMultipleParents(weddingData.partner1Family)) {
  // Generate parent grouping shots
}

if (hasAdoptiveFamily(weddingData.partner2Family)) {
  // Mark as adoptive family in notes
}

if (hasStepFamily(weddingData.partner1Family)) {
  // Handle step-family dynamics
}
```

---

## 📤 Export Behavior

All exports automatically adapt:

### PDF Export
- Uses correct partner labels
- Groups by family side
- Includes shared family
- Respects custom labels

### Mobile Checklist
- Dynamic attendant count
- Correct family grouping
- Readable on wedding day
- Custom labels visible

### Timeline View
- No assumptions about family size
- Flexible grouping logic
- Adaptable time blocks

---

## ✅ Implementation Checklist

- [ ] Use `getPartnerLabels()` instead of hardcoding "Bride/Groom"
- [ ] Use `getAttendantLabels()` instead of hardcoding "Bridesmaids/Groomsmen"
- [ ] Check `person.customLabel` before using `person.relationship`
- [ ] Handle `sharedFamily` in addition to `partner1Family` and `partner2Family`
- [ ] Use `isBlendedWedding()` to detect complex families
- [ ] Call `migrateWeddingDataToNewFormat()` for legacy data
- [ ] Support all `RelationshipType` values in recognition
- [ ] Test with diverse family configurations

---

## 🧪 Quick Test Cases

```typescript
// Test 1: Two Brides
testWeddingType('two-brides');

// Test 2: Two Grooms
testWeddingType('two-grooms');

// Test 3: Non-Binary
testWeddingType('non-binary');

// Test 4: Multiple Parents
testMultipleParents();

// Test 5: Adoptive Family
testAdoptiveFamily();

// Test 6: Step-Family
testStepFamily();

// Test 7: Blended
testBlendedFamily();

// Test 8: Custom Labels
testCustomLabels();

// Test 9: Legacy Migration
testLegacyDataMigration();

// Test 10: All Relationships
testAllRelationshipTypes();
```

---

## 📚 Documentation Files

- **`DIVERSE_FAMILY_SUPPORT.md`** - Complete feature documentation
- **`DIVERSE_FAMILY_EXAMPLES.md`** - 6+ detailed examples with code
- **`src/lib/diverseFamilyUtils.ts`** - Utility functions
- **`src/lib/relationshipRecognition.ts`** - Enhanced relationship parser
- **`src/types/app.ts`** - Updated type definitions

---

## 🚨 Common Mistakes to Avoid

❌ **Don't:**
```typescript
// Hardcoding assumptions
const brideFamily = weddingData.brideFamily;
const groomAttendants = weddingData.groomsmen;
const motherLabel = 'Mother of Bride';
```

✅ **Do:**
```typescript
// Use dynamic labels and new fields
const partner1Family = weddingData.partner1Family || [];
const attendants = getAttendantLabels(weddingData);
const motherLabel = RelationshipRecognizer.formatLabel('mother');
```

❌ **Don't:**
```typescript
// Ignore custom labels
const display = person.relationship;
```

✅ **Do:**
```typescript
// Respect custom labels
const display = person.customLabel || person.relationship;
```

❌ **Don't:**
```typescript
// Assume single set of parents
const mother = weddingData.partner1Family.find(p => p.relationship === 'Mother');
```

✅ **Do:**
```typescript
// Handle multiple parents
const parents = weddingData.partner1Family.filter(
  p => ['Mother', 'Father', 'Parent', 'Co-Mother', 'Co-Father'].includes(p.relationship)
);
```

---

## 🎯 By Wedding Type

| Type | Partner Labels | Attendants | Family Notes |
|------|----------------|-----------|--------------|
| **traditional** | Bride, Groom | Bridesmaids, Groomsmen | Two distinct families |
| **two-brides** | Bride, Co-Bride | Attendants, Attendants | Two distinct families |
| **two-grooms** | Groom, Co-Groom | Attendants, Attendants | Two distinct families |
| **same-sex** | Based on gender | Attendants, Attendants | Can have complex families |
| **non-binary** | Partner, Partner | Attendants, Attendants | No gender assumptions |
| **custom** | Custom roles | Custom labels | Maximum flexibility |

---

## 📞 When to Use Utilities

| Utility | Use When | Example |
|---------|----------|---------|
| `getPartnerLabels()` | Displaying couple names | "Welcome, Bride & Co-Bride!" |
| `getAttendantLabels()` | Creating attendant sections | "Partner 1's Attendants" |
| `getFamilyLabels()` | Grouping family | "Emily's Family" section |
| `isBlendedWedding()` | Complex layout logic | Show "Shared Family" section |
| `hasMultipleParents()` | Special handling | Generate multiple parent combos |
| `hasAdoptiveFamily()` | Notes/context | Add adoption context to export |
| `migrateWeddingDataToNewFormat()` | Data import | Converting old data |
| `formatRelationshipDisplay()` | Display label | Showing person relationship |

---

## 🎓 Learn More

1. Read `DIVERSE_FAMILY_SUPPORT.md` for complete feature spec
2. Study `DIVERSE_FAMILY_EXAMPLES.md` for concrete examples
3. Use `src/lib/diverseFamilyUtils.ts` for helper functions
4. Check `src/lib/relationshipRecognition.ts` for all supported relationships
