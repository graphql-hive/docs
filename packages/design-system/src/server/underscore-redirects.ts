import { writeFile } from "node:fs/promises";
import { join } from "node:path";

interface WebpackCompiler {
  hooks: {
    beforeCompile: {
      tapPromise: (name: string, fn: () => Promise<void>) => void;
    };
  };
}

class RunPromiseWebpackPlugin {
  constructor(public asyncHook: () => Promise<void>) {}

  apply(compiler: WebpackCompiler) {
    compiler.hooks.beforeCompile.tapPromise(
      "RunPromiseWebpackPlugin",
      this.asyncHook,
    );
  }
}

interface NextConfig {
  redirects?: (() => Promise<Redirect[]>) | Redirect[];
}

interface NextMeta {
  config: NextConfig;
  dir: string;
}

interface Redirect {
  destination: string;
  permanent: boolean;
  source: string;
}

interface WebpackConfig {
  plugins: { apply: (compiler: WebpackCompiler) => void }[];
}

let isWarningPrinted = false;

export function applyUnderscoreRedirects(
  config: WebpackConfig,
  meta: NextMeta,
) {
  config.plugins.push(
    new RunPromiseWebpackPlugin(async () => {
      const outDir = meta.dir;
      const outFile = join(outDir, "./public/_redirects");

      try {
        const redirects: Redirect[] = meta.config.redirects
          ? Array.isArray(meta.config.redirects)
            ? meta.config.redirects
            : await meta.config.redirects()
          : [];

        if (redirects.length === 0) {
          if (!isWarningPrinted) {
            // eslint-disable-next-line no-console -- for debug
            console.warn(
              '[@theguild/components] No redirects defined, no "_redirect" file is created!',
            );
            isWarningPrinted = true;
          }
          return;
        }
        const redirectsTxt = redirects
          .map((r) => `${r.source} ${r.destination} ${r.permanent ? 301 : 302}`)
          .join("\n");
        await writeFile(outFile, redirectsTxt);
      } catch (error) {
        throw new Error(
          `Failed to generate "_redirects" file during build: ${(error as Error).message}`,
        );
      }
    }),
  );
}
