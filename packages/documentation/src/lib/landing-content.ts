import type { BlogPost } from "@/components/blog/blog-card";
import type {
  CaseStudyFile,
  CaseStudyFrontmatter,
} from "@/components/case-studies/case-study-types";

import { pathToSlug } from "./path-to-slug";

type ProductUpdateAuthor = { name: string };

type ProductUpdateFrontmatter = {
  authors: ProductUpdateAuthor[];
  date: string;
  description: string;
  title: string;
};

type BlogFrontmatter = {
  authors: string[];
  date: string;
  description?: string;
  featured?: boolean;
  image?: string;
  tags: string[];
  title: string;
};

type BlogDetail = {
  authors: string[];
  date: string;
  description: string;
  image?: string;
  mobileImage?: string;
  ogImage?: string;
  path: string;
  tags: string[];
  title: string;
};

type BlogModule = {
  _headerImage?: string;
  _mobileImage?: string;
  _ogImage?: string;
};

const productUpdateFrontmatters = import.meta.glob(
  "../../content/product-updates/**/*.{mdx,md}",
  {
    eager: true,
    import: "frontmatter",
    query: {
      collection: "productUpdates",
      only: "frontmatter",
    },
  },
) as Record<string, ProductUpdateFrontmatter>;

const blogFrontmatters = import.meta.glob("../../content/blog/**/*.{mdx,md}", {
  eager: true,
  import: "frontmatter",
  query: {
    collection: "blog",
    only: "frontmatter",
  },
}) as Record<string, BlogFrontmatter>;

const blogModules = import.meta.glob("../../content/blog/**/*.{mdx,md}", {
  query: {
    collection: "blog",
  },
}) as Record<string, () => Promise<BlogModule>>;

const caseStudyFrontmatters = import.meta.glob(
  "../../content/case-studies/**/*.{mdx,md}",
  {
    eager: true,
    import: "frontmatter",
    query: {
      collection: "caseStudies",
      only: "frontmatter",
    },
  },
) as Record<string, CaseStudyFrontmatter>;

function stripContentPrefix(file: string, dir: string) {
  return file.replace(new RegExp(`^.*content/${dir}/`), "");
}

const productUpdates = Object.entries(productUpdateFrontmatters)
  .map(([file, frontMatter]) => {
    const path = stripContentPrefix(file, "product-updates");
    const slug = pathToSlug(path);
    return {
      authors: frontMatter.authors,
      date: frontMatter.date,
      description: frontMatter.description ?? "",
      path,
      route: `/product-updates/${slug}`,
      slug,
      title: frontMatter.title ?? slug,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const blogDetails = Object.fromEntries(
  Object.entries(blogFrontmatters).map(([file, frontMatter]) => {
    const path = stripContentPrefix(file, "blog");
    const slug = pathToSlug(path);
    return [
      slug,
      {
        authors: frontMatter.authors,
        date: frontMatter.date,
        description: frontMatter.description ?? "",
        image: frontMatter.image,
        path,
        tags: frontMatter.tags,
        title: frontMatter.title ?? slug,
      } satisfies BlogDetail,
    ];
  }),
) as Record<string, BlogDetail>;

const blogFilesBySlug = Object.fromEntries(
  Object.entries(blogFrontmatters).map(([file]) => {
    const path = stripContentPrefix(file, "blog");
    const slug = pathToSlug(path);
    return [slug, file];
  }),
) as Record<string, string>;

const blogPosts = Object.entries(blogFrontmatters)
  .map(([file, frontMatter]) => {
    const path = stripContentPrefix(file, "blog");
    const slug = pathToSlug(path);
    return {
      authors: frontMatter.authors,
      date: frontMatter.date,
      description: frontMatter.description ?? "",
      featured: frontMatter.featured ?? false,
      route: `/blog/${slug}`,
      slug,
      tags: frontMatter.tags,
      title: frontMatter.title ?? slug,
    } satisfies BlogPost & { slug: string };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const caseStudies = Object.entries(caseStudyFrontmatters)
  .map(([file, frontMatter]) => {
    const path = stripContentPrefix(file, "case-studies");
    const slug = pathToSlug(path);
    return {
      frontMatter,
      name: slug,
      path,
      route: `/case-studies/${slug}`,
    } satisfies CaseStudyFile;
  })
  .sort((a, b) => (a.frontMatter.date < b.frontMatter.date ? 1 : -1));

export const landingPosts: BlogPost[] = [
  ...blogPosts,
  ...productUpdates.map((item) => ({
    authors: item.authors.map((author) => author.name),
    date: item.date,
    description: item.description,
    featured: false,
    route: item.route,
    tags: ["Product Update"],
    title: item.title,
  })),
  ...caseStudies.map((item) => ({
    authors: item.frontMatter.authors?.map((author) => author.name) ?? [],
    date: item.frontMatter.date,
    description: item.frontMatter.excerpt ?? "",
    featured: false,
    route: item.route,
    tags: ["Case Study"],
    title: item.frontMatter.title,
  })),
].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getProductUpdateBySlug(slug: string) {
  return productUpdates.find((item) => item.slug === slug);
}

export async function getBlogDetailBySlug(slug: string) {
  const detail = blogDetails[slug];
  if (!detail) return;

  const file = blogFilesBySlug[slug];
  const load = file ? blogModules[file] : undefined;
  const media = load ? await load() : undefined;

  return {
    ...detail,
    image: detail.image ?? media?._headerImage,
    mobileImage: media?._mobileImage,
    ogImage: media?._ogImage,
  };
}

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((item) => item.name === slug);
}

export function getOtherCaseStudies(slug: string) {
  return caseStudies.filter((item) => item.name !== slug).slice(0, 3);
}
