// Re-export from @unpic/react for next/image
declare module "next/image" {
  export {
    Link as default,
    Link,
    type LinkProps,
  } from "@tanstack/react-router";
}

// Re-export from @tanstack/react-router for next/link
declare module "next/link" {
  export {
    useLocation,
    useParams,
    useNavigate as useRouter,
    useSearch as useSearchParams,
  } from "@tanstack/react-router";
}

// No-op for next/head - use route head() instead
declare module "next/head" {
  import { FC, ReactNode } from "react";
  const Head: FC<{ children?: ReactNode }>;
  export default Head;
}

// TanStack Router equivalents for next/navigation
declare module "next/navigation" {
  export { Image as default, Image, type ImageProps } from "@unpic/react";

  export function usePathname(): string;
}
