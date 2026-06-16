import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import StepWeddingInfo from '@/components/intake-steps/StepWeddingInfo';
import { useCoupleIntakeForm } from '@/hooks/useCoupleIntakeForm';

const meta = {
  title: 'Forms/CoupleIntake/StepWeddingInfo',
  component: StepWeddingInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StepWeddingInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

function StepWeddingInfoWrapper({
  initialBrideFirstName = '',
  initialGroomFirstName = '',
  hasErrors = false,
}: {
  initialBrideFirstName?: string;
  initialGroomFirstName?: string;
  hasErrors?: boolean;
}) {
  const form = useCoupleIntakeForm();
  
  // Set initial values
  if (initialBrideFirstName && form.brideFirstName !== initialBrideFirstName) {
    form.setBrideFirstName(initialBrideFirstName);
  }
  if (initialGroomFirstName && form.groomFirstName !== initialGroomFirstName) {
    form.setGroomFirstName(initialGroomFirstName);
  }

  return (
    <div style={{ backgroundColor: '#FAF6F0', padding: '2rem', minHeight: '100vh' }}>
      <StepWeddingInfo
        form={form}
        onBrideFirstNameChange={form.setBrideFirstName}
        onBrideLastNameChange={form.setBrideLastName}
        onGroomFirstNameChange={form.setGroomFirstName}
        onGroomLastNameChange={form.setGroomLastName}
        errors={hasErrors ? { brideFirstName: 'Required', groomFirstName: 'Required' } : {}}
      />
    </div>
  );
}

export const Empty: Story = {
  render: () => <StepWeddingInfoWrapper />,
};

export const PartiallyFilled: Story = {
  render: () => (
    <StepWeddingInfoWrapper
      initialBrideFirstName="Elizabeth"
      initialGroomFirstName=""
    />
  ),
};

export const Filled: Story = {
  render: () => (
    <StepWeddingInfoWrapper
      initialBrideFirstName="Elizabeth"
      initialGroomFirstName="Tim"
    />
  ),
};

export const WithValidationErrors: Story = {
  render: () => (
    <StepWeddingInfoWrapper
      hasErrors={true}
    />
  ),
};

export const WithOptionalLastNames: Story = {
  render: () => (
    <StepWeddingInfoWrapper
      initialBrideFirstName="Elizabeth"
      initialGroomFirstName="Timothy"
    />
  ),
};
