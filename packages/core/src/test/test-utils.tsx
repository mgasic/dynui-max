import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../theme';

/**
 * Custom render function with ThemeProvider wrapper
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="light">
      {children}
    </ThemeProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };