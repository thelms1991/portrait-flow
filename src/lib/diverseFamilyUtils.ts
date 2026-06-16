import { WeddingData, Person } from '@/types/app';

/**
 * Utilities for diverse family structures
 * Supports: same-sex weddings, multiple parents, step-parents, adoptive families, non-binary partners
 */

/**
 * Determine primary partner labels based on wedding type
 */
export function getPartnerLabels(weddingData: WeddingData): { partner1Label: string; partner2Label: string } {
  if (weddingData.partner1Role && weddingData.partner2Role) {
    return {
      partner1Label: weddingData.partner1Role,
      partner2Label: weddingData.partner2Role,
    };
  }

  switch (weddingData.weddingType) {
    case 'two-brides':
      return { partner1Label: 'Bride', partner2Label: 'Co-Bride' };
    case 'two-grooms':
      return { partner1Label: 'Groom', partner2Label: 'Co-Groom' };
    case 'same-sex':
      // Determine by gender
      if (weddingData.partner1Gender === 'female' && weddingData.partner2Gender === 'female') {
        return { partner1Label: 'Bride', partner2Label: 'Co-Bride' };
      }
      if (weddingData.partner1Gender === 'male' && weddingData.partner2Gender === 'male') {
        return { partner1Label: 'Groom', partner2Label: 'Co-Groom' };
      }
      return { partner1Label: 'Partner 1', partner2Label: 'Partner 2' };
    case 'non-binary':
      return { partner1Label: 'Partner', partner2Label: 'Partner' };
    case 'custom':
      return { partner1Label: 'Partner 1', partner2Label: 'Partner 2' };
    default:
      return { partner1Label: 'Bride', partner2Label: 'Groom' };
  }
}

/**
 * Get attendant labels (instead of hardcoded bridesmaids/groomsmen)
 */
export function getAttendantLabels(weddingData: WeddingData): {
  side1AttendantLabel: string;
  side2AttendantLabel: string;
} {
  const { partner1Label, partner2Label } = getPartnerLabels(weddingData);

  return {
    side1AttendantLabel: `${partner1Label} Attendant`,
    side2AttendantLabel: `${partner2Label} Attendant`,
  };
}

/**
 * Get family labels based on wedding type and partner names
 */
export function getFamilyLabels(
  weddingData: WeddingData
): { family1Label: string; family2Label: string; sharedFamilyLabel: string } {
  const partner1Name = weddingData.partner1FirstName;
  const partner2Name = weddingData.partner2FirstName;

  switch (weddingData.weddingType) {
    case 'same-sex':
    case 'two-brides':
    case 'two-grooms':
      return {
        family1Label: `${partner1Name}'s Family`,
        family2Label: `${partner2Name}'s Family`,
        sharedFamilyLabel: 'Shared Family',
      };
    case 'non-binary':
    case 'custom':
      return {
        family1Label: `${partner1Name}'s Family`,
        family2Label: `${partner2Name}'s Family`,
        sharedFamilyLabel: 'Shared Family',
      };
    default:
      return {
        family1Label: "Bride's Family",
        family2Label: "Groom's Family",
        sharedFamilyLabel: 'Shared Family',
      };
  }
}

/**
 * Detect if a person has a custom label (for display purposes)
 */
export function getPersonDisplayLabel(person: Person, weddingData?: WeddingData): string {
  // If person has a custom label, use it
  if (person.customLabel) {
    return person.customLabel;
  }

  // Otherwise, use the relationship field
  return person.relationship;
}

/**
 * Merge legacy wedding data to new format
 */
export function migrateWeddingDataToNewFormat(legacyData: any): WeddingData {
  const migratedData: WeddingData = {
    weddingType: 'traditional',
    partner1FirstName: legacyData.brideFirstName || '',
    partner1LastName: legacyData.brideLastName || '',
    partner1Role: 'Bride',
    partner2FirstName: legacyData.groomFirstName || '',
    partner2LastName: legacyData.groomLastName || '',
    partner2Role: 'Groom',
    weddingDate: legacyData.weddingDate || '',
    ceremonyLocation: legacyData.ceremonyLocation || '',
    receptionLocation: legacyData.receptionLocation || '',
    side1Attendants: legacyData.bridesmaids || [],
    side2Attendants: legacyData.groomsmen || [],
    partner1Family: legacyData.brideFamily || [],
    partner2Family: legacyData.groomFamily || [],
    specialGroupings: legacyData.specialGroupings || [],
    receptionPortraits: legacyData.receptionPortraits || [],
    // Keep legacy fields
    brideFirstName: legacyData.brideFirstName,
    brideLastName: legacyData.brideLastName,
    groomFirstName: legacyData.groomFirstName,
    groomLastName: legacyData.groomLastName,
    bridesmaids: legacyData.bridesmaids,
    groomsmen: legacyData.groomsmen,
    brideFamily: legacyData.brideFamily,
    groomFamily: legacyData.groomFamily,
  };

  return migratedData;
}

/**
 * Group all family members including shared/blended families
 */
export function getAllFamilyMembers(weddingData: WeddingData): {
  family1: Person[];
  family2: Person[];
  shared: Person[];
} {
  return {
    family1: weddingData.partner1Family || [],
    family2: weddingData.partner2Family || [],
    shared: weddingData.sharedFamily || [],
  };
}

/**
 * Format a relationship for display with custom labels support
 */
export function formatRelationshipDisplay(
  person: Person,
  weddingData?: WeddingData,
  context?: 'family1' | 'family2' | 'shared'
): string {
  if (person.customLabel) {
    return person.customLabel;
  }

  // If we have context about which family they belong to, we could enhance the label
  // e.g., "Mother (Partner 1's Side)" for divorced/blended families
  if (context && weddingData) {
    const { family1Label, family2Label, sharedFamilyLabel } = getFamilyLabels(weddingData);
    const familyLabel =
      context === 'family1' ? family1Label : context === 'family2' ? family2Label : sharedFamilyLabel;
    const baseName = person.relationship;

    // For common relationships, we might enhance them
    if (['mother', 'father', 'parent'].some((r) => baseName.toLowerCase().includes(r))) {
      return `${baseName} (${familyLabel})`;
    }
  }

  return person.relationship;
}

/**
 * Check if wedding has multiple parents for a partner (blended/same-sex families)
 */
export function hasMultipleParents(
  family: Person[],
  parentTypes: string[] = ['mother', 'father', 'parent']
): boolean {
  const parentCount = family.filter((p) =>
    parentTypes.some((type) => p.relationship.toLowerCase().includes(type))
  ).length;

  return parentCount > 1;
}

/**
 * Check if wedding has adoptive family
 */
export function hasAdoptiveFamily(family: Person[]): boolean {
  return family.some((p) =>
    ['adoptive', 'adopt'].some((term) => p.relationship.toLowerCase().includes(term))
  );
}

/**
 * Check if wedding has step-family
 */
export function hasStepFamily(family: Person[]): boolean {
  return family.some((p) => p.relationship.toLowerCase().includes('step'));
}

/**
 * Check if wedding is truly blended (multiple family structures)
 */
export function isBlendedWedding(weddingData: WeddingData): boolean {
  const { family1, family2, shared } = getAllFamilyMembers(weddingData);

  const hasMultipleStructures =
    [family1, family2, shared].filter((f) => f.length > 0).length > 2 || shared.length > 0;
  const hasComplexFamilyStructure =
    hasMultipleParents(family1) ||
    hasMultipleParents(family2) ||
    hasStepFamily(family1) ||
    hasStepFamily(family2) ||
    hasAdoptiveFamily(family1) ||
    hasAdoptiveFamily(family2);

  return hasMultipleStructures || hasComplexFamilyStructure;
}
