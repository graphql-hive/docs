type Changelog = {
  date: string;
  description: string;
  route: string;
  title: string;
};

export async function getChangelogs(): Promise<Changelog[]> {
  const { productUpdates } = await import("fumadocs-mdx:collections/server");
  return productUpdates
    .map((entry) => {
      const slug = entry.info.path.replace(/\.mdx?$/, "");
      return {
        date: entry.date,
        description: entry.description ?? "",
        route: `/product-updates/${slug}`,
        title: entry.title ?? slug,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
