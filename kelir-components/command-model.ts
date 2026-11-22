import type { CommandGroup, CommandProps } from "../kelir-kit/kit-navigation-chrome";

// Command filtering (internal): case-insensitive label match per group,
// dropping groups left empty. Rendering lives in command.tsx.
export function filterCommandGroups(
  groups: CommandProps["groups"],
  query: string,
): CommandGroup[] {
  const normalized = query.trim().toLowerCase();
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(normalized),
      ),
    }))
    .filter((group) => group.items.length > 0);
}