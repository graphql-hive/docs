import { cn } from "@hive/design-system/cn";

import { type Author, authors } from "./authors";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  weekday: "long",
  year: "numeric",
});

function resolveAuthor(
  author: { name: string } | string,
): Author & { name: string } {
  const key = typeof author === "string" ? author : author.name;
  const found = authors[key];
  if (found) return found;
  return { link: "#", name: key };
}

function AuthorAvatar({ author }: { author: Author }) {
  const src = author.github
    ? `https://github.com/${author.github}.png?size=80`
    : undefined;
  return (
    <img
      alt={author.name}
      className="size-10 rounded-full"
      loading="lazy"
      src={src}
    />
  );
}

export function ProductUpdateAuthors({
  authors: rawAuthors,
  className,
  date,
}: {
  authors: ({ name: string } | string)[];
  className?: string;
  date: string;
}) {
  const dateObj = new Date(date);
  const resolved = rawAuthors.map(resolveAuthor);

  if (resolved.length === 1) {
    const author = resolved[0]!;
    return (
      <div
        className={cn(
          "my-4 -mb-1 flex flex-row items-center w-fit rounded-sm py-1 pl-1 pr-3",
          "has-[a:hover]:bg-beige-900/5 dark:has-[a:hover]:bg-neutral-50/5",
          className,
        )}
      >
        <a href={author.link} title={author.name}>
          <AuthorAvatar author={author} />
        </a>
        <div className="ml-2.5 flex flex-col">
          <a
            className="text-green-1000 font-semibold dark:text-neutral-200"
            href={author.link}
            title={author.name}
          >
            {author.name}
          </a>
          <time
            className="text-green-1000 text-xs dark:text-neutral-200"
            dateTime={dateObj.toISOString()}
            title={`Posted ${dateFormat.format(dateObj)}`}
          >
            {dateFormat.format(dateObj)}
          </time>
        </div>
      </div>
    );
  }

  return (
    <>
      <time
        className="mt-5 block text-center text-xs text-[#777]"
        dateTime={dateObj.toISOString()}
        title={`Posted ${dateFormat.format(dateObj)}`}
      >
        {dateFormat.format(dateObj)}
      </time>
      <div className="my-5 flex flex-wrap justify-center gap-5">
        {resolved.map((author) => (
          <a
            className="text-green-1000 flex items-center font-semibold dark:text-neutral-200"
            href={author.link}
            key={author.name}
            title={author.name}
          >
            <AuthorAvatar author={author} />
            <span className="ml-2.5 text-sm">{author.name}</span>
          </a>
        ))}
      </div>
    </>
  );
}
