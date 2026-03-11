import { mdxComponents } from "@/lib/mdx-components";
import { CallToAction } from "@hive/design-system/call-to-action";
import React, {
  ComponentPropsWithoutRef,
  ReactElement,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Markdown from "react-markdown";
import { deploymentChangelogSnapshot } from "virtual:deployment-changelog-snapshot";

import {
  DEPLOYMENT_CHANGELOG_MARKDOWN_PLUGINS,
  DEPLOYMENT_CHANGELOG_REHYPE_PLUGINS,
} from "../lib/deployment-changelog";
import {
  type ChangelogState,
  getClientRenderState,
  getFallbackState,
  resetClientChangelogCache,
  resolveStateAfterRefresh,
  seedClientChangelogCache,
} from "../lib/deployment-changelog-client-cache";
import { getChangelogMarkdown } from "../lib/deployment-changelog.server";

const GITHUB_URL =
  "https://github.com/graphql-hive/console/blob/main/deployment/CHANGELOG.md";

let markdownRefreshPromise: Promise<string> | null = null;

const useBrowserLayoutEffect =
  globalThis.window === undefined ? useEffect : useLayoutEffect;

async function refreshMarkdown(loadMarkdown = getChangelogMarkdown) {
  markdownRefreshPromise ||= loadMarkdown()
    .then((markdown) => {
      if (markdown) {
        seedClientChangelogCache(markdown, Date.now());
      }
      return markdown;
    })
    .finally(() => {
      markdownRefreshPromise = null;
    });

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
  const [state, setState] = useState(() =>
    getFallbackState(deploymentChangelogSnapshot),
  );

  useBrowserLayoutEffect(() => {
    let isCancelled = false;
    const nextState = getClientRenderState(deploymentChangelogSnapshot);

    setState((prev) =>
      prev.markdown === nextState.markdown &&
      prev.showGitHubCta === nextState.showGitHubCta
        ? prev
        : {
            markdown: nextState.markdown,
            showGitHubCta: nextState.showGitHubCta,
          },
    );

    if (!nextState.shouldRefresh) {
      return () => {
        isCancelled = true;
      };
    }

    void refreshMarkdown().then((markdown) => {
      if (isCancelled) {
        return;
      }

      setState((prev) =>
        resolveStateAfterRefresh(prev, deploymentChangelogSnapshot, markdown),
      );
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

export function __getClientRenderStateForTests(
  snapshot: string,
  now = Date.now(),
) {
  return getClientRenderState(snapshot, now);
}

export function __resetClientChangelogCacheForTests() {
  resetClientChangelogCache();
  markdownRefreshPromise = null;
}

export function __resolveStateAfterRefreshForTests(
  previousState: ChangelogState,
  snapshot: string,
  markdown: string,
) {
  return resolveStateAfterRefresh(previousState, snapshot, markdown);
}

export function __seedClientChangelogCacheForTests(
  markdown: string,
  timestamp = Date.now(),
) {
  seedClientChangelogCache(markdown, timestamp);
}
