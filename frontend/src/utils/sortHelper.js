/**
 * Sorts an array of items (projects, blogs) by priority slot sequence.
 * - Items with priority > 0 (Slot #1, Slot #2, Slot #3...) appear first in ascending order.
 * - Items without slots (priority 0, null, or undefined) are placed at the end.
 * - Items with equal slot or unslotted items are ordered newest first.
 */
export const sortItemsBySlot = (items) => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const hasSlotA = typeof a.priority === 'number' && a.priority > 0;
    const hasSlotB = typeof b.priority === 'number' && b.priority > 0;

    if (hasSlotA && hasSlotB) {
      if (a.priority !== b.priority) {
        return a.priority - b.priority; // Slot 1, Slot 2, Slot 3...
      }
    } else if (hasSlotA && !hasSlotB) {
      return -1; // A has slot, B does not -> A comes first
    } else if (!hasSlotA && hasSlotB) {
      return 1; // B has slot, A does not -> B comes first, A goes to the end
    }

    // Unslotted or identical slot: newest first
    const dateA = new Date(a.createdAt || a.published_at || 0).getTime();
    const dateB = new Date(b.createdAt || b.published_at || 0).getTime();
    if (dateB !== dateA) return dateB - dateA;
    return (b.id || 0) - (a.id || 0);
  });
};
