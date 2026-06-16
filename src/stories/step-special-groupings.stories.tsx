import type { Meta, StoryObj } from '@storybook/react';
import StepSpecialGroupings from '@/components/intake-steps/StepSpecialGroupings';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';

const meta = {
  title: 'Forms/CoupleIntake/StepSpecialGroupings',
  component: StepSpecialGroupings,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StepSpecialGroupings>;

export default meta;
type Story = StoryObj<typeof meta>;

function StepSpecialGroupingsWrapper({
  groupingCount = 0,
}: {
  groupingCount?: number;
}) {
  const form = useCoupleIntakeForm();
  
  // Add groupings for demo
  const sampleGroupings = [
    'Bride + College Friends',
    'Groom + Work Colleagues',
    'Both sets of parents together',
  ];
  
  for (let i = 0; i < groupingCount && i < sampleGroupings.length; i++) {
    if (i === 0) {
      form.updateString(form.setSpecialGroupings, 0, sampleGroupings[i]);
    } else {
      form.addString(form.setSpecialGroupings);
      const lastIdx = form.specialGroupings.length - 1;
      form.updateString(form.setSpecialGroupings, lastIdx, sampleGroupings[i]);
    }
  }

  return (
    <div style={{ backgroundColor: '#FAF6F0', padding: '2rem', minHeight: '100vh', maxWidth: '600px' }}>
      <StepSpecialGroupings form={form} />
    </div>
  );
}

export const Empty: Story = {
  render: () => <StepSpecialGroupingsWrapper groupingCount={0} />,
};

export const OneGrouping: Story = {
  render: () => <StepSpecialGroupingsWrapper groupingCount={1} />,
};

export const MultipleGroupings: Story = {
  render: () => <StepSpecialGroupingsWrapper groupingCount={3} />,
};
