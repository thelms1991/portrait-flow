import { useState } from 'react';
import { WeddingData, Person, SpecialGrouping, ReceptionPortrait } from '@/types/app';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function useCoupleIntakeForm() {
  const [brideFirstName, setBrideFirstName] = useState('');
  const [brideLastName, setBrideLastName] = useState('');
  const [groomFirstName, setGroomFirstName] = useState('');
  const [groomLastName, setGroomLastName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [ceremonyLocation, setCeremonyLocation] = useState('');
  const [receptionLocation, setReceptionLocation] = useState('');
  const [bridesmaids, setBridesmaids] = useState<Person[]>([{ id: generateId(), name: '', relationship: '' }]);
  const [groomsmen, setGroomsmen] = useState<Person[]>([{ id: generateId(), name: '', relationship: '' }]);
  const [brideFamily, setBrideFamily] = useState<Person[]>([{ id: generateId(), name: '', relationship: '' }]);
  const [groomFamily, setGroomFamily] = useState<Person[]>([{ id: generateId(), name: '', relationship: '' }]);
  const [specialGroupings, setSpecialGroupings] = useState<SpecialGrouping[]>([{ id: generateId(), description: '' }]);
  const [receptionPortraits, setReceptionPortraits] = useState<ReceptionPortrait[]>([{ id: generateId(), description: '' }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!brideFirstName.trim()) newErrors.brideFirstName = 'Required';
      if (!groomFirstName.trim()) newErrors.groomFirstName = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = (onComplete: (data: WeddingData) => void) => {
    const clean = (arr: Person[]) => arr.filter((p) => p.name.trim());
    const cleanGroupings = (arr: SpecialGrouping[]) => arr.filter((g) => g.description.trim());
    const cleanPortraits = (arr: ReceptionPortrait[]) => arr.filter((p) => p.description.trim());
    onComplete({
      brideFirstName: brideFirstName.trim(),
      brideLastName: brideLastName.trim(),
      groomFirstName: groomFirstName.trim(),
      groomLastName: groomLastName.trim(),
      weddingDate: weddingDate.trim(),
      ceremonyLocation: ceremonyLocation.trim(),
      receptionLocation: receptionLocation.trim(),
      bridesmaids: clean(bridesmaids),
      groomsmen: clean(groomsmen),
      brideFamily: clean(brideFamily),
      groomFamily: clean(groomFamily),
      specialGroupings: cleanGroupings(specialGroupings),
      receptionPortraits: cleanPortraits(receptionPortraits),
    });
  };

  const addPerson = (setter: React.Dispatch<React.SetStateAction<Person[]>>) => {
    setter((prev) => [...prev, { id: generateId(), name: '', relationship: '' }]);
  };

  const updatePerson = (
    setter: React.Dispatch<React.SetStateAction<Person[]>>,
    id: string,
    updated: Person
  ) => {
    setter((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const removePerson = (
    setter: React.Dispatch<React.SetStateAction<Person[]>>,
    id: string
  ) => {
    setter((prev) => prev.filter((p) => p.id !== id));
  };

  const addString = (setter: React.Dispatch<React.SetStateAction<SpecialGrouping[] | ReceptionPortrait[]>>) => {
    setter((prev: any) => [...prev, { id: generateId(), description: '' }]);
  };

  const updateString = (
    setter: React.Dispatch<React.SetStateAction<SpecialGrouping[] | ReceptionPortrait[]>>,
    idx: number,
    val: string
  ) => {
    setter((prev: any) => prev.map((item: any, i: number) => (i === idx ? { ...item, description: val } : item)));
  };

  const removeString = (
    setter: React.Dispatch<React.SetStateAction<SpecialGrouping[] | ReceptionPortrait[]>>,
    idx: number
  ) => {
    setter((prev: any) => prev.filter((_: any, i: number) => i !== idx));
  };

  return {
    brideFirstName,
    setBrideFirstName,
    brideLastName,
    setBrideLastName,
    groomFirstName,
    setGroomFirstName,
    groomLastName,
    setGroomLastName,
    weddingDate,
    setWeddingDate,
    ceremonyLocation,
    setCeremonyLocation,
    receptionLocation,
    setReceptionLocation,
    bridesmaids,
    setBridesmaids,
    groomsmen,
    setGroomsmen,
    brideFamily,
    setBrideFamily,
    groomFamily,
    setGroomFamily,
    specialGroupings,
    setSpecialGroupings,
    receptionPortraits,
    setReceptionPortraits,
    errors,
    setErrors,
    validate,
    submit,
    addPerson,
    updatePerson,
    removePerson,
    addString,
    updateString,
    removeString,
  };
}
