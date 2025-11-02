import type { Meta, StoryObj } from '@storybook/react';
import { DynTabs, DynBox, DynBadge, DynButton, ThemeProvider } from '@dynui-max/core';
import { useState } from 'react';

const basicTabs = [
  { value: 'overview', label: 'Overview', panel: <DynBox p="md">Overview content goes here...</DynBox> },
  { value: 'details', label: 'Details', panel: <DynBox p="md">Detailed information and specifications...</DynBox> },
  { value: 'settings', label: 'Settings', panel: <DynBox p="md">Configuration and preferences...</DynBox> },
];

const meta = {
  title: 'Navigation/DynTabs',
  component: DynTabs,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <div style={{ minHeight: '300px', width: '100%' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Accessible tab navigation component with keyboard support and orientation variants.

### Features
- Horizontal and vertical orientations
- Automatic and manual activation modes
- Full keyboard navigation (Arrow keys, Home, End)
- ARIA tabs pattern compliance
- Controlled and uncontrolled state management
- Focus management and restoration
- Smooth panel transitions
        `
      }
    }
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    activation: {
      control: 'select',
      options: ['auto', 'manual'],
    },
  },
} satisfies Meta<typeof DynTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic horizontal tabs
export const Default: Story = {
  args: {
    items: basicTabs,
    orientation: 'horizontal',
  },
};

// Vertical tabs
export const Vertical: Story = {
  args: {
    items: basicTabs,
    orientation: 'vertical',
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical tab layout - useful for sidebars or when you have many tabs.'
      }
    }
  }
};

// Manual activation
export const ManualActivation: Story = {
  args: {
    items: basicTabs,
    activation: 'manual',
  },
  parameters: {
    docs: {
      description: {
        story: 'Manual activation mode - tabs only change when Enter or Space is pressed, not on focus. Useful when tab content is expensive to load.'
      }
    }
  }
};

// Complex content example
export const ComplexContent: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(3);
    
    const tabs = [
      { 
        value: 'dashboard', 
        label: 'Dashboard', 
        panel: (
          <DynBox p="lg">
            <h3>Dashboard Overview</h3>
            <DynBox display="flex" gap="md" mt="md">
              <DynBox p="md" bg="secondary" radius="md" style={{ flex: 1 }}>
                <strong>Total Users</strong>
                <div style={{ fontSize: '2rem', margin: '0.5rem 0' }}>1,234</div>
                <DynBadge color="success">+12% this month</DynBadge>
              </DynBox>
              <DynBox p="md" bg="secondary" radius="md" style={{ flex: 1 }}>
                <strong>Active Sessions</strong>
                <div style={{ fontSize: '2rem', margin: '0.5rem 0' }}>89</div>
                <DynBadge color="warning">-3% this week</DynBadge>
              </DynBox>
            </DynBox>
          </DynBox>
        )
      },
      { 
        value: 'notifications', 
        label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Notifications
            {notifications > 0 && <DynBadge color="danger" size="sm">{notifications}</DynBadge>}
          </span>
        ),
        panel: (
          <DynBox p="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Notifications ({notifications})</h3>
              <DynButton 
                variant="outline" 
                size="sm"
                onClick={() => setNotifications(0)}
              >
                Mark All Read
              </DynButton>
            </div>
            <DynBox p="md" bg="secondary" radius="md">
              <p><strong>System Update</strong> - New version available</p>
              <p><strong>User Registration</strong> - 3 new users registered</p>
              <p><strong>Security Alert</strong> - Suspicious login detected</p>
            </DynBox>
          </DynBox>
        )
      },
      { 
        value: 'settings', 
        label: 'Settings',
        panel: (
          <DynBox p="lg">
            <h3>Application Settings</h3>
            <DynBox display="flex" direction="column" gap="md" mt="md">
              <DynBox display="flex" justify="space-between" align="center">
                <span>Enable notifications</span>
                <input type="checkbox" defaultChecked />
              </DynBox>
              <DynBox display="flex" justify="space-between" align="center">
                <span>Auto-save</span>
                <input type="checkbox" defaultChecked />
              </DynBox>
              <DynBox display="flex" justify="space-between" align="center">
                <span>Dark mode</span>
                <input type="checkbox" />
              </DynBox>
            </DynBox>
          </DynBox>
        )
      },
    ];
    
    return (
      <DynTabs
        items={tabs}
        defaultValue="dashboard"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complex tab content with interactive elements, badges, and dynamic content. Shows real-world usage patterns.'
      }
    }
  }
};

// Controlled tabs
export const ControlledTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');
    
    return (
      <div>
        <DynBox mb="md">
          <strong>External Controls:</strong>
          <DynBox display="flex" gap="sm" mt="sm">
            <DynButton
              size="sm"
              variant={activeTab === 'tab1' ? 'solid' : 'outline'}
              color="primary"
              onClick={() => setActiveTab('tab1')}
            >
              Go to Tab 1
            </DynButton>
            <DynButton
              size="sm"
              variant={activeTab === 'tab2' ? 'solid' : 'outline'}
              color="primary"
              onClick={() => setActiveTab('tab2')}
            >
              Go to Tab 2
            </DynButton>
          </DynBox>
        </DynBox>
        
        <DynTabs
          value={activeTab}
          onChange={setActiveTab}
          items={[
            { value: 'tab1', label: 'Controlled Tab 1', panel: <DynBox p="md">Content for controlled tab 1</DynBox> },
            { value: 'tab2', label: 'Controlled Tab 2', panel: <DynBox p="md">Content for controlled tab 2</DynBox> },
          ]}
        />
        
        <DynBox mt="md" p="sm" bg="muted" radius="md">
          <strong>Current active tab:</strong> {activeTab}
        </DynBox>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled tabs with external state management. Shows how to programmatically control tab selection.'
      }
    }
  }
};

// Interactive playground
export const Playground: Story = {
  args: {
    items: basicTabs,
    orientation: 'horizontal',
    activation: 'auto',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test different tab configurations. Use the controls panel to experiment with props.'
      }
    }
  }
};