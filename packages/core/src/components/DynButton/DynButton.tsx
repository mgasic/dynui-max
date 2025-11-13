import React, { forwardRef } from 'react';
import clsx from 'clsx';
import type { ComponentVariant, ComponentSize, ComponentColor } from '@dynui-max/design-tokens';
import type { PolymorphicComponentProps } from '../../types/polymorphic';
import { DynIcon } from '../DynIcon';
import './DynButton.css';

type DynButtonOwnProps = {
  /**
   * Visual style variant
   * @default 'solid'
   */
  variant?: ComponentVariant;

  /**
   * Button size using design tokens
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Color theme variant
   * @default 'primary'
   */
  color?: ComponentColor;

  /**
   * Loading state - shows spinner and disables button
   */
  loading?: boolean;

  /**
   * Icon at the start of the button
   */
  startIcon?: React.ReactNode;

  /**
   * Icon at the end of the button
   */
  endIcon?: React.ReactNode;

  /**
   * Button content
   */
  children?: React.ReactNode;

  /**
   * Disabled state - supported when rendering as button
   */
  disabled?: boolean;
};

export type DynButtonProps<C extends React.ElementType = 'button'> =
  PolymorphicComponentProps<C, DynButtonOwnProps>;

const DynButtonComponent = <C extends React.ElementType = 'button'>(
  {
    variant = 'solid',
    size = 'md',
    color = 'primary',
    loading = false,
    disabled = false,
    startIcon,
    endIcon,
    as,
    className,
    children,
    ...props
  }: DynButtonProps<C>,
  ref: React.ComponentPropsWithRef<C>['ref']
) => {
  const Component = (as || 'button') as React.ElementType;
  const isDisabled = disabled || loading;
  const isButtonElement = Component === 'button';

  const forwardedProps = {
    ...props,
    disabled: isButtonElement ? undefined : isDisabled || undefined
  };

  const classes = clsx(
    'dyn-button',
    `dyn-button--variant-${variant}`,
    `dyn-button--size-${size}`,
    `dyn-button--color-${color}`,
    {
      'dyn-button--loading': loading,
      'dyn-button--disabled': isDisabled,
      'dyn-button--icon-only': !children && (startIcon || endIcon)
    },
    className
  );

  return (
    <Component
      ref={ref}
      className={classes}
      disabled={isButtonElement ? isDisabled : undefined}
      aria-busy={loading}
      aria-disabled={!isButtonElement && isDisabled ? true : undefined}
      {...forwardedProps}
    >
      {/* Loading spinner */}
      {loading && (
        <span className="dyn-button__loading" aria-hidden="true">
          <DynIcon name="spinner" size={size} />
        </span>
      )}

      {/* Start icon */}
      {startIcon && !loading && (
        <span className="dyn-button__start-icon" aria-hidden="true">
          {startIcon}
        </span>
      )}

      {/* Content */}
      {children && (
        <span className="dyn-button__content">
          {children}
        </span>
      )}

      {/* End icon */}
      {endIcon && !loading && (
        <span className="dyn-button__end-icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </Component>
  );
};

export const DynButton = forwardRef(DynButtonComponent) as <
  C extends React.ElementType = 'button'
>(
  props: DynButtonProps<C>
) => React.ReactElement | null;

DynButton.displayName = 'DynButton';
