import {
  ComponentPropsWithoutRef,
  forwardRef,
  useState,
  createContext,
} from 'react';
import { Menu } from '@base-ui-components/react/menu';
import { cn } from '../../cn';
import { Anchor } from '../anchor';
import { ArrowIcon } from '../icons';

// Base UI NavigationMenu implementation
// Using Base UI Menu components as the foundation

const CONTAINER_ID = 'h-navmenu-container';

interface NavigationMenuContextValue {
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
}

const NavigationMenuContext = createContext<NavigationMenuContextValue>({
  activeValue: null,
  setActiveValue: () => {},
});

export interface NavigationMenuProps extends ComponentPropsWithoutRef<'nav'> {
  forceMount?: true;
  delayDuration?: number;
}

export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(
  ({ className, children, forceMount: _forceMount, delayDuration: _delayDuration, ...rest }, ref) => {
    const [activeValue, setActiveValue] = useState<string | null>(null);

    return (
      <NavigationMenuContext.Provider value={{ activeValue, setActiveValue }}>
        <nav
          id={CONTAINER_ID}
          ref={ref}
          className={cn('relative z-10 flex flex-1 items-center', className)}
          aria-label="Navigation Menu"
          {...rest}
        >
          {children}
          <RemoveMotionIfPreferred />
        </nav>
      </NavigationMenuContext.Provider>
    );
  },
);
NavigationMenu.displayName = 'NavigationMenu';

export const NavigationMenuList = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group flex flex-1 list-none items-center rounded-lg border-beige-200 px-1.5 lg:border lg:px-3 dark:border-neutral-700',
      className,
    )}
    {...rest}
  />
));
NavigationMenuList.displayName = 'NavigationMenuList';

export const NavigationMenuItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'> & { value?: string }
>(({ className, children, value: _value, ...rest }, ref) => {
  const [open, setOpen] = useState(false);

  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <div ref={ref} className={cn('relative', className)} {...rest}>
        {children}
      </div>
    </Menu.Root>
  );
});
NavigationMenuItem.displayName = 'NavigationMenuItem';

export const NavigationMenuTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<'button'>
>(({ className, children, disabled, ...rest }, ref) => (
  <Menu.Trigger
    ref={ref}
    disabled={disabled ?? false}
    className={cn(
      'hive-focus cursor-default rounded p-3 font-medium leading-normal text-green-800 aria-expanded:text-green-1000 dark:text-neutral-300 dark:aria-expanded:text-neutral-100',
      className,
    )}
    {...rest}
  >
    {children}
  </Menu.Trigger>
));
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export const NavigationMenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, children, id, ...rest }, ref) => (
  <Menu.Portal>
    <Menu.Positioner sideOffset={8}>
      <Menu.Popup
        ref={ref}
        id={id ?? undefined}
        className={cn(
          'absolute left-0 top-0 w-auto rounded-xl border border-beige-200 bg-white p-6 shadow-[0px_16px_32px_-12px_rgba(14,18,27,0.10)] dark:border-neutral-800 dark:bg-neutral-900',
          'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity',
          className,
        )}
        {...rest}
      >
        {children}
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
));
NavigationMenuContent.displayName = 'NavigationMenuContent';

export interface NavigationMenuLinkProps
  extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  href: string;
  arrow?: boolean;
}

export const NavigationMenuLink = forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className, arrow, children, href, ...rest }, ref) => {
    return (
      <Anchor
        ref={ref}
        href={href}
        className={cn(
          'hive-focus rounded p-3 leading-normal text-green-800 transition-colors hover:bg-beige-100 hover:text-green-1000 dark:text-neutral-300 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-100',
          arrow && 'flex items-center',
          className,
        )}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
        {arrow && <ArrowIcon className="ml-auto size-6 shrink-0 opacity-0 transition-all" />}
      </Anchor>
    );
  },
);
NavigationMenuLink.displayName = 'NavigationMenuLink';

export const NavigationMenuViewport = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(function NavigationMenuViewport() {
  // Viewport is handled by Menu.Portal/Positioner now
  // This is kept for API compatibility but doesn't render anything
  return null;
});
NavigationMenuViewport.displayName = 'NavigationMenuViewport';

export const NavigationMenuIndicator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ className, ...rest }, ref) => (
  <div
    ref={ref}
    className={cn(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
      className,
    )}
    {...rest}
  >
    <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-beige-200 shadow-md" />
  </div>
));
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

// We're removing fade-in and fade-out too, because without the slide animations they make the content less readable.
function RemoveMotionIfPreferred() {
  return (
    <style>
      {`@media (prefers-reduced-motion: reduce) { #${CONTAINER_ID} * { animation-duration: 0ms !important; transition-duration: 0ms !important; } }`}
    </style>
  );
}
