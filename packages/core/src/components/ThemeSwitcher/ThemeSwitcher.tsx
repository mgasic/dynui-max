import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent
} from 'react';
import clsx from 'clsx';
import type { ComponentSize, ThemeName } from '@dynui-max/design-tokens';
import { useTheme } from '../../theme';
import { DynIcon } from '../DynIcon';
import './ThemeSwitcher.css';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeSwitcherProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /**
   * Switcher size
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Show theme labels
   * @default false
   */
  showLabels?: boolean;

  /**
   * Variant style
   * @default 'button'
   */
  variant?: 'button' | 'toggle' | 'dropdown';

  /**
   * Allow selecting system preference
   * @default false
   */
  showSystem?: boolean;

  /**
   * Current theme mode. When provided, the component operates in controlled mode.
   */
  mode?: ThemeMode;

  /**
   * Initial mode when uncontrolled
   */
  defaultMode?: ThemeMode;

  /**
   * Callback when mode changes
   */
  onModeChange?: (mode: ThemeMode) => void;

  /**
   * Callback fired when theme mode changes.
   */
  onChange?: (mode: ThemeMode) => void;

  /**
   * Disable interactions
   */
  disabled?: boolean;

  'data-testid'?: string;
}

const formatModeLabel = (mode: ThemeMode, systemTheme: ThemeName) => {
  if (mode === 'system') {
    return `System (${systemTheme === 'dark' ? 'Dark' : 'Light'})`;
  }

  return mode === 'light' ? 'Light' : 'Dark';
};

const accessibleModeLabel = (mode: ThemeMode, systemTheme: ThemeName) => {
  if (mode === 'system') {
    return `System theme (${systemTheme === 'dark' ? 'dark' : 'light'} preference)`;
  }

  return `${mode === 'light' ? 'Light' : 'Dark'} theme`;
};

const iconForMode = (mode: ThemeMode, systemTheme: ThemeName) => {
  if (mode === 'system') {
    return systemTheme === 'dark' ? 'moon' : 'sun';
  }

  return mode === 'dark' ? 'moon' : 'sun';
};

export const ThemeSwitcher = forwardRef<HTMLButtonElement, ThemeSwitcherProps>(
  (
    {
      size = 'md',
      showLabels = false,
      variant = 'button',
      showSystem = false,
      mode,
      defaultMode,
      onModeChange,
      onChange,
      disabled = false,
      className,
      'data-testid': dataTestId,
      ...rest
    },
    ref
  ) => {
    const { themeName, setTheme } = useTheme();

    const {
      ['aria-label']: ariaLabel,
      ['aria-labelledby']: ariaLabelledBy,
      ['aria-describedby']: ariaDescribedBy,
      onClick,
      onKeyDown,
      ...buttonProps
    } = rest;

    const getSystemTheme = useCallback((): ThemeName => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return 'light';
      }

      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }, []);

    const [systemTheme, setSystemTheme] = useState<ThemeName>(() => getSystemTheme());

    useEffect(() => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return;
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateSystemTheme = (event: MediaQueryList | MediaQueryListEvent) => {
        const matches = 'matches' in event ? event.matches : (event as MediaQueryList).matches;
        setSystemTheme(matches ? 'dark' : 'light');
      };

      updateSystemTheme(mediaQuery);

      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', updateSystemTheme);
        return () => mediaQuery.removeEventListener('change', updateSystemTheme);
      }

      mediaQuery.addListener(updateSystemTheme);
      return () => mediaQuery.removeListener(updateSystemTheme);
    }, [getSystemTheme]);

    const isControlled = mode !== undefined;

    const [uncontrolledMode, setUncontrolledMode] = useState<ThemeMode>(() => {
      if (mode !== undefined) {
        return mode;
      }

      if (defaultMode) {
        return defaultMode;
      }

      return themeName;
    });

    useEffect(() => {
      if (!isControlled) {
        setUncontrolledMode(current => (current === 'system' ? current : themeName));
      }
    }, [isControlled, themeName]);

    const availableModes = useMemo<ThemeMode[]>(
      () => (showSystem ? ['light', 'dark', 'system'] : ['light', 'dark']),
      [showSystem]
    );

    const fallbackMode = availableModes[0] ?? 'light';

    const ensureMode = useCallback(
      (modeValue?: ThemeMode): ThemeMode => {
        if (modeValue && availableModes.includes(modeValue)) {
          return modeValue;
        }

        return fallbackMode;
      },
      [availableModes, fallbackMode]
    );

    const rawMode = isControlled && mode !== undefined ? mode : uncontrolledMode;
    const currentMode = ensureMode(rawMode);

    useEffect(() => {
      if (!isControlled && currentMode !== uncontrolledMode) {
        setUncontrolledMode(currentMode);
      }
    }, [currentMode, isControlled, uncontrolledMode]);

    const currentTheme: ThemeName = currentMode === 'system' ? systemTheme : (currentMode as ThemeName);

    useEffect(() => {
      if (themeName !== currentTheme) {
        setTheme(currentTheme);
      }
    }, [currentTheme, setTheme, themeName]);

    const emitChange = useCallback(
      (nextMode: ThemeMode) => {
        if (!isControlled) {
          setUncontrolledMode(nextMode);
        }

        onChange?.(nextMode);
        onModeChange?.(nextMode);
      },
      [isControlled, onChange, onModeChange]
    );

    const changeMode = useCallback(
      (modeValue?: ThemeMode) => {
        const safeNextMode = ensureMode(modeValue);
        emitChange(safeNextMode);
      },
      [emitChange, ensureMode]
    );

    const cycleMode = useCallback(
      (direction: 1 | -1 = 1) => {
        if (disabled) {
          return;
        }

        const currentIndex = availableModes.indexOf(currentMode);
        const safeIndex = currentIndex >= 0 ? currentIndex : 0;
        const nextIndex = (safeIndex + direction + availableModes.length) % availableModes.length;
        const nextMode = availableModes[nextIndex];
        changeMode(nextMode);
      },
      [availableModes, changeMode, currentMode, disabled]
    );

    const dropdownModes = useMemo<ThemeMode[]>(
      () => (showSystem ? ['light', 'system', 'dark'] : availableModes),
      [availableModes, showSystem]
    );

    const nextMode = useMemo(() => {
      const currentIndex = availableModes.indexOf(currentMode);
      const safeIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextIndex = (safeIndex + 1) % availableModes.length;
      return ensureMode(availableModes[nextIndex]);
    }, [availableModes, currentMode, ensureMode]);

    const nextModeDescription = `Switch to ${accessibleModeLabel(nextMode, systemTheme)}`;

    const classes = clsx(
      'dyn-theme-switcher',
      `dyn-theme-switcher--${variant}`,
      `dyn-theme-switcher--size-${size}`,
      {
        'dyn-theme-switcher--with-labels': showLabels,
        'dyn-theme-switcher--disabled': disabled
      },
      className
    );

    if (variant === 'dropdown') {
      const rotateDropdownMode = (direction: 1 | -1) => {
        if (dropdownModes.length === 0) {
          return;
        }

        const currentIndex = dropdownModes.indexOf(currentMode);
        const safeIndex = currentIndex >= 0 ? currentIndex : 0;
        const nextIndex = (safeIndex + direction + dropdownModes.length) % dropdownModes.length;
        const nextMode = dropdownModes[nextIndex];
        changeMode(nextMode);
      };

      const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (disabled) {
          return;
        }

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          rotateDropdownMode(1);
        }

        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          rotateDropdownMode(-1);
        }
      };

      return (
        <div className={classes} data-testid={dataTestId} data-mode={currentMode}>
          <div
            role="radiogroup"
            className="dyn-theme-switcher__options"
            aria-label={ariaLabel ?? 'Theme mode'}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-disabled={disabled || undefined}
            onKeyDown={handleKeyDown}
          >
            {dropdownModes.map(modeValue => {
              const isActive = currentMode === modeValue;
              const displayLabel = formatModeLabel(modeValue, systemTheme);
              const optionAccessibleLabel = accessibleModeLabel(modeValue, systemTheme);

              return (
                <button
                  key={modeValue}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={clsx(
                    'dyn-theme-switcher__option',
                    `dyn-theme-switcher__option--size-${size}`,
                    {
                      'dyn-theme-switcher__option--active': isActive
                    }
                  )}
                  onClick={() => {
                    if (disabled || isActive) {
                      return;
                    }
                    changeMode(modeValue);
                  }}
                  disabled={disabled}
                  aria-label={showLabels ? undefined : optionAccessibleLabel}
                  data-mode={modeValue}
                >
                  <DynIcon name={iconForMode(modeValue, systemTheme)} size={size} />
                  {showLabels && (
                    <span className="dyn-theme-switcher__option-label">{displayLabel}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (variant === 'toggle') {
      return (
        <label className={classes} data-testid={dataTestId} data-mode={currentMode}>
          <input
            type="checkbox"
            className="dyn-theme-switcher__input"
            checked={currentTheme === 'dark'}
            onChange={event => {
              if (disabled) {
                event.preventDefault();
                return;
              }
              cycleMode(1);
            }}
            aria-label={ariaLabel ?? nextModeDescription}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-checked={currentMode === 'system' ? 'mixed' : currentTheme === 'dark'}
            disabled={disabled}
          />

          <span className="dyn-theme-switcher__track">
            <span className="dyn-theme-switcher__thumb">
              <DynIcon name={iconForMode(currentMode, systemTheme)} size="sm" />
            </span>
          </span>

          {showLabels && (
            <span className="dyn-theme-switcher__label">{formatModeLabel(currentMode, systemTheme)}</span>
          )}
        </label>
      );
    }

    const keyboardClickPreventedRef = useRef(false);

    return (
      <button
        ref={ref}
        type="button"
        className={classes}
        onClick={event => {
          if (keyboardClickPreventedRef.current) {
            keyboardClickPreventedRef.current = false;
            event.preventDefault();
            return;
          }

          if (disabled) {
            event.preventDefault();
            return;
          }

          onClick?.(event);
          if (event.defaultPrevented) {
            return;
          }

          changeMode(nextMode);
        }}
        onKeyDown={event => {
          onKeyDown?.(event);
          if (event.defaultPrevented) {
            return;
          }

          if (disabled) {
            return;
          }

          if (event.key === ' ' || event.key === 'Space' || event.key === 'Spacebar' || event.key === 'Enter') {
            event.preventDefault();
            keyboardClickPreventedRef.current = true;
            changeMode(nextMode);
          }
        }}
        aria-label={ariaLabel ?? nextModeDescription}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        data-testid={dataTestId}
        disabled={disabled}
        data-mode={currentMode}
        {...buttonProps}
      >
        <DynIcon name={iconForMode(currentMode, systemTheme)} size={size} />

        {showLabels && (
          <span className="dyn-theme-switcher__label">{formatModeLabel(currentMode, systemTheme)}</span>
        )}
      </button>
    );
  }
);

ThemeSwitcher.displayName = 'ThemeSwitcher';
