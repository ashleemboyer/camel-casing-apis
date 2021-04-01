import { normalizeKeyCasing } from '@utils';

const snakeCaseObject = {
  snake_case: 'foo',
};
const normalizedSnakeCaseObject = { snakeCase: 'foo' };
const nestedSnakeCaseObject = { snake_case: snakeCaseObject };
const normalizedNestedSnakeCaseObject = {
  snakeCase: normalizedSnakeCaseObject,
};

describe('normalizeKeyCasing', () => {
  describe('with objects', () => {
    it('normalizes a flat object', () => {
      expect(normalizeKeyCasing(snakeCaseObject)).toEqual(
        normalizedSnakeCaseObject,
      );
    });

    it('normalizes an object with nested objects', () => {
      expect(normalizeKeyCasing(nestedSnakeCaseObject)).toEqual(
        normalizedNestedSnakeCaseObject,
      );
    });

    it('normalizes an object with a nested array', () => {
      expect(
        normalizeKeyCasing({
          data: [snakeCaseObject, snakeCaseObject, snakeCaseObject],
        }),
      ).toEqual({
        data: [
          normalizedSnakeCaseObject,
          normalizedSnakeCaseObject,
          normalizedSnakeCaseObject,
        ],
      });
    });

    it('normalizes an object with several layers of nesting', () => {
      expect(
        normalizeKeyCasing({
          snake_case: {
            snake_case: { snake_case: { snake_case: { snake_case: 'foo' } } },
          },
        }),
      ).toEqual({
        snakeCase: {
          snakeCase: { snakeCase: { snakeCase: { snakeCase: 'foo' } } },
        },
      });
    });
  });

  describe('with arrays', () => {
    it('normalizes an array of flat objects', () => {
      expect(
        normalizeKeyCasing([snakeCaseObject, snakeCaseObject, snakeCaseObject]),
      ).toEqual([
        normalizedSnakeCaseObject,
        normalizedSnakeCaseObject,
        normalizedSnakeCaseObject,
      ]);
    });

    it('normalizes an array of nested objects', () => {
      expect(
        normalizeKeyCasing([
          nestedSnakeCaseObject,
          nestedSnakeCaseObject,
          nestedSnakeCaseObject,
        ]),
      ).toEqual([
        normalizedNestedSnakeCaseObject,
        normalizedNestedSnakeCaseObject,
        normalizedNestedSnakeCaseObject,
      ]);
    });
  });
});
