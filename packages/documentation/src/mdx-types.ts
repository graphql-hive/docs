import { z, ZodTypeAny } from 'zod';

export type MdxFile<FrontMatterType> = {
  name: string;
  route: string;
  frontMatter: FrontMatterType;
};

export const MdxFile = <T extends ZodTypeAny>(frontMatterSchema: T) => {
  return z.object({
    name: z.string(),
    route: z.string(),
    frontMatter: frontMatterSchema,
  });
};
