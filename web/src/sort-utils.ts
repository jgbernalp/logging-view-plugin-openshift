type SortableValue = string | number;

// sort with an appropriate numeric comparator for big floats
export const numericComparator = <T extends SortableValue>(
  a: T,
  b: T,
  directionMultiplier: number,
  fallbackComparison?: number,
): number => {
  const result = a < b ? -1 : a > b ? 1 : 0;
  if (result === 0 && fallbackComparison !== undefined) {
    return fallbackComparison * directionMultiplier;
  }
  return result * directionMultiplier;
};
