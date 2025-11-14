import React, { forwardRef } from 'react';
import clsx from 'clsx';
import type { PolymorphicComponentProps } from '../../types/polymorphic';
import './DynBreadcrumbItem.css';

type DynBreadcrumbItemOwnProps = {
  /**
   * Item content
   */
  children: React.ReactNode;

  /**
   * Link href
   */
  href?: string;

  /**
   * Click handler (for button-like items)
   */
  onClick?: React.MouseEventHandler;

  /**
   * Current/active item
   */
  current?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;
};

export type DynBreadcrumbItemProps<C extends React.ElementType = 'span'> =
  PolymorphicComponentProps<C, DynBreadcrumbItemOwnProps>;

const DynBreadcrumbItemComponent = <C extends React.ElementType = 'span'>(
  {
    children,
    href,
    onClick,
    current = false,
    disabled = false,
    className,
    as,
    ...restProps
  }: DynBreadcrumbItemProps<C>,
  ref: React.ComponentPropsWithRef<C>['ref']
) => {
  const Component = (as || (href ? 'a' : onClick ? 'button' : 'span')) as React.ElementType;
  const isLink = Component === 'a';
  const isButton = Component === 'button';

  const classes = clsx(
    'dyn-breadcrumb-item',
    {
      'dyn-breadcrumb-item--current': current,
      'dyn-breadcrumb-item--disabled': disabled,
      'dyn-breadcrumb-item--link': href && !disabled,
      'dyn-breadcrumb-item--button': onClick && !disabled,
      'dyn-breadcrumb-item--text': !href && !onClick
    },
    className
  );

  const commonProps = {
    ref,
    className: classes,
    'aria-current': current ? 'page' : undefined,
    'aria-disabled': disabled || undefined,
    ...restProps
  };

  if (isLink) {
    return (
      <a
        {...commonProps}
        href={disabled ? undefined : href}
        tabIndex={disabled ? -1 : undefined}
        onClick={
          disabled
            ? (event) => {
                event.preventDefault();
              }
            : onClick
        }
      >
        {children}
      </a>
    );
  }

  if (isButton) {
    return (
      <button
        {...commonProps}
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  const customComponentProps = {
    ...commonProps,
    ...(href !== undefined
      ? {
          href: disabled ? undefined : href
        }
      : null),
    ...(onClick
      ? {
          onClick: disabled ? undefined : onClick
        }
      : null),
    disabled: disabled || undefined
  };

  return (
    <Component {...customComponentProps}>
      {children}
    </Component>
  );
};

export const DynBreadcrumbItem = forwardRef(DynBreadcrumbItemComponent) as <
  C extends React.ElementType = 'span'
>(
  props: DynBreadcrumbItemProps<C>
) => React.ReactElement | null;

DynBreadcrumbItem.displayName = 'DynBreadcrumbItem';
