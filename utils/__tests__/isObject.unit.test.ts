import { isObject } from '@utils';

describe('isObject', () => {
  it('returns false for a number', () => {
    expect(isObject(100)).toEqual(false);
  });

  it('returns false for a string', () => {
    expect(isObject('string')).toEqual(false);
  });

  it('returns false for an object', () => {
    expect(isObject({})).toEqual(true);
  });

  it('returns false for a boolean', () => {
    expect(isObject(true)).toEqual(false);
  });

  it('returns false for null', () => {
    expect(isObject(null)).toEqual(false);
  });

  it('returns false for undefined', () => {
    expect(isObject(undefined)).toEqual(false);
  });

  it('returns false for an array', () => {
    expect(isObject([])).toEqual(false);
  });

  it('returns true for a function', () => {
    expect(isObject(jest.fn())).toEqual(false);
  });
});
