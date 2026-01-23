import { Link } from "@tanstack/react-router";
import { ReactElement } from "react";

// TODO: getPageMap needs to be implemented for TanStack Start
// For now using a stub implementation
async function getPageMap(_path: string): Promise<PageMapItem[]> {
  // This should be implemented to fetch the page map from Fumadocs or similar
  console.warn("getPageMap not yet implemented for TanStack Start");
  return [];
}

type PageMapItem = {
  children?: unknown;
  data?: unknown;
  frontMatter?: {
    date?: string;
    description?: string;
    title?: string;
  };
  name: string;
  route: string;
};

// Native date formatting to replace date-fns
function formatDate(date: Date): string {
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

type Changelog = {
  date: string;
  description: string;
  route: string;
  title: string;
};

export async function ProductUpdatesPage() {
  const changelogs = await getChangelogs();

  return (
    <ol className="relative mt-12 border-l border-gray-200 dark:border-gray-700">
      {changelogs.map((item) => (
        <ProductUpdateTeaser key={item.route} {...item} />
      ))}
    </ol>
  );
}

function ProductUpdateTeaser(props: Changelog): ReactElement {
  return (
    <li className="mb-10 ml-4">
      <div className="absolute -left-1.5 mt-1.5 size-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700" />
      <time
        className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
        dateTime={props.date}
      >
        {formatDate(new Date(props.date))}
      </time>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        <Link to={props.route}>{props.title}</Link>
      </h3>
      <div className="mb-4 mt-1 max-w-[600px] text-base font-normal leading-6 text-gray-500 dark:text-gray-400">
        {props.description}
      </div>
    </li>
  );
}

export async function getChangelogs(): Promise<Changelog[]> {
  const [_meta, _indexPage, ...pageMap] = await getPageMap("/product-updates");

  return pageMap
    .map((item) => {
      if ("data" in item || "children" in item) {
        throw new Error("Incorrect page map");
      }
      const { frontMatter = {}, route } = item;
      let date: string;

      try {
        date = new Date(
          frontMatter.date || item.name.slice(0, 10),
        ).toISOString();
      } catch (error) {
        console.error(
          `Error parsing date \`${frontMatter.date}\` for ${item.name}: ${error}`,
        );
        throw error;
      }
      return {
        date,
        description: frontMatter.description ?? "",
        route,
        title: frontMatter.title ?? item.name,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
