import { spawn, type ChildProcess } from "node:child_process";

const HOST = "127.0.0.1";
const BASE_PATH = "/graphql/hive-testing";
const DEFAULT_TIMEOUT_MS = 60_000;

async function isReady(url: string) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1_000) });
    return response.ok || response.status < 500;
  } catch {
    return false;
  }
}

export async function waitForServer(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isReady(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Server did not start: ${url}`);
}

export async function ensureDevServer(options: { cwd: string; port: number }) {
  const baseUrl = `http://${HOST}:${options.port}`;
  const readyUrl = `${baseUrl}${BASE_PATH}/docs`;

  if (await isReady(readyUrl)) {
    return { baseUrl, child: null as ChildProcess | null };
  }

  const child = spawn(
    "bun",
    ["run", "dev", "--", "--port", String(options.port)],
    {
      cwd: options.cwd,
      env: {
        ...process.env,
        CI: "1",
        FORCE_COLOR: "0",
        HIVE_ENABLE_TANSTACK_DEV_STYLES_BASE_PATH: "1",
        NO_COLOR: "1",
      },
      stdio: "ignore",
    },
  );

  await waitForServer(readyUrl);
  return { baseUrl, child };
}
