export function headingSlug(text: string): string {
  return text.replaceAll(/[\s.,]+/g, "-").toLowerCase();
}
