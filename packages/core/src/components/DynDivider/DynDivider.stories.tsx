import type { Meta, StoryObj } from '@storybook/react';
import { DynDivider } from './DynDivider';
import { DynBox } from '../DynBox/DynBox';
import { DynButton } from '../DynButton/DynButton';

const meta: Meta<typeof DynDivider> = {
  title: 'Layout/DynDivider',
  component: DynDivider,
  parameters: {
    docs: {
      description: {
        component: `
**DynDivider** provides visual separation between content sections with multiple styling options and label support.

### Features:
- Horizontal and vertical orientations
- Multiple visual styles (solid, dashed, dotted)
- Optional labels with positioning
- Spacing variants using design tokens
- Accessible with proper ARIA attributes
        `
      }
    }
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the divider line'
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted'],
      description: 'Visual style of the divider line'
    },
    label: {
      control: 'text',
      description: 'Optional label text displayed with the divider'
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Position of label for horizontal dividers'
    },
    spacing: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Spacing around the divider'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic horizontal divider without label.
 */
export const Default: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    spacing: 'md'
  },
  render: (args) => (
    <DynBox>
      <p>Content above the divider</p>
      <DynDivider {...args} />
      <p>Content below the divider</p>
    </DynBox>
  )
};

/**
 * Horizontal divider with centered label.
 */
export const WithLabel: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    label: 'OR',
    labelPosition: 'center',
    spacing: 'md'
  }
};

/**
 * All visual variants of the divider.
 */
export const Variants: Story = {
  render: () => (
    <DynBox display="flex" direction="column" gap="xl">
      <DynBox>
        <h4>Solid</h4>
        <DynDivider variant="solid" />
      </DynBox>
      <DynBox>
        <h4>Dashed</h4>
        <DynDivider variant="dashed" />
      </DynBox>
      <DynBox>
        <h4>Dotted</h4>
        <DynDivider variant="dotted" />
      </DynBox>
    </DynBox>
  )
};

/**
 * Vertical divider separating content horizontally.
 */
export const Vertical: Story = {
  render: () => (
    <DynBox display="flex" align="center" gap="md" style={{ minHeight: '200px' }}>
      <DynBox flex="1" p="lg" bg="primary" color="white" radius="md">
        <h4>Left Section</h4>
        <p>Content on the left side</p>
      </DynBox>
      <DynDivider orientation="vertical" />
      <DynBox flex="1" p="lg" bg="secondary" color="white" radius="md">
        <h4>Right Section</h4>
        <p>Content on the right side</p>
      </DynBox>
    </DynBox>
  )
};

/**
 * Form layout example with dividers.
 */
export const FormExample: Story = {
  render: () => (
    <DynBox p="xl" bg="background" radius="lg">
      <h2>Account Setup</h2>
      <DynBox display="flex" direction="column" gap="md">
        <DynButton variant="solid" color="primary">Continue with Email</DynButton>
        <DynButton variant="solid" color="secondary">Continue with Google</DynButton>
      </DynBox>
      <DynDivider label="OR" spacing="lg" />
      <DynBox display="flex" direction="column" gap="md">
        <DynButton variant="outline">Create New Account</DynButton>
      </DynBox>
    </DynBox>
  )
};

/**
 * Interactive playground for testing divider properties.
 */
export const Interactive: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    label: '',
    labelPosition: 'center',
    spacing: 'md'
  }
};