import { ReactNode } from "react";

export function questionToId(question: ReactNode | string) {
  return typeof question === "string"
    ? `faq--${question.slice(0, -1).replaceAll(" ", "-").toLowerCase()}`
    : undefined;
}
