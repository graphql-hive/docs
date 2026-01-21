// Stub for nextra-theme-docs
import { createContext, ReactNode, useContext } from 'react';

export interface DocsThemeConfig {
  chat?: { link?: string };
  docsRepositoryBase?: string;
  footer?: { text?: ReactNode };
  head?: ReactNode;
  logo?: ReactNode;
  primaryHue?: number;
  project?: { link?: string };
}

export function useConfig(): DocsThemeConfig {
  return {};
}

export function useThemeConfig(): DocsThemeConfig {
  return {};
}

export function useTheme() {
  return {
    resolvedTheme: 'light' as 'dark' | 'light',
    setTheme: (_theme: string) => {},
    theme: 'light' as 'dark' | 'light',
  };
}

// Menu state management
const MenuContext = createContext<{ menu: boolean; setMenu: (v: boolean) => void }>({
  menu: false,
  setMenu: () => {},
});

export function useMenu() {
  return useContext(MenuContext).menu;
}

export function setMenu(value: ((prev: boolean) => boolean) | boolean) {
  // This is a simplified stub - in real usage, this would be connected to context
  console.warn('setMenu stub called', value);
}

export const ThemeSwitch = () => null;
export const Navbar = () => null;
export const NotFoundPage = () => null;
