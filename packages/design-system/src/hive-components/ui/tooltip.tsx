'use client';

// Native Tooltip component to replace @radix-ui/react-tooltip
// TODO: Migrate to Base UI Tooltip when available
import { createContext, useContext, useState, ReactNode, HTMLAttributes, useRef, useEffect } from 'react';
import { cn } from '../../guild-components/cn';

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
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}

function Root({ children, open: controlledOpen, defaultOpen = false, onOpenChange, delayDuration = 700 }: RootProps) {
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
  children: ReactNode;
  asChild?: boolean;
}

function Trigger({ children, asChild, className, ...props }: TriggerProps) {
  const { setOpen, triggerRef } = useTooltipContext();

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);
  const handleFocus = () => setOpen(true);
  const handleBlur = () => setOpen(false);

  if (asChild && children) {
    // For asChild, we'd need to clone the element - simplified version just wraps
    return (
      <span
        ref={triggerRef as React.RefObject<HTMLSpanElement>}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={className}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  avoidCollisions?: boolean;
}

function Content({ children, className, side = 'top', ...props }: ContentProps) {
  const { open } = useTooltipContext();

  if (!open) {
    return null;
  }

  return (
    <div
      role="tooltip"
      data-side={side}
      className={cn(
        'absolute z-50 animate-in fade-in-0 zoom-in-95',
        side === 'top' && 'bottom-full mb-2',
        side === 'bottom' && 'top-full mt-2',
        side === 'left' && 'right-full mr-2',
        side === 'right' && 'left-full ml-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const Tooltip = {
  Provider,
  Root,
  Trigger,
  Content,
};

// Also export individual parts for destructuring imports
export { Provider, Root, Trigger, Content };
export default Tooltip;
