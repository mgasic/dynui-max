import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DynModal, DynButton, DynBox, ThemeProvider } from '@dynui-max/core';
import type { DynModalProps } from '@dynui-max/core';

const meta = {
  title: 'Layout/DynModal',
  component: DynModal,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Accessible modal dialog with portal rendering, focus trapping, keyboard shortcuts and rich content slots.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    closeOnBackdropClick: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
    showCloseButton: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof DynModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ModalContent = ({ onClose }: { onClose: () => void }) => (
  <DynBox display="flex" direction="column" gap="md">
    <header>
      <h2 style={{ margin: 0 }}>Create new project</h2>
      <p style={{ margin: '0.5rem 0 0', color: 'var(--dyn-color-text-muted)' }}>
        Provide a name and description to get started.
      </p>
    </header>
    <DynBox display="flex" direction="column" gap="sm">
      <label htmlFor="project-name" style={{ fontWeight: 600 }}>
        Project name
      </label>
      <input
        id="project-name"
        placeholder="Launchpad redesign"
        style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--dyn-color-border-subtle)' }}
      />
    </DynBox>
    <DynBox display="flex" justify="flex-end" gap="sm">
      <DynButton variant="ghost" onClick={onClose}>
        Cancel
      </DynButton>
      <DynButton variant="solid" color="primary" onClick={onClose}>
        Create project
      </DynButton>
    </DynBox>
  </DynBox>
);

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <DynButton onClick={() => setOpen(true)}>Open modal</DynButton>
        <DynModal
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          aria-label="Create project"
        >
          <ModalContent onClose={() => setOpen(false)} />
        </DynModal>
      </div>
    );
  },
  args: {
    size: 'md',
  },
};

export const SizeVariants: Story = {
  render: (args) => {
    const [activeSize, setActiveSize] = useState<DynModalProps['size']>('sm');
    const [open, setOpen] = useState(false);
    const sizes: DynModalProps['size'][] = ['sm', 'md', 'lg', 'xl', '2xl'];

    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', gap: '1rem' }}>
        <DynBox display="flex" gap="sm">
          {sizes.map((size) => (
            <DynButton
              key={size}
              variant={activeSize === size ? 'solid' : 'outline'}
              color="primary"
              onClick={() => {
                setActiveSize(size);
                setOpen(true);
              }}
            >
              {size.toUpperCase()}
            </DynButton>
          ))}
        </DynBox>
        <DynModal
          {...args}
          size={activeSize}
          isOpen={open}
          onClose={() => setOpen(false)}
          aria-label={`Modal size ${activeSize}`}
        >
          <ModalContent onClose={() => setOpen(false)} />
        </DynModal>
      </div>
    );
  },
};

export const NonDismissableBackdrop: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <DynButton onClick={() => setOpen(true)}>Launch blocking modal</DynButton>
        <DynModal
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          closeOnBackdropClick={false}
          aria-label="Blocking modal"
        >
          <DynBox display="flex" direction="column" gap="md">
            <h2 style={{ margin: 0 }}>Please review carefully</h2>
            <p style={{ margin: 0 }}>
              This modal requires explicit confirmation. Clicking outside will not dismiss it, but pressing Escape is still
              enabled.
            </p>
            <DynBox display="flex" justify="flex-end" gap="sm">
              <DynButton variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </DynButton>
              <DynButton variant="solid" color="primary" onClick={() => setOpen(false)}>
                Confirm
              </DynButton>
            </DynBox>
          </DynBox>
        </DynModal>
      </div>
    );
  },
  args: {
    closeOnEscape: true,
    showCloseButton: true,
  },
};
