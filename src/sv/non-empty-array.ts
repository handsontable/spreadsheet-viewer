/* eslint-disable no-use-before-define, @typescript-eslint/no-use-before-define */

// A NonEmptyArray is an Array that *must* have at least a single element.

const $symbol: unique symbol = Symbol('non empty array');

type FindLast<T> = (predicate: (input: T) => boolean) => T | undefined;
type Append<T> = (element: T) => NonEmptyArray<T>;

export type NonEmptyArray<T> = {
  $symbol: typeof $symbol
  last: () => T
  findLast: FindLast<T>
  append: Append<T>
};

const _from = <T>(head: T, tail: T[]): NonEmptyArray<T> => ({
  $symbol,
  last: _last(head, tail),
  findLast: _findLast(head, tail),
  append: _append(head, tail)
});

const _last = <T>(head: T, tail: T[]) => (): T => (tail.length > 0 ? tail[tail.length - 1] : head);

const _findLast = <T>(head: T, tail: T[]): FindLast<T> => predicate => [head, ...tail].reverse().find(predicate);

/**
 * Initializes a `NonEmptyArray` with a single element
 */
export const init = <T>(head: T): NonEmptyArray<T> => _from(head, []);

const _append = <T>(head: T, tail: T[]): Append<T> => element => _from(head, [...tail, element]);
