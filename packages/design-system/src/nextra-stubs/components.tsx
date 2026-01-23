// Stub for nextra/components
import { FC, HTMLAttributes, ReactNode } from "react";

// Re-export local Tabs
export { Tabs } from "../tabs";

// Pre component stub
export interface PreProps extends HTMLAttributes<HTMLPreElement> {
  children?: ReactNode;
  "data-copy"?: string;
  "data-filename"?: string;
  "data-language"?: string;
  "data-theme"?: string;
}

export function Pre({ children, ...props }: PreProps) {
  return <pre {...props}>{children}</pre>;
}

// Stub components - these should be replaced with Fumadocs equivalents
export const Callout: FC<{
  children?: ReactNode;
  emoji?: string;
  type?: string;
}> = ({ children }) => <div className="nextra-callout">{children}</div>;

export const Cards: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="nextra-cards">{children}</div>
);

export const Code: FC<{ children?: ReactNode }> = ({ children }) => (
  <code>{children}</code>
);

export const FileTree: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="nextra-filetree">{children}</div>
);

export const Mermaid: FC<{ chart: string }> = ({ chart }) => (
  <pre className="nextra-mermaid">{chart}</pre>
);

export const Steps: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="nextra-steps">{children}</div>
);

export const Bleed: FC<{ children?: ReactNode; full?: boolean }> = ({
  children,
}) => <div className="nextra-bleed">{children}</div>;

export const Collapse: FC<{ children?: ReactNode; open?: boolean }> = ({
  children,
}) => <details className="nextra-collapse">{children}</details>;

export const Search: FC<{ className?: string }> = ({ className }) => (
  <div className={className}>Search placeholder</div>
);

export const Banner: FC<{ children?: ReactNode; dismissible?: boolean }> = ({
  children,
}) => <div className="nextra-banner">{children}</div>;

export const Table: FC<{ children?: ReactNode }> = ({ children }) => (
  <table>{children}</table>
);
