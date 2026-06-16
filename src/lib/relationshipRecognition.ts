import { Person } from '@/types/app';

/**
 * Comprehensive relationship type definitions
 */
export type RelationshipType =
  // Primary partners (gender-neutral)
  | 'partner'
  | 'co-bride'
  | 'co-groom'
  | 'non-binary-partner'
  
  // Traditional roles (kept for compatibility)
  | 'bride'
  | 'groom'
  
  // Parents (support multiple and diverse families)
  | 'mother'
  | 'father'
  | 'parent'
  | 'co-mother'
  | 'co-father'
  | 'co-parent'
  | 'mother-of-partner1'
  | 'father-of-partner1'
  | 'parent-of-partner1'
  | 'mother-of-partner2'
  | 'father-of-partner2'
  | 'parent-of-partner2'
  | 'step-parent'
  | 'step-mother'
  | 'step-father'
  | 'adoptive-parent'
  | 'adoptive-mother'
  | 'adoptive-father'
  
  // Bride-specific parents (kept for backward compatibility)
  | 'mother-of-bride'
  | 'father-of-bride'
  
  // Groom-specific parents (kept for backward compatibility)
  | 'mother-of-groom'
  | 'father-of-groom'
  
  // Siblings
  | 'sister'
  | 'brother'
  | 'sibling'
  | 'sister-of-partner1'
  | 'brother-of-partner1'
  | 'sibling-of-partner1'
  | 'sister-of-partner2'
  | 'brother-of-partner2'
  | 'sibling-of-partner2'
  | 'sister-of-bride'
  | 'brother-of-bride'
  | 'sister-of-groom'
  | 'brother-of-groom'
  | 'step-sibling'
  | 'step-sister'
  | 'step-brother'
  
  // Wedding party (gender-neutral)
  | 'attendant'
  | 'side1-attendant'
  | 'side2-attendant'
  | 'bridesmaid'
  | 'groomsman'
  | 'best-person'
  | 'honor-attendant'
  | 'maid-of-honor'
  | 'matron-of-honor'
  
  // Grandparents
  | 'grandparent'
  | 'grandmother'
  | 'grandfather'
  
  // Extended family
  | 'aunt'
  | 'aunt-of-partner1'
  | 'aunt-of-partner2'
  | 'aunt-of-bride'
  | 'aunt-of-groom'
  | 'uncle'
  | 'uncle-of-partner1'
  | 'uncle-of-partner2'
  | 'uncle-of-bride'
  | 'uncle-of-groom'
  | 'cousin'
  | 'cousin-of-partner1'
  | 'cousin-of-partner2'
  | 'cousin-of-bride'
  | 'cousin-of-groom'
  
  | 'other';

/**
 * Parsed relationship with recognized relationships and family side
 */
export interface ParsedRelationship {
  rawInput: string;
  normalizedType: RelationshipType;
  familySide: 'bride' | 'groom' | 'unknown';
  relationships: RelationshipType[]; // All applicable relationships (e.g., "Sister" + "Bridesmaid")
  primaryRole: RelationshipType; // The most important role
  displayLabel: string; // Human-readable label
}

/**
 * Relationship recognition patterns
 */
const RELATIONSHIP_PATTERNS = {
  // Bride/Groom
  bride: /^bride$/i,
  groom: /^groom$/i,

  // Direct parents
  mother: /mother|^mom$|^ma$/i,
  father: /father|^dad$|^pa$/i,

  // Bride's parents
  motherOfBride: /mother\s*of\s*bride|bride.*mother|bride.*mom/i,
  fatherOfBride: /father\s*of\s*bride|bride.*father|bride.*dad/i,

  // Groom's parents
  motherOfGroom: /mother\s*of\s*groom|groom.*mother|groom.*mom/i,
  fatherOfGroom: /father\s*of\s*groom|groom.*father|groom.*dad/i,

  // Siblings
  sister: /sister|^sis$/i,
  brother: /brother|^bro$/i,

  // Bride's siblings
  sisterOfBride: /sister\s*of\s*bride|bride.*sister|bride.*sis/i,
  brotherOfBride: /brother\s*of\s*bride|bride.*brother|bride.*bro/i,

  // Groom's siblings
  sisterOfGroom: /sister\s*of\s*groom|groom.*sister|groom.*sis/i,
  brotherOfGroom: /brother\s*of\s*groom|groom.*brother|groom.*bro/i,

  // Wedding party
  bridesmaid: /bridesmaid|maid\s*of\s*honor|matron\s*of\s*honor|bride.*attendant/i,
  groomsman: /groomsman|best\s*man|groom.*attendant|usher/i,

  // Grandparents
  grandparent: /grandparent|grandma|grandpa|grandmother|grandfather|nana|papa/i,
  grandmother: /grandmother|grandma|nana|gram/i,
  grandfather: /grandfather|grandpa|papa|gramps/i,

  // Step relations
  stepParent: /step[\s-]?parent|stepparent/i,
  stepMother: /step[\s-]?mother|stepmother/i,
  stepFather: /step[\s-]?father|stepfather/i,
  stepSibling: /step[\s-]?sibling|stepsib/i,
  stepSister: /step[\s-]?sister|stepsister/i,
  stepBrother: /step[\s-]?brother|stepbrother/i,

  // Extended family
  aunt: /aunt|auntie|aunty/i,
  auntOfBride: /aunt\s*of\s*bride|bride.*aunt/i,
  auntOfGroom: /aunt\s*of\s*groom|groom.*aunt/i,

  uncle: /uncle|unk/i,
  uncleOfBride: /uncle\s*of\s*bride|bride.*uncle/i,
  uncleOfGroom: /uncle\s*of\s*groom|groom.*uncle/i,

  cousin: /cousin|cuz/i,
  cousinOfBride: /cousin\s*of\s*bride|bride.*cousin/i,
  cousinOfGroom: /cousin\s*of\s*groom|groom.*cousin/i,
};

/**
 * Relationship Recognition Engine
 * Parses natural language relationship inputs and recognizes multiple roles
 */
export class RelationshipRecognizer {
  /**
   * Recognize and parse a relationship string
   * Example: "Maid of Honor" -> { normalizedType: 'bridesmaid', relationships: ['bridesmaid'] }
   */
  static recognize(input: string, context?: 'bride-side' | 'groom-side'): ParsedRelationship {
    const normalized = input.trim().toLowerCase();

    // Check all patterns and collect matching relationship types
    const matchedRelationships: RelationshipType[] = [];
    let familySide: 'bride' | 'groom' | 'unknown' = context
      ? context === 'bride-side'
        ? 'bride'
        : 'groom'
      : 'unknown';

    // Check for explicit family side indicators
    if (normalized.includes('bride')) familySide = 'bride';
    if (normalized.includes('groom')) familySide = 'groom';

    // Bride & Groom (special case)
    if (RELATIONSHIP_PATTERNS.bride.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'bride',
        familySide: 'bride',
        relationships: ['bride'],
        primaryRole: 'bride',
        displayLabel: 'Bride',
      };
    }
    if (RELATIONSHIP_PATTERNS.groom.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'groom',
        familySide: 'groom',
        relationships: ['groom'],
        primaryRole: 'groom',
        displayLabel: 'Groom',
      };
    }

    // Check specific relationships with family side
    if (RELATIONSHIP_PATTERNS.motherOfBride.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'mother-of-bride',
        familySide: 'bride',
        relationships: ['mother-of-bride', 'mother'],
        primaryRole: 'mother-of-bride',
        displayLabel: 'Mother of Bride',
      };
    }
    if (RELATIONSHIP_PATTERNS.fatherOfBride.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'father-of-bride',
        familySide: 'bride',
        relationships: ['father-of-bride', 'father'],
        primaryRole: 'father-of-bride',
        displayLabel: 'Father of Bride',
      };
    }
    if (RELATIONSHIP_PATTERNS.motherOfGroom.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'mother-of-groom',
        familySide: 'groom',
        relationships: ['mother-of-groom', 'mother'],
        primaryRole: 'mother-of-groom',
        displayLabel: 'Mother of Groom',
      };
    }
    if (RELATIONSHIP_PATTERNS.fatherOfGroom.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'father-of-groom',
        familySide: 'groom',
        relationships: ['father-of-groom', 'father'],
        primaryRole: 'father-of-groom',
        displayLabel: 'Father of Groom',
      };
    }

    // Bride's siblings
    if (RELATIONSHIP_PATTERNS.sisterOfBride.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'sister-of-bride',
        familySide: 'bride',
        relationships: ['sister-of-bride', 'sister'],
        primaryRole: 'sister-of-bride',
        displayLabel: 'Sister of Bride',
      };
    }
    if (RELATIONSHIP_PATTERNS.brotherOfBride.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'brother-of-bride',
        familySide: 'bride',
        relationships: ['brother-of-bride', 'brother'],
        primaryRole: 'brother-of-bride',
        displayLabel: 'Brother of Bride',
      };
    }

    // Groom's siblings
    if (RELATIONSHIP_PATTERNS.sisterOfGroom.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'sister-of-groom',
        familySide: 'groom',
        relationships: ['sister-of-groom', 'sister'],
        primaryRole: 'sister-of-groom',
        displayLabel: 'Sister of Groom',
      };
    }
    if (RELATIONSHIP_PATTERNS.brotherOfGroom.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'brother-of-groom',
        familySide: 'groom',
        relationships: ['brother-of-groom', 'brother'],
        primaryRole: 'brother-of-groom',
        displayLabel: 'Brother of Groom',
      };
    }

    // Wedding party (combine with potential family relationships)
    if (RELATIONSHIP_PATTERNS.bridesmaid.test(normalized)) {
      matchedRelationships.push('bridesmaid');
      familySide = 'bride';
    }
    if (RELATIONSHIP_PATTERNS.groomsman.test(normalized)) {
      matchedRelationships.push('groomsman');
      familySide = 'groom';
    }

    // Step relations
    if (RELATIONSHIP_PATTERNS.stepMother.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'step-mother',
        familySide,
        relationships: ['step-mother', 'step-parent'],
        primaryRole: 'step-mother',
        displayLabel: 'Step Mother',
      };
    }
    if (RELATIONSHIP_PATTERNS.stepFather.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'step-father',
        familySide,
        relationships: ['step-father', 'step-parent'],
        primaryRole: 'step-father',
        displayLabel: 'Step Father',
      };
    }
    if (RELATIONSHIP_PATTERNS.stepSister.test(normalized)) {
      matchedRelationships.push('step-sister');
      matchedRelationships.push('step-sibling');
    }
    if (RELATIONSHIP_PATTERNS.stepBrother.test(normalized)) {
      matchedRelationships.push('step-brother');
      matchedRelationships.push('step-sibling');
    }
    if (
      RELATIONSHIP_PATTERNS.stepParent.test(normalized) &&
      matchedRelationships.length === 0
    ) {
      return {
        rawInput: input,
        normalizedType: 'step-parent',
        familySide,
        relationships: ['step-parent'],
        primaryRole: 'step-parent',
        displayLabel: 'Step Parent',
      };
    }
    if (
      RELATIONSHIP_PATTERNS.stepSibling.test(normalized) &&
      matchedRelationships.length === 0
    ) {
      return {
        rawInput: input,
        normalizedType: 'step-sibling',
        familySide,
        relationships: ['step-sibling'],
        primaryRole: 'step-sibling',
        displayLabel: 'Step Sibling',
      };
    }

    // Grandparents
    if (RELATIONSHIP_PATTERNS.grandmother.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'grandmother',
        familySide,
        relationships: ['grandmother', 'grandparent'],
        primaryRole: 'grandmother',
        displayLabel: 'Grandmother',
      };
    }
    if (RELATIONSHIP_PATTERNS.grandfather.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'grandfather',
        familySide,
        relationships: ['grandfather', 'grandparent'],
        primaryRole: 'grandfather',
        displayLabel: 'Grandfather',
      };
    }
    if (RELATIONSHIP_PATTERNS.grandparent.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'grandparent',
        familySide,
        relationships: ['grandparent'],
        primaryRole: 'grandparent',
        displayLabel: 'Grandparent',
      };
    }

    // Extended family with family side
    if (RELATIONSHIP_PATTERNS.auntOfBride.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'aunt-of-bride',
        familySide: 'bride',
        relationships: ['aunt-of-bride', 'aunt'],
        primaryRole: 'aunt-of-bride',
        displayLabel: 'Aunt of Bride',
      };
    }
    if (RELATIONSHIP_PATTERNS.auntOfGroom.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'aunt-of-groom',
        familySide: 'groom',
        relationships: ['aunt-of-groom', 'aunt'],
        primaryRole: 'aunt-of-groom',
        displayLabel: 'Aunt of Groom',
      };
    }
    if (RELATIONSHIP_PATTERNS.uncleOfBride.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'uncle-of-bride',
        familySide: 'bride',
        relationships: ['uncle-of-bride', 'uncle'],
        primaryRole: 'uncle-of-bride',
        displayLabel: 'Uncle of Bride',
      };
    }
    if (RELATIONSHIP_PATTERNS.uncleOfGroom.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'uncle-of-groom',
        familySide: 'groom',
        relationships: ['uncle-of-groom', 'uncle'],
        primaryRole: 'uncle-of-groom',
        displayLabel: 'Uncle of Groom',
      };
    }
    if (RELATIONSHIP_PATTERNS.cousinOfBride.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'cousin-of-bride',
        familySide: 'bride',
        relationships: ['cousin-of-bride', 'cousin'],
        primaryRole: 'cousin-of-bride',
        displayLabel: 'Cousin of Bride',
      };
    }
    if (RELATIONSHIP_PATTERNS.cousinOfGroom.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'cousin-of-groom',
        familySide: 'groom',
        relationships: ['cousin-of-groom', 'cousin'],
        primaryRole: 'cousin-of-groom',
        displayLabel: 'Cousin of Groom',
      };
    }

    // Generic extended family
    if (RELATIONSHIP_PATTERNS.aunt.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'aunt',
        familySide,
        relationships: ['aunt'],
        primaryRole: 'aunt',
        displayLabel: 'Aunt',
      };
    }
    if (RELATIONSHIP_PATTERNS.uncle.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'uncle',
        familySide,
        relationships: ['uncle'],
        primaryRole: 'uncle',
        displayLabel: 'Uncle',
      };
    }
    if (RELATIONSHIP_PATTERNS.cousin.test(normalized)) {
      return {
        rawInput: input,
        normalizedType: 'cousin',
        familySide,
        relationships: ['cousin'],
        primaryRole: 'cousin',
        displayLabel: 'Cousin',
      };
    }

    // Generic siblings
    if (RELATIONSHIP_PATTERNS.sister.test(normalized)) {
      matchedRelationships.push('sister');
    }
    if (RELATIONSHIP_PATTERNS.brother.test(normalized)) {
      matchedRelationships.push('brother');
    }

    // Generic parents
    if (RELATIONSHIP_PATTERNS.mother.test(normalized) && matchedRelationships.length === 0) {
      return {
        rawInput: input,
        normalizedType: 'mother',
        familySide,
        relationships: ['mother'],
        primaryRole: 'mother',
        displayLabel: 'Mother',
      };
    }
    if (RELATIONSHIP_PATTERNS.father.test(normalized) && matchedRelationships.length === 0) {
      return {
        rawInput: input,
        normalizedType: 'father',
        familySide,
        relationships: ['father'],
        primaryRole: 'father',
        displayLabel: 'Father',
      };
    }

    // If wedding party was matched, return it
    if (matchedRelationships.length > 0) {
      return {
        rawInput: input,
        normalizedType: matchedRelationships[0] as RelationshipType,
        familySide,
        relationships: matchedRelationships,
        primaryRole: matchedRelationships[0] as RelationshipType,
        displayLabel: this.formatLabel(matchedRelationships[0]),
      };
    }

    // Fallback: unrecognized relationship
    return {
      rawInput: input,
      normalizedType: 'other',
      familySide: 'unknown',
      relationships: ['other'],
      primaryRole: 'other',
      displayLabel: input,
    };
  }

  /**
   * Format a relationship type into human-readable label
   */
  static formatLabel(type: RelationshipType): string {
    const labels: Record<RelationshipType, string> = {
      // Primary partners
      partner: 'Partner',
      'co-bride': 'Co-Bride',
      'co-groom': 'Co-Groom',
      'non-binary-partner': 'Non-Binary Partner',
      
      // Traditional
      bride: 'Bride',
      groom: 'Groom',
      
      // Parents (generic)
      mother: 'Mother',
      father: 'Father',
      parent: 'Parent',
      'co-mother': 'Co-Mother',
      'co-father': 'Co-Father',
      'co-parent': 'Co-Parent',
      
      // Adoptive parents
      'adoptive-parent': 'Adoptive Parent',
      'adoptive-mother': 'Adoptive Mother',
      'adoptive-father': 'Adoptive Father',
      
      // Traditional bride/groom parents
      'mother-of-bride': 'Mother of Bride',
      'father-of-bride': 'Father of Bride',
      'mother-of-groom': 'Mother of Groom',
      'father-of-groom': 'Father of Groom',
      
      // Siblings
      sister: 'Sister',
      brother: 'Brother',
      sibling: 'Sibling',
      'sister-of-partner1': 'Sister of Partner 1',
      'brother-of-partner1': 'Brother of Partner 1',
      'sibling-of-partner1': 'Sibling of Partner 1',
      'sister-of-partner2': 'Sister of Partner 2',
      'brother-of-partner2': 'Brother of Partner 2',
      'sibling-of-partner2': 'Sibling of Partner 2',
      'sister-of-bride': 'Sister of Bride',
      'brother-of-bride': 'Brother of Bride',
      'sister-of-groom': 'Sister of Groom',
      'brother-of-groom': 'Brother of Groom',
      
      // Wedding party
      attendant: 'Attendant',
      'side1-attendant': 'Side 1 Attendant',
      'side2-attendant': 'Side 2 Attendant',
      bridesmaid: 'Bridesmaid',
      groomsman: 'Groomsman',
      'best-person': 'Best Person',
      'honor-attendant': 'Honor Attendant',
      'maid-of-honor': 'Maid of Honor',
      'matron-of-honor': 'Matron of Honor',
      
      // Grandparents
      grandparent: 'Grandparent',
      grandmother: 'Grandmother',
      grandfather: 'Grandfather',
      
      // Step relations
      'step-parent': 'Step Parent',
      'step-mother': 'Step Mother',
      'step-father': 'Step Father',
      'step-sibling': 'Step Sibling',
      'step-sister': 'Step Sister',
      'step-brother': 'Step Brother',
      
      // Extended family
      aunt: 'Aunt',
      'aunt-of-partner1': 'Aunt of Partner 1',
      'aunt-of-partner2': 'Aunt of Partner 2',
      'aunt-of-bride': 'Aunt of Bride',
      'aunt-of-groom': 'Aunt of Groom',
      uncle: 'Uncle',
      'uncle-of-partner1': 'Uncle of Partner 1',
      'uncle-of-partner2': 'Uncle of Partner 2',
      'uncle-of-bride': 'Uncle of Bride',
      'uncle-of-groom': 'Uncle of Groom',
      cousin: 'Cousin',
      'cousin-of-partner1': 'Cousin of Partner 1',
      'cousin-of-partner2': 'Cousin of Partner 2',
      'cousin-of-bride': 'Cousin of Bride',
      'cousin-of-groom': 'Cousin of Groom',
      
      other: 'Other',
    };
    return labels[type] || type;
  }

  /**
   * Check if a person has a specific relationship type
   */
  static hasRelationship(person: Person, relationshipType: RelationshipType): boolean {
    const parsed = this.recognize(person.relationship);
    return parsed.relationships.includes(relationshipType);
  }

  /**
   * Check if a person belongs to a category (for grouping logic)
   * Example: Check if someone is in "Immediate Family"
   */
  static belongsToCategory(person: Person, category: 'immediate-family' | 'extended-family' | 'wedding-party'): boolean {
    const parsed = this.recognize(person.relationship);
    const { relationships } = parsed;

    if (category === 'immediate-family') {
      return relationships.some((rel) =>
        [
          'mother',
          'father',
          'parent',
          'co-mother',
          'co-father',
          'co-parent',
          'adoptive-mother',
          'adoptive-father',
          'adoptive-parent',
          'mother-of-bride',
          'father-of-bride',
          'mother-of-groom',
          'father-of-groom',
          'sister',
          'brother',
          'sibling',
          'sister-of-bride',
          'brother-of-bride',
          'sister-of-groom',
          'brother-of-groom',
          'sister-of-partner1',
          'brother-of-partner1',
          'sibling-of-partner1',
          'sister-of-partner2',
          'brother-of-partner2',
          'sibling-of-partner2',
          'step-parent',
          'step-mother',
          'step-father',
          'step-sibling',
          'step-sister',
          'step-brother',
        ].includes(rel)
      );
    }

    if (category === 'extended-family') {
      return relationships.some((rel) =>
        [
          'grandparent',
          'grandmother',
          'grandfather',
          'aunt',
          'aunt-of-bride',
          'aunt-of-groom',
          'aunt-of-partner1',
          'aunt-of-partner2',
          'uncle',
          'uncle-of-bride',
          'uncle-of-groom',
          'uncle-of-partner1',
          'uncle-of-partner2',
          'cousin',
          'cousin-of-bride',
          'cousin-of-groom',
          'cousin-of-partner1',
          'cousin-of-partner2',
        ].includes(rel)
      );
    }

    if (category === 'wedding-party') {
      return relationships.some((rel) =>
        [
          'bridesmaid',
          'groomsman',
          'attendant',
          'side1-attendant',
          'side2-attendant',
          'best-person',
          'honor-attendant',
          'maid-of-honor',
          'matron-of-honor',
        ].includes(rel)
      );
    }

    return false;
  }

  /**
   * Detect if a person has multiple roles
   * Example: "Sister of Bride" + "Bridesmaid"
   */
  static getMultipleRoles(person: Person): RelationshipType[] {
    const parsed = this.recognize(person.relationship);
    return parsed.relationships;
  }

  /**
   * Get the primary role (most important relationship)
   */
  static getPrimaryRole(person: Person): RelationshipType {
    const parsed = this.recognize(person.relationship);
    return parsed.primaryRole;
  }
}
