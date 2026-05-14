/** Ordine di visualizzazione nel menu cliente. */
export const MENU_CATEGORY_ORDER = [
  "Antipasti",
  "Primi piatti",
  "Secondi",
  "Contorni",
  "Bevande",
  "Dessert",
] as const;

export type MenuCategoryPreset = (typeof MENU_CATEGORY_ORDER)[number];

export function sortCategoryEntries<T extends { category: string }>(
  entries: [string, T[]][],
): [string, T[]][] {
  const map = new Map(entries);
  const result: [string, T[]][] = [];
  for (const cat of MENU_CATEGORY_ORDER) {
    const items = map.get(cat);
    if (items?.length) result.push([cat, items]);
    map.delete(cat);
  }
  const rest = Array.from(map.entries()).sort((a, b) =>
    a[0].localeCompare(b[0], "it"),
  );
  return [...result, ...rest];
}
