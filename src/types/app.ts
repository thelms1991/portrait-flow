export type UserRole = 'couple' | 'photographer';

export interface Person {
  id: string;
  name: string;
  relationship: string;
  customLabel?: string; // Allow custom relationship labels
}

export interface SpecialGrouping {
  id: string;
  description: string;
}

export interface ReceptionPortrait {
  id: string;
  description: string;
}

export type WeddingType = 'traditional' | 'same-sex' | 'two-brides' | 'two-grooms' | 'non-binary' | 'custom';

export interface WeddingData {
  // Wedding type - supports diverse scenarios
  weddingType: WeddingType;
  
  // Primary partners (supports any combination)
  partner1FirstName: string;
  partner1LastName: string;
  partner1Role?: string; // Custom role instead of hardcoded "bride"
  partner1Gender?: 'male' | 'female' | 'non-binary';
  
  partner2FirstName: string;
  partner2LastName: string;
  partner2Role?: string; // Custom role instead of hardcoded "groom"
  partner2Gender?: 'male' | 'female' | 'non-binary';
  
  // Backward compatibility - deprecated but kept for migrations
  brideFirstName?: string;
  brideLastName?: string;
  groomFirstName?: string;
  groomLastName?: string;
  
  weddingDate: string;
  ceremonyLocation: string;
  receptionLocation: string;
  
  // Attendants (not gendered anymore)
  side1Attendants: Person[];      // Replaces bridesmaids
  side2Attendants: Person[];      // Replaces groomsmen
  
  // Family (more flexible structure)
  partner1Family: Person[];        // Replaces brideFamily
  partner2Family: Person[];        // Replaces groomFamily
  
  // For multi-family/blended situations
  sharedFamily?: Person[];         // Parents/family shared by both partners
  
  specialGroupings: SpecialGrouping[];
  receptionPortraits: ReceptionPortrait[];
  
  // Legacy fields - kept for backwards compatibility
  bridesmaids?: Person[];
  groomsmen?: Person[];
  brideFamily?: Person[];
  groomFamily?: Person[];
}

export interface ShotCard {
  id: string;
  description: string;
  completed: boolean;
  custom?: boolean;
}

export interface ShotSection {
  id: string;
  title: string;
  category: ShotCategory;
  shots: ShotCard[];
  collapsed: boolean;
}

export type ShotCategory =
  | 'couple'
  | 'bridal-party'
  | 'groomsmen'
  | 'bridesmaids'
  | 'bride-family'
  | 'groom-family'
  | 'full-wedding-party'
  | 'special-requests';

export type AppView =
  | 'role-selection'
  | 'couple-intake'
  | 'generating'
  | 'photographer-workspace'
  | 'checklist-mode'
  | 'export-panel';
