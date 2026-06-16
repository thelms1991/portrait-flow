import { WeddingData, Person } from '@/types/app';
import { RelationshipRecognizer } from './relationshipRecognition';
import {
  formatPortraitGrouping,
  deduplicatePeople,
  isPersonInGroup,
  analyzeGrouping,
} from './portraitGroupingUtils';

export interface PortraitGrouping {
  id: string;
  description: string;
  category: PortraitCategory;
  people: Person[];
  notes?: string;
}

export type PortraitCategory = 
  | 'bride-and-bridesmaids'
  | 'groom-and-groomsmen'
  | 'family-groups'
  | 'couple'
  | 'mixed-groups'
  | 'special-requests'
  | 'reception-portraits'
  | 'other';

/**
 * AI Rules Engine for Wedding Portrait Groupings
 * Automatically generates professional portrait combinations based on wedding party data
 */
export class PortraitGroupingsEngine {
  private weddingData: WeddingData;
  private groupings: PortraitGrouping[] = [];
  private groupIdCounter = 0;

  constructor(weddingData: WeddingData) {
    this.weddingData = weddingData;
  }

  /**
   * Generate all portrait groupings based on wedding data
   */
  public generateGroupings(): PortraitGrouping[] {
    this.groupings = [];
    this.groupIdCounter = 0;

    // Generate efficient portrait flow first (minimizes movement)
    this.generateEfficientPortraitFlow();

    // Then generate other groupings
    this.generateBrideAndBridesmaidsGroupings();
    this.generateGroomAndGroomsmenGroupings();
    this.generateFamilyGroupings();
    this.generateMixedGroupings();
    this.generateSpecialRequestGroupings();
    this.generateReceptionPortraits();

    return this.groupings;
  }

  /**
   * Generate efficient portrait flow ordered from smallest to largest groups
   * Prioritizes elderly family members early to minimize movement
   * Goal: Minimize people entering and leaving photos
   */
  private generateEfficientPortraitFlow(): void {
    const bride = this.getBride();
    const groom = this.getGroom();

    if (!bride || !groom) return;

    // Get family members by type
    const brideGrandparents = this.weddingData.brideFamily.filter((fm) =>
      fm.relationship?.toLowerCase() === 'grandparent'
    );
    const groomGrandparents = this.weddingData.groomFamily.filter((fm) =>
      fm.relationship?.toLowerCase() === 'grandparent'
    );

    const brideParents = this.weddingData.brideFamily.filter((fm) =>
      ['mother', 'father'].includes(fm.relationship?.toLowerCase() || '')
    );
    const groomParents = this.weddingData.groomFamily.filter((fm) =>
      ['mother', 'father'].includes(fm.relationship?.toLowerCase() || '')
    );

    const brideSiblings = this.weddingData.brideFamily.filter(
      (fm) =>
        fm.relationship?.toLowerCase() === 'sibling' &&
        !this.isPersonInWeddingParty(fm)
    );
    const groomSiblings = this.weddingData.groomFamily.filter(
      (fm) =>
        fm.relationship?.toLowerCase() === 'sibling' &&
        !this.isPersonInWeddingParty(fm)
    );

    const brideAuntsUncles = this.weddingData.brideFamily.filter((fm) =>
      ['aunt', 'uncle'].includes(fm.relationship?.toLowerCase() || '')
    );
    const groomAuntsUncles = this.weddingData.groomFamily.filter((fm) =>
      ['aunt', 'uncle'].includes(fm.relationship?.toLowerCase() || '')
    );

    const brideCousins = this.weddingData.brideFamily.filter((fm) =>
      fm.relationship?.toLowerCase() === 'cousin'
    );
    const groomCousins = this.weddingData.groomFamily.filter((fm) =>
      fm.relationship?.toLowerCase() === 'cousin'
    );

    const brideExtendedFamily = this.weddingData.brideFamily.filter(
      (fm) => !['mother', 'father', 'sibling', 'grandparent', 'aunt', 'uncle', 'cousin'].includes(
        fm.relationship?.toLowerCase() || ''
      )
    );
    const groomExtendedFamily = this.weddingData.groomFamily.filter(
      (fm) => !['mother', 'father', 'sibling', 'grandparent', 'aunt', 'uncle', 'cousin'].includes(
        fm.relationship?.toLowerCase() || ''
      )
    );

    // 1. Bride & Groom (smallest group, always start here)
    this.addGrouping([bride, groom], 'Bride & Groom', 'couple');

    // 2. Bride & Groom + Grandparents (prioritize elderly early)
    if (brideGrandparents.length > 0 || groomGrandparents.length > 0) {
      const grandparents = [...brideGrandparents, ...groomGrandparents];
      this.addGrouping(
        [bride, groom, ...grandparents],
        'Bride & Groom + Grandparents',
        'couple'
      );
    }

    // 3. Bride & Groom + Bride's Parents
    if (brideParents.length > 0) {
      this.addGrouping(
        [bride, groom, ...brideParents],
        'Bride & Groom + Bride\'s Parents',
        'couple'
      );
    }

    // 4. Bride & Groom + Groom's Parents
    if (groomParents.length > 0) {
      this.addGrouping(
        [bride, groom, ...groomParents],
        'Bride & Groom + Groom\'s Parents',
        'couple'
      );
    }

    // 5. Bride & Groom + Both Sets of Parents
    if (brideParents.length > 0 && groomParents.length > 0) {
      this.addGrouping(
        [bride, groom, ...brideParents, ...groomParents],
        'Bride & Groom + Both Sets of Parents',
        'couple'
      );
    }

    // 6. Bride & Groom + Bride's Immediate Family (parents + siblings)
    const brideImmediateFamily = [...brideParents, ...brideSiblings];
    if (brideImmediateFamily.length > 0) {
      this.addGrouping(
        [bride, groom, ...brideImmediateFamily],
        'Bride & Groom + Bride\'s Immediate Family',
        'couple'
      );
    }

    // 7. Bride & Groom + Groom's Immediate Family (parents + siblings)
    const groomImmediateFamily = [...groomParents, ...groomSiblings];
    if (groomImmediateFamily.length > 0) {
      this.addGrouping(
        [bride, groom, ...groomImmediateFamily],
        'Bride & Groom + Groom\'s Immediate Family',
        'couple'
      );
    }

    // 8. Bride & Groom + Both Immediate Families
    const allImmediateFamily = [
      ...brideParents,
      ...brideSiblings,
      ...groomParents,
      ...groomSiblings,
    ];
    if (allImmediateFamily.length > 0) {
      this.addGrouping(
        [bride, groom, ...allImmediateFamily],
        'Bride & Groom + Both Immediate Families',
        'couple'
      );
    }

    // 9. Bride & Groom + Aunts and Uncles (growing group)
    const allAuntsUncles = [...brideAuntsUncles, ...groomAuntsUncles];
    if (allAuntsUncles.length > 0) {
      this.addGrouping(
        [bride, groom, ...allAuntsUncles],
        'Bride & Groom + Aunts & Uncles',
        'couple'
      );
    }

    // 10. Bride & Groom + Cousins
    const allCousins = [...brideCousins, ...groomCousins];
    if (allCousins.length > 0) {
      this.addGrouping(
        [bride, groom, ...allCousins],
        'Bride & Groom + Cousins',
        'couple'
      );
    }

    // 11. Bride & Groom + Extended Family (anyone else)
    const allExtendedFamily = [...brideExtendedFamily, ...groomExtendedFamily];
    if (allExtendedFamily.length > 0) {
      this.addGrouping(
        [bride, groom, ...allExtendedFamily],
        'Bride & Groom + Extended Family',
        'couple'
      );
    }
  }

  /**
   * Generate Bride + Bridesmaids groupings
   */
  private generateBrideAndBridesmaidsGroupings(): void {
    const bride = this.getBride();
    if (!bride) return;

    const bridesmaids = this.weddingData.bridesmaids;
    const flowerGirls = this.weddingData.bridesmaids.filter(
      (b) => b.relationship?.toLowerCase().includes('flower girl')
    );
    const juniorBridesmaids = this.weddingData.bridesmaids.filter(
      (b) => b.relationship?.toLowerCase().includes('junior bridesmaid')
    );
    const regularBridesmaids = bridesmaids.filter(
      (b) =>
        !b.relationship?.toLowerCase().includes('flower girl') &&
        !b.relationship?.toLowerCase().includes('junior bridesmaid')
    );

    // Bride + All Bridesmaids + All Flower Girls + All Junior Bridesmaids
    if (bridesmaids.length > 0) {
      this.addGrouping(
        [bride, ...bridesmaids],
        'Bride + All Bridesmaids, Flower Girls & Junior Bridesmaids',
        'bride-and-bridesmaids'
      );
    }

    // Bride + All Bridesmaids
    if (regularBridesmaids.length > 0) {
      this.addGrouping(
        [bride, ...regularBridesmaids],
        'Bride + All Bridesmaids',
        'bride-and-bridesmaids'
      );
    }

    // Bride + All Flower Girls
    if (flowerGirls.length > 0) {
      this.addGrouping(
        [bride, ...flowerGirls],
        'Bride + All Flower Girls',
        'bride-and-bridesmaids'
      );
    }

    // Bride + All Junior Bridesmaids
    if (juniorBridesmaids.length > 0) {
      this.addGrouping(
        [bride, ...juniorBridesmaids],
        'Bride + All Junior Bridesmaids',
        'bride-and-bridesmaids'
      );
    }

    // Bride + Each Regular Bridesmaid Individually
    regularBridesmaids.forEach((bridesmaid) => {
      this.addGrouping(
        [bride, bridesmaid],
        `Bride + ${bridesmaid.name}`,
        'bride-and-bridesmaids'
      );
    });

    // Bride + Each Flower Girl Individually
    flowerGirls.forEach((flowerGirl) => {
      this.addGrouping(
        [bride, flowerGirl],
        `Bride + ${flowerGirl.name}`,
        'bride-and-bridesmaids'
      );
    });

    // Bride + Each Junior Bridesmaid Individually
    juniorBridesmaids.forEach((juniorBridesmaid) => {
      this.addGrouping(
        [bride, juniorBridesmaid],
        `Bride + ${juniorBridesmaid.name}`,
        'bride-and-bridesmaids'
      );
    });
  }

  /**
   * Generate Groom + Groomsmen groupings
   */
  private generateGroomAndGroomsmenGroupings(): void {
    const groom = this.getGroom();
    if (!groom) return;

    const groomsmen = this.weddingData.groomsmen;
    const ringBearers = this.weddingData.groomsmen.filter(
      (g) => g.relationship?.toLowerCase().includes('ring bearer')
    );
    const juniorGroomsmen = this.weddingData.groomsmen.filter(
      (g) => g.relationship?.toLowerCase().includes('junior groomsman')
    );
    const regularGroomsmen = groomsmen.filter(
      (g) =>
        !g.relationship?.toLowerCase().includes('ring bearer') &&
        !g.relationship?.toLowerCase().includes('junior groomsman')
    );

    // Groom + All Groomsmen + All Ring Bearers + All Junior Groomsmen
    if (groomsmen.length > 0) {
      this.addGrouping(
        [groom, ...groomsmen],
        'Groom + All Groomsmen, Ring Bearers & Junior Groomsmen',
        'groom-and-groomsmen'
      );
    }

    // Groom + All Groomsmen
    if (regularGroomsmen.length > 0) {
      this.addGrouping(
        [groom, ...regularGroomsmen],
        'Groom + All Groomsmen',
        'groom-and-groomsmen'
      );
    }

    // Groom + All Ring Bearers
    if (ringBearers.length > 0) {
      this.addGrouping(
        [groom, ...ringBearers],
        'Groom + All Ring Bearers',
        'groom-and-groomsmen'
      );
    }

    // Groom + All Junior Groomsmen
    if (juniorGroomsmen.length > 0) {
      this.addGrouping(
        [groom, ...juniorGroomsmen],
        'Groom + All Junior Groomsmen',
        'groom-and-groomsmen'
      );
    }

    // Groom + Each Groomsman Individually
    regularGroomsmen.forEach((groomsman) => {
      this.addGrouping(
        [groom, groomsman],
        `Groom + ${groomsman.name}`,
        'groom-and-groomsmen'
      );
    });

    // Groom + Each Ring Bearer Individually
    ringBearers.forEach((ringBearer) => {
      this.addGrouping(
        [groom, ringBearer],
        `Groom + ${ringBearer.name}`,
        'groom-and-groomsmen'
      );
    });

    // Groom + Each Junior Groomsman Individually
    juniorGroomsmen.forEach((juniorGroomsman) => {
      this.addGrouping(
        [groom, juniorGroomsman],
        `Groom + ${juniorGroomsman.name}`,
        'groom-and-groomsmen'
      );
    });
  }

  /**
   * Generate family groupings with relationship-based combinations
   */
  private generateFamilyGroupings(): void {
    const bride = this.getBride();
    const groom = this.getGroom();

    if (!bride || !groom) return;

    // Bride's Immediate Family - comprehensive family groupings
    this.generateDetailedFamilyGroupings(bride, this.weddingData.brideFamily, 'Bride');

    // Groom's Immediate Family - comprehensive family groupings
    this.generateDetailedFamilyGroupings(groom, this.weddingData.groomFamily, 'Groom');

    // Generate relationship-overlapping groups
    this.generateRelationshipOverlapGroupings();
  }

  /**
   * Generate detailed family groupings for bride or groom
   * Creates: Individual family members, Family groups by type, Combined family groupings
   */
  private generateDetailedFamilyGroupings(
    primaryPerson: Person,
    familyMembers: Person[],
    primaryLabel: string
  ): void {
    if (familyMembers.length === 0) return;

    // Helper to get unique family members by relationship, excluding bridesmaids/groomsmen
    const getFamilyByRelationship = (relationship: string): Person[] => {
      return familyMembers.filter(
        (fm) =>
          fm.relationship?.toLowerCase() === relationship.toLowerCase() &&
          !this.isPersonInWeddingParty(fm)
      );
    };

    const mothers = getFamilyByRelationship('Mother');
    const fathers = getFamilyByRelationship('Father');
    const siblings = getFamilyByRelationship('Sibling');
    const grandparents = getFamilyByRelationship('Grandparent');

    // Individual groupings: Primary + Mother
    if (mothers.length > 0) {
      mothers.forEach((mother) => {
        this.addGrouping(
          [primaryPerson, mother],
          `${primaryPerson.name} + Mother`,
          'family-groups'
        );
      });
    }

    // Individual groupings: Primary + Father
    if (fathers.length > 0) {
      fathers.forEach((father) => {
        this.addGrouping(
          [primaryPerson, father],
          `${primaryPerson.name} + Father`,
          'family-groups'
        );
      });
    }

    // Individual groupings: Primary + Parents (if both exist)
    const parents = [...mothers, ...fathers];
    if (parents.length > 0) {
      this.addGrouping(
        [primaryPerson, ...parents],
        `${primaryPerson.name} + Parents`,
        'family-groups'
      );
    }

    // Individual groupings: Primary + Each Sibling (avoid duplicates from bridal party)
    if (siblings.length > 0) {
      siblings.forEach((sibling) => {
        this.addGrouping(
          [primaryPerson, sibling],
          `${primaryPerson.name} + ${sibling.name}`,
          'family-groups'
        );
      });

      // Grouped: Primary + All Siblings
      this.addGrouping(
        [primaryPerson, ...siblings],
        `${primaryPerson.name} + Siblings`,
        'family-groups'
      );
    }

    // Individual groupings: Primary + Grandparents
    if (grandparents.length > 0) {
      grandparents.forEach((grandparent) => {
        this.addGrouping(
          [primaryPerson, grandparent],
          `${primaryPerson.name} + ${grandparent.name}`,
          'family-groups'
        );
      });

      // Grouped: Primary + All Grandparents
      this.addGrouping(
        [primaryPerson, ...grandparents],
        `${primaryPerson.name} + Grandparents`,
        'family-groups'
      );
    }

    // All immediate family: Primary + Mother + Father + Siblings + Grandparents
    const allImmediateFamily = [...mothers, ...fathers, ...siblings, ...grandparents];
    if (allImmediateFamily.length > 0) {
      this.addGrouping(
        [primaryPerson, ...allImmediateFamily],
        `${primaryPerson.name} + Immediate Family`,
        'family-groups'
      );
    }

    // Combined: Primary + Parents + Siblings (no grandparents)
    const parentsAndSiblings = [...parents, ...siblings];
    if (parentsAndSiblings.length > 0 && siblings.length > 0) {
      this.addGrouping(
        [primaryPerson, ...parentsAndSiblings],
        `${primaryPerson.name} + Parents + Siblings`,
        'family-groups'
      );
    }

    // Combined: Primary + Grandparents + Parents (no siblings)
    const grandparentsAndParents = [...grandparents, ...parents];
    if (grandparentsAndParents.length > 0 && grandparents.length > 0) {
      this.addGrouping(
        [primaryPerson, ...grandparentsAndParents],
        `${primaryPerson.name} + Grandparents + Parents`,
        'family-groups'
      );
    }
  }

  /**
   * Helper: Check if a person is in the bridal party
   */
  private isPersonInWeddingParty(person: Person): boolean {
    return (
      this.weddingData.bridesmaids.some((bm) => bm.id === person.id) ||
      this.weddingData.groomsmen.some((gm) => gm.id === person.id)
    );
  }

  /**
   * Generate groupings when relationships overlap
   * Example: If Maid of Honor is Sister of Bride
   */
  private generateRelationshipOverlapGroupings(): void {
    const bride = this.getBride();
    const groom = this.getGroom();

    if (!bride || !groom) return;

    // Find bridesmaids who are also in bride's family
    const bridesmaidsInBrideFamily = this.weddingData.bridesmaids.filter((bm) => {
      return this.weddingData.brideFamily.some((fm) => fm.name === bm.name);
    });

    // Find groomsmen who are also in groom's family
    const groomsmenInGroomFamily = this.weddingData.groomsmen.filter((gm) => {
      return this.weddingData.groomFamily.some((fm) => fm.name === gm.name);
    });

    // Bride + Sister (who is Maid of Honor, etc)
    bridesmaidsInBrideFamily.forEach((bridesmaid) => {
      const relationship = bridesmaid.relationship?.toLowerCase() || '';
      const familyRecord = this.weddingData.brideFamily.find(
        (fm) => fm.name === bridesmaid.name
      );

      if (familyRecord) {
        const familyRelation = familyRecord.relationship?.toLowerCase() || '';

        // Add as family relationship grouping
        this.addGrouping(
          [bride, bridesmaid],
          `Bride + ${familyRelation.charAt(0).toUpperCase() + familyRelation.slice(1)}`,
          'family-groups',
          `${bridesmaid.name} is both ${relationship} and ${familyRelation}`
        );
      }
    });

    // Groom + Brother (who is Groomsman, etc)
    groomsmenInGroomFamily.forEach((groomsman) => {
      const relationship = groomsman.relationship?.toLowerCase() || '';
      const familyRecord = this.weddingData.groomFamily.find(
        (fm) => fm.name === groomsman.name
      );

      if (familyRecord) {
        const familyRelation = familyRecord.relationship?.toLowerCase() || '';

        // Add as family relationship grouping
        this.addGrouping(
          [groom, groomsman],
          `Groom + ${familyRelation.charAt(0).toUpperCase() + familyRelation.slice(1)}`,
          'family-groups',
          `${groomsman.name} is both ${relationship} and ${familyRelation}`
        );
      }
    });
  }



  /**
   * Generate mixed groupings (bride's and groom's parties together)
   */
  private generateMixedGroupings(): void {
    const bride = this.getBride();
    const groom = this.getGroom();

    if (!bride || !groom) return;

    // All Bridesmaids + All Groomsmen
    if (
      this.weddingData.bridesmaids.length > 0 &&
      this.weddingData.groomsmen.length > 0
    ) {
      this.addGrouping(
        [
          bride,
          groom,
          ...this.weddingData.bridesmaids,
          ...this.weddingData.groomsmen,
        ],
        'Full Bridal Party',
        'mixed-groups'
      );
    }

    // All Bridesmaids + All Groomsmen (without couple)
    if (
      this.weddingData.bridesmaids.length > 0 &&
      this.weddingData.groomsmen.length > 0
    ) {
      this.addGrouping(
        [...this.weddingData.bridesmaids, ...this.weddingData.groomsmen],
        'All Bridesmaids & All Groomsmen',
        'mixed-groups'
      );
    }

    // Bride + All Groomsmen (fun shot)
    if (this.weddingData.groomsmen.length > 0) {
      this.addGrouping(
        [bride, ...this.weddingData.groomsmen],
        'Bride + All Groomsmen',
        'mixed-groups'
      );
    }

    // Groom + All Bridesmaids (fun shot)
    if (this.weddingData.bridesmaids.length > 0) {
      this.addGrouping(
        [groom, ...this.weddingData.bridesmaids],
        'Groom + All Bridesmaids',
        'mixed-groups'
      );
    }
  }

  /**
   * Generate special request groupings
   */
  private generateSpecialRequestGroupings(): void {
    if (!this.weddingData.specialGroupings || this.weddingData.specialGroupings.length === 0) {
      return;
    }

    this.weddingData.specialGroupings.forEach((grouping) => {
      const people: Person[] = [];

      // Parse the special grouping string to find matching people
      // This is a simple implementation - could be enhanced with more sophisticated parsing
      if (grouping.description) {
        people.push(...this.parsePersonsFromString(grouping.description));
      }

      if (people.length > 0) {
        this.addGrouping(people, grouping.description, 'special-requests');
      }
    });
  }

  /**
   * Generate reception portrait requests
   */
  private generateReceptionPortraits(): void {
    if (!this.weddingData.receptionPortraits || this.weddingData.receptionPortraits.length === 0) {
      return;
    }

    this.weddingData.receptionPortraits.forEach((portrait) => {
      const people: Person[] = [];

      // Parse the reception portrait string
      if (portrait.description) {
        people.push(...this.parsePersonsFromString(portrait.description));
      }

      if (people.length > 0) {
        this.addGrouping(people, portrait.description, 'reception-portraits');
      }
    });
  }

  /**
   * Helper: Add a grouping to the collection
   * Automatically deduplicates people and generates formatted description
   */
  private addGrouping(
    people: Person[],
    description: string,
    category: PortraitCategory,
    notes?: string
  ): void {
    // Deduplicate people first to ensure no one appears twice in the same grouping
    const uniquePeople = deduplicatePeople(people);

    // Avoid duplicates
    const isDuplicate = this.groupings.some((g) => {
      if (g.people.length === uniquePeople.length) {
        return g.people.every((p) => uniquePeople.some((pp) => pp.id === p.id));
      }
      return false;
    });

    if (!isDuplicate && uniquePeople.length > 0) {
      this.groupings.push({
        id: `grouping-${this.groupIdCounter++}`,
        description,
        category,
        people: uniquePeople,
        notes,
      });
    }
  }

  /**
   * Helper: Get bride person object
   */
  private getBride(): Person | undefined {
    return {
      id: 'bride',
      name: this.weddingData.brideFirstName + ' ' + this.weddingData.brideLastName,
      relationship: 'Bride',
    };
  }

  /**
   * Helper: Get groom person object
   */
  private getGroom(): Person | undefined {
    return {
      id: 'groom',
      name: this.weddingData.groomFirstName + ' ' + this.weddingData.groomLastName,
      relationship: 'Groom',
    };
  }

  /**
   * Helper: Group people by relationship type
   */
  private groupByRelationship(people: Person[]): Array<{ relationship: string; members: Person[] }> {
    const grouped: Map<string, Person[]> = new Map();

    people.forEach((person) => {
      const rel = person.relationship || 'Other';
      if (!grouped.has(rel)) {
        grouped.set(rel, []);
      }
      grouped.get(rel)!.push(person);
    });

    return Array.from(grouped.entries()).map(([relationship, members]) => ({
      relationship,
      members,
    }));
  }

  /**
   * Helper: Parse persons from a description string
   * This is a simple implementation - matches names in the database
   */
  private parsePersonsFromString(description: string): Person[] {
    const people: Person[] = [];
    const allPeople = [
      { id: 'bride', name: this.getBride()?.name || '', relationship: 'Bride' },
      { id: 'groom', name: this.getGroom()?.name || '', relationship: 'Groom' },
      ...this.weddingData.bridesmaids,
      ...this.weddingData.groomsmen,
      ...this.weddingData.brideFamily,
      ...this.weddingData.groomFamily,
    ];

    allPeople.forEach((person) => {
      if (
        description.toLowerCase().includes(person.name.toLowerCase()) &&
        !people.some((p) => p.id === person.id)
      ) {
        people.push(person);
      }
    });

    return people;
  }
}

/**
 * Main export function for generating all portrait groupings
 */
export function generateAllPortraitGroupings(
  weddingData: WeddingData
): PortraitGrouping[] {
  const engine = new PortraitGroupingsEngine(weddingData);
  return engine.generateGroupings();
}
