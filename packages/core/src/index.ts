import packageJson from '../package.json' assert { type: 'json' };

/**
 * DynUI-Max Core Components
 *
 * Production-ready React + TypeScript component library
 * with design tokens integration and comprehensive a11y support.
 */

// Theme Provider and Context
export { ThemeProvider, useTheme } from './theme';

// Core Components (P0 Prerequisites)
export { DynIcon } from './components/DynIcon';
export type { DynIconProps } from './components/DynIcon';
export { iconRegistry } from './components/DynIcon/iconRegistry';

export { DynFieldContainer } from './components/DynFieldContainer';
export type { DynFieldContainerProps } from './components/DynFieldContainer';

export { DynStepper } from './components/DynStepper';
export type { DynStepperProps, DynStepperRef, StepData, StepStatus } from './components/DynStepper';

// Form Components
export { DynButton } from './components/DynButton';
export type { DynButtonProps } from './components/DynButton';

export { DynInput } from './components/DynInput';
export type { DynInputProps, InputVariant } from './components/DynInput';

export { DynTextArea } from './components/DynTextArea';
export type { DynTextAreaProps } from './components/DynTextArea';

export { DynSelect } from './components/DynSelect';
export type { DynSelectProps, DynSelectRef, SelectOption } from './components/DynSelect';

export { DynSelectOption } from './components/DynSelect/DynSelectOption';
export type { DynSelectOptionProps } from './components/DynSelect/DynSelectOption';

export { DynCheckbox } from './components/DynCheckbox';
export type { DynCheckboxProps } from './components/DynCheckbox';

export { DynRadio, DynRadioGroup } from './components/DynRadio';
export type { DynRadioProps, DynRadioGroupProps } from './components/DynRadio';

export { DynLabel } from './components/DynLabel';
export type { DynLabelProps } from './components/DynLabel';

// Layout & Container Components
export { DynBox } from './components/DynBox';
export type { DynBoxProps, SpacingValue, DisplayValue, FlexDirection, JustifyContent, AlignItems } from './components/DynBox';

export { DynContainer } from './components/DynContainer';
export type { DynContainerProps } from './components/DynContainer';

export { DynGrid, DynGridItem } from './components/DynGrid';
export type { DynGridProps, DynGridItemProps } from './components/DynGrid';

export { DynModal } from './components/DynModal';
export type { DynModalProps } from './components/DynModal';

export { DynDivider } from './components/DynDivider';
export type { DynDividerProps } from './components/DynDivider';

// Navigation Components
export { DynTabs } from './components/DynTabs';
export type { DynTabsProps, DynTabsRef, TabItem } from './components/DynTabs';

export { DynMenu } from './components/DynMenu';
export type { DynMenuProps, DynMenuRef, MenuItem } from './components/DynMenu';

export { DynMenuItem } from './components/DynMenu/DynMenuItem';
export type { DynMenuItemProps } from './components/DynMenu/DynMenuItem';

export { DynBreadcrumb } from './components/DynBreadcrumb';
export type { DynBreadcrumbProps, BreadcrumbItem } from './components/DynBreadcrumb';

export { DynBreadcrumbItem } from './components/DynBreadcrumb/DynBreadcrumbItem';
export type { DynBreadcrumbItemProps } from './components/DynBreadcrumb/DynBreadcrumbItem';

// Data Display Components
export { DynTable } from './components/DynTable';
export type { DynTableProps, TableColumn } from './components/DynTable';

export { DynTreeView } from './components/DynTreeView';
export type { DynTreeViewProps, TreeNode } from './components/DynTreeView';

export { DynTreeNode } from './components/DynTreeView/DynTreeNode';
export type { DynTreeNodeProps } from './components/DynTreeView/DynTreeNode';

export { DynListView } from './components/DynListView';
export type { DynListViewProps, ListItem } from './components/DynListView';

export { DynBadge } from './components/DynBadge';
export type { DynBadgeProps } from './components/DynBadge';

export { DynAvatar } from './components/DynAvatar';
export type { DynAvatarProps } from './components/DynAvatar';

// Utility Components
export { ThemeSwitcher } from './components/ThemeSwitcher';
export type { ThemeSwitcherProps, ThemeMode } from './components/ThemeSwitcher';

// Hooks
export { useClickOutside } from './hooks/useClickOutside';
export { useKeyboard } from './hooks/useKeyboard';
export { useFocusTrap } from './hooks/useFocusTrap';

// Types and utilities from design tokens
export type { 
  Theme, 
  ComponentVariant, 
  ComponentSize, 
  ComponentColor,
  BaseTokens,
  SemanticTokens
} from '@dynui-max/design-tokens';

// Version
export const VERSION = packageJson.version;
