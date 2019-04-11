export type AnyType = string | number | boolean | symbol | object | null | undefined
export type ConstructorOf<T> = new (...args: any[]) => T
export type ExcludeUndefined<T> = Exclude<T, undefined>
export type ArrayItemType<T> = T extends (infer U)[] ? U : never

/**
 * Union the array types of `T` and `U`, leaving other types of `T` unmodified.
 * @example
 * type A = MergeArray<A[] | B, C> // (A | C)[] | B
 */
export type MergeArray<T, U> = (
  T extends (infer TValue)[]
  ? (TValue | U)[]
  : T
)

/**
 * Exclude `U` from the array types of `T`, leaving other types of `T` unmodified.
 * @example
 * type A = ExcludeFromArray<(A | C)[] | B, C> // A[] | B
 */
export type ExcludeFromArray<T, U> = (
  T extends any[]
  ? Exclude<T, U>[]
  : T
)

export type IsAny<T, TrueType = never, FalseType = never> = 1 extends (T extends never ? 1 : 0) ? TrueType : FalseType
export type IsInvariant<T, U, TrueType = true, FalseType = false> = [T] extends [U] ? ([U] extends [T] ? TrueType : FalseType) : FalseType
export type IsInvariantWithoutAny<T, U, TrueType = true, FalseType = false> = IsAny<T, FalseType, IsAny<U, FalseType, IsInvariant<T, U, TrueType, FalseType>>>
export type IsNever<T, TrueType = true, FalseType = false> = IsInvariant<T, never, TrueType, FalseType>

/**
 * Check if a type is `true`.
 * @example
 * type A = IsTrue<any>; // false
 * type B = IsTrue<never>; // false
 * type C = IsTrue<unknown>; // error
 * type D = IsTrue<boolean>; // false
 * type E = IsTrue<false>; // false
 * type F = IsTrue<true>; // true
 */
export type IsTrue<T extends boolean, TrueType = true, FalseType = false> = IsInvariantWithoutAny<T, true, TrueType, FalseType>

export type FilterUndefinedKeys<T extends object> = { [Key in keyof T]: undefined extends T[Key] ? Key : never }[keyof T]
export type OmitUndefinedKeys<T extends object> = { [Key in keyof T]: undefined extends T[Key] ? never : Key }[keyof T]
export type MakeOptional<T extends object> = Exclude<({ [Key in OmitUndefinedKeys<T>]: T[Key] } & { [Key in FilterUndefinedKeys<T>]?: T[Key] }) | undefined, undefined>
