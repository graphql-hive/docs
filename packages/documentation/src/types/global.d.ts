/** Defined via `define` in vite.config.ts */
declare const BASE_PATH: string;

declare global {
  var $crisp:
    | {
        push: (args: unknown[]) => void;
      }
    | undefined;
}

declare module "crossws/adapters/cloudflare" {
  type WebSocketHandler = {
    handleUpgrade(
      request: Request,
      env: Record<string, unknown>,
      context: { waitUntil(promise: Promise<unknown>): void },
    ): Promise<Response> | Response;
  };

  export default function wsAdapter(options: {
    resolve: unknown;
  }): WebSocketHandler;
}

declare module "#nitro/virtual/public-assets" {
  export function isPublicAssetURL(pathname: string): boolean;
}

declare module "#nitro/virtual/tasks" {
  export const scheduledTasks:
    | {
        cron: string;
        tasks: string[];
      }[]
    | undefined;
}
