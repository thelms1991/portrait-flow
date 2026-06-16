# Diverse Wedding Family Examples

## Example 1: Two Brides with Blended Families

```typescript
const twoBridesBlendedWedding: WeddingData = {
  weddingType: 'two-brides',
  
  // Primary partners
  partner1FirstName: 'Sarah',
  partner1LastName: 'Smith',
  partner1Role: 'Bride',
  partner1Gender: 'female',
  
  partner2FirstName: 'Emily',
  partner2LastName: 'Jones',
  partner2Role: 'Co-Bride',
  partner2Gender: 'female',
  
  weddingDate: '2024-06-15',
  ceremonyLocation: 'Community Garden',
  receptionLocation: 'Modern Event Space',
  
  // Sarah's attendants
  side1Attendants: [
    { id: '1', name: 'Alex', relationship: 'Best Person' },
    { id: '2', name: 'Jordan', relationship: 'Attendant' },
  ],
  
  // Emily's attendants
  side2Attendants: [
    { id: '3', name: 'Casey', relationship: 'Honor Attendant' },
    { id: '4', name: 'Morgan', relationship: 'Attendant' },
  ],
  
  // Sarah's family (divorced parents, stepdad)
  partner1Family: [
    { id: '5', name: 'Patricia', relationship: 'Mother' },
    { id: '6', name: 'Robert', relationship: 'Father' },
    { id: '7', name: 'David', relationship: 'Step-Father', customLabel: 'Mom\'s Partner' },
    { id: '8', name: 'Michael', relationship: 'Brother' },
    { id: '9', name: 'Lisa', relationship: 'Sister' },
  ],
  
  // Emily's family (two moms)
  partner2Family: [
    { id: '10', name: 'Margaret', relationship: 'Mother' },
    { id: '11', name: 'Susan', relationship: 'Co-Mother' },
    { id: '12', name: 'Jennifer', relationship: 'Sister' },
    { id: '13', name: 'Thomas', relationship: 'Brother' },
  ],
  
  // Shared family (grandmother they both know well)
  sharedFamily: [
    { id: '14', name: 'Evelyn', relationship: 'Grandmother', customLabel: 'Mentor & Friend' },
  ],
  
  specialGroupings: [
    { id: '15', description: 'Sarah + Emily + immediate parents' },
    { id: '16', description: 'Sarah + Emily + all siblings' },
  ],
  
  receptionPortraits: [
    { id: '17', description: 'Both families together' },
    { id: '18', description: 'Sarah with her family' },
    { id: '19', description: 'Emily with her family' },
  ],
};
```

**Generated Shot List Sections:**
- Sarah (Bride) + Emily (Co-Bride)
- Sarah (Bride) + Emily (Co-Bride) + Attendants
- Sarah's Family
  - Sarah + Patricia (Mother)
  - Sarah + Robert (Father)
  - Sarah + David (Mom's Partner)
  - Sarah + all siblings
  - etc.
- Emily's Family
  - Emily + Margaret (Mother)
  - Emily + Susan (Co-Mother)
  - Emily + all siblings
  - etc.
- Shared Family
  - Grandmother portraits

---

## Example 2: Two Grooms with One Adoptive Parent

```typescript
const twoGroomsAdoptiveWedding: WeddingData = {
  weddingType: 'two-grooms',
  
  partner1FirstName: 'James',
  partner1LastName: 'Anderson',
  partner1Role: 'Groom',
  partner1Gender: 'male',
  
  partner2FirstName: 'Marcus',
  partner2LastName: 'Williams',
  partner2Role: 'Co-Groom',
  partner2Gender: 'male',
  
  weddingDate: '2024-07-20',
  ceremonyLocation: 'Modern Chapel',
  receptionLocation: 'Rooftop Venue',
  
  side1Attendants: [
    { id: '1', name: 'David', relationship: 'Best Man' },
    { id: '2', name: 'Kevin', relationship: 'Groomsman' },
  ],
  
  side2Attendants: [
    { id: '3', name: 'Thomas', relationship: 'Best Person' },
  ],
  
  // James's family
  partner1Family: [
    { id: '4', name: 'Catherine', relationship: 'Mother' },
    { id: '5', name: 'John', relationship: 'Father' },
    { id: '6', name: 'Sarah', relationship: 'Sister' },
  ],
  
  // Marcus's family (adoptive parents)
  partner2Family: [
    { id: '7', name: 'Robert', relationship: 'Adoptive Father' },
    { id: '8', name: 'William', relationship: 'Adoptive Father', customLabel: 'Pops' },
    { id: '9', name: 'Anthony', relationship: 'Brother' },
  ],
  
  sharedFamily: [],
  
  specialGroupings: [],
  receptionPortraits: [],
};
```

**Key Features:**
- Two adoptive fathers for Marcus
- Custom label "Pops" for personalization
- Different attendant titles for each side

---

## Example 3: Non-Binary Wedding with Mixed Family

```typescript
const nonBinaryWedding: WeddingData = {
  weddingType: 'non-binary',
  
  partner1FirstName: 'Casey',
  partner1Role: 'Partner',
  partner1Gender: 'non-binary',
  
  partner2FirstName: 'Riley',
  partner2Role: 'Partner',
  partner2Gender: 'non-binary',
  
  weddingDate: '2024-08-10',
  ceremonyLocation: 'Nature Reserve',
  receptionLocation: 'Warehouse Gallery',
  
  side1Attendants: [
    { id: '1', name: 'Alex', relationship: 'Attendant' },
    { id: '2', name: 'Skylar', relationship: 'Attendant' },
  ],
  
  side2Attendants: [
    { id: '3', name: 'Taylor', relationship: 'Attendant' },
  ],
  
  // Casey's family
  partner1Family: [
    { id: '4', name: 'Pat', relationship: 'Parent' },
    { id: '5', name: 'Jordan', relationship: 'Sibling' },
    { id: '6', name: 'Terry', relationship: 'Parent', customLabel: 'Stepparent' },
  ],
  
  // Riley's family
  partner2Family: [
    { id: '7', name: 'Morgan', relationship: 'Mother' },
    { id: '8', name: 'Sam', relationship: 'Father' },
    { id: '9', name: 'Charlie', relationship: 'Sibling' },
    { id: '10', name: 'Avery', relationship: 'Sibling' },
  ],
  
  sharedFamily: [],
  
  specialGroupings: [
    { id: '11', description: 'Casey + Riley + all family' },
  ],
  
  receptionPortraits: [],
};
```

**Key Features:**
- Gender-neutral "Partner" roles
- Generic "Parent" relationships
- "Attendant" instead of gendered wedding party titles
- All family members valued equally regardless of relationship type

---

## Example 4: Complex Blended Family (Multiple Family Sides)

```typescript
const complexBlendedWedding: WeddingData = {
  weddingType: 'same-sex',
  
  partner1FirstName: 'Victoria',
  partner1Role: 'Bride',
  partner1Gender: 'female',
  
  partner2FirstName: 'Laura',
  partner2Role: 'Co-Bride',
  partner2Gender: 'female',
  
  weddingDate: '2024-09-22',
  ceremonyLocation: 'Historic Estate',
  receptionLocation: 'Ballroom',
  
  side1Attendants: [
    { id: '1', name: 'Nicole', relationship: 'Maid of Honor' },
    { id: '2', name: 'Emma', relationship: 'Bridesmaid' },
  ],
  
  side2Attendants: [
    { id: '3', name: 'Sophie', relationship: 'Honor Attendant' },
  ],
  
  // Victoria's family (with ex-spouse co-parent)
  partner1Family: [
    { id: '4', name: 'Dorothy', relationship: 'Mother' },
    { id: '5', name: 'Edward', relationship: 'Father' },
    { id: '6', name: 'Rebecca', relationship: 'Step-Mother' },
    { id: '7', name: 'Daniel', relationship: 'Step-Brother' },
    { id: '8', name: 'George', relationship: 'Uncle' },
    { id: '9', name: 'Helen', relationship: 'Aunt' },
    { id: '10', name: 'James', relationship: 'Cousin' },
  ],
  
  // Laura's family (blended with adopted children)
  partner2Family: [
    { id: '11', name: 'Margaret', relationship: 'Mother' },
    { id: '12', name: 'Richard', relationship: 'Father' },
    { id: '13', name: 'Melissa', relationship: 'Sister' },
    { id: '14', name: 'Christopher', relationship: 'Brother' },
    { id: '15', name: 'Patricia', relationship: 'Adoptive Sister' },
  ],
  
  // Shared close friends/mentors who are family
  sharedFamily: [
    { id: '16', name: 'Carol', relationship: 'Grandmother', customLabel: 'Lifelong Family Friend' },
  ],
  
  specialGroupings: [
    { id: '17', description: 'Victoria + Laura + both sets of parents' },
    { id: '18', description: 'All female family members' },
    { id: '19', description: 'All siblings (including step and adoptive)' },
  ],
  
  receptionPortraits: [
    { id: '20', description: 'Extended family group photos' },
    { id: '21', description: 'Each family side separately' },
  ],
};
```

**Generated Structure:**
- Complete handling of 13+ family members
- Step-relations clearly marked
- Adoptive relations clearly marked
- Separate family sides with easy grouping
- Shared family integration
- Custom labels for special relationships

---

## Example 5: Traditional Wedding (Backward Compatibility)

```typescript
const traditionalWedding: WeddingData = {
  weddingType: 'traditional',
  
  // Old format still works
  brideFirstName: 'Jennifer',
  brideLastName: 'Davis',
  groomFirstName: 'Michael',
  groomLastName: 'Johnson',
  
  // New format also available
  partner1FirstName: 'Jennifer',
  partner1LastName: 'Davis',
  partner1Role: 'Bride',
  partner2FirstName: 'Michael',
  partner2LastName: 'Johnson',
  partner2Role: 'Groom',
  
  weddingDate: '2024-05-18',
  ceremonyLocation: 'Church',
  receptionLocation: 'Country Club',
  
  // Both old and new field names work
  bridesmaids: [
    { id: '1', name: 'Sarah', relationship: 'Maid of Honor' },
    { id: '2', name: 'Emma', relationship: 'Bridesmaid' },
  ],
  side1Attendants: [
    { id: '1', name: 'Sarah', relationship: 'Maid of Honor' },
    { id: '2', name: 'Emma', relationship: 'Bridesmaid' },
  ],
  
  groomsmen: [
    { id: '3', name: 'James', relationship: 'Best Man' },
    { id: '4', name: 'David', relationship: 'Groomsman' },
  ],
  side2Attendants: [
    { id: '3', name: 'James', relationship: 'Best Man' },
    { id: '4', name: 'David', relationship: 'Groomsman' },
  ],
  
  brideFamily: [
    { id: '5', name: 'Dorothy', relationship: 'Mother of Bride' },
    { id: '6', name: 'Robert', relationship: 'Father of Bride' },
    { id: '7', name: 'Rachel', relationship: 'Sister of Bride' },
  ],
  partner1Family: [
    { id: '5', name: 'Dorothy', relationship: 'Mother of Bride' },
    { id: '6', name: 'Robert', relationship: 'Father of Bride' },
    { id: '7', name: 'Rachel', relationship: 'Sister of Bride' },
  ],
  
  groomFamily: [
    { id: '8', name: 'Patricia', relationship: 'Mother of Groom' },
    { id: '9', name: 'Charles', relationship: 'Father of Groom' },
    { id: '10', name: 'Michael Jr.', relationship: 'Brother of Groom' },
  ],
  partner2Family: [
    { id: '8', name: 'Patricia', relationship: 'Mother of Groom' },
    { id: '9', name: 'Charles', relationship: 'Father of Groom' },
    { id: '10', name: 'Michael Jr.', relationship: 'Brother of Groom' },
  ],
  
  specialGroupings: [],
  receptionPortraits: [],
};
```

**Key Points:**
- Completely backward compatible
- Old field names still work
- New structure available for migration
- All existing code continues to function

---

## Relationship Customization Examples

### Example 6: All Custom Labels

```typescript
const customizedRelationships: Person[] = [
  {
    id: '1',
    name: 'Susan',
    relationship: 'Mother',
    customLabel: 'Mom',
  },
  {
    id: '2',
    name: 'Robert',
    relationship: 'Father',
    customLabel: 'Dad',
  },
  {
    id: '3',
    name: 'Patricia',
    relationship: 'Step-Mother',
    customLabel: 'Stepmom (Mom\'s Wife)',
  },
  {
    id: '4',
    name: 'James',
    relationship: 'Adoptive Father',
    customLabel: 'Pops',
  },
  {
    id: '5',
    name: 'Carol',
    relationship: 'Aunt',
    customLabel: 'Aunt Carol (Mom\'s Twin)',
  },
  {
    id: '6',
    name: 'Terry',
    relationship: 'Sister',
    customLabel: 'Best Friend (Sister)',
  },
];
```

**Usage:**
```typescript
// Display with custom labels
familyMembers.map(person => {
  const display = person.customLabel || person.relationship;
  return `${person.name} (${display})`;
});
// Output:
// Susan (Mom)
// Robert (Dad)
// Patricia (Stepmom (Mom's Wife))
// James (Pops)
// Carol (Aunt Carol (Mom's Twin))
// Terry (Best Friend (Sister))
```

---

## Testing Migration

```typescript
// Old legacy data
const legacyData = {
  brideFirstName: 'Jane',
  brideLastName: 'Smith',
  groomFirstName: 'John',
  groomLastName: 'Doe',
  bridesmaids: [{ id: '1', name: 'Mary', relationship: 'Bridesmaid' }],
  groomsmen: [{ id: '2', name: 'Bob', relationship: 'Groomsman' }],
  brideFamily: [{ id: '3', name: 'Mom', relationship: 'Mother of Bride' }],
  groomFamily: [{ id: '4', name: 'Dad', relationship: 'Father of Groom' }],
};

// Migrate to new format
const newData = migrateWeddingDataToNewFormat(legacyData);

// Result maintains all data and adds new structure
console.log(newData.partner1FirstName); // 'Jane'
console.log(newData.partner2FirstName); // 'John'
console.log(newData.side1Attendants.length); // 1
console.log(newData.partner1Family.length); // 1
```

---

## Utility Function Examples

### Detecting Family Structure

```typescript
const weddingData = getTwoGroomsWithAdoptiveFamily();

// Detect complex structures
console.log(isBlendedWedding(weddingData)); // true
console.log(hasMultipleParents(weddingData.partner1Family)); // false
console.log(hasMultipleParents(weddingData.partner2Family)); // true (2 dads)
console.log(hasAdoptiveFamily(weddingData.partner1Family)); // false
console.log(hasAdoptiveFamily(weddingData.partner2Family)); // true
console.log(hasStepFamily(weddingData.partner1Family)); // false

// Get labels
const { partner1Label, partner2Label } = getPartnerLabels(weddingData);
console.log(`${partner1Label} & ${partner2Label}`); // "Groom & Co-Groom"

const { family1Label, family2Label } = getFamilyLabels(weddingData);
console.log(`${family1Label} and ${family2Label}`); 
// "James's Family and Marcus's Family"
```

---

## Summary

The diverse family support system allows you to:
- ✅ Support any wedding type without assumptions
- ✅ Handle multiple family structures (blended, same-sex, adoptive, step)
- ✅ Allow custom relationship labels for personalization
- ✅ Maintain complete backward compatibility
- ✅ Automatically generate appropriate shot lists
- ✅ Export in all formats with correct family structures
- ✅ Detect and handle complex family situations
