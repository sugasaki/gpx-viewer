// src/utils/to.ts
export function to<T>(promise: Promise<T>): Promise<[Error, null] | [null, T]> {
  return promise.then<[null, T]>((data) => [null, data]).catch<[Error, null]>((err) => [err, null]);
}
