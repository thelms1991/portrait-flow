# Diverse Wedding Families Support

## Overview

The Wedding Portrait Shotlist Builder now fully supports diverse family structures and relationship configurations. No family structure is hardcoded or assumed to be "traditional."

## Supported Wedding Types

### 1. **Same-Sex Weddings**
- Two brides: Both partners labeled as "Bride" and "Co-Bride"
- Two grooms: Both partners labeled as "Groom" and "Co-Groom"
- Partners with custom labels: Use `partner1Role` and `partner2Role`

### 2. **Non-Binary Weddings**
- Partners of any gender identity
- Custom gender fields: `male`, `female`, `non-binary`
- Generic "Partner" labels available

### 3. **Blended/Complex Family Structures**
- Multiple parents per partner (e.g., divorced parents, same-sex parents)
- Step-parents and step-siblings
- Adoptive family members
- Shared family members (members belonging to both families)
- Extended family with flexible relationship labels

### 4. **Traditional Weddings**
- Backward compatible with existing "Bride" and "Groom" terminology
- Still fully supported but never assumed

## Data Structure

### WeddingData Type
```typescript
interface WeddingData {
  weddingType: 'traditional' | 'same-sex' | 'two-brides' | 'two-grooms' | 'non-binary' | 'custom';
  
  // Primary partners (not gendered terms)
  partner1FirstName: string;
  partner1LastName: string;
  partner1Role?: string; // Custom role (default: determined by weddingType)
  partner1Gender?: 'male' | 'female' | 'non-binary';
  
  partner2FirstName: string;
  partner2LastName: string;
  partner2Role?: string; // Custom role (default: determined by weddingType)
  partner2Gender?: 'male' | 'female' | 'non-binary';
  
  // Family structures (not gendered)
  side1Attendants: Person[];       // Replaces bridesmaids
  side2Attendants: Person[];       // Replaces groomsmen
  partner1Family: Person[];        // Replaces brideFamily
  partner2Family: Person[];        // Replaces groomFamily
  sharedFamily?: Person[];         // New: For shared family members
  
  // Backward compatible fields (still available)
  brideFirstName?: string;
  brideLastName?: string;
  groomFirstName?: string;
  groomLastName?: string;
  bridesmaids?: Person[];
  groomsmen?: Person[];
  brideFamily?: Person[];
  groomFamily?: Person[];
}
```

### Person Type with Customization
```typescript
interface Person {
  id: string;
  name: string;
  relationship: string;
  customLabel?: string; // Optional custom label for display
}
```

## Relationship Types Supported

### Primary Partners
- `partner` - Generic partner
- `co-bride` - Second bride
- `co-groom` - Second groom
- `non-binary-partner` - Non-binary partner
- `bride` / `groom` - Traditional (still supported)

### Parents (All Combinations)
- `mother`, `father`, `parent` - Generic parents
- `co-mother`, `co-father`, `co-parent` - Additional parent figures
- `step-mother`, `step-father`, `step-parent` - Step-parents
- `adoptive-mother`, `adoptive-father`, `adoptive-parent` - Adoptive parents
- `mother-of-bride`, `father-of-bride` - Traditional (backward compatible)
- `mother-of-groom`, `father-of-groom` - Traditional (backward compatible)

### Siblings
- `sibling`, `sister`, `brother` - Generic siblings
- `step-sibling`, `step-sister`, `step-brother` - Step-siblings

### Wedding Attendants (Not Gendered)
- `attendant` - Generic attendant
- `side1-attendant` - Partner 1's attendant
- `side2-attendant` - Partner 2's attendant
- `bridesmaid`, `groomsman` - Traditional (still recognized)
- `best-person`, `honor-attendant` - Inclusive alternatives

### Extended Family
- All extended family relationships support "of-partner1" and "of-partner2" variants
- Example: `aunt-of-partner1`, `uncle-of-partner2`

## Usage Examples

### Example 1: Two Brides
```typescript
const weddingData: WeddingData = {
  weddingType: 'two-brides',
  partner1FirstName: 'Sarah',
  partner1LastName: 'Smith',
  partner1Gender: 'female',
  partner2FirstName: 'Emily',
  partner2LastName: 'Jones',
  partner2Gender: 'female',
  
  side1Attendants: [{ id: '1', name: 'Alex', relationship: 'Best Person' }],
  side2Attendants: [{ id: '2', name: 'Jordan', relationship: 'Honor Attendant' }],
  
  partner1Family: [
    { id: '3', name: 'Margaret', relationship: 'Mother' },
    { id: '4', name: 'Patricia', relationship: 'Co-Mother' },
  ],
  partner2Family: [
    { id: '5', name: 'Robert', relationship: 'Father' },
  ],
  // ...
};
```

### Example 2: Non-Binary Wedding
```typescript
const weddingData: WeddingData = {
  weddingType: 'non-binary',
  partner1FirstName: 'Casey',
  partner1Role: 'Partner', // Custom role
  partner2FirstName: 'Morgan',
  partner2Role: 'Partner', // Custom role
  // ... families with any relationship types
};
```

### Example 3: Blended Family
```typescript
const weddingData: WeddingData = {
  weddingType: 'same-sex',
  partner1Family: [
    { id: '1', name: 'Mom 1', relationship: 'Mother' },
    { id: '2', name: 'Mom 2', relationship: 'Co-Mother' },
    { id: '3', name: 'Stepdad', relationship: 'Step-Father' },
  ],
  sharedFamily: [
    { id: '4', name: 'Grandma', relationship: 'Grandmother' },
  ],
  // ...
};
```

### Example 4: Custom Relationship Label
```typescript
const familyMember: Person = {
  id: '123',
  name: 'Terry',
  relationship: 'Parent', // Recognized as parent
  customLabel: 'Aunt (Mom\'s Friend)', // Custom display label
};
```

## Utility Functions

### `diverseFamilyUtils.ts`

#### Get Partner Labels
```typescript
const labels = getPartnerLabels(weddingData);
// Returns: { partner1Label: 'Bride', partner2Label: 'Co-Bride' }
```

#### Get Attendant Labels
```typescript
const labels = getAttendantLabels(weddingData);
// Returns: { side1AttendantLabel: 'Bride Attendant', ... }
```

#### Get Family Labels
```typescript
const labels = getFamilyLabels(weddingData);
// Returns: { family1Label: 'Sarah\'s Family', family2Label: 'Emily\'s Family', ... }
```

#### Format Relationship Display
```typescript
const display = formatRelationshipDisplay(person, weddingData, 'family1');
// Returns formatted relationship with context
```

#### Detect Complex Families
```typescript
if (hasMultipleParents(family)) { ... }
if (hasAdoptiveFamily(family)) { ... }
if (hasStepFamily(family)) { ... }
if (isBlendedWedding(weddingData)) { ... }
```

#### Migrate Legacy Data
```typescript
const newData = migrateWeddingDataToNewFormat(legacyWeddingData);
// Automatically converts old bride/groom format to new partner format
```

## Relationship Recognition

The `RelationshipRecognizer` class intelligently parses natural language input:

```typescript
// Recognizes multiple formats for the same relationship
RelationshipRecognizer.recognize('Mother'); // ✓ Recognized
RelationshipRecognizer.recognize('Mom'); // ✓ Recognized
RelationshipRecognizer.recognize('Co-Mother'); // ✓ Recognized
RelationshipRecognizer.recognize('Adoptive Father'); // ✓ Recognized
RelationshipRecognizer.recognize('Step-Sister'); // ✓ Recognized
RelationshipRecognizer.recognize('Best Person'); // ✓ Recognized
RelationshipRecognizer.recognize('Partner 1 Sister'); // ✓ Recognized
RelationshipRecognizer.recognize('Custom Label Here'); // ✓ Falls back to custom
```

## Pattern Matching

The system recognizes:
- Gender-neutral terms (partner, parent, attendant, sibling)
- Traditional terms (bride, groom, bridesmaid, groomsman)
- Modern alternatives (co-bride, co-groom, best-person, honor-attendant)
- Inclusive terms (step-, adoptive-)
- Contextual family-side markers (with "of Partner 1/2")

## Display & Export

All export formats automatically adapt to the wedding type:

### PDF Export
- Shows correct partner labels (Bride/Co-Bride or Partner/Partner, etc.)
- Groups family members by family side with appropriate labels
- Includes shared family members in dedicated section
- Uses custom labels where provided

### Mobile Checklist
- Uses dynamic attendant count labels
- Shows family structure clearly
- Supports custom relationship labels

### Timeline View
- Adapts groupings based on actual family structure
- No assumptions about number of parents or siblings

## Backward Compatibility

All existing code continues to work:
- Legacy `bridesmaids`, `groomsmen`, `brideFamily`, `groomFamily` fields still available
- `bride` and `groom` relationships still recognized and processed
- Automatic migration from old format to new format via `migrateWeddingDataToNewFormat()`

## Best Practices

1. **Don't Assume Family Structure**
   - Never hardcode "bride" or "groom"
   - Always use dynamic labels from `getPartnerLabels()`

2. **Support Custom Labels**
   - Check `person.customLabel` first before using `person.relationship`
   - Use `formatRelationshipDisplay()` for consistent output

3. **Use Generic Terms**
   - Use `attendant` instead of `bridesmaid`
   - Use `parent` instead of `mother`/`father` when possible
   - Use `partner` instead of assuming gender

4. **Handle Multiple Families**
   - Check for `sharedFamily` in complex structures
   - Use `getAllFamilyMembers()` to get complete family picture
   - Detect blended families with `isBlendedWedding()`

5. **Migrate Legacy Data**
   - Always call `migrateWeddingDataToNewFormat()` for old data
   - Preserve original fields for backward compatibility

## Testing & Examples

See `DIVERSE_FAMILY_EXAMPLES.md` for comprehensive test cases and usage examples.
