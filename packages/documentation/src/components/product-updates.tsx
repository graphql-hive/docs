import { Anchor } from "@hive/design-system/anchor";
import { ReactElement } from "react";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export type Changelog = {
  date: string;
  description: string;
  route: string;
  title: string;
};

export function ProductUpdatesPage({
  changelogs,
}: {
  changelogs: Changelog[];
}) {
  return (
    <ol className="relative mx-auto mt-12 w-[872px] max-w-full border-l border-blue-300 dark:border-neutral-700">
      {changelogs.map((item) => (
        <ProductUpdateTeaser key={item.route} {...item} />
      ))}
    </ol>
  );
}

function ProductUpdateTeaser(props: Changelog): ReactElement {
  return (
    <li className="mb-10 ml-4">
      <Anchor className="group" href={props.route}>
        <div className="absolute -left-1.5 translate-x-[-.5px] mt-1.5 size-3 rounded-full border border-white bg-blue-300 dark:border-neutral-900 dark:bg-neutral-700 group-hover:bg-blue-400 dark:group-hover:bg-neutral-200" />
        <time
          className="mb-1 text-sm font-normal leading-none text-green-800 dark:text-neutral-400"
          dateTime={props.date}
        >
          {dateFormat.format(new Date(props.date))}
        </time>
        <h3 className="text-lg font-semibold text-green-900 dark:text-white group-hover:underline">
          {props.title}
        </h3>
        <div className="mb-4 mt-1 max-w-[600px] text-base/6 font-normal text-green-900 dark:text-neutral-400">
          {props.description}
        </div>
      </Anchor>
    </li>
  );
}
