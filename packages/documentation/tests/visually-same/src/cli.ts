#!/usr/bin/env bun
import { render } from "ink";
import meow from "meow";
import React from "react";

import App from "./app.js";
import { compareAll } from "./compare.js";
import { config } from "./config.js";

const cli = meow(
  dedent(`
    Usage
      $ visually-same <command>

    Commands
      compare              Take screenshots and compare against baseline
      update-baseline     Take screenshots and save as new baseline
      screenshot-production Take screenshots from production site
      report               Run comparison and output JSON report to stdout

    Examples
      $ visually-same compare
      $ visually-same update-baseline
      $ visually-same screenshot-production
      $ visually-same report > report.json
  `),
  {
    flags: {},
    importMeta: import.meta,
  },
);

const validCommands = [
  "compare",
  "report",
  "screenshot-production",
  "update-baseline",
] as const;
type Command = (typeof validCommands)[number];

const command = cli.input[0] as Command;

if (!command || !validCommands.includes(command)) {
  process.stderr.write("Invalid command.");
  process.stderr.write(cli.help);
  process.exit(1);
}

if (command === "report") {
  // Headless JSON report — no ink UI
  const results: {
    diffPercentage?: number;
    match: boolean;
    name: string;
    path: string;
    reason?: string;
  }[] = [];

  await compareAll((_current, _total, page, result) => {
    const pageConfig = config.pages.find((p) => p.name === page);
    results.push({
      diffPercentage: result.diffPercentage,
      match: result.match,
      name: page,
      path: pageConfig?.path ?? "",
      reason: result.reason,
    });
    process.stderr.write(
      `[${_current}/${_total}] ${page}: ${result.match ? "PASS" : `FAIL (${result.diffPercentage?.toFixed(2)}%)`}\n`,
    );
  });

  const passed = results.filter((r) => r.match).length;
  const failed = results.filter((r) => !r.match).length;

  const report = {
    failed,
    pages: results,
    passed,
    total: results.length,
  };

  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  process.exit(failed > 0 ? 1 : 0);
} else {
  render(React.createElement(App, { command }));
}

function dedent(str: string): string {
  return str.replace(/^\s+/, "");
}
