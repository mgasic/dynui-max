import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useMemo, useState } from 'react';
import { ThemeSwitcher, ThemeProvider, DynBox, DynButton } from '@dynui-max/core';
import type { ThemeMode } from '@dynui-max/core';

const meta = {
  title: 'Infrastructure/ThemeSwitcher',
  component: ThemeSwitcher,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <div style={{ padding: '2rem', minHeight: '420px' }}>
          <Story />
        </div>
      </ThemeProvider>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Interactive control for switching between light, dark, and system themes. Supports controlled and uncontrolled usage patterns.'
      }
    }
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      description: 'Current theme mode'
    },
    onChange: {
      action: 'mode-changed (onChange)',
      description: 'New change handler triggered when the theme mode updates'
    },
    onModeChange: {
      action: 'theme-changed',
      description: 'Callback when theme mode changes'
    },
    showSystem: {
      control: 'boolean',
      description: 'Whether to show system preference option'
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size of the switcher component'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable theme switching'
    }
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

type ModeSwatchProps = {
  label: string;
  description: string;
};

const ModeSwatch = ({ label, description }: ModeSwatchProps) => (
  <DynBox
    p="lg"
    radius="md"
    style={{
      border: '1px solid var(--dyn-color-border-primary)',
      background: 'var(--dyn-color-background-secondary)',
      minWidth: '220px'
    }}
  >
    <strong style={{ display: 'block', marginBottom: '0.5rem' }}>{label}</strong>
    <span style={{ color: 'var(--dyn-color-text-secondary)', fontSize: '0.9rem' }}>{description}</span>
  </DynBox>
);

export const ControlledModes: Story = {
  args: {
    showSystem: true,
    size: 'md'
  },
  render: (args) => {
    const [mode, setMode] = useState<ThemeMode>('light');

    useEffect(() => {
      if (args.mode) {
        setMode(args.mode);
      }
    }, [args.mode]);

    const handleModeChange = (next: ThemeMode) => {
      setMode(next);
      args.onModeChange?.(next);
    };

    return (
      <DynBox display="flex" direction="column" gap="lg">
        <DynBox display="flex" align="center" gap="md">
          <ThemeSwitcher
            {...args}
            mode={theme}
            onChange={(newMode) => {
              setTheme(newMode);
              args.onChange?.(newMode);
            }}
            onModeChange={(newMode) => {
              args.onModeChange?.(newMode);
            }}
          />
          <span style={{ color: 'var(--dyn-color-text-secondary)' }}>
            Active mode: <strong>{mode}</strong>
          </span>
        </DynBox>

        <DynBox display="flex" gap="sm" wrap="wrap">
          <DynButton variant={mode === 'light' ? 'solid' : 'outline'} color="primary" onClick={() => handleModeChange('light')}>
            Light
          </DynButton>
          <DynButton variant={mode === 'dark' ? 'solid' : 'outline'} color="primary" onClick={() => handleModeChange('dark')}>
            Dark
          </DynButton>
          {args.showSystem && (
            <DynButton
              variant={mode === 'system' ? 'solid' : 'outline'}
              color="primary"
              onClick={() => handleModeChange('system')}
            >
              System
            </DynButton>
          )}
        </DynBox>

        <DynBox display="grid" gap="md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <ModeSwatch label="Light" description="High contrast for bright environments." />
          <ModeSwatch label="Dark" description="Dimmed interface for low-light usage." />
          {args.showSystem && (
            <ModeSwatch label="System" description="Follows the operating system preference." />
          )}
        </DynBox>
      </DynBox>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled ThemeSwitcher hooked to local state. External buttons drive the same controlled mode.'
      }
    }
  }
};

export const SystemAwareness: Story = {
  render: () => {
    const [mode, setMode] = useState<ThemeMode>('system');
    const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(() => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return 'light';
      }

      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return;
      }

      const media = window.matchMedia('(prefers-color-scheme: dark)');

      const listener = (event: MediaQueryListEvent | MediaQueryList) => {
        const matches = 'matches' in event ? event.matches : (event as MediaQueryList).matches;
        setSystemPreference(matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    
    const getEffectiveTheme = () => {
      if (theme === 'system') return systemPreference;
      return theme;
    };
    
    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Theme Options</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
            <div>
              <strong>Selected:</strong> {theme}
            </div>
            <div>
              <strong>Effective:</strong> {getEffectiveTheme()}
            </div>
            <div>
              <strong>System Preference:</strong> {systemPreference}
            </div>
          </div>
          <ThemeSwitcher
            variant="dropdown"
            mode={theme}
            onChange={setTheme}
            showSystem
            showLabels
            size="md"
            aria-label="Theme mode"
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <DynBox p="md" bg="primary" radius="md">
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-inverse)' }}>☀️ Light Mode</h4>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-inverse)', fontSize: '0.9em' }}>Clean, bright interface for daytime use</p>
            <div style={{ fontSize: '0.8em', opacity: 0.8, color: 'var(--color-text-inverse)' }}>Active when: theme='light' or system preference is light</div>
          </DynBox>
          
          <DynBox p="md" bg="secondary" radius="md">
            <h4 style={{ margin: '0 0 0.5rem 0' }}>🌙 Dark Mode</h4>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>Reduced eye strain for low-light environments</p>
            <div style={{ fontSize: '0.8em', opacity: 0.8, color: 'var(--color-text-secondary)' }}>Active when: theme='dark' or system preference is dark</div>
          </DynBox>
          
          <DynBox p="md" bg="muted" radius="md">
            <h4 style={{ margin: '0 0 0.5rem 0' }}>⚙️ System Mode</h4>
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>Automatically follows your device settings</p>
            <div style={{ fontSize: '0.8em', opacity: 0.8, color: 'var(--color-text-secondary)' }}>Active when: theme='system' and respects OS preference</div>
          </DynBox>
        </div>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--color-background-secondary)', borderRadius: '8px', border: '1px solid var(--color-border-primary)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-primary)' }}>Theme Information</h4>
          <ul style={{ margin: '0', paddingLeft: '1.5rem', color: 'var(--color-text-secondary)' }}>
            <li><strong>Light:</strong> Forces light theme regardless of system settings</li>
            <li><strong>Dark:</strong> Forces dark theme regardless of system settings</li>
            <li><strong>System:</strong> Automatically detects and follows your operating system's theme preference</li>
          </ul>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('radiogroup', { name: /theme mode/i });
    const options = within(group).getAllByRole('radio');
    await expect(options).toHaveLength(3);
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete theme switcher with light, dark, and system options. System mode automatically detects and follows OS preferences.'
      }

      media.addListener(listener);
      return () => media.removeListener(listener);
    }, []);

    // Simulate saving preference to localStorage or API
    const handleThemeChange = (newTheme: ThemeMode) => {
      setGlobalTheme(newTheme);
      setUserPreference(newTheme);
      
      // Simulate API call or localStorage save
      console.log('Saving theme preference:', newTheme);
      
      // In a real app, you might do:
      // localStorage.setItem('theme-preference', newTheme);
      // or make an API call to save user preferences
    };
    
    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Controlled Theme Switcher</h3>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-secondary)' }}>This theme switcher is controlled by external state and can persist user preferences.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', padding: '1rem', background: 'var(--color-background-secondary)', borderRadius: '8px' }}>
          <div>
            <strong style={{ color: 'var(--color-text-primary)' }}>Theme Control:</strong>
            <ThemeSwitcher
              mode={globalTheme}
              onChange={handleThemeChange}
              showSystem
              size="md"
            />
          </div>
          
          <div style={{ color: 'var(--color-text-secondary)' }}>
            <div><strong>Current Theme:</strong> {globalTheme}</div>
            <div><strong>User Preference:</strong> {userPreference}</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => handleThemeChange('light')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-border-primary)',
              borderRadius: '4px',
              background: globalTheme === 'light' ? 'var(--color-primary)' : 'var(--color-background-primary)',
              color: globalTheme === 'light' ? 'white' : 'var(--color-text-primary)',
              cursor: 'pointer'
            }}
          >
            Set Light
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-border-primary)',
              borderRadius: '4px',
              background: globalTheme === 'dark' ? 'var(--color-primary)' : 'var(--color-background-primary)',
              color: globalTheme === 'dark' ? 'white' : 'var(--color-text-primary)',
              cursor: 'pointer'
            }}
          >
            Set Dark
          </button>
          <button
            onClick={() => handleThemeChange('system')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-border-primary)',
              borderRadius: '4px',
              background: globalTheme === 'system' ? 'var(--color-primary)' : 'var(--color-background-primary)',
              color: globalTheme === 'system' ? 'white' : 'var(--color-text-primary)',
              cursor: 'pointer'
            }}
          >
            Set System
          </button>
        </div>
        
        <DynBox p="lg" bg="primary" radius="md">
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-inverse)' }}>Controlled Component Benefits</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-inverse)' }}>
            <li>External state management and persistence</li>
            <li>Integration with global application state</li>
            <li>API synchronization for user preferences</li>
            <li>Advanced validation and business logic</li>
            <li>Multi-component theme coordination</li>
          </ul>
        </DynBox>
      </div>
    );

// Size Variants - Different switcher sizes
export const SizeVariants: Story = {
  render: () => {
    const [smallTheme, setSmallTheme] = useState<ThemeMode>('light');
    const [mediumTheme, setMediumTheme] = useState<ThemeMode>('dark');

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Size Variants</h3>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-secondary)' }}>Theme switchers in different sizes for various UI contexts.</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Small Size (sm)</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--color-background-secondary)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Perfect for compact UIs, toolbars, or mobile interfaces:</span>
              <ThemeSwitcher
                mode={smallTheme}
                onChange={setSmallTheme}
                showSystem
                size="sm"
              />
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>Current: {smallTheme}</span>
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>Use in: Navigation bars, mobile interfaces, inline settings</p>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Medium Size (md)</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--color-background-secondary)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Standard size for most applications and settings pages:</span>
              <ThemeSwitcher
                mode={mediumTheme}
                onChange={setMediumTheme}
                showSystem
                size="md"
              />
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>Current: {mediumTheme}</span>
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>Use in: Settings panels, preferences, main application areas</p>
          </div>
        </div>
        
        <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--color-background-secondary)', borderRadius: '8px', border: '1px solid var(--color-border-primary)' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Usage Guidelines</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>Small (sm)</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>
                <li>Mobile navigation</li>
                <li>Compact toolbars</li>
                <li>Inline controls</li>
                <li>Space-constrained areas</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>Medium (md)</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>
                <li>Settings panels</li>
                <li>Preference dialogs</li>
                <li>Main application areas</li>
                <li>Desktop interfaces</li>
              </ul>
            </div>
          </div>
        </DynBox>

// Disabled States - Non-interactive controls
export const DisabledStates: Story = {
  render: () => (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Disabled Theme Switchers</h3>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
          Use the disabled prop to present a non-interactive theme switcher when permissions or loading states require it.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeSwitcher variant="button" showLabels disabled showSystem data-testid="disabled-button" />
          <span style={{ color: 'var(--color-text-secondary)' }}>Button variant</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeSwitcher variant="toggle" showLabels disabled showSystem data-testid="disabled-toggle" />
          <span style={{ color: 'var(--color-text-secondary)' }}>Toggle variant</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeSwitcher variant="dropdown" showLabels showSystem disabled data-testid="disabled-dropdown" />
          <span style={{ color: 'var(--color-text-secondary)' }}>Dropdown variant</span>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const buttonVariant = canvas.getByTestId('disabled-button');
    await expect(buttonVariant).toBeDisabled();

    const toggleInput = canvas.getByTestId('disabled-toggle').querySelector('input') as HTMLInputElement | null;
    expect(toggleInput).not.toBeNull();
    if (toggleInput) {
      await expect(toggleInput).toBeDisabled();
    }

    const dropdownOptions = within(canvas.getByTestId('disabled-dropdown')).getAllByRole('radio');
    dropdownOptions.forEach(option => expect(option).toBeDisabled());
  },
  parameters: {
    docs: {
      description: {
        story: 'All ThemeSwitcher variants with the disabled prop applied, demonstrating non-interactive states for permission-gated actions.'
      }
    }
  }
};

// In Toolbar - Integration example
export const InToolbar: Story = {
  render: () => {
    const [theme, setTheme] = useState<ThemeMode>('light');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const ToolbarDemo = () => (
      <div>
        {/* Header with theme switcher */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          background: 'var(--color-background-primary)',
          borderBottom: '1px solid var(--color-border-primary)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{ margin: 0, color: 'var(--color-text-primary)' }}>My App</h2>
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--color-link)', textDecoration: 'none' }}>Home</a>
              <a href="#" style={{ color: 'var(--color-link)', textDecoration: 'none' }}>About</a>
              <a href="#" style={{ color: 'var(--color-link)', textDecoration: 'none' }}>Contact</a>
            </nav>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>Theme:</span>
            <ThemeSwitcher
              mode={theme}
              onChange={setTheme}
              showSystem
              size="sm"
            />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: 'none',
                border: '1px solid var(--color-border-primary)',
                borderRadius: '4px',
                padding: '0.5rem',
                cursor: 'pointer',
                color: 'var(--color-text-primary)'
              }}
            >
              ☰
            </button>
          </div>
        </header>
        
        {/* Settings panel example */}
        <div style={{ padding: '0 1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Settings Panel</h3>
          <div style={{
            background: 'var(--color-background-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--color-border-primary)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Theme Preference</strong>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>Choose your preferred color scheme</p>
                </div>
                <ThemeSwitcher
                  mode={theme}
                  onChange={setTheme}
                  showSystem
                  size="md"
                />
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-primary)', margin: '0.5rem 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Notifications</strong>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>Receive email notifications</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Auto-save</strong>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.9em' }}>Automatically save changes</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </div>
        </div>
        
        {/* Content area showing theme effects */}
        <div style={{ padding: '2rem 1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Content Area</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <DynBox p="lg" bg="primary" radius="md">
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-inverse)' }}>Feature Card</h4>
              <p style={{ margin: 0, color: 'var(--color-text-inverse)' }}>This card adapts to the selected theme automatically.</p>
            </DynBox>
            
            <DynBox p="lg" bg="secondary" radius="md">
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Another Card</h4>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>All interface elements respect the theme choice.</p>
            </DynBox>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the system-aware mode. The simulated system preference controls the effective theme when mode is set to system.'
      }
    }
  }
};

export const VariantComparison: Story = {
  render: () => {
    const [theme, setTheme] = useState<ThemeMode>('light');
    
    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Accessibility Features</h3>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-secondary)' }}>This theme switcher includes full keyboard navigation and screen reader support.</p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label
            id="theme-control-label"
            style={{
              display: 'block',
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: 'var(--color-text-primary)'
            }}
          >
            Choose Theme Preference
          </label>
          <ThemeSwitcher
            variant="dropdown"
            mode={theme}
            onChange={setTheme}
            showSystem
            showLabels
            size="md"
            aria-labelledby="theme-control-label"
            aria-describedby="theme-description"
          />
          <div 
            id="theme-description"
            style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.9em', 
              color: 'var(--color-text-secondary)'
            }}
          >
            Use arrow keys to navigate options, Enter or Space to select. Current selection: <strong>{theme}</strong>
          </div>
        </div>
        
        <div style={{ 
          padding: '1.5rem', 
          background: 'var(--color-background-secondary)', 
          borderRadius: '8px',
          border: '1px solid var(--color-border-primary)',
          marginBottom: '2rem'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Keyboard Navigation</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)' }}>
            <li><kbd>Tab</kbd> - Focus the theme switcher</li>
            <li><kbd>Arrow Keys</kbd> - Navigate between theme options</li>
            <li><kbd>Enter</kbd> or <kbd>Space</kbd> - Select the focused option</li>
            <li><kbd>Escape</kbd> - Close dropdown (if applicable)</li>
          </ul>
        </div>
        
        <div style={{ 
          padding: '1.5rem', 
          background: 'var(--color-background-secondary)', 
          borderRadius: '8px',
          border: '1px solid var(--color-border-primary)'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Screen Reader Announcements</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--color-text-secondary)' }}>
            <li>"Theme switcher, radiogroup" - Component type and role</li>
            <li>"Light theme, radio button, 1 of 3" - Option details</li>
            <li>"Selected" - Current selection state</li>
            <li>"Theme changed to dark mode" - Change announcements</li>
          </ul>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test ARIA labels and descriptions
    const themeSwitcher = canvas.getByRole('radiogroup', { name: /choose theme preference/i });
    await expect(themeSwitcher).toBeInTheDocument();

    const options = within(themeSwitcher).getAllByRole('radio');
    await expect(options).toHaveLength(3);

    // Test keyboard navigation
    await userEvent.tab();
    await expect(options[0]).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(options[1]).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{Enter}');
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'radiogroup',
            enabled: true,
          },
          {
            id: 'aria-valid-attr-value',
            enabled: true,
          },
          {
            id: 'keyboard-nav',
            enabled: true,
          },
        ],
      },
    },
    docs: {
      description: {
        story: 'Comprehensive accessibility demo with keyboard navigation, screen reader support, and proper ARIA attributes.'
      }
    }
  }
};

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-primary)' }}>Theme Switcher Playground</h3>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text-secondary)' }}>Use the controls panel to experiment with different theme switcher configurations.</p>
        </div>
        
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeSwitcher
            {...args}
            mode={theme}
            onChange={(newMode) => {
              setTheme(newMode);
              args.onChange?.(newMode);
            }}
            onModeChange={(newMode) => {
              args.onModeChange?.(newMode);
            }}
          />
          <span style={{ color: 'var(--color-text-secondary)' }}>Current: <strong>{theme}</strong></span>
        </div>
        
        <DynBox p="lg" bg="primary" radius="md">
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text-inverse)' }}>Live Theme Preview</h4>
          <p style={{ margin: 0, color: 'var(--color-text-inverse)' }}>This content adapts to show the effects of your theme switcher configuration.</p>
        </DynBox>
      </DynBox>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    const radiogroup = canvas.queryByRole('radiogroup');
    const themeControl = radiogroup ?? canvas.getByRole('button', { name: /switch to/i });

    await expect(themeControl).toBeInTheDocument();

    if (!args.disabled) {
      if (radiogroup) {
        const options = within(radiogroup).getAllByRole('radio');
        await userEvent.click(options[1]);
      } else {
        await userEvent.click(themeControl);
      }
    }
    
    // Verify current theme display
    const currentThemeText = canvas.getByText(/current:/i);
    await expect(currentThemeText).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story: 'All visual variants share the same controlled mode. Interacting with one switcher updates the others immediately.'
      }
    }
  }
};
