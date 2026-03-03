import { createServerFn } from "@tanstack/react-start";

import { getSerializedPageTree } from "./source";

export const serverGetPageTree = createServerFn({ method: "GET" }).handler(() =>
  getSerializedPageTree(),
);
