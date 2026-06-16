import type { Meta, StoryObj } from '@storybook/react';
import StepGroomsmen from '@/components/intake-steps/StepGroomsmen';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';

const meta = {
  title: 'Forms/CoupleIntake/StepGroomsmen',
  component: StepGroomsmen,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StepGroomsmen>;

export default meta;
type Story = StoryObj<typeof meta>;

function StepGroomsmenWrapper({
  groomsmenCount = 0,
}: {
  groomsmenCount?: number;
}) {
  const form = useCoupleIntakeForm();
  
  // Add groomsmen for demo
  if (groomsmenCount > 0 && form.groomsmen.length < groomsmenCount) {
    const sampleGroomsmen = [
      { id: 'g1', name: 'Jake', relationship: 'Best Man' },
      { id: 'g2', name: 'Connor', relationship: 'Brother' },
      { id: 'g3', name: 'Noah', relationship: 'Friend' },
    ];
    
    for (let i = 0; i < groomsmenCount && i < sampleGroomsmen.length; i++) {
      if (i === 0) {
        form.updatePerson(form.setGroomsmen, form.groomsmen[0].id, sampleGroomsmen[i]);
      } else {
        form.addPerson(form.setGroomsmen);
        const lastId = form.groomsmen[form.groomsmen.length - 1].id;
        form.updatePerson(form.setGroomsmen, lastId, sampleGroomsmen[i]);
      }
    }
  }

  return (
    <div style={{ backgroundColor: '#FAF6F0', padding: '2rem', minHeight: '100vh', maxWidth: '600px' }}>
      <StepGroomsmen form={form} />
    </div>
  );
}

export const Empty: Story = {
  render: () => <StepGroomsmenWrapper groomsmenCount={0} />,
};

export const OneEntry: Story = {
  render: () => <StepGroomsmenWrapper groomsmenCount={1} />,
};

export const MultipleEntries: Story = {
  render: () => <StepGroomsmenWrapper groomsmenCount={3} />,
};
