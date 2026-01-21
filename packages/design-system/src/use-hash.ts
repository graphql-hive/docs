'use client';

// don't need to memoize string `hash` value
'use no memo';

import { useEffect, useState } from 'react';

export function useHash() {
  const [hash, setHash] = useState('');

  useEffect(() => {
    const handleHashChange = () => setHash(location.hash.replace('#', ''));
    handleHashChange();

    globalThis.addEventListener('hashchange', handleHashChange);
    return () => globalThis.removeEventListener('hashchange', handleHashChange);
  }, []);

  return hash;
}
