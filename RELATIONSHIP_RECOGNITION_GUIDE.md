# Relationship Recognition System

## Overview

The relationship recognition system intelligently parses natural language relationship inputs and automatically detects multiple roles a person may have. It ensures that people appear only once per portrait grouping, even if they have multiple titles (e.g., "Sister of Bride" + "Bridesmaid").

## Key Features

### 1. **Multi-Role Detection**
People can have multiple roles that are all recognized and captured:

```typescript
// Example: Katie Soost
const relationship = RelationshipRecognizer.recognize("Sister of Bride");
// Returns:
// {
//   normalizedType: 'sister-of-bride',
//   relationships: ['sister-of-bride', 'sister'],
//   primaryRole: 'sister-of-bride',
//   displayLabel: 'Sister of Bride'
// }
```

### 2. **Natural Language Support**
Recognizes hundreds of relationship variations:

- **Parents**: Mother, Mom, Ma | Father, Dad, Pa
- **Siblings**: Brother, Bro | Sister, Sis
- **Marriage Party**: Bridesmaid, Maid of Honor, Matron of Honor | Groomsman, Best Man, Usher
- **Grandparents**: Grandparent, Grandma, Grandpa, Nana, Papa
- **Extended Family**: Aunt, Uncle, Cousin
- **Step Relations**: Step Mother, Stepmother, Step-Mother, etc.
- **Specific Sides**: "Mother of Bride", "Father of Groom", "Sister of Bride", etc.

### 3. **Family Side Awareness**
Automatically identifies if a person belongs to the Bride or Groom side:

```typescript
const bride_relation = RelationshipRecognizer.recognize("Father of Bride");
console.log(bride_relation.familySide); // 'bride'

const groom_relation = RelationshipRecognizer.recognize("Sister of Groom");
console.log(groom_relation.familySide); // 'groom'
```

### 4. **Duplicate Prevention**
Ensures each person appears exactly once in a portrait grouping:

```typescript
import { deduplicatePeople } from '@/lib/portraitGroupingUtils';

const people = [
  { id: '1', name: 'Katie', relationship: 'Sister' },
  { id: '1', name: 'Katie', relationship: 'Sister' }, // Duplicate
  { id: '2', name: 'Steve', relationship: 'Father' }
];

const unique = deduplicatePeople(people);
// Returns only 2 people
```

## API Reference

### RelationshipRecognizer

#### `recognize(input: string, context?: 'bride-side' | 'groom-side'): ParsedRelationship`

Parses a relationship string and returns comprehensive relationship data.

```typescript
// Basic recognition
const result = RelationshipRecognizer.recognize("Maid of Honor");
// {
//   rawInput: "Maid of Honor",
//   normalizedType: 'bridesmaid',
//   familySide: 'bride',
//   relationships: ['bridesmaid'],
//   primaryRole: 'bridesmaid',
//   displayLabel: 'Bridesmaid'
// }

// With context
const result2 = RelationshipRecognizer.recognize("Sibling", 'bride-side');
// familySide will be 'bride'
```

#### `formatLabel(type: RelationshipType): string`

Converts a relationship type to a human-readable label.

```typescript
RelationshipRecognizer.formatLabel('sister-of-bride'); // "Sister of Bride"
RelationshipRecognizer.formatLabel('groomsman'); // "Groomsman"
```

#### `hasRelationship(person: Person, relationshipType: RelationshipType): boolean`

Checks if a person has a specific relationship type.

```typescript
const person: Person = { id: '1', name: 'Katie', relationship: 'Sister of Bride' };

RelationshipRecognizer.hasRelationship(person, 'sister-of-bride'); // true
RelationshipRecognizer.hasRelationship(person, 'bridesmaid'); // false
```

#### `belongsToCategory(person: Person, category): boolean`

Determines if a person belongs to a broad category.

```typescript
const person: Person = { id: '1', name: 'Katie', relationship: 'Sister of Bride' };

// Categories: 'immediate-family' | 'extended-family' | 'wedding-party'
RelationshipRecognizer.belongsToCategory(person, 'immediate-family'); // true
RelationshipRecognizer.belongsToCategory(person, 'extended-family'); // false
RelationshipRecognizer.belongsToCategory(person, 'wedding-party'); // false
```

#### `getMultipleRoles(person: Person): RelationshipType[]`

Returns all recognized roles for a person.

```typescript
const person: Person = { id: '1', name: 'Katie', relationship: 'Sister of Bride' };
RelationshipRecognizer.getMultipleRoles(person);
// Returns: ['sister-of-bride', 'sister']
```

#### `getPrimaryRole(person: Person): RelationshipType`

Returns the most important role for a person.

```typescript
const person: Person = { id: '1', name: 'Katie', relationship: 'Sister of Bride' };
RelationshipRecognizer.getPrimaryRole(person);
// Returns: 'sister-of-bride'
```

### Portrait Grouping Utils

#### `formatPortraitGrouping(people: Person[]): string`

Generates a formatted portrait grouping description with relationships.

```typescript
const people = [
  { id: '1', name: 'Elizabeth', relationship: 'Bride' },
  { id: '2', name: 'Tim', relationship: 'Groom' },
  { id: '3', name: 'Steve', relationship: 'Father of Bride' }
];

formatPortraitGrouping(people);
// Returns: "Elizabeth (Bride) + Tim (Groom) + Steve (Father of Bride)"
```

#### `formatPortraitGroupingShort(people: Person[]): string`

Generates a short version with just names.

```typescript
formatPortraitGroupingShort(people);
// Returns: "Elizabeth + Tim + Steve"
```

#### `deduplicatePeople(people: Person[]): Person[]`

Removes duplicate people from a list.

```typescript
const unique = deduplicatePeople([...people, people[0]]);
// Returns array with one less person
```

#### `smartGroupPeople(people: Person[], options?): Person[]`

Intelligently groups people with optional deduplication by relationship.

```typescript
const grouped = smartGroupPeople(people, {
  excludeDuplicateRelationships: true,
  prioritizePrimaryRole: true
});
```

#### `isPersonInGroup(person: Person, group: Person[]): boolean`

Checks if a person is already in a group.

```typescript
const isPresent = isPersonInGroup(person, group);
if (!isPresent) {
  group.push(person);
}
```

#### `addPersonToGroup(person: Person, group: Person[]): Person[]`

Safely adds a person to a group (avoids duplicates).

```typescript
const newGroup = addPersonToGroup(newPerson, existingGroup);
```

#### `removePersonFromGroup(person: Person, group: Person[]): Person[]`

Removes a person from a group.

```typescript
const updatedGroup = removePersonFromGroup(personToRemove, group);
```

#### `analyzeGrouping(people: Person[]): GroupingBreakdown`

Provides detailed analysis of a portrait grouping.

```typescript
const analysis = analyzeGrouping(people);
// {
//   summary: "Elizabeth (Bride) + Tim (Groom) + Steve (Father of Bride)",
//   people: [
//     { name: 'Elizabeth', role: 'Bride', roleType: 'bride' },
//     { name: 'Tim', role: 'Groom', roleType: 'groom' },
//     { name: 'Steve', role: 'Father of Bride', roleType: 'father-of-bride' }
//   ],
//   totalCount: 3
// }
```

## Recognized Relationship Types

```typescript
type RelationshipType =
  | 'bride'
  | 'groom'
  | 'mother'
  | 'father'
  | 'mother-of-bride'
  | 'father-of-bride'
  | 'mother-of-groom'
  | 'father-of-groom'
  | 'sister'
  | 'brother'
  | 'sister-of-bride'
  | 'brother-of-bride'
  | 'sister-of-groom'
  | 'brother-of-groom'
  | 'bridesmaid'
  | 'groomsman'
  | 'grandparent'
  | 'grandmother'
  | 'grandfather'
  | 'step-parent'
  | 'step-mother'
  | 'step-father'
  | 'step-sibling'
  | 'step-sister'
  | 'step-brother'
  | 'aunt'
  | 'aunt-of-bride'
  | 'aunt-of-groom'
  | 'uncle'
  | 'uncle-of-bride'
  | 'uncle-of-groom'
  | 'cousin'
  | 'cousin-of-bride'
  | 'cousin-of-groom'
  | 'other';
```

## Integration with Portrait Groupings Engine

The portraitGroupingsEngine automatically uses relationship recognition:

```typescript
// In portraitGroupingsEngine.ts
private addGrouping(
  people: Person[],
  description: string,
  category: PortraitCategory,
  notes?: string
): void {
  // Automatically deduplicates people
  const uniquePeople = deduplicatePeople(people);
  
  // Generate formatted description
  const formatted = formatPortraitGrouping(uniquePeople);
  
  // Add to groupings...
}
```

## Usage Examples

### Example 1: Multi-Role Person (Katie Soost)

```typescript
const katie: Person = {
  id: 'katie-001',
  name: 'Katie Soost',
  relationship: 'Sister of Bride'
};

// Recognize relationship
const recognition = RelationshipRecognizer.recognize(katie.relationship);

// Check if it's immediate family
const isImmediateFamily = RelationshipRecognizer.belongsToCategory(
  katie,
  'immediate-family'
);

// Get all roles
const allRoles = RelationshipRecognizer.getMultipleRoles(katie);
// Returns: ['sister-of-bride', 'sister']

// In a portrait grouping
const grouping = [
  { id: 'bride', name: 'Elizabeth', relationship: 'Bride' },
  { id: 'groom', name: 'Tim', relationship: 'Groom' },
  { id: 'katie-001', name: 'Katie Soost', relationship: 'Sister of Bride' }
];

const formatted = formatPortraitGrouping(grouping);
// "Elizabeth (Bride) + Tim (Groom) + Katie Soost (Sister of Bride)"
```

### Example 2: Duplicate Prevention

```typescript
const people = [
  { id: '1', name: 'Katie', relationship: 'Sister of Bride' },
  { id: '1', name: 'Katie', relationship: 'Sister of Bride' }, // Duplicate by ID
  { id: '2', name: 'Katie', relationship: 'Sister' }, // Same name, different relationship
  { id: '3', name: 'Steve', relationship: 'Father' }
];

const unique = deduplicatePeople(people);
// Returns 3 people (first Katie duplicate removed, second Katie kept as different relationship)
```

### Example 3: Building Portrait Suggestions

```typescript
function suggestPortraitGroupings(
  bridesmaids: Person[],
  groomsmen: Person[],
  family: Person[]
): string[] {
  const suggestions: string[] = [];

  // Bride + each bridesmaid with family relationship if applicable
  bridesmaids.forEach((bm) => {
    const familyMembers = family.filter(
      (f) => f.name === bm.name && 
      RelationshipRecognizer.belongsToCategory(f, 'immediate-family')
    );
    
    if (familyMembers.length > 0) {
      // Multi-role: bridesmaid AND family member
      const grouping = [bm, ...familyMembers];
      suggestions.push(formatPortraitGrouping(grouping));
    }
  });

  return suggestions;
}
```

## Categories

### Immediate Family
- Mother, Father
- Sister, Brother
- Step Parents, Step Siblings

### Extended Family
- Grandparents
- Aunts, Uncles
- Cousins

### Wedding Party
- Bridesmaids
- Groomsmen

## Error Handling

Unrecognized relationships default to 'other':

```typescript
const unknown = RelationshipRecognizer.recognize("Random Role");
// {
//   normalizedType: 'other',
//   familySide: 'unknown',
//   relationships: ['other'],
//   displayLabel: 'Random Role'
// }
```

## Best Practices

1. **Always deduplicate before creating groupings**
   ```typescript
   const unique = deduplicatePeople(people);
   ```

2. **Use formatPortraitGrouping for display**
   ```typescript
   // Instead of manually building strings
   const display = formatPortraitGrouping(people);
   ```

3. **Check category membership for filtering**
   ```typescript
   const immediateFamily = people.filter(p => 
     RelationshipRecognizer.belongsToCategory(p, 'immediate-family')
   );
   ```

4. **Handle multi-role people carefully**
   ```typescript
   const roles = RelationshipRecognizer.getMultipleRoles(person);
   // Use primaryRole for most important categorization
   ```
