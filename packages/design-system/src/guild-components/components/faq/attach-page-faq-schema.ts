'use client';

import { FC, useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

export const AttachPageFAQSchema: FC<{ faqPages?: string[] }> = ({ faqPages = [] }) => {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const html = document.querySelector('html')!;
    if (!faqPages.includes(pathname) || html.hasAttribute('itemscope')) {
      return;
    }
    html.setAttribute('itemscope', '');
    html.setAttribute('itemtype', 'https://schema.org/FAQPage');

    return () => {
      html.removeAttribute('itemscope');
      html.removeAttribute('itemtype');
    };
  }, [faqPages, pathname]);

  return null;
};
