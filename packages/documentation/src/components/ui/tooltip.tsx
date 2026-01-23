'use client';

import { cn } from '@hive/design-system/cn';
import { createContext, HTMLAttributes, ReactNode, useContext, useEffect, useRef, useState } from 'react';

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip components must be used within a Tooltip.Root');
  }
  return context;
}

interface ProviderProps {
  children: ReactNode;
  delayDuration?: number;
}

function Provider({ children }: ProviderProps) {
  return <>{children}</>;
}

interface RootProps {
  children: ReactNode;
  defaultOpen?: boolean;
  delayDuration?: number;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

function Root({ children, defaultOpen = false, delayDuration = 700, onOpenChange, open: controlledOpen }: RootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = (newOpen: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (newOpen && delayDuration > 0) {
      timeoutRef.current = setTimeout(() => {
        if (controlledOpen === undefined) {
          setUncontrolledOpen(true);
        }
        onOpenChange?.(true);
      }, delayDuration);
    } else {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </TooltipContext.Provider>
  );
}

interface TriggerProps extends HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode;
}

/**
 * TODO: Migrate to Base UI Tooltip
 */
function Trigger({ asChild, children, className, ...props }: TriggerProps) {
  const { setOpen, triggerRef } = useTooltipContext();

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);
  const handleFocus = () => setOpen(true);
  const handleBlur = () => setOpen(false);

  if (asChild && children) {
    // For asChild, we'd need to clone the element - simplified version just wraps
    return (
      <span
        className={className}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={triggerRef as React.RefObject<HTMLSpanElement>}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      className={className}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'center' | 'end' | 'start';
  avoidCollisions?: boolean;
  children: ReactNode;
  side?: 'bottom' | 'left' | 'right' | 'top';
  sideOffset?: number;
}

function Content({ children, className, side = 'top', ...props }: ContentProps) {
  const { open } = useTooltipContext();

  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute z-50 animate-in fade-in-0 zoom-in-95',
        side === 'top' && 'bottom-full mb-2',
        side === 'bottom' && 'top-full mt-2',
        side === 'left' && 'right-full mr-2',
        side === 'right' && 'left-full ml-2',
        className
      )}
      data-side={side}
      role="tooltip"
      {...props}
    >
      {children}
    </div>
  );
}

export const Tooltip = {
  Content,
  Provider,
  Root,
  Trigger,
};

// Also export individual parts for destructuring imports
export { Content, Provider, Root, Trigger };
export default Tooltip;
