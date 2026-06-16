import { Person } from '@/types/app';
import { RelationshipRecognizer } from './relationshipRecognition';

/**
 * Utilities for managing portrait groupings
 * Handles duplicate prevention, person deduplication, and smart grouping
 */

/**
 * Check if two people are the same person
 */
export function areSamePerson(person1: Person, person2: Person): boolean {
  return (
    person1.id === person2.id ||
    (person1.name.toLowerCase().trim() === person2.name.toLowerCase().trim() &&
      person1.relationship?.toLowerCase() === person2.relationship?.toLowerCase())
  );
}

/**
 * Remove duplicate people from a group
 * Keeps the first occurrence, removes subsequent duplicates
 */
export function deduplicatePeople(people: Person[]): Person[] {
  const seen = new Set<string>();
  return people.filter((person) => {
    const key = `${person.name.toLowerCase().trim()}|${person.id}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Generate a formatted description for a portrait grouping
 * Example: "Elizabeth (Bride) + Tim (Groom) + Steve (Father of Bride) + Diana (Mother of Bride)"
 */
export function formatPortraitGrouping(people: Person[]): string {
  const deduplicated = deduplicatePeople(people);

  if (deduplicated.length === 0) {
    return '';
  }

  return deduplicated
    .map((person) => {
      const relationship = RelationshipRecognizer.recognize(person.relationship);
      return `${person.name} (${relationship.displayLabel})`;
    })
    .join(' + ');
}

/**
 * Create a short version of the grouping (just names)
 */
export function formatPortraitGroupingShort(people: Person[]): string {
  const deduplicated = deduplicatePeople(people);
  if (deduplicated.length === 0) {
    return '';
  }
  return deduplicated.map((person) => person.name).join(' + ');
}

/**
 * Intelligently group people by considering:
 * 1. Remove duplicates
 * 2. Keep primary role representation only (e.g., if someone is both sister and bridesmaid, include them appropriately)
 * 3. Maintain family groupings
 */
export function smartGroupPeople(
  people: Person[],
  options?: {
    excludeDuplicateRelationships?: boolean; // If true, don't include same person with different relationship strings
    prioritizePrimaryRole?: boolean; // If true, use only the primary role in description
  }
): Person[] {
  let result = deduplicatePeople(people);

  if (options?.excludeDuplicateRelationships) {
    // Keep track of which names we've seen to avoid the same person in different roles
    const seenNames = new Map<string, Person>();
    result = result.filter((person) => {
      const nameLower = person.name.toLowerCase().trim();
      if (seenNames.has(nameLower)) {
        return false; // Already included this person
      }
      seenNames.set(nameLower, person);
      return true;
    });
  }

  return result;
}

/**
 * Verify that a person should only appear once in a grouping
 * Returns true if the person is already in the group
 */
export function isPersonInGroup(person: Person, group: Person[]): boolean {
  return group.some((p) => areSamePerson(p, person));
}

/**
 * Add a person to a group, avoiding duplicates
 */
export function addPersonToGroup(person: Person, group: Person[]): Person[] {
  if (isPersonInGroup(person, group)) {
    return group;
  }
  return [...group, person];
}

/**
 * Remove a person from a group
 */
export function removePersonFromGroup(person: Person, group: Person[]): Person[] {
  return group.filter((p) => !areSamePerson(p, person));
}

/**
 * Create a detailed breakdown of a portrait grouping
 * Useful for display in the photographer review screen
 */
export interface GroupingBreakdown {
  summary: string; // Full formatted string: "Bride & Groom + Parents"
  people: Array<{
    name: string;
    role: string;
    roleType: string;
  }>;
  totalCount: number;
}

export function analyzeGrouping(people: Person[]): GroupingBreakdown {
  const deduplicated = deduplicatePeople(people);

  const peopleDetails = deduplicated.map((person) => {
    const relationship = RelationshipRecognizer.recognize(person.relationship);
    return {
      name: person.name,
      role: relationship.displayLabel,
      roleType: relationship.normalizedType,
    };
  });

  return {
    summary: formatPortraitGrouping(deduplicated),
    people: peopleDetails,
    totalCount: deduplicated.length,
  };
}

/**
 * Check if a grouping has a specific relationship type
 */
export function groupingHasRelationship(
  people: Person[],
  relationshipType: string
): boolean {
  return people.some((person) =>
    RelationshipRecognizer.hasRelationship(person, relationshipType as any)
  );
}

/**
 * Filter grouping by relationship category
 */
export function filterGroupingByCategory(
  people: Person[],
  category: 'immediate-family' | 'extended-family' | 'wedding-party'
): Person[] {
  return people.filter((person) => RelationshipRecognizer.belongsToCategory(person, category));
}
