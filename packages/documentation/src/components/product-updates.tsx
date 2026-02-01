import { productUpdates } from "fumadocs-mdx:collections/server";
import { ReactElement } from "react";

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

export function getChangelogs(): Changelog[] {
  return productUpdates
    .map((entry) => {
      const slug = entry.info.path.replace(/^\//, "").replace(/\/$/, "");
      return {
        date: (entry as Record<string, unknown>)["date"] as string,
        description:
          ((entry as Record<string, unknown>)["description"] as string) ?? "",
        route: `/product-updates/${slug}`,
        title: ((entry as Record<string, unknown>)["title"] as string) ?? slug,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function ProductUpdatesPage() {
  const changelogs = getChangelogs();

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
        <a href={props.route}>{props.title}</a>
      </h3>
      <div className="mb-4 mt-1 max-w-[600px] text-base/6 font-normal text-gray-500 dark:text-gray-400">
        {props.description}
      </div>
    </li>
  );
}
