import { isArray } from '@utils';

describe('isArray', () => {
  it('returns false for a number', () => {
    expect(isArray(100)).toEqual(false);
  });

  it('returns false for a string', () => {
    expect(isArray('string')).toEqual(false);
  });

  it('returns false for an object', () => {
    expect(isArray({})).toEqual(false);
  });

  it('returns false for a boolean', () => {
    expect(isArray(true)).toEqual(false);
  });

  it('returns false for null', () => {
    expect(isArray(null)).toEqual(false);
  });

  it('returns false for undefined', () => {
    expect(isArray(undefined)).toEqual(false);
  });

  it('returns true for an array', () => {
    expect(isArray([])).toEqual(true);
  });
});
