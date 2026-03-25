import { observedTimestampDifference } from '../sort-utils';

describe('observedTimestampDifference', () => {
  it('should return the numeric difference for small bigints', () => {
    expect(observedTimestampDifference(10n, 3n)).toBe(7);
    expect(observedTimestampDifference(3n, 10n)).toBe(-7);
  });

  it('should return 0 when both values are equal', () => {
    expect(observedTimestampDifference(42n, 42n)).toBe(0);
  });

  it('should clamp to MIN_SAFE_INTEGER when difference is too negative', () => {
    const a = 0n;
    const b = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
    expect(observedTimestampDifference(a, b)).toBe(Number.MIN_SAFE_INTEGER);
  });

  it('should clamp to MAX_SAFE_INTEGER when difference is too positive', () => {
    const a = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
    const b = 0n;
    expect(observedTimestampDifference(a, b)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('should not clamp when difference is exactly MAX_SAFE_INTEGER', () => {
    const maxSafe = BigInt(Number.MAX_SAFE_INTEGER);
    expect(observedTimestampDifference(maxSafe, 0n)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('should not clamp when difference is exactly MIN_SAFE_INTEGER', () => {
    const minSafe = BigInt(Number.MIN_SAFE_INTEGER);
    expect(observedTimestampDifference(minSafe, 0n)).toBe(Number.MIN_SAFE_INTEGER);
  });

  it('should clamp when difference is one past MAX_SAFE_INTEGER', () => {
    const pastMax = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
    expect(observedTimestampDifference(pastMax, 0n)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('should clamp when difference is one past MIN_SAFE_INTEGER', () => {
    const pastMin = BigInt(Number.MIN_SAFE_INTEGER) - 1n;
    expect(observedTimestampDifference(pastMin, 0n)).toBe(Number.MIN_SAFE_INTEGER);
  });

  it('should handle realistic nanosecond timestamp differences', () => {
    const ts1 = 1679000000000000000n;
    const ts2 = 1679000000000000001n;
    expect(observedTimestampDifference(ts2, ts1)).toBe(1);
    expect(observedTimestampDifference(ts1, ts2)).toBe(-1);
  });

  it('should clamp when nanosecond timestamps are far apart', () => {
    const ts1 = 1679000000000000000n;
    const ts2 = 1579000000000000000n;
    expect(observedTimestampDifference(ts1, ts2)).toBe(Number.MAX_SAFE_INTEGER);
    expect(observedTimestampDifference(ts2, ts1)).toBe(Number.MIN_SAFE_INTEGER);
  });
});
