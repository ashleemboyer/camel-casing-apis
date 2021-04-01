import { capitalizeString } from '@utils';

describe('captializeString', () => {
  it('capitalizes the first letter of a string', () => {
    expect(capitalizeString('hello world')).toBe('Hello world');
  });

  it('does not change a string that is already capitalized', () => {
    expect(capitalizeString('Hello world')).toBe('Hello world');
  });
});
