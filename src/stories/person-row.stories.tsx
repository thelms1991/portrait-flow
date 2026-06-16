import type { Meta, StoryObj } from '@storybook/react';
import { PersonRow } from '@/components/intake-steps/PersonRow';
import { Person } from '@/types/app';

const meta = {
  title: 'Forms/PersonRow',
  component: PersonRow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PersonRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePerson: Person = {
  id: '1',
  name: 'Sarah Mitchell',
  relationship: 'Maid of Honor',
};

const emptyPerson: Person = {
  id: '2',
  name: '',
  relationship: '',
};

export const Filled: Story = {
  args: {
    person: samplePerson,
    onChange: (updated) => console.log('Updated:', updated),
    onRemove: () => console.log('Removed'),
    namePlaceholder: 'e.g. Sarah',
    relationshipPlaceholder: 'e.g. MOH, Sister',
  },
};

export const Empty: Story = {
  args: {
    person: emptyPerson,
    onChange: (updated) => console.log('Updated:', updated),
    onRemove: () => console.log('Removed'),
    namePlaceholder: 'Full name',
    relationshipPlaceholder: 'Relationship',
  },
};

export const Bridesmaid: Story = {
  args: {
    person: { id: '3', name: 'Rachel', relationship: 'Sister' },
    onChange: (updated) => console.log('Updated:', updated),
    onRemove: () => console.log('Removed'),
    namePlaceholder: 'e.g. Sarah',
    relationshipPlaceholder: 'e.g. MOH, Sister',
  },
};

export const Groomsman: Story = {
  args: {
    person: { id: '4', name: 'James', relationship: 'Best Man' },
    onChange: (updated) => console.log('Updated:', updated),
    onRemove: () => console.log('Removed'),
    namePlaceholder: 'e.g. James',
    relationshipPlaceholder: 'e.g. Best Man, Brother',
  },
};

export const FamilyMember: Story = {
  args: {
    person: { id: '5', name: 'Margaret', relationship: 'Mother of Bride' },
    onChange: (updated) => console.log('Updated:', updated),
    onRemove: () => console.log('Removed'),
    namePlaceholder: 'e.g. Margaret',
    relationshipPlaceholder: 'e.g. Mother of Bride',
  },
};
