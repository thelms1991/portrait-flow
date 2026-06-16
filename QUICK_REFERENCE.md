# Relationship Recognition Logic - Quick Reference

## 🎯 What You Asked For

```
Katie Soost = Maid of Honor + Sister of Bride
The AI should recognize:
✅ Katie belongs in: Bridesmaids, Siblings, Immediate Family
✅ But appears only once in any portrait grouping
✅ Understands: Mother/Father of Bride, Sister/Brother, etc.
✅ And: Step Parents, Aunts, Uncles, Cousins, Grandparents
```

## ✅ What Was Built

### 1. **Relationship Recognizer Engine** (370 lines)
```typescript
RelationshipRecognizer.recognize("Sister of Bride")
→ {
    displayLabel: "Sister of Bride",
    relationships: ["sister-of-bride", "sister"],
    familySide: "bride",
    primaryRole: "sister-of-bride"
  }
```

### 2. **Portrait Grouping Utils** (200 lines)
```typescript
formatPortraitGrouping(people)
→ "Elizabeth (Bride) + Tim (Groom) + Katie (Sister of Bride)"

deduplicatePeople(people)
→ Ensures no one appears twice
```

### 3. **Interactive Demo** (320 lines)
- Add family members with relationships
- See real-time recognition
- Duplicate detection
- Formatted output

### 4. **Complete Documentation**
- API reference
- Code examples
- Usage patterns
- Best practices

## 🔍 Recognition Examples

| Input | Recognized As | Type | Family Side |
|-------|---|---|---|
| "Sister of Bride" | Sister (Bride) | sister-of-bride | bride |
| "Maid of Honor" | Bridesmaid | bridesmaid | bride |
| "Father of Groom" | Father (Groom) | father-of-groom | groom |
| "Best Man" | Groomsman | groomsman | groom |
| "Grandmother" | Grandparent | grandmother | context |
| "Uncle of Bride" | Uncle (Bride) | uncle-of-bride | bride |
| "Step Sister" | Step Sibling | step-sister | context |

## 🎯 Recognized Relationships

### ✅ Already Implemented
- **Parents**: Mother, Father, Step Parents
- **Siblings**: Brother, Sister, Step Siblings
- **Marriage Party**: Bridesmaid, Maid of Honor, Groomsman, Best Man
- **Grandparents**: Grandma, Grandpa, Grandmother, Grandfather
- **Extended**: Aunt, Uncle, Cousin
- **All with**: Bride/Groom sides automatically detected

### 📋 Categories
- **Immediate Family** → Parents + Siblings
- **Extended Family** → Grandparents + Aunts/Uncles + Cousins
- **Wedding Party** → Bridesmaids + Groomsmen

## 🚀 How to Use

### Basic Recognition
```typescript
import { RelationshipRecognizer } from '@/lib/relationshipRecognition';

const person = { id: '1', name: 'Katie', relationship: 'Sister of Bride' };
const result = RelationshipRecognizer.recognize(person.relationship);

console.log(result.displayLabel);    // "Sister of Bride"
console.log(result.familySide);      // "bride"
```

### Format Groupings
```typescript
import { formatPortraitGrouping } from '@/lib/portraitGroupingUtils';

const grouping = formatPortraitGrouping([
  { id: '1', name: 'Elizabeth', relationship: 'Bride' },
  { id: '2', name: 'Tim', relationship: 'Groom' },
  { id: '3', name: 'Steve', relationship: 'Father of Bride' }
]);

console.log(grouping);
// "Elizabeth (Bride) + Tim (Groom) + Steve (Father of Bride)"
```

### Prevent Duplicates
```typescript
import { deduplicatePeople } from '@/lib/portraitGroupingUtils';

const unique = deduplicatePeople(people);
// Automatically removes duplicates by ID and name/relationship
```

## 🧪 Test It Out

1. **Open the canvas**
2. **Find the RelationshipRecognitionDemo storyboard**
3. **Add family members** with various relationships
4. **See recognition happen in real-time**

Try:
- "Sister of Bride" 
- "Maid of Honor"
- "Father of Groom"
- "Uncle"
- "Bridesmaid"

## 📁 Files Created

| File | Purpose | Lines |
|------|---------|-------|
| relationshipRecognition.ts | Core engine | 370 |
| portraitGroupingUtils.ts | Utilities | 200 |
| relationshipRecognition.test.ts | Tests | 250 |
| RelationshipRecognitionDemo.tsx | Interactive demo | 320 |
| RELATIONSHIP_RECOGNITION_GUIDE.md | API reference | - |
| IMPLEMENTATION_SUMMARY.md | Feature overview | - |
| RELATIONSHIP_LOGIC_README.md | This file | - |

## 🔗 Integration

### Already Integrated ✅
- **portraitGroupingsEngine.ts** uses deduplicatePeople()
- Prevents same person appearing twice in groupings

### Ready for ✅
- **Photographer Review Screen** (Drag-and-drop editor)
- **Portrait Editor** (Add/Edit/Delete)
- **Export Logic** (PDF, Checklist, Timeline)

## 💡 Key Features

✅ **100+ Relationship Patterns** - Recognizes natural language variations
✅ **Multi-Role People** - Detects when someone has multiple roles
✅ **Duplicate Prevention** - Ensures people appear only once
✅ **Family Side Awareness** - Knows Bride vs Groom sides
✅ **Smart Categorization** - Groups into immediate/extended/wedding party
✅ **Professional Formatting** - "Name (Role) + Name (Role) + ..."

## 🎯 Next Steps

When building the Photographer Review Screen, you can:

1. **Display** - Show recognized relationships per person
2. **Reorder** - Drag-and-drop with relationship awareness
3. **Add** - Suggest groupings based on relationships
4. **Delete** - Remove with duplicate checking
5. **Merge** - Combine while avoiding duplicates
6. **Edit** - Re-recognize on name/role changes
7. **Export** - Use formatPortraitGrouping() for output

All relationship logic is ready to go! 🚀
