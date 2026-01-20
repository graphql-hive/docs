// Stub for nextra-theme-docs
import { ReactNode, createContext, useContext } from 'react';

export interface DocsThemeConfig {
  logo?: ReactNode;
  project?: { link?: string };
  chat?: { link?: string };
  docsRepositoryBase?: string;
  footer?: { text?: ReactNode };
  head?: ReactNode;
  primaryHue?: number;
}

export function useConfig(): DocsThemeConfig {
  return {};
}

export function useThemeConfig(): DocsThemeConfig {
  return {};
}

export function useTheme() {
  return {
    theme: 'light' as 'light' | 'dark',
    setTheme: (_theme: string) => {},
    resolvedTheme: 'light' as 'light' | 'dark',
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

export function setMenu(value: boolean | ((prev: boolean) => boolean)) {
  // This is a simplified stub - in real usage, this would be connected to context
  console.warn('setMenu stub called', value);
}

export const ThemeSwitch = () => null;
export const Navbar = () => null;
export const NotFoundPage = () => null;
