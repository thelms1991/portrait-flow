import type { Meta, StoryObj } from '@storybook/react';
import StepBridesmaids from '@/components/intake-steps/StepBridesmaids';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';

const meta = {
  title: 'Forms/CoupleIntake/StepBridesmaids',
  component: StepBridesmaids,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StepBridesmaids>;

export default meta;
type Story = StoryObj<typeof meta>;

function StepBridesmaidWrapper({
  bridesmaidCount = 0,
}: {
  bridesmaidCount?: number;
}) {
  const form = useCoupleIntakeForm();
  
  // Add bridesmaids for demo
  if (bridesmaidCount > 0 && form.bridesmaids.length < bridesmaidCount) {
    // Add sample bridesmaids
    const sampleBridesmaids = [
      { id: 'b1', name: 'Rachel', relationship: 'Maid of Honor' },
      { id: 'b2', name: 'Sophie', relationship: 'Sister' },
      { id: 'b3', name: 'Mia', relationship: 'Best Friend' },
    ];
    
    for (let i = 0; i < bridesmaidCount && i < sampleBridesmaids.length; i++) {
      if (i === 0) {
        form.updatePerson(form.setBridesmaids, form.bridesmaids[0].id, sampleBridesmaids[i]);
      } else {
        form.addPerson(form.setBridesmaids);
        const lastId = form.bridesmaids[form.bridesmaids.length - 1].id;
        form.updatePerson(form.setBridesmaids, lastId, sampleBridesmaids[i]);
      }
    }
  }

  return (
    <div style={{ backgroundColor: '#FAF6F0', padding: '2rem', minHeight: '100vh', maxWidth: '600px' }}>
      <StepBridesmaids form={form} />
    </div>
  );
}

export const Empty: Story = {
  render: () => <StepBridesmaidWrapper bridesmaidCount={0} />,
};

export const OneEntry: Story = {
  render: () => <StepBridesmaidWrapper bridesmaidCount={1} />,
};

export const MultipleEntries: Story = {
  render: () => <StepBridesmaidWrapper bridesmaidCount={3} />,
};
