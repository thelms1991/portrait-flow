import { WeddingData, Person } from '@/types/app';

export interface SmartImportResult {
  success: boolean;
  weddingData?: Partial<WeddingData>;
  errors?: string[];
  warnings?: string[];
}

interface ParsedSection {
  type: 'attendant' | 'family' | 'couple' | 'portrait' | 'grouping' | 'unknown';
  side?: 1 | 2;
  people: Person[];
  title?: string;
}

/**
 * Intelligently parse unstructured questionnaire data
 * Supports bullet points, tables, paragraphs, emails, etc.
 */
export function parseSmartImport(rawText: string): SmartImportResult {
  if (!rawText.trim()) {
    return {
      success: false,
      errors: ['Input text is empty'],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Normalize text: remove extra whitespace, fix line breaks
  const normalizedText = normalizeText(rawText);

  // Split into logical sections
  const sections = identifySections(normalizedText);

  // Initialize wedding data structure
  const weddingData: Partial<WeddingData> = {
    weddingType: 'traditional',
    partner1FirstName: '',
    partner1LastName: '',
    partner2FirstName: '',
    partner2LastName: '',
    weddingDate: '',
    ceremonyLocation: '',
    receptionLocation: '',
    side1Attendants: [],
    side2Attendants: [],
    partner1Family: [],
    partner2Family: [],
    specialGroupings: [],
    receptionPortraits: [],
  };

  // Process each section
  for (const section of sections) {
    processSection(section, weddingData, errors, warnings);
  }

  // Try to infer couple names if not found
  if (!weddingData.partner1FirstName && !weddingData.partner2FirstName) {
    const coupleNames = inferCoupleNames(normalizedText);
    if (coupleNames) {
      weddingData.partner1FirstName = coupleNames.partner1FirstName;
      weddingData.partner1LastName = coupleNames.partner1LastName;
      weddingData.partner2FirstName = coupleNames.partner2FirstName;
      weddingData.partner2LastName = coupleNames.partner2LastName;
    }
  }

  // Validate minimum required fields
  const hasMinimumData =
    (weddingData.side1Attendants && weddingData.side1Attendants.length > 0) ||
    (weddingData.side2Attendants && weddingData.side2Attendants.length > 0) ||
    (weddingData.partner1Family && weddingData.partner1Family.length > 0) ||
    (weddingData.partner2Family && weddingData.partner2Family.length > 0) ||
    (weddingData.receptionPortraits && weddingData.receptionPortraits.length > 0);

  if (!hasMinimumData) {
    return {
      success: false,
      errors: ['No structured wedding data could be extracted from the input'],
    };
  }

  return {
    success: true,
    weddingData,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Normalize and clean text input
 */
function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, '  ')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

/**
 * Identify logical sections in the text
 */
function identifySections(text: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const lines = text.split('\n');

  let currentSection: ParsedSection | null = null;
  const attendantKeywords = ['bridesmaids', 'groomsmen', 'attendants', 'maids', 'grooms'];
  const familyKeywords = ['family', 'parents', 'father', 'mother', 'siblings', 'family members'];
  const portraitKeywords = ['portraits', 'requested', 'portrait requests', 'special requests'];
  const groupingKeywords = ['groupings', 'special groupings', 'custom groupings'];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    // Check for section headers
    let newSectionType: ParsedSection['type'] | null = null;

    if (
      attendantKeywords.some(
        (kw) =>
          lowerLine.includes(kw) &&
          (lowerLine.includes('bride') || lowerLine.includes('groom') || lowerLine.includes('side'))
      )
    ) {
      if (lowerLine.includes('bride')) {
        newSectionType = 'attendant';
        currentSection = { type: newSectionType, side: 1, people: [], title: line };
      } else if (lowerLine.includes('groom')) {
        newSectionType = 'attendant';
        currentSection = { type: newSectionType, side: 2, people: [], title: line };
      }
    } else if (familyKeywords.some((kw) => lowerLine.includes(kw))) {
      if (lowerLine.includes('bride')) {
        newSectionType = 'family';
        currentSection = { type: newSectionType, side: 1, people: [], title: line };
      } else if (lowerLine.includes('groom')) {
        newSectionType = 'family';
        currentSection = { type: newSectionType, side: 2, people: [], title: line };
      } else if (lowerLine.includes('family')) {
        // Ambiguous - will assign based on context
        newSectionType = 'family';
        currentSection = { type: newSectionType, side: 1, people: [], title: line };
      }
    } else if (portraitKeywords.some((kw) => lowerLine.includes(kw))) {
      newSectionType = 'portrait';
      currentSection = { type: newSectionType, side: undefined, people: [], title: line };
    } else if (groupingKeywords.some((kw) => lowerLine.includes(kw))) {
      newSectionType = 'grouping';
      currentSection = { type: newSectionType, side: undefined, people: [], title: line };
    }

    if (newSectionType && currentSection) {
      sections.push(currentSection);
    }

    // Extract person data from current line
    if (currentSection && !isHeaderLine(line)) {
      const person = extractPerson(line);
      if (person) {
        currentSection.people.push(person);
      }
    }
  }

  return sections;
}

/**
 * Check if a line is a header/label line
 */
function isHeaderLine(line: string): boolean {
  const headerPatterns = [
    /^(bridesmaids|groomsmen|attendants|bride|groom|family|parents|portrait|grouping)/i,
    /^(bride.*family|groom.*family)/i,
    /^(requested|special|custom)/i,
  ];
  return headerPatterns.some((pattern) => pattern.test(line));
}

/**
 * Extract a person from a single line
 * Format: "Name - Relationship" or "Name (Relationship)"
 */
function extractPerson(line: string): Person | null {
  // Remove bullet points, dashes, etc.
  const cleaned = line.replace(/^[\s\-\*\•\.]+/, '').trim();

  if (!cleaned || cleaned.length < 2) {
    return null;
  }

  let name = '';
  let relationship = '';

  // Try pattern: "Name - Relationship" or "Name – Relationship"
  if (cleaned.includes(' - ') || cleaned.includes(' – ')) {
    const parts = cleaned.split(/\s+[-–]\s+/);
    if (parts.length >= 2) {
      name = parts[0].trim();
      relationship = parts.slice(1).join(' - ').trim();
    }
  }
  // Try pattern: "Name (Relationship)"
  else if (cleaned.includes('(') && cleaned.includes(')')) {
    const match = cleaned.match(/^(.+?)\s*\((.*?)\)$/);
    if (match) {
      name = match[1].trim();
      relationship = match[2].trim();
    }
  }
  // Just a name, try to infer relationship from context
  else {
    name = cleaned;
    relationship = 'Guest';
  }

  if (!name || name.length < 2) {
    return null;
  }

  return {
    id: generateId(),
    name,
    relationship: relationship || 'Guest',
  };
}

/**
 * Try to infer couple names from text
 */
function inferCoupleNames(text: string): {
  partner1FirstName: string;
  partner1LastName: string;
  partner2FirstName: string;
  partner2LastName: string;
} | null {
  // Look for "Bride and Groom" or similar patterns
  const brideMatch = text.match(/bride[:\s]+([A-Z][a-z]+)(?:\s+([A-Z][a-z]+))?/i);
  const groomMatch = text.match(/groom[:\s]+([A-Z][a-z]+)(?:\s+([A-Z][a-z]+))?/i);

  if (brideMatch && groomMatch) {
    return {
      partner1FirstName: brideMatch[1],
      partner1LastName: brideMatch[2] || '',
      partner2FirstName: groomMatch[1],
      partner2LastName: groomMatch[2] || '',
    };
  }

  return null;
}

/**
 * Process a parsed section and add data to wedding data
 */
function processSection(
  section: ParsedSection,
  weddingData: Partial<WeddingData>,
  errors: string[],
  warnings: string[]
): void {
  switch (section.type) {
    case 'attendant':
      if (section.side === 1) {
        if (!weddingData.side1Attendants) weddingData.side1Attendants = [];
        weddingData.side1Attendants.push(...section.people);
      } else if (section.side === 2) {
        if (!weddingData.side2Attendants) weddingData.side2Attendants = [];
        weddingData.side2Attendants.push(...section.people);
      }
      break;

    case 'family':
      if (section.side === 1) {
        if (!weddingData.partner1Family) weddingData.partner1Family = [];
        weddingData.partner1Family.push(...section.people);
      } else if (section.side === 2) {
        if (!weddingData.partner2Family) weddingData.partner2Family = [];
        weddingData.partner2Family.push(...section.people);
      }
      break;

    case 'portrait':
      if (!weddingData.receptionPortraits) weddingData.receptionPortraits = [];
      weddingData.receptionPortraits.push(
        ...section.people.map((p) => ({
          id: p.id,
          description: p.name,
        }))
      );
      break;

    case 'grouping':
      if (!weddingData.specialGroupings) weddingData.specialGroupings = [];
      weddingData.specialGroupings.push(
        ...section.people.map((p) => ({
          id: p.id,
          description: p.name,
        }))
      );
      break;
  }
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
