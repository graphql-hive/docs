import { z, ZodTypeAny } from "zod";

export type MdxFile<FrontMatterType> = {
  frontMatter: FrontMatterType;
  name: string;
  route: string;
};

export const MdxFile = <T extends ZodTypeAny>(frontMatterSchema: T) => {
  return z.object({
    frontMatter: frontMatterSchema,
    name: z.string(),
    route: z.string(),
  });
};
