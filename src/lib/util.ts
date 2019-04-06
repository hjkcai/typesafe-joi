export type AnyType = string | number | boolean | symbol | object | null | undefined
export type ConstructorOf<T> = new (...args: any[]) => T
export type ExcludeUndefined<T> = Exclude<T, undefined>
export type ArrayItemType<T> = T extends (infer U)[] ? U : never

/** Find keys that its value extends `U` of an object */
export type FilterKeys<T extends object, U> = { [key in keyof T]: T[key] extends U ? key : never }[keyof T]

/** Keep keys that its value extends `U` */
export type FilterValues<T extends object, U> = { [key in FilterKeys<T, U>]: T[key] }

// Reversed version of `FilterKeys` and `Filter`
export type OmitKeys<T extends object, U> = { [key in keyof T]: T[key] extends U ? never : key }[keyof T]
export type OmitValues<T extends object, U> = { [key in OmitKeys<T, U>]: T[key] }

/**
 * Union the array types of `T` and `U`, leaving other types of `T` unmodified
 * @example MergeArray<A[] | B, C> = (A | C)[] | B
 */
export type MergeArray<T, U> = (
  T extends (infer TValue)[]
    ? (TValue | U)[]
    : T
)

/**
 * Exclude `U` from the array types of `T`, leaving other types of `T` unmodified
 * @example ExcludeFromArray<(A | C)[] | B, C> = A[] | B
 */
export type ExcludeFromArray<T, U> = (
  T extends any[]
    ? Exclude<T, U>[]
    : T
)

/**
 * Merge the object types of `T` and `U`, leaving other types of `T` unmodified
 * @example MergeObject<{ a: A } | B, { c: C }> = { a: A, c: C } | B
 */
export type MergeObject<T, U extends object> = (Extract<T, object> & U) | Exclude<T, object>
