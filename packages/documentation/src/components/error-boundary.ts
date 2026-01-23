"use client";

import { Component } from "react";

export class ErrorBoundary extends Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
}> {
  override state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    console.error(error);
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error(error, info);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
