import React, { forwardRef, useState, useRef, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { DynIcon } from '../DynIcon';
import { useClickOutside } from '../../hooks/useClickOutside';
import './DynMenu.css';

export interface MenuItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
  description?: string;
}

export interface DynMenuTriggerRenderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ref: React.Ref<HTMLButtonElement>;
  /**
   * Indicates whether the menu is currently open
   */
  isOpen: boolean;
}

export type DynMenuTrigger =
  | React.ReactNode
  | ((props: DynMenuTriggerRenderProps) => React.ReactNode);

export interface DynMenuProps {
  /**
   * Menu items
   */
  items: MenuItem[];
  
  /**
   * Menu trigger element or render function
   */
  trigger: DynMenuTrigger;
  
  /**
   * Menu placement
   * @default 'bottom-start'
   */
  placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  
  /**
   * Item selection handler
   */
  onSelect?: (value: string) => void;
  
  /**
   * Open state (controlled)
   */
  open?: boolean;
  
  /**
   * Open change handler
   */
  onOpenChange?: (open: boolean) => void;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Test identifier
   */
  'data-testid'?: string;
}

export interface DynMenuRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * DynMenu - Dropdown menu component with keyboard navigation
 * 
 * Features:
 * - Click outside to close
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Multiple placement options
 * - Icon and description support
 * - Divider support
 * - ARIA menu pattern compliance
 */
export const DynMenu = forwardRef<DynMenuRef, DynMenuProps>((
  {
    items,
    trigger,
    placement = 'bottom-start',
    onSelect,
    open,
    onOpenChange,
    className,
    'data-testid': dataTestId,
    ...props
  },
  ref
) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isOpen = open !== undefined ? open : internalOpen;
  const enabledItems = items.filter(item => !item.disabled);
  
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [open, onOpenChange]);
  
  const handleTriggerClick = useCallback(() => {
    handleOpenChange(!isOpen);
  }, [isOpen, handleOpenChange]);
  
  const handleItemSelect = useCallback((value: string) => {
    onSelect?.(value);
    handleOpenChange(false);
  }, [onSelect, handleOpenChange]);
  
  // Close on outside click
  useClickOutside([triggerRef, menuRef], () => {
    if (isOpen) {
      handleOpenChange(false);
    }
  });
  
  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < enabledItems.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : enabledItems.length - 1
        );
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < enabledItems.length) {
          handleItemSelect(enabledItems[focusedIndex].value);
        }
        break;
        
      case 'Escape':
        handleOpenChange(false);
        triggerRef.current?.focus();
        break;
    }
  }, [isOpen, enabledItems, focusedIndex, handleItemSelect, handleOpenChange]);
  
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);
  
  // Reset focused index when menu closes
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);
  
  // Expose ref methods
  React.useImperativeHandle(ref, () => ({
    open: () => handleOpenChange(true),
    close: () => handleOpenChange(false),
    toggle: () => handleOpenChange(!isOpen)
  }), [handleOpenChange, isOpen]);
  
  return (
    <div className={clsx('dyn-menu', className)} data-testid={dataTestId} {...props}>
      {/* Trigger */}
      {typeof trigger === 'function' ? (
        trigger({
          ref: triggerRef,
          type: 'button',
          className: 'dyn-menu__trigger',
          onClick: handleTriggerClick,
          'aria-expanded': isOpen,
          'aria-haspopup': 'menu',
          isOpen
        })
      ) : (
        <button
          ref={triggerRef}
          type="button"
          className="dyn-menu__trigger"
          onClick={handleTriggerClick}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {trigger}
        </button>
      )}
      
      {/* Menu dropdown */}
      {isOpen && (
        <div
          ref={menuRef}
          className={clsx(
            'dyn-menu__dropdown',
            `dyn-menu__dropdown--${placement}`
          )}
          role="menu"
        >
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div 
                  key={`divider-${index}`}
                  className="dyn-menu__divider"
                  role="separator"
                />
              );
            }
            
            const isFocused = enabledItems.findIndex(ei => ei.value === item.value) === focusedIndex;
            
            return (
              <button
                key={item.value}
                type="button"
                className={clsx(
                  'dyn-menu__item',
                  {
                    'dyn-menu__item--disabled': item.disabled,
                    'dyn-menu__item--focused': isFocused
                  }
                )}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => !item.disabled && handleItemSelect(item.value)}
              >
                {item.icon && (
                  <span className="dyn-menu__item-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                
                <div className="dyn-menu__item-content">
                  <div className="dyn-menu__item-label">
                    {item.label}
                  </div>
                  
                  {item.description && (
                    <div className="dyn-menu__item-description">
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

DynMenu.displayName = 'DynMenu';