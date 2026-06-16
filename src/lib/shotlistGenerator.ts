import { WeddingData, ShotCard, ShotSection, ShotCategory } from '@/types/app';

let shotIdCounter = 0;
const genId = () => `shot-${++shotIdCounter}-${Date.now()}`;

function makeShot(description: string): ShotCard {
  return { id: genId(), description, completed: false };
}

function makeSection(
  id: string,
  title: string,
  category: ShotCategory,
  shots: ShotCard[]
): ShotSection {
  return { id, title, category, shots, collapsed: false };
}

export function generateShotList(data: WeddingData): ShotSection[] {
  const bride = `${data.brideFirstName} (Bride)`;
  const groom = `${data.groomFirstName} (Groom)`;

  const sections: ShotSection[] = [];

  // 1. Couple Portraits
  const coupleShots: ShotCard[] = [
    makeShot(`${bride} + ${groom}`),
    makeShot(`${bride} + ${groom} — candid walk`),
    makeShot(`${bride} + ${groom} — close-up detail`),
    makeShot(`${bride} + ${groom} — first look`),
    makeShot(`${bride} alone — full length`),
    makeShot(`${bride} alone — detail`),
    makeShot(`${groom} alone — full length`),
    makeShot(`${groom} alone — detail`),
  ];
  sections.push(makeSection('couple', 'Couple Portraits', 'couple', coupleShots));

  // 2. Bridesmaids
  const bridesmaidsShots: ShotCard[] = [];
  if (data.bridesmaids.length > 0) {
    bridesmaidsShots.push(
      makeShot(`${bride} + All Bridesmaids`),
    );
    data.bridesmaids.forEach((bm) => {
      bridesmaidsShots.push(makeShot(`${bride} + ${bm.name} (${bm.relationship})`));
    });
    if (data.bridesmaids.length >= 2) {
      bridesmaidsShots.push(makeShot(`All Bridesmaids together`));
    }
  }
  sections.push(makeSection('bridesmaids', 'Bridesmaids', 'bridesmaids', bridesmaidsShots));

  // 3. Groomsmen
  const groomsmenShots: ShotCard[] = [];
  if (data.groomsmen.length > 0) {
    groomsmenShots.push(makeShot(`${groom} + All Groomsmen`));
    data.groomsmen.forEach((gm) => {
      groomsmenShots.push(makeShot(`${groom} + ${gm.name} (${gm.relationship})`));
    });
    if (data.groomsmen.length >= 2) {
      groomsmenShots.push(makeShot(`All Groomsmen together`));
    }
  }
  sections.push(makeSection('groomsmen', 'Groomsmen', 'groomsmen', groomsmenShots));

  // 4. Bridal Party
  const bridalPartyShots: ShotCard[] = [];
  if (data.bridesmaids.length > 0 || data.groomsmen.length > 0) {
    bridalPartyShots.push(makeShot(`${bride} + ${groom} + Full Bridal Party`));
    bridalPartyShots.push(makeShot(`${bride} side of bridal party`));
    bridalPartyShots.push(makeShot(`${groom} side of bridal party`));
    bridalPartyShots.push(makeShot(`Bridal party — candid, fun shot`));
  }
  sections.push(makeSection('bridal-party', 'Full Bridal Party', 'bridal-party', bridalPartyShots));

  // 5. Bride's Family
  const brideFamilyShots: ShotCard[] = [];
  if (data.brideFamily.length > 0) {
    brideFamilyShots.push(makeShot(`${bride} + ${groom} + ${data.brideFirstName}'s Family`));
    brideFamilyShots.push(makeShot(`${bride} + ${data.brideFirstName}'s Family`));
    data.brideFamily.forEach((fm) => {
      brideFamilyShots.push(makeShot(`${bride} + ${groom} + ${fm.name} (${fm.relationship})`));
      brideFamilyShots.push(makeShot(`${bride} + ${fm.name} (${fm.relationship})`));
    });
  }
  sections.push(makeSection('bride-family', `${data.brideFirstName}'s Family`, 'bride-family', brideFamilyShots));

  // 6. Groom's Family
  const groomFamilyShots: ShotCard[] = [];
  if (data.groomFamily.length > 0) {
    groomFamilyShots.push(makeShot(`${bride} + ${groom} + ${data.groomFirstName}'s Family`));
    groomFamilyShots.push(makeShot(`${groom} + ${data.groomFirstName}'s Family`));
    data.groomFamily.forEach((fm) => {
      groomFamilyShots.push(makeShot(`${bride} + ${groom} + ${fm.name} (${fm.relationship})`));
      groomFamilyShots.push(makeShot(`${groom} + ${fm.name} (${fm.relationship})`));
    });
  }
  sections.push(makeSection('groom-family', `${data.groomFirstName}'s Family`, 'groom-family', groomFamilyShots));

  // 7. Special Groupings
  const specialShots: ShotCard[] = data.specialGroupings
    .filter((s) => s.trim())
    .map((s) => makeShot(s.trim()));
  sections.push(makeSection('special-requests', 'Special Requests', 'special-requests', specialShots));

  // 8. Reception Portraits
  const receptionShots: ShotCard[] = data.receptionRequests
    .filter((s) => s.trim())
    .map((s) => makeShot(s.trim()));
  if (receptionShots.length === 0) {
    receptionShots.push(makeShot(`${bride} + ${groom} — first dance`));
    receptionShots.push(makeShot(`${bride} + ${groom} — cake cutting`));
    receptionShots.push(makeShot(`${bride} + ${groom} — reception candids`));
  }
  sections.push(makeSection('reception', 'Reception Portraits', 'special-requests', receptionShots));

  return sections;
}
