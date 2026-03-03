"use client";

import { cn } from "@hive/design-system/cn";
import { GithubIcon, RabbitIcon, RouteIcon, TargetIcon } from "lucide-react";
import React from "react";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      className="relative w-full overflow-x-auto"
      data-slot="table-container"
    >
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        data-slot="table"
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn("[&_tr]:border-b", className)}
      data-slot="table-header"
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      data-slot="table-body"
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "hover:bg-beige-100 border-beige-400 border-b transition-colors hover:transition-none dark:border-neutral-800 dark:hover:bg-neutral-800/25",
        className,
      )}
      data-slot="table-row"
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "whitespace-nowrap p-2 text-left align-middle font-medium",
        className,
      )}
      data-slot="table-head"
      {...props}
    />
  );
}
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn("whitespace-nowrap p-2 align-middle", className)}
      data-slot="table-cell"
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      className={cn(
        "mt-2 text-sm text-green-800 dark:text-neutral-400",
        className,
      )}
      data-slot="table-caption"
      {...props}
    />
  );
}

const testCasesTotal = 189;
const testSuitesTotal = 42;
const gateways = [
  {
    cpu: 167,
    mem: 48,
    name: "Hive Router",
    okTestCases: 189,
    okTestSuites: 42,
    p95: 48.58,
    p99_9: 78.84,
    rps: 1831.09,
    version: "main",
  },
  {
    cpu: 270,
    mem: 192,
    name: "Apollo Router",
    okTestCases: 185,
    okTestSuites: 40,
    p95: 196.46,
    p99_9: 472.21,
    rps: 329.84,
    version: "v2.6.0",
  },
  {
    cpu: 133,
    mem: 94,
    name: "Grafbase Gateway",
    okTestCases: 171,
    okTestSuites: 35,
    p95: 137.81,
    p99_9: 395.73,
    rps: 461.19,
    version: "v0.48.1",
  },
  {
    cpu: 263,
    mem: 119,
    name: "Cosmo Router",
    okTestCases: 179,
    okTestSuites: 36,
    p95: 128.25,
    p99_9: 348.17,
    rps: 585.79,
    version: "v0.247.0",
  },
];

export function BenchmarkResultsTable() {
  const rows = [...gateways];
  rows.sort((a, b) => b.rps - a.rps);

  return (
    <Table className="mt-6 font-mono">
      <TableHeader>
        <TableRow className="bg-beige-100 dark:bg-neutral-800/50">
          <TableHead className="w-[100px]">
            Gateway
            <br />
            <span className="text-green-800 dark:text-neutral-400">
              version
            </span>
          </TableHead>
          <TableHead className="text-center">
            RPS
            <br />
            <span className="text-green-800 dark:text-neutral-400">reqs/s</span>
          </TableHead>
          <TableHead className="text-center">
            P95
            <br />
            <span className="text-green-800 dark:text-neutral-400">ms</span>
          </TableHead>
          <TableHead className="text-center">
            P99.9
            <br />
            <span className="text-green-800 dark:text-neutral-400">ms</span>
          </TableHead>
          <TableHead className="text-center">
            CPU
            <br />
            <span className="text-green-800 dark:text-neutral-400">max %</span>
          </TableHead>
          <TableHead className="text-center">
            MEM
            <br />
            <span className="text-green-800 dark:text-neutral-400">max MB</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          return (
            <TableRow key={row.name}>
              <TableCell>
                <div className="font-medium">{row.name}</div>
                <span className="text-xs text-green-800 dark:text-neutral-400">
                  {row.version}
                </span>
              </TableCell>
              <TableCell className="text-center">{row.rps}</TableCell>
              <TableCell className="text-center">{row.p95}</TableCell>
              <TableCell className="text-center">{row.p99_9}</TableCell>
              <TableCell className="text-center">{row.cpu}</TableCell>
              <TableCell className="text-center">{row.mem}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableCaption className="text-xs">
        Results from our open-source{" "}
        <a
          className="underline"
          href="http://the-guild.dev/graphql/hive/federation-gateway-performance/#/constant"
          rel="noreferrer"
          target="_blank"
          title="Open Source GraphQL federation gateways performance benchmark"
        >
          benchmark
        </a>
      </TableCaption>
    </Table>
  );
}

export function AuditResultsTable() {
  const rows = [...gateways];
  rows.sort((a, b) => b.okTestCases - a.okTestCases);

  return (
    <Table className="mt-6 font-mono">
      <TableHeader>
        <TableRow className="bg-beige-100 hover:bg-beige-100 dark:bg-neutral-800/50 hover:dark:bg-neutral-800/50">
          <TableHead className="w-[100px]">Gateway</TableHead>
          <TableHead className="text-center">Compatibility</TableHead>
          <TableHead className="text-center">Test Cases</TableHead>
          <TableHead className="text-center">Test Suites</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          return (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-center font-medium">
                {((row.okTestCases * 100) / testCasesTotal).toFixed(2)}
                <span className="text-green-800 dark:text-neutral-400">%</span>
              </TableCell>
              <TableCell className="space-x-2 text-center">
                <span className="text-green-600 dark:text-green-500">
                  ✓ {row.okTestCases}
                </span>
                {testCasesTotal - row.okTestCases > 0 ? (
                  <span className="text-red-600 dark:text-red-500">
                    ✗ {testCasesTotal - row.okTestCases}
                  </span>
                ) : null}
              </TableCell>
              <TableCell className="space-x-2 text-center">
                <span className="text-green-600 dark:text-green-500">
                  ✓ {row.okTestSuites}
                </span>
                {testSuitesTotal - row.okTestSuites > 0 ? (
                  <span className="text-red-600 dark:text-red-500">
                    ✗ {testSuitesTotal - row.okTestSuites}
                  </span>
                ) : null}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableCaption className="text-xs">
        Results from our open-source{" "}
        <a
          className="underline"
          href="http://the-guild.dev/graphql/hive/federation-gateway-audit"
          rel="noreferrer"
          target="_blank"
          title="Open Source GraphQL federation gateways compatibility audit"
        >
          audit
        </a>
      </TableCaption>
    </Table>
  );
}

export function RPSRace() {
  const data = [...gateways];
  const max = Math.max(...data.map((d) => d.rps));
  const sorted = [...data].sort((a, b) => b.rps - a.rps);
  const [hovered, setHovered] = React.useState<(typeof data)[0] | null>(null);
  const first = sorted[0]!;

  return (
    <div className="my-4 space-y-3 font-mono">
      {sorted.map((d) => (
        <div
          key={d.name}
          onMouseEnter={() => (d.name === first.name ? null : setHovered(d))}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-green-900 dark:text-neutral-300">
              {d.name}
            </span>
            <span className="text-sm tabular-nums text-green-800 dark:text-neutral-400">
              {d.name === first.name && hovered
                ? `${(first.rps / hovered.rps).toFixed(1)}x faster | `
                : null}
              {d.rps.toFixed(0)} rps
            </span>
          </div>
          <div className="h-[5px] overflow-hidden bg-blue-200 dark:bg-zinc-800">
            <div
              className="h-full bg-sky-600/90 transition-[width] duration-1000 ease-out dark:bg-sky-600"
              style={{ width: `${(d.rps / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LatencyBands() {
  const data = [...gateways];
  data.sort((a, b) => a.p99_9 - b.p99_9);
  const max = Math.max(...data.map((d) => d.p99_9));
  return (
    <div className="my-4 space-y-5 font-mono">
      {data.map((d) => (
        <div className="" key={d.name}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span>{d.name}</span>
            <span className="tabular-nums text-green-800 dark:text-neutral-400">
              p95 {d.p95.toFixed(1)} ms | p99.9 {d.p99_9.toFixed(1)} ms
            </span>
          </div>
          <div className="border-beige-300 bg-beige-100 relative h-4 border dark:border-zinc-800 dark:bg-zinc-900">
            {/*<div className="absolute inset-y-0 left-0 right-0 m-2 border-b border-zinc-800" />*/}
            <div
              className="absolute top-1/2 h-full w-[4px] -translate-y-1/2 bg-sky-600"
              style={{ left: `${(d.p95 / max) * 100}%` }}
              title={`p95 ${d.p95}ms`}
            />
            <div
              className="absolute top-1/2 h-full w-[4px] -translate-y-1/2 bg-rose-600"
              style={{ left: `${(d.p99_9 / max) * 100}%` }}
              title={`p99.9 ${d.p99_9}ms`}
            />
          </div>
        </div>
      ))}
      <div className="text-center text-xs text-green-700 dark:text-neutral-400">
        Axis scaled to the highest p99.9 across gateways
      </div>
    </div>
  );
}

function HighlightItem(props: {
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="relative pl-16">
      <div className="font-semibold">
        <div className="bg-beige-100 absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg dark:bg-neutral-600/20">
          {props.icon}
        </div>
        {props.title}
      </div>
      <div className="text-sm text-green-800 dark:text-neutral-400">
        {props.description}
      </div>
    </div>
  );
}

export function Highlights() {
  return (
    <div className="my-8 grid grid-cols-1 gap-x-4 gap-y-6 px-4 lg:grid-cols-2">
      <HighlightItem
        description="MIT licensed, transparent, and community-driven."
        icon={<GithubIcon className="size-6" />}
        title="Open Source"
      />
      <HighlightItem
        description="Fully compatible - works seamlessly with Federation standards."
        icon={<TargetIcon className="size-6" />}
        title="Apollo Federation"
      />
      <HighlightItem
        description="Designed in Rust for speed, low memory use, and efficiency."
        icon={<RabbitIcon className="size-6" />}
        title="Fast and Efficient"
      />
      <HighlightItem
        description="Apollo-style query plans, no new concepts to learn."
        icon={<RouteIcon className="size-6" />}
        title="Familiar Query Plans"
      />
    </div>
  );
}
