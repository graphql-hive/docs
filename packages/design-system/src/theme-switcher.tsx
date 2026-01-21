'use client';

import { useTheme } from 'nextra-theme-docs';
import { FC, ReactNode } from 'react';

export const ThemeSwitcherButton: FC<{ children: ReactNode }> = ({ children }) => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      className="self-center rounded-sm p-2 outline-none focus-visible:ring"
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
    >
      {children}
    </button>
  );
};
