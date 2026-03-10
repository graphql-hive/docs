import { mdxComponents } from "@/lib/mdx-components";
import { CallToAction } from "@hive/design-system/call-to-action";
import React, {
  ComponentPropsWithoutRef,
  createContext,
  ReactElement,
  ReactNode,
  use,
  useContext,
} from "react";
import Markdown from "react-markdown";

import {
  DEPLOYMENT_CHANGELOG_MARKDOWN_PLUGINS,
  DEPLOYMENT_CHANGELOG_REHYPE_PLUGINS,
} from "../lib/deployment-changelog";
import { getChangelogMarkdown } from "../lib/deployment-changelog.server";

const GITHUB_URL =
  "https://github.com/graphql-hive/console/blob/main/deployment/CHANGELOG.md";

let markdownPromise: Promise<string> | null = null;

async function loadChangelogMarkdown() {
  const markdown = await getChangelogMarkdown();
  if (!markdown) {
    markdownPromise = null;
  }
  return markdown;
}

export const DeploymentChangelogMarkdownContext = createContext<
  string | null | undefined
>(undefined);

const changelogMdxComponents = {
  ...mdxComponents,
  /**
   * We're getting redundant paragraphs nested in all list items.
   */
  li: (props: ComponentPropsWithoutRef<"li">) => {
    const children = React.Children.toArray(props.children).filter(
      (child) => child !== "\n",
    );
    const firstChild = children[0] as
      | ReactElement<{ children: ReactNode }>
      | undefined;

    if (children.length === 1 && firstChild?.type === "p") {
      return <li {...props}>{firstChild?.props.children}</li>;
    }

    return <li {...props}>{children}</li>;
  },
};

export function DeploymentChangelog() {
  const prefetchedMarkdown = useContext(DeploymentChangelogMarkdownContext);
  const markdown =
    prefetchedMarkdown == null
      ? use((markdownPromise ??= loadChangelogMarkdown()))
      : prefetchedMarkdown;

  if (!markdown) {
    return (
      <CallToAction href={GITHUB_URL} variant="secondary">
        View the changelog on GitHub
      </CallToAction>
    );
  }

  return (
    <Markdown
      components={changelogMdxComponents}
      rehypePlugins={[...DEPLOYMENT_CHANGELOG_REHYPE_PLUGINS]}
      remarkPlugins={[...DEPLOYMENT_CHANGELOG_MARKDOWN_PLUGINS]}
    >
      {markdown}
    </Markdown>
  );
}
