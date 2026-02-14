/**
 * Shim for `@theguild/components` imports in old docs content.
 * Re-exports from design-system where available, stubs the rest.
 */

export { ContactTextLink } from "@hive/design-system/contact-us";
export { Callout } from "@hive/design-system/hive-components/callout";
export { Tabs } from "@hive/design-system/tabs";

// Nextra-style Cards component
function Card({
  arrow,
  children,
  href,
  icon,
  title,
}: {
  arrow?: boolean;
  children?: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
  title: string;
}) {
  return (
    <a
      className="nextra-card group flex flex-col justify-start overflow-hidden rounded-lg border border-gray-200 text-current no-underline shadow-sm shadow-gray-100 transition-all duration-200 hover:border-gray-300 hover:shadow-md hover:shadow-gray-100 dark:border-neutral-700 dark:shadow-none dark:hover:border-neutral-500 dark:hover:shadow-none"
      href={href}
    >
      <span className="flex items-center gap-2 p-4 font-semibold text-gray-700 hover:text-gray-900 dark:text-neutral-200 dark:hover:text-neutral-50">
        {icon}
        {title}
        {arrow && (
          <span className="ml-auto transition-transform group-hover:translate-x-1">
            →
          </span>
        )}
      </span>
      {children && (
        <span className="px-4 pb-4 text-sm text-gray-500 dark:text-neutral-400">
          {children}
        </span>
      )}
    </a>
  );
}

export function Cards({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  );
}
Cards.Card = Card;

// Nextra-style Steps component
export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <div className="nextra-steps ml-4 mb-12 border-l border-gray-200 pl-6 [counter-reset:step] dark:border-neutral-800">
      {children}
    </div>
  );
}

// Nextra-style FileTree component
function File({ name }: { name: string }) {
  return <li className="my-0.5 list-none text-sm">{name}</li>;
}

function Folder({
  children,
  defaultOpen,
  name,
}: {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  name: string;
}) {
  return (
    <li className="my-0.5 list-none text-sm">
      <details open={defaultOpen}>
        <summary className="cursor-pointer font-medium">{name}</summary>
        <ul className="ml-4">{children}</ul>
      </details>
    </li>
  );
}

export function FileTree({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-neutral-800">
      <ul className="m-0 list-none">{children}</ul>
    </div>
  );
}
FileTree.File = File;
FileTree.Folder = Folder;
