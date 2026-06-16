import type { Meta, StoryObj } from '@storybook/react';
import StepReceptionRequests from '@/components/intake-steps/StepReceptionRequests';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';

const meta = {
  title: 'Forms/CoupleIntake/StepReceptionRequests',
  component: StepReceptionRequests,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StepReceptionRequests>;

export default meta;
type Story = StoryObj<typeof meta>;

function StepReceptionRequestsWrapper({
  requestCount = 0,
}: {
  requestCount?: number;
}) {
  const form = useCoupleIntakeForm();
  
  // Add requests for demo
  const sampleRequests = [
    'First dance',
    'Cake cutting',
    'Table shots with grandparents',
  ];
  
  for (let i = 0; i < requestCount && i < sampleRequests.length; i++) {
    if (i === 0) {
      form.updateString(form.setReceptionRequests, 0, sampleRequests[i]);
    } else {
      form.addString(form.setReceptionRequests);
      const lastIdx = form.receptionRequests.length - 1;
      form.updateString(form.setReceptionRequests, lastIdx, sampleRequests[i]);
    }
  }

  return (
    <div style={{ backgroundColor: '#FAF6F0', padding: '2rem', minHeight: '100vh', maxWidth: '600px' }}>
      <StepReceptionRequests form={form} />
    </div>
  );
}

export const Empty: Story = {
  render: () => <StepReceptionRequestsWrapper requestCount={0} />,
};

export const OneRequest: Story = {
  render: () => <StepReceptionRequestsWrapper requestCount={1} />,
};

export const MultipleRequests: Story = {
  render: () => <StepReceptionRequestsWrapper requestCount={3} />,
};
