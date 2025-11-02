import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { ThemeMode } from './ThemeSwitcher';
import { ThemeProvider } from '../../theme';
import { DynBox } from '../DynBox/DynBox';
import { DynContainer } from '../DynContainer/DynContainer';
import { DynButton } from '../DynButton/DynButton';
import { DynInput } from '../DynInput/DynInput';
import { DynFieldContainer } from '../DynFieldContainer/DynFieldContainer';

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Utility/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    docs: {
      description: {
        component: `
**ThemeSwitcher** provides seamless light/dark theme switching with multiple visual variants and sizes.

### Features:
- Light, dark, and system theme switching
- Button, toggle, and dropdown variants
- Size variants using design tokens
- Theme context integration
- Controlled and uncontrolled usage
- Keyboard navigation support
- Accessible labels and ARIA attributes
        `
      }
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'label', enabled: true }
        ]
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    )
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the theme switcher component'
    },
    variant: {
      control: { type: 'select' },
      options: ['button', 'toggle', 'dropdown'],
      description: 'Visual style variant of the switcher'
    },
    showLabels: {
      control: 'boolean',
      description: 'Display theme labels alongside icons'
    },
    showSystem: {
      control: 'boolean',
      description: 'Include a third state that follows the system preference'
    },
    mode: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system'],
      description: 'Controlled theme mode'
    },
    defaultMode: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system'],
      description: 'Initial mode when using the component uncontrolled'
    },
    onModeChange: {
      action: 'mode-change',
      description: 'Fires when the theme mode changes'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interactions'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button-style theme switcher.
 */
export const Default: Story = {
  args: {
    size: 'md',
    variant: 'button',
    showLabels: false
  }
};

/**
 * Toggle-style theme switcher with sliding animation.
 */
export const Toggle: Story = {
  args: {
    size: 'md',
    variant: 'toggle',
    showLabels: false
  }
};

/**
 * Theme switcher with labels showing current theme.
 */
export const WithLabels: Story = {
  args: {
    size: 'md',
    variant: 'button',
    showLabels: true
  }
};

/**
 * Controlled example showcasing light/dark/system modes.
 */
export const ControlledModes: Story = {
  render: () => {
    const getSystemPreference = () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

    const [mode, setMode] = useState<ThemeMode>('system');
    const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(() => getSystemPreference());

    useEffect(() => {
      if (typeof window === 'undefined') {
        return;
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updatePreference = (event: MediaQueryList | MediaQueryListEvent) => {
        const matches = 'matches' in event ? event.matches : (event as MediaQueryList).matches;
        setSystemPreference(matches ? 'dark' : 'light');
      };

      updatePreference(mediaQuery);

      const listener = (event: MediaQueryListEvent) => updatePreference(event);

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      }

      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }, []);

    const effectiveTheme = mode === 'system' ? systemPreference : mode;
    const modeLabel = mode === 'system'
      ? `Following system preference (${systemPreference})`
      : `Forced ${mode} mode`;

    return (
      <DynBox display="flex" direction="column" gap="lg" p="md">
        <DynBox
          display="flex"
          justify="space-between"
          align="center"
          p="md"
          bg="background"
          radius="md"
          style={{ border: '1px solid var(--dyn-color-border-primary)' }}
        >
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>Controlled theme mode</p>
            <p style={{ margin: '4px 0 0', color: 'var(--dyn-color-text-secondary)' }}>{modeLabel}</p>
            <p style={{ margin: '4px 0 0', color: 'var(--dyn-color-text-secondary)' }}>
              Effective theme applied: <strong>{effectiveTheme}</strong>
            </p>
          </div>
          <ThemeSwitcher showSystem mode={mode} onModeChange={setMode} />
        </DynBox>

        <DynBox display="flex" gap="sm" wrap="wrap">
          <DynButton variant="solid" color="primary" onClick={() => setMode('light')}>
            Force light
          </DynButton>
          <DynButton variant="solid" color="secondary" onClick={() => setMode('dark')}>
            Force dark
          </DynButton>
          <DynButton variant="outline" onClick={() => setMode('system')}>
            Follow system
          </DynButton>
        </DynBox>

        <DynBox display="flex" gap="lg" wrap="wrap">
          <ThemeSwitcher variant="button" showLabels showSystem mode={mode} onModeChange={setMode} />
          <ThemeSwitcher variant="toggle" showSystem mode={mode} onModeChange={setMode} />
          <ThemeSwitcher variant="dropdown" showLabels showSystem mode={mode} onModeChange={setMode} />
        </DynBox>
      </DynBox>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the controlled API with the optional system mode and multiple synchronized switchers.'
      }
    }
  }
};

/**
 * All size variations of the theme switcher.
 */
export const Sizes: Story = {
  render: () => (
    <DynBox display="flex" align="center" gap="lg" wrap="wrap">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <DynBox key={size} display="flex" direction="column" align="center" gap="sm">
          <ThemeSwitcher size={size} />
          <span style={{ fontSize: '12px', color: 'var(--dyn-color-text-secondary)' }}>
            {size.toUpperCase()}
          </span>
        </DynBox>
      ))}
    </DynBox>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ThemeSwitcher in all available sizes from xs to xl.'
      }
    }
  }
};

/**
 * All visual variants of the theme switcher.
 */
export const Variants: Story = {
  render: () => (
    <DynBox display="flex" direction="column" gap="xl">
      {/* Button Variant */}
      <DynBox>
        <h4 style={{ marginBottom: '16px', color: 'var(--dyn-color-text-primary)' }}>Button Variant</h4>
        <DynBox display="flex" align="center" gap="lg">
          <ThemeSwitcher variant="button" size="md" />
          <ThemeSwitcher variant="button" size="md" showLabels />
        </DynBox>
      </DynBox>
      
      {/* Toggle Variant */}
      <DynBox>
        <h4 style={{ marginBottom: '16px', color: 'var(--dyn-color-text-primary)' }}>Toggle Variant</h4>
        <DynBox display="flex" align="center" gap="lg">
          <ThemeSwitcher variant="toggle" size="md" />
          <ThemeSwitcher variant="toggle" size="md" showLabels />
        </DynBox>
      </DynBox>
      
      {/* Dropdown Variant */}
      <DynBox>
        <h4 style={{ marginBottom: '16px', color: 'var(--dyn-color-text-primary)' }}>Dropdown Variant</h4>
        <DynBox display="flex" align="center" gap="lg">
          <ThemeSwitcher variant="dropdown" size="md" showSystem />
          <ThemeSwitcher variant="dropdown" size="md" showLabels showSystem />
        </DynBox>
      </DynBox>
    </DynBox>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All visual variants of ThemeSwitcher with and without labels.'
      }
      }
    }
};

/**
 * Demonstrates the controlled API with the dropdown radiogroup variant.
 */
export const SystemRadiogroup: Story = {
  args: {
    variant: 'dropdown',
    showSystem: true,
    showLabels: true
  },
  render: (args) => {
    const [mode, setMode] = useState<ThemeMode>('system');

    return (
      <DynBox display="flex" direction="column" gap="lg">
        <DynBox>
          <p style={{ margin: 0, color: 'var(--dyn-color-text-secondary)' }}>
            The dropdown variant exposes light, dark, and system modes using a radiogroup for accessibility.
          </p>
        </DynBox>

        <DynBox display="flex" align="center" gap="md">
          <strong style={{ color: 'var(--dyn-color-text-primary)' }}>Selected mode:</strong>
          <span style={{ color: 'var(--dyn-color-text-secondary)' }}>{mode}</span>
        </DynBox>

        <ThemeSwitcher
          {...args}
          mode={mode}
          onChange={(nextMode) => {
            setMode(nextMode);
            args.onChange?.(nextMode);
          }}
        />
      </DynBox>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled usage of the dropdown variant that exposes the new system option via a radiogroup.'
      }
    }
  }
};

/**
 * Disabled state for all variants.
 */
export const DisabledState: Story = {
  render: () => (
    <DynBox display="flex" direction="column" gap="lg">
      <DynBox display="flex" align="center" gap="md">
        <ThemeSwitcher disabled />
        <span style={{ color: 'var(--dyn-color-text-secondary)' }}>Button variant</span>
      </DynBox>
      <DynBox display="flex" align="center" gap="md">
        <ThemeSwitcher variant="toggle" disabled showLabels />
        <span style={{ color: 'var(--dyn-color-text-secondary)' }}>Toggle variant</span>
      </DynBox>
      <DynBox display="flex" align="center" gap="md">
        <ThemeSwitcher variant="dropdown" disabled showSystem showLabels />
        <span style={{ color: 'var(--dyn-color-text-secondary)' }}>Dropdown radiogroup</span>
      </DynBox>
    </DynBox>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All variants can be disabled to prevent user interaction.'
      }
    }
  }
};

/**
 * Theme switcher in different UI contexts and layouts.
 */
export const InContext: Story = {
  render: () => (
    <div style={{ minHeight: '400px' }}>
      {/* Header with theme switcher */}
      <DynBox 
        display="flex" 
        justify="space-between" 
        align="center" 
        p="lg" 
        bg="primary" 
        color="white"
        style={{ marginBottom: '32px' }}
      >
        <h2 style={{ margin: 0 }}>DynUI-Max Application</h2>
        <DynBox display="flex" align="center" gap="md">
          <span style={{ fontSize: '14px', opacity: 0.9 }}>Theme:</span>
          <ThemeSwitcher variant="toggle" size="md" />
        </DynBox>
      </DynBox>
      
      {/* Content area showing theme effects */}
      <DynContainer size="lg">
        <DynBox display="flex" direction="column" gap="lg">
          <DynBox p="lg" bg="secondary" radius="md">
            <h3 style={{ marginTop: 0, color: 'var(--dyn-color-text-primary)' }}>
              Theme-Aware Content
            </h3>
            <p style={{ color: 'var(--dyn-color-text-secondary)', lineHeight: 1.6 }}>
              This content automatically adapts to the selected theme. Switch between light and dark modes
              using the theme switcher above to see the color changes in real-time.
            </p>
            
            <DynBox display="flex" align="center" gap="md" mt="md">
              <ThemeSwitcher variant="button" size="sm" showLabels />
              <span style={{ color: 'var(--dyn-color-text-secondary)', fontSize: '14px' }}>
                Try this switcher too!
              </span>
            </DynBox>
          </DynBox>
          
          {/* Form elements showing theme integration */}
          <DynBox p="lg" bg="background" radius="md" style={{ border: '1px solid var(--dyn-color-border-primary)' }}>
            <h4 style={{ marginTop: 0, color: 'var(--dyn-color-text-primary)' }}>Sample Form</h4>
            
            <DynBox display="flex" direction="column" gap="md">
              <DynFieldContainer label="Name" htmlFor="theme-name">
                <DynInput id="theme-name" placeholder="Enter your name" />
              </DynFieldContainer>
              
              <DynFieldContainer label="Email" htmlFor="theme-email">
                <DynInput id="theme-email" type="email" placeholder="Enter your email" />
              </DynFieldContainer>
              
              <DynBox display="flex" justify="space-between" align="center" pt="md">
                <DynButton variant="solid" color="primary">Submit</DynButton>
                <ThemeSwitcher variant="dropdown" size="sm" showLabels />
              </DynBox>
            </DynBox>
          </DynBox>
        </DynBox>
      </DynContainer>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'ThemeSwitcher integrated into a realistic application layout showing theme effects across components.'
      }
    }
  }
};

/**
 * Custom theme switcher implementation with state management.
 */
export const CustomImplementation: Story = {
  render: () => {
    const getSystemPreference = () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

    const [mode, setMode] = useState<ThemeMode>('system');
    const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(() => getSystemPreference());

    useEffect(() => {
      if (typeof window === 'undefined') {
        return;
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updatePreference = (event: MediaQueryList | MediaQueryListEvent) => {
        const matches = 'matches' in event ? event.matches : (event as MediaQueryList).matches;
        setSystemPreference(matches ? 'dark' : 'light');
      };

      updatePreference(mediaQuery);

      const listener = (event: MediaQueryListEvent) => updatePreference(event);

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      }

      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }, []);

    const effectiveTheme = mode === 'system' ? systemPreference : mode;
    const modeDescription = mode === 'system'
      ? `System preference (${systemPreference})`
      : `Manual ${mode} mode`;

    return (
      <ThemeProvider defaultTheme={effectiveTheme}>
        <DynBox display="flex" direction="column" gap="xl" p="lg">
          <DynBox>
            <h3 style={{ color: 'var(--dyn-color-text-primary)' }}>Custom Theme Management</h3>
            <p style={{ color: 'var(--dyn-color-text-secondary)' }}>
              This example shows how to integrate ThemeSwitcher with controlled state and shared mode selection.
              Active mode: <strong>{modeDescription}</strong>
            </p>
          </DynBox>

          <DynBox display="flex" direction="column" gap="lg">
            <DynBox display="flex" align="center" gap="lg" wrap="wrap">
              <ThemeSwitcher variant="button" showLabels showSystem mode={mode} onModeChange={setMode} />
              <ThemeSwitcher variant="toggle" showSystem mode={mode} onModeChange={setMode} />
              <ThemeSwitcher variant="dropdown" showLabels showSystem mode={mode} onModeChange={setMode} />
            </DynBox>

            <DynBox
              p="lg"
              bg="primary"
              color="white"
              radius="md"
              display="flex"
              justify="space-between"
              align="center"
            >
              <div>
                <h4 style={{ margin: 0, marginBottom: '8px' }}>Theme-Aware Component</h4>
                <p style={{ margin: 0, opacity: 0.9 }}>
                  This component automatically updates its appearance based on the current theme.
                </p>
              </div>
              <ThemeSwitcher variant="toggle" size="lg" showSystem mode={mode} onModeChange={setMode} />
            </DynBox>

            <DynBox
              p="lg"
              bg="background"
              radius="md"
              style={{ border: '2px solid var(--dyn-color-border-primary)' }}
            >
              <DynBox display="flex" justify="space-between" align="center" mb="md">
                <h4 style={{ margin: 0, color: 'var(--dyn-color-text-primary)' }}>Settings Panel</h4>
                <ThemeSwitcher variant="button" size="sm" showSystem mode={mode} onModeChange={setMode} />
              </DynBox>

              <p style={{ margin: 0, color: 'var(--dyn-color-text-secondary)' }}>
                Theme switching affects all design tokens including colors, shadows, and borders.
                Try switching themes to see the visual changes throughout the interface.
              </p>
            </DynBox>
          </DynBox>
        </DynBox>
      </ThemeProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Advanced example showing custom theme state management and multiple theme switchers working in harmony.'
      }
    }
  }
};

/**
 * Interactive playground for testing theme switcher properties.
 */
export const Interactive: Story = {
  args: {
    size: 'md',
    variant: 'button',
    showLabels: false
  },
  render: (args) => (
    <DynBox display="flex" direction="column" gap="lg" align="center" p="xl">
      <ThemeSwitcher {...args} />
      
      <DynBox 
        p="lg" 
        bg="secondary" 
        radius="md" 
        style={{ textAlign: 'center' }}
      >
        <h4 style={{ margin: 0, marginBottom: '8px', color: 'var(--dyn-color-text-primary)' }}>
          Interactive Playground
        </h4>
        <p style={{ margin: 0, color: 'var(--dyn-color-text-secondary)' }}>
          Use the controls below to customize the theme switcher and see the changes in real-time.
          Click the switcher above to test theme switching functionality.
        </p>
      </DynBox>
    </DynBox>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with all ThemeSwitcher properties and see their effects in real-time.'
      }
    }
  }
};