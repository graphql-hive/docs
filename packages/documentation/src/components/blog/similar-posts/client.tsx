"use client";

import { BlogCard, type BlogPost } from "../blog-card";

export function SimilarPostsClient({
  currentTags,
  currentTitle,
  sortedPosts,
}: {
  currentTags: string[];
  currentTitle: string;
  sortedPosts: BlogPost[];
}) {
  const postsToShow: BlogPost[] = [];
  const intersectedTags: string[] = [];

  for (let i = 0; i < sortedPosts.length && postsToShow.length < 2; i++) {
    const post = sortedPosts[i]!;
    if (post.title !== currentTitle) {
      const tagsInCommon = post.tags.filter((tag) => currentTags.includes(tag));
      if (tagsInCommon.length > 0) {
        postsToShow.push(post);
        intersectedTags.push(tagsInCommon[0]!);
      }
    }
  }

  if (postsToShow.length === 0) {
    return <del />;
  }

  return postsToShow.map((post, i) => (
    <BlogCard className="h-full" key={i} post={post} tag={intersectedTags[i]} />
  ));
}
