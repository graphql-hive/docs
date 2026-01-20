declare module '*.svg' {
  import { SVGProps, ReactNode } from 'react';
  export const ReactComponent: (props: SVGProps<SVGSVGElement>) => ReactNode;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: { src: string; width: number; height: number; blurDataURL?: string };
  export default content;
}

declare module '*.jpeg' {
  const content: { src: string; width: number; height: number; blurDataURL?: string };
  export default content;
}

declare module '*.png' {
  const content: { src: string; width: number; height: number; blurDataURL?: string };
  export default content;
}

declare module '*.webp' {
  const content: { src: string; width: number; height: number; blurDataURL?: string };
  export default content;
}

declare module '*.gif' {
  const content: { src: string; width: number; height: number };
  export default content;
}

declare module '*.mdx' {
  import { ComponentType } from 'react';
  const MDXComponent: ComponentType<{ components?: Record<string, ComponentType> }>;
  export default MDXComponent;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
