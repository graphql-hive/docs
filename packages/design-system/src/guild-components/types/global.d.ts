declare global {
  interface Window {
    $crisp?: {
      push: (args: unknown[]) => void;
    };
  }
}


