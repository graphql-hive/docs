import { mdxComponents } from "@/lib/mdx-components";
import { CallToAction } from "@hive/design-system/call-to-action";
import React, {
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
  use,
} from "react";
import Markdown from "react-markdown";
import { deploymentChangelogSnapshot } from "virtual:deployment-changelog-snapshot";

import {
  DEPLOYMENT_CHANGELOG_MARKDOWN_PLUGINS,
  DEPLOYMENT_CHANGELOG_REHYPE_PLUGINS,
} from "../lib/deployment-changelog";
import { getChangelogMarkdown } from "../lib/deployment-changelog.server";

const GITHUB_URL =
  "https://github.com/graphql-hive/console/blob/main/deployment/CHANGELOG.md";

const ONE_HOUR = 3_600_000;

let markdownPromiseCache: {
  promise: Promise<string>;
  timestamp: number;
} | null = null;

async function loadChangelogMarkdown() {
  return (await getChangelogMarkdown()) || deploymentChangelogSnapshot;
}

function getChangelogMarkdownPromise() {
  if (typeof window === "undefined") {
    return loadChangelogMarkdown();
  }

  if (
    !markdownPromiseCache ||
    Date.now() - markdownPromiseCache.timestamp >= ONE_HOUR
  ) {
    markdownPromiseCache = {
      promise: loadChangelogMarkdown(),
      timestamp: Date.now(),
    };
  }

  return markdownPromiseCache.promise;
}

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
  const markdown = use(getChangelogMarkdownPromise());

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
