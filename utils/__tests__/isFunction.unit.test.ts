import { isFunction } from '@utils';

describe('isFunction', () => {
  it('returns false for a number', () => {
    expect(isFunction(100)).toEqual(false);
  });

  it('returns false for a string', () => {
    expect(isFunction('string')).toEqual(false);
  });

  it('returns false for an object', () => {
    expect(isFunction({})).toEqual(false);
  });

  it('returns false for a boolean', () => {
    expect(isFunction(true)).toEqual(false);
  });

  it('returns false for null', () => {
    expect(isFunction(null)).toEqual(false);
  });

  it('returns false for undefined', () => {
    expect(isFunction(undefined)).toEqual(false);
  });

  it('returns false for an array', () => {
    expect(isFunction([])).toEqual(false);
  });

  it('returns true for a function', () => {
    expect(isFunction(jest.fn())).toEqual(true);
  });
});
