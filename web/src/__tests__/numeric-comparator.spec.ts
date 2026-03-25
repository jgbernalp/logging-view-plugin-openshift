import { numericComparator } from '../sort-utils';

describe('numericComparator', () => {
  it('should return -1 when a < b with positive multiplier', () => {
    expect(numericComparator(1, 2, 1)).toBe(-1);
  });

  it('should return 1 when a > b with positive multiplier', () => {
    expect(numericComparator(2, 1, 1)).toBe(1);
  });

  it('should return 0 when a === b', () => {
    expect(numericComparator(1, 1, 1)).toBe(0);
  });

  it('should invert result with negative multiplier (descending sort)', () => {
    expect(numericComparator(1, 2, -1)).toBe(1);
    expect(numericComparator(2, 1, -1)).toBe(-1);
  });

  it('should use fallback comparison when values are equal', () => {
    expect(numericComparator(5, 5, 1, 3)).toBe(3);
    expect(numericComparator(5, 5, 1, -2)).toBe(-2);
  });

  it('should apply direction multiplier to fallback comparison', () => {
    expect(numericComparator(5, 5, -1, 3)).toBe(-3);
    expect(numericComparator(5, 5, -1, -2)).toBe(2);
  });

  it('should ignore fallback when values are not equal', () => {
    expect(numericComparator(1, 2, 1, 100)).toBe(-1);
    expect(numericComparator(2, 1, 1, 100)).toBe(1);
  });

  it('should work with timestamps', () => {
    const timestamp1 = 1679000000000;
    const timestamp2 = 1679000000001;
    expect(numericComparator(timestamp1, timestamp2, 1)).toBe(-1);
    expect(numericComparator(timestamp2, timestamp1, 1)).toBe(1);
    expect(numericComparator(timestamp1, timestamp1, 1)).toBe(0);
  });

  it('should use logIndex as tiebreaker for equal timestamps in ascending sort', () => {
    const timestamp = 1679000000000;
    const logs = [
      { timestamp, logIndex: 0 },
      { timestamp, logIndex: 1 },
      { timestamp, logIndex: 2 },
    ];

    const sortedAsc = [...logs].sort((a, b) =>
      numericComparator(a.timestamp, b.timestamp, 1, a.logIndex - b.logIndex),
    );
    expect(sortedAsc.map((l) => l.logIndex)).toEqual([0, 1, 2]);
  });

  it('should use logIndex as tiebreaker for equal timestamps in descending sort', () => {
    const timestamp = 1679000000000;
    const logs = [
      { timestamp, logIndex: 0 },
      { timestamp, logIndex: 1 },
      { timestamp, logIndex: 2 },
    ];

    const sortedDesc = [...logs].sort((a, b) =>
      numericComparator(a.timestamp, b.timestamp, -1, a.logIndex - b.logIndex),
    );
    // Direction multiplier is applied to fallback, so order is reversed
    expect(sortedDesc.map((l) => l.logIndex)).toEqual([2, 1, 0]);
  });
});
