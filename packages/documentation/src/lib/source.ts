import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docs } from 'fumadocs-mdx:collections/server';

export const source = loader({
  baseUrl: '/docs',
  plugins: [lucideIconsPlugin()],
  source: docs.toFumadocsSource(),
});
