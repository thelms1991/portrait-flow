# Relationship Recognition Logic - Implementation Summary

## What Was Built

A comprehensive relationship recognition system for the Wedding Portrait Shotlist Builder that automatically identifies family and wedding party relationships from natural language input.

## Files Created

### 1. **src/lib/relationshipRecognition.ts** (Primary Engine)
- **RelationshipRecognizer class** with static methods:
  - `recognize()` - Parses relationship strings into structured data
  - `formatLabel()` - Converts relationship types to human-readable text
  - `hasRelationship()` - Checks if person has specific relationship type
  - `belongsToCategory()` - Categorizes into immediate/extended family or wedding party
  - `getMultipleRoles()` - Returns all recognized roles for a person
  - `getPrimaryRole()` - Gets the primary role

### 2. **src/lib/portraitGroupingUtils.ts** (Grouping Management)
Utility functions for handling portrait groupings:
- `deduplicatePeople()` - Removes duplicate people
- `formatPortraitGrouping()` - Creates formatted strings like "Elizabeth (Bride) + Tim (Groom) + Steve (Father of Bride)"
- `smartGroupPeople()` - Intelligently groups people with deduplication
- `isPersonInGroup()` - Checks group membership
- `addPersonToGroup()` - Safely adds person (avoiding duplicates)
- `removePersonFromGroup()` - Removes person from group
- `analyzeGrouping()` - Provides detailed breakdown

### 3. **src/components/RelationshipRecognitionDemo.tsx** (Interactive Demo)
React component demonstrating:
- Adding family members with relationships
- Real-time recognition of relationships
- Duplicate detection and prevention
- Formatted portrait grouping output
- Grouping breakdown with totals

### 4. **RELATIONSHIP_RECOGNITION_GUIDE.md** (Complete Documentation)
Comprehensive guide including:
- API reference
- Code examples
- Recognized relationship types
- Integration patterns
- Best practices

## Recognized Relationships

### Core Roles
- **Bride** / **Groom**

### Parents
- Mother, Father (and variations: Mom, Dad, Ma, Pa)
- Mother of Bride / Groom
- Father of Bride / Groom
- Step Mother, Step Father

### Siblings
- Brother, Sister (and variations: Bro, Sis)
- Brother/Sister of Bride/Groom
- Step Brother, Step Sister

### Wedding Party
- Bridesmaid, Maid of Honor, Matron of Honor, Flower Girl, Junior Bridesmaid
- Groomsman, Best Man, Ring Bearer, Junior Groomsman, Usher

### Extended Family
- **Grandparent** - Grandpa, Grandma, Grandfather, Grandmother, Nana, Papa
- **Aunt** - Aunt of Bride/Groom (or generic)
- **Uncle** - Uncle of Bride/Groom (or generic)
- **Cousin** - Cousin of Bride/Groom (or generic)

## Key Features

### 1. **Multi-Role Detection**
Recognizes when a person has multiple roles:
```
Example: Katie Soost = "Sister of Bride" + "Bridesmaid"
Relationships: ['sister-of-bride', 'sister', 'bridesmaid']
```

### 2. **Natural Language Processing**
Handles hundreds of variations:
- "Maid of Honor" → Bridesmaid
- "Mother of the Bride" → Mother of Bride
- "Step Sister" → Step Sibling
- "Matron of Honor" → Bridesmaid

### 3. **Family Side Awareness**
Automatically identifies Bride vs Groom side:
- "Father of Bride" → familySide: 'bride'
- "Sister of Groom" → familySide: 'groom'
- Generic "Father" → familySide: context-aware

### 4. **Duplicate Prevention**
Ensures people appear only once per grouping:
- By ID
- By name + relationship combination
- Prevents same person from appearing twice in the same portrait

### 5. **Category Grouping**
Organizes people by category:
- **Immediate Family**: Parents, siblings, step-relations
- **Extended Family**: Grandparents, aunts, uncles, cousins
- **Wedding Party**: Bridesmaids, groomsmen, flower girls, ring bearers

## Integration Points

### Updated: portraitGroupingsEngine.ts
- Now uses `deduplicatePeople()` to ensure no duplicates in groupings
- Imports from relationship recognition library
- Automatically prevents same person appearing twice

### Ready for: Photographer Review Screen
Can be used in a drag-and-drop editor to:
- Display people with their recognized relationships
- Prevent adding the same person twice
- Show when someone has multiple roles
- Group people intelligently

## Usage Example

```typescript
import { RelationshipRecognizer } from '@/lib/relationshipRecognition';
import { formatPortraitGrouping, deduplicatePeople } from '@/lib/portraitGroupingUtils';

// Recognize a person's relationships
const katie: Person = { id: '1', name: 'Katie Soost', relationship: 'Sister of Bride' };
const recognized = RelationshipRecognizer.recognize(katie.relationship);

console.log(recognized.displayLabel); // "Sister of Bride"
console.log(recognized.relationships); // ['sister-of-bride', 'sister']
console.log(recognized.familySide); // 'bride'

// Create a portrait grouping
const grouping = [
  { id: '1', name: 'Elizabeth', relationship: 'Bride' },
  { id: '2', name: 'Tim', relationship: 'Groom' },
  { id: '3', name: 'Steve', relationship: 'Father of Bride' },
  { id: '3', name: 'Steve', relationship: 'Father of Bride' } // Duplicate
];

const unique = deduplicatePeople(grouping);
const formatted = formatPortraitGrouping(unique);

console.log(formatted);
// "Elizabeth (Bride) + Tim (Groom) + Steve (Father of Bride)"
```

## Testing the System

1. **Open the RelationshipRecognitionDemo Storyboard** in the canvas
2. Add family members with various relationship types
3. Watch the system:
   - Recognize the relationship type
   - Display all applicable roles
   - Identify family side
   - Prevent duplicates
   - Format the portrait grouping

Try adding:
- "Katie Soost" as "Sister of Bride" (multi-role candidate)
- "Steve" as "Father of Bride" twice (duplicate detection)
- Various relationship variations to see natural language parsing

## Next Steps for Full Implementation

When building the Photographer Review Screen, you can:

1. **Drag-to-Reorder**: Use the person's ID and relationship recognition
2. **Add Portrait**: Suggest similar groupings based on relationship categories
3. **Delete Portrait**: Remove based on ID matching
4. **Merge Portraits**: Combine groupings while avoiding duplicates
5. **Duplicate Portrait**: Clone with new IDs
6. **Edit Names/Relationships**: Re-recognize relationships on change
7. **Mark Required/Optional**: Store as metadata on grouping

All relationship recognition happens automatically as data is edited!
