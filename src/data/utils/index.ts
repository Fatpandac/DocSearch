type ItemType = "page" | "section";
export type GitBookAiSearchItem = {
  type: ItemType;
  id: string;
  title: string;
  href: string;
  pageId: string;
  spaceId: string;
  breadcrumbs?: { label: string }[];
  body?: string;
};

export function parseNextFlightText(text: string) {
  const result: Array<GitBookAiSearchItem> = [];

  const matchs = text.match(/1:(?<rawValue>((.*)\s*)*)$/m);
  if (!matchs) return result;

  const { rawValue } = matchs.groups as { rawValue: string };
  const clean = rawValue.trim().replace(/\n/g, "").replace(/\r/g, "");

  result.push(...JSON.parse(clean));

  return result;
}
