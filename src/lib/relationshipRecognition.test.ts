import { Person } from '@/types/app';
import { RelationshipRecognizer } from '@/lib/relationshipRecognition';
import {
  formatPortraitGrouping,
  deduplicatePeople,
  analyzeGrouping,
} from '@/lib/portraitGroupingUtils';

/**
 * Test suite for relationship recognition system
 * Run these tests to verify the system works correctly
 */

// Test data
const testCases = [
  {
    name: 'Katie Soost - Sister of Bride',
    input: 'Sister of Bride',
    expectedType: 'sister-of-bride',
    expectedFamilySide: 'bride',
    expectedRelationships: ['sister-of-bride', 'sister'],
  },
  {
    name: 'Maid of Honor',
    input: 'Maid of Honor',
    expectedType: 'bridesmaid',
    expectedFamilySide: 'bride',
  },
  {
    name: 'Father of Groom',
    input: 'Father of Groom',
    expectedType: 'father-of-groom',
    expectedFamilySide: 'groom',
  },
  {
    name: 'Step Mother',
    input: 'Step Mother',
    expectedType: 'step-mother',
  },
  {
    name: 'Grandmother',
    input: 'Grandmother',
    expectedType: 'grandmother',
    expectedRelationships: ['grandmother', 'grandparent'],
  },
  {
    name: 'Uncle of Bride',
    input: 'Uncle of Bride',
    expectedType: 'uncle-of-bride',
    expectedFamilySide: 'bride',
  },
  {
    name: 'Cousin of Groom',
    input: 'Cousin of Groom',
    expectedType: 'cousin-of-groom',
    expectedFamilySide: 'groom',
  },
  {
    name: 'Best Man',
    input: 'Best Man',
    expectedType: 'groomsman',
    expectedFamilySide: 'groom',
  },
];

export function runRelationshipRecognitionTests() {
  console.log('🧪 Running Relationship Recognition Tests...\n');

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase) => {
    try {
      const result = RelationshipRecognizer.recognize(testCase.input);

      let testPassed = true;
      const failures: string[] = [];

      if (result.normalizedType !== testCase.expectedType) {
        testPassed = false;
        failures.push(
          `Type mismatch: got '${result.normalizedType}', expected '${testCase.expectedType}'`
        );
      }

      if (testCase.expectedFamilySide && result.familySide !== testCase.expectedFamilySide) {
        testPassed = false;
        failures.push(
          `Family side mismatch: got '${result.familySide}', expected '${testCase.expectedFamilySide}'`
        );
      }

      if (testCase.expectedRelationships) {
        const hasAll = testCase.expectedRelationships.every((rel) =>
          result.relationships.includes(rel)
        );
        if (!hasAll) {
          testPassed = false;
          failures.push(
            `Relationships mismatch: got [${result.relationships.join(', ')}], expected [${testCase.expectedRelationships.join(', ')}]`
          );
        }
      }

      if (testPassed) {
        console.log(`✅ ${testCase.name}`);
        console.log(`   Type: ${result.normalizedType}`);
        console.log(`   Roles: ${result.relationships.join(', ')}`);
        console.log(`   Family Side: ${result.familySide}\n`);
        passed++;
      } else {
        console.log(`❌ ${testCase.name}`);
        failures.forEach((failure) => console.log(`   ${failure}`));
        console.log();
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${testCase.name}`);
      console.log(`   Error: ${error}\n`);
      failed++;
    }
  });

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);
  return { passed, failed };
}

export function runDeduplicationTests() {
  console.log('🧪 Running Deduplication Tests...\n');

  // Test 1: Duplicate by ID
  const people1: Person[] = [
    { id: '1', name: 'Elizabeth', relationship: 'Bride' },
    { id: '2', name: 'Tim', relationship: 'Groom' },
    { id: '1', name: 'Elizabeth', relationship: 'Bride' }, // Duplicate
  ];

  const unique1 = deduplicatePeople(people1);
  console.log('Test 1: Duplicate by ID');
  console.log(`  Input: 3 people (2 Elizabeths with same ID)`);
  console.log(`  Output: ${unique1.length} people`);
  console.log(`  Status: ${unique1.length === 2 ? '✅' : '❌'}\n`);

  // Test 2: Duplicate by name and relationship
  const people2: Person[] = [
    { id: '1', name: 'Steve', relationship: 'Father' },
    { id: '2', name: 'Steve', relationship: 'Father' },
    { id: '3', name: 'Steve', relationship: 'Uncle' }, // Different relationship, keep it
  ];

  const unique2 = deduplicatePeople(people2);
  console.log('Test 2: Duplicate by name and relationship');
  console.log(`  Input: 3 people (2 Steves with same relationship, 1 Steve as Uncle)`);
  console.log(`  Output: ${unique2.length} people`);
  console.log(`  Status: ${unique2.length === 2 ? '✅' : '❌'}\n`);
}

export function runGroupingFormatTests() {
  console.log('🧪 Running Grouping Format Tests...\n');

  const grouping: Person[] = [
    { id: '1', name: 'Elizabeth', relationship: 'Bride' },
    { id: '2', name: 'Tim', relationship: 'Groom' },
    { id: '3', name: 'Steve', relationship: 'Father of Bride' },
    { id: '4', name: 'Diana', relationship: 'Mother of Bride' },
  ];

  const formatted = formatPortraitGrouping(grouping);
  console.log('Portrait Grouping Format:');
  console.log(`  ${formatted}\n`);

  const analysis = analyzeGrouping(grouping);
  console.log('Grouping Analysis:');
  console.log(`  Total Count: ${analysis.totalCount}`);
  console.log(`  People:`);
  analysis.people.forEach((p) => {
    console.log(`    - ${p.name} (${p.role})`);
  });
  console.log();
}

export function runCategoryTests() {
  console.log('🧪 Running Category Tests...\n');

  const testPeople = [
    { id: '1', name: 'Elizabeth', relationship: 'Bride' },
    { id: '2', name: 'Steve', relationship: 'Father of Bride' },
    { id: '3', name: 'Katie', relationship: 'Sister of Bride' },
    { id: '4', name: 'Grandma Rose', relationship: 'Grandmother' },
    { id: '5', name: 'Uncle Joe', relationship: 'Uncle of Bride' },
    { id: '6', name: 'Aunt Mary', relationship: 'Bridesmaid' },
  ];

  console.log('Immediate Family:');
  testPeople.forEach((person) => {
    if (RelationshipRecognizer.belongsToCategory(person, 'immediate-family')) {
      console.log(`  ✓ ${person.name} (${person.relationship})`);
    }
  });

  console.log('\nExtended Family:');
  testPeople.forEach((person) => {
    if (RelationshipRecognizer.belongsToCategory(person, 'extended-family')) {
      console.log(`  ✓ ${person.name} (${person.relationship})`);
    }
  });

  console.log('\nWedding Party:');
  testPeople.forEach((person) => {
    if (RelationshipRecognizer.belongsToCategory(person, 'wedding-party')) {
      console.log(`  ✓ ${person.name} (${person.relationship})`);
    }
  });
  console.log();
}

export function runMultiRoleTests() {
  console.log('🧪 Running Multi-Role Detection Tests...\n');

  const multiRolePeople = [
    { id: '1', name: 'Katie', relationship: 'Sister of Bride' },
    { id: '2', name: 'Jennifer', relationship: 'Bridesmaid' },
    { id: '3', name: 'Grandmother Rose', relationship: 'Grandmother' },
  ];

  multiRolePeople.forEach((person) => {
    const roles = RelationshipRecognizer.getMultipleRoles(person);
    const primary = RelationshipRecognizer.getPrimaryRole(person);

    console.log(`${person.name} (${person.relationship})`);
    console.log(`  Primary Role: ${RelationshipRecognizer.formatLabel(primary)}`);
    console.log(`  All Roles: ${roles.map((r) => RelationshipRecognizer.formatLabel(r)).join(', ')}`);
    console.log();
  });
}

// Run all tests
export function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   RELATIONSHIP RECOGNITION SYSTEM TEST SUITE');
  console.log('═══════════════════════════════════════════════════════\n');

  runRelationshipRecognitionTests();
  runDeduplicationTests();
  runGroupingFormatTests();
  runCategoryTests();
  runMultiRoleTests();

  console.log('═══════════════════════════════════════════════════════');
  console.log('   All tests completed!');
  console.log('═══════════════════════════════════════════════════════');
}

// Export for use in console or tests
if (typeof window !== 'undefined') {
  (window as any).RelationshipRecognitionTests = {
    runAllTests,
    runRelationshipRecognitionTests,
    runDeduplicationTests,
    runGroupingFormatTests,
    runCategoryTests,
    runMultiRoleTests,
  };
}
