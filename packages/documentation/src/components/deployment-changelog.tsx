import { mdxComponents } from "@/lib/mdx-components";
import { CallToAction } from "@hive/design-system/call-to-action";
import React, {
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
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

let markdownCache: {
  markdown: string;
  timestamp: number;
} | null = null;
let markdownRefreshPromise: Promise<string> | null = null;

type ChangelogState = {
  markdown: string;
  showGitHubCta: boolean;
};

function getInitialState(): ChangelogState {
  return {
    markdown: deploymentChangelogSnapshot,
    showGitHubCta: !deploymentChangelogSnapshot,
  };
}

function getCachedMarkdown() {
  if (!markdownCache) {
    return null;
  }

  if (Date.now() - markdownCache.timestamp >= ONE_HOUR) {
    markdownCache = null;
    return null;
  }

  return markdownCache.markdown;
}

async function refreshMarkdown() {
  const cachedMarkdown = getCachedMarkdown();
  if (cachedMarkdown !== null) {
    return cachedMarkdown;
  }

  if (!markdownRefreshPromise) {
    markdownRefreshPromise = getChangelogMarkdown()
      .then((markdown) => {
        if (markdown) {
          markdownCache = {
            markdown,
            timestamp: Date.now(),
          };
        }
        return markdown;
      })
      .finally(() => {
        markdownRefreshPromise = null;
      });
  }

  return markdownRefreshPromise;
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
  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    let isCancelled = false;

    void refreshMarkdown().then((markdown) => {
      if (isCancelled) {
        return;
      }

      if (markdown) {
        setState({
          markdown,
          showGitHubCta: false,
        });
        return;
      }

      setState((prev) => ({
        markdown: prev.markdown || deploymentChangelogSnapshot,
        showGitHubCta: true,
      }));
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!state.markdown) {
    return (
      <CallToAction href={GITHUB_URL} variant="secondary">
        View the changelog on GitHub
      </CallToAction>
    );
  }

  return (
    <>
      <Markdown
        components={changelogMdxComponents}
        rehypePlugins={[...DEPLOYMENT_CHANGELOG_REHYPE_PLUGINS]}
        remarkPlugins={[...DEPLOYMENT_CHANGELOG_MARKDOWN_PLUGINS]}
      >
        {state.markdown}
      </Markdown>
      {state.showGitHubCta ? (
        <div className="mt-6">
          <CallToAction href={GITHUB_URL} variant="secondary">
            View the changelog on GitHub
          </CallToAction>
        </div>
      ) : null}
    </>
  );
}
