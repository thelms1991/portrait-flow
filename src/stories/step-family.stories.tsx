import type { Meta, StoryObj } from '@storybook/react';
import StepFamily from '@/components/intake-steps/StepFamily';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';

const meta = {
  title: 'Forms/CoupleIntake/StepFamily',
  component: StepFamily,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StepFamily>;

export default meta;
type Story = StoryObj<typeof meta>;

function StepFamilyWrapper({
  brideFamilyCount = 0,
  groomFamilyCount = 0,
  brideFirstName = 'Elizabeth',
  groomFirstName = 'Timothy',
}: {
  brideFamilyCount?: number;
  groomFamilyCount?: number;
  brideFirstName?: string;
  groomFirstName?: string;
}) {
  const form = useCoupleIntakeForm();
  
  // Set names
  form.setBrideFirstName(brideFirstName);
  form.setGroomFirstName(groomFirstName);

  // Add bride family members
  const sampleBrideFamily = [
    { id: 'bf1', name: 'Margaret', relationship: 'Mother of Bride' },
    { id: 'bf2', name: 'Steve', relationship: 'Father of Bride' },
    { id: 'bf3', name: 'David', relationship: 'Brother of Bride' },
  ];
  
  for (let i = 0; i < brideFamilyCount && i < sampleBrideFamily.length; i++) {
    if (i === 0) {
      form.updatePerson(form.setBrideFamily, form.brideFamily[0].id, sampleBrideFamily[i]);
    } else {
      form.addPerson(form.setBrideFamily);
      const lastId = form.brideFamily[form.brideFamily.length - 1].id;
      form.updatePerson(form.setBrideFamily, lastId, sampleBrideFamily[i]);
    }
  }

  // Add groom family members
  const sampleGroomFamily = [
    { id: 'gf1', name: 'Patricia', relationship: 'Mother of Groom' },
    { id: 'gf2', name: 'Robert', relationship: 'Father of Groom' },
  ];
  
  for (let i = 0; i < groomFamilyCount && i < sampleGroomFamily.length; i++) {
    if (i === 0) {
      form.updatePerson(form.setGroomFamily, form.groomFamily[0].id, sampleGroomFamily[i]);
    } else {
      form.addPerson(form.setGroomFamily);
      const lastId = form.groomFamily[form.groomFamily.length - 1].id;
      form.updatePerson(form.setGroomFamily, lastId, sampleGroomFamily[i]);
    }
  }

  return (
    <div style={{ backgroundColor: '#FAF6F0', padding: '2rem', minHeight: '100vh', maxWidth: '600px' }}>
      <StepFamily form={form} />
    </div>
  );
}

export const Empty: Story = {
  render: () => <StepFamilyWrapper />,
};

export const BrideFamilyOnly: Story = {
  render: () => <StepFamilyWrapper brideFamilyCount={3} />,
};

export const BothFamilies: Story = {
  render: () => <StepFamilyWrapper brideFamilyCount={3} groomFamilyCount={2} />,
};

export const WithNames: Story = {
  render: () => (
    <StepFamilyWrapper
      brideFirstName="Sarah"
      groomFirstName="James"
      brideFamilyCount={2}
      groomFamilyCount={2}
    />
  ),
};
