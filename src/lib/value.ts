import { Schema } from './schema'
import { IS_INTERNAL_SCHEMA_MAP } from "./symbols";

type IsAny<T, TrueType = never, FalseType = never> = 1 extends (T extends never ? 1 : 0) ? TrueType : FalseType
type IsInvariant<T, U, TrueType = true, FalseType = false> = [T] extends [U] ? ([U] extends [T] ? TrueType : FalseType) : FalseType
type IsInvariantWithoutAny<T, U, TrueType = true, FalseType = false> = IsAny<T, FalseType, IsAny<U, FalseType, IsInvariant<T, U, TrueType, FalseType>>>

/**
 * @example
 * type A = IsTrue<any>; // false
 * type B = IsTrue<never>; // false
 * type C = IsTrue<unknown>; // error
 * type D = IsTrue<boolean>; // false
 * type E = IsTrue<false>; // false
 * type F = IsTrue<true>; // true
 */
type IsTrue<T extends boolean, TrueType = true, FalseType = false> = IsInvariantWithoutAny<T, true, TrueType, FalseType>
type IsNever<T, TrueType = true, FalseType = false> = IsInvariant<T, never, TrueType, FalseType>

// type FilterKeys<T extends object, U> = { [key in keyof T]: U extends IsAny<T[key], never, T[key]> ? key : never }[keyof T]
// type FilterValues<T extends object, U> = IsInvariant<T, never, never, { [key in FilterKeys<T, U>]: T[key] }>

// type OmitKeys<T extends object, U> = { [key in keyof T]: U extends IsAny<T[key], never, T[key]> ? never : key }[keyof T]
// type OmitValues<T extends object, U> = IsInvariant<T, never, never, { [key in OmitKeys<T, U>]: T[key] }>

// type OmitAny<T> = IsAny<T, never, T>
// type MakeOptional<T extends object> = OmitAny<OmitValues<T, undefined> & { [Key in keyof FilterValues<T, undefined>]?: FilterValues<T, undefined>[Key] }>

type FilterUndefinedKeys<T extends object> = { [Key in keyof T]: undefined extends T[Key] ? Key : never }[keyof T]
type OmitUndefinedKeys<T extends object> = { [Key in keyof T]: undefined extends T[Key] ? never : Key }[keyof T]

type MakeOptional<T extends object> = Exclude<({ [Key in OmitUndefinedKeys<T>]: T[Key] } & { [Key in FilterUndefinedKeys<T>]?: T[Key] }) | undefined, undefined>

/**
 * A structure stores all information needed to match Joi's validation logic.
 * `Value` will NEVER exist in runtime. `Value` is used only for type inference.
 * @see Value.getType - How `Value` is assembled into literal type.
 */
export interface Value<
  TBase = never,
  TAugment = never,
  TAllowed = never,
  TDisallowed = never,
  TDefault = undefined,
  TIsRequired extends boolean = false
> {
  /**
   * The base (initial) type of a schema.
   *
   * @description
   * The initial type of a schema is the type when a new schema is created. For example:
   *
   * | Schema         | The initial type   |
   * |:---------------|:-------------------|
   * | `Joi.any()`    | `any`              |
   * | `Joi.array()`  | `any[]`            |
   * | `Joi.object()` | `Record<any, any>` |
   */
  base: TBase,

  /**
   * The augmented type of a schema.
   *
   * @description
   * The augmented type of a schema is the type when specifying subtypes for an existing schema. For example:
   *
   * | Schema                                   | The augmented type |
   * |:-----------------------------------------|:-------------------|
   * | `Joi.any().equal("0", 1)`                | `"0" | 1`          |
   * | `Joi.array().items(Joi.string())`        | `string[]`         |
   * | `Joi.object().keys({ a: Joi.number() })` | `{ a?: number }`   |
   *
   * Additionally, a schema map of a object schema is stored in the augment type to simplify the process of merging two object schemas.
   */
  augment: TAugment,

  /**
   * The extra allowed types of a schema.
   *
   * @description
   * The allowed type is added by `Schema.allow()`, `Schema.valid()`, `Schema.only`, `Schema.equal()`.
   * This type will be the part of the final literal type.
   */
  allowed: TAllowed,

  /**
   * The extra disallowed types of a schema.
   *
   * @description
   * The disallowed type is added by `Schema.invalid()`, `Schema.disallow()`, `Schema.not()`.
   * This type will be removed from the final literal type.
   */
  disallowed: TDisallowed,

  /**
   * The default type of a schema.
   *
   * @description
   * The default type is specified by `Schema.default()`.
   * This type will be the part of the final literal type if `isRequired` is false.
   */
  default: TDefault,

  /**
   * Indicates if the schema is required.
   *
   * @description
   * The default type will be the part of the final literal type if the schema is required.
   *
   * Note: if `TIsRequired` is both `true` and `false` (aka `boolean`), the schema is considered as *NOT* required.
   * This behavior is to prevent some weird edge cases.
   */
  isRequired: TIsRequired
}

export namespace Value {
  /** Just a placeholder */
  type UNUSED = any

  export type AnyValue = Value<
    /* base */ unknown,
    /* augment */ unknown,
    /* allowed */ unknown,
    /* disallowed */ unknown,
    /* default */ unknown,
    /* isRequired */ boolean
  >

  export type EmptyValue = Value<
    /* base */ never,
    /* augment */ never,
    /* allowed */ never,
    /* disallowed */ never,
    /* default */ never,
    /* isRequired */ true
  >

  /** Transform a schema map into object literal type. */
  export type transformSchemaMap<T extends Schema.InternalSchemaMap> = MakeOptional<{
    [Key in Exclude<keyof T, typeof IS_INTERNAL_SCHEMA_MAP>]: (
      T[Key] extends Schema<infer TValue>
      ? Value.getType<TValue>
      : never
    )
  }>

  /** Get the literal type of a `Value`. */
  export type getType<TValue extends AnyValue> = (
    TValue extends Value<infer TBase, infer TAugment, infer TAllowed, infer TDisallowed, infer TDefault, infer TIsRequired>
    ? Exclude<(
        IsNever<TAugment, TBase, transformSchemaMap<TAugment>>
        | TAllowed
        | IsTrue<TIsRequired, never, TDefault>
      ), TDisallowed>
    : never
  )

  /** Set the extra allowed type of a `Value`. */
  export type allow<TValue extends AnyValue, TAllowed = never> = (
    TValue extends Value<infer TBase, infer TAugment, infer TOringinalAllowed, infer TDisallowed, infer TDefault, infer TIsRequired>
    ? (
      Value<
        /* base */ TBase,
        /* augment */ TAugment,
        /* allowed */ TOringinalAllowed | TAllowed,
        /* disallowed */ Exclude<TDisallowed, TAllowed>,
        /* default */ TDefault,
        /* isRequired */ TIsRequired
      >
    )
    : never
  )

  /** Set the only allowed type of a `Value`. */
  export type allowOnly<TValue extends AnyValue, TAllowed = never> = (
    TValue extends Value<UNUSED, infer TAugment, infer TOringinalAllowed, infer TDisallowed, infer TDefault, infer TIsRequired>
    ? (
      Value<
        /* base */ never,
        /* augment */ TAugment,
        /* allowed */ TOringinalAllowed | TAllowed,
        /* disallowed */ Exclude<TDisallowed, TAllowed>,
        /* default */ TDefault,
        /* isRequired */ TIsRequired
      >
    )
    : never
  )

  /** Set the disallowed type of a `Value`. */
  export type disallow<TValue extends AnyValue, TDisallowed = never> = unknown

  /** Merge two a value types by adding the rules of one type to another. */
  export type concat<T extends AnyValue, U extends AnyValue> = unknown

  /** Set the default type of a `Value`. */
  export type setDefault<TValue extends AnyValue, TDefault = never> = unknown

  /** Make a `Value` required. */
  export type required<TValue extends AnyValue> = (
    TValue extends Value<infer TBase, infer TAugment, infer TAllowed, infer TDisallowed, infer TDefault, UNUSED>
    ? (
      Value<
        /* base */ TBase,
        /* augment */ TAugment,
        /* allowed */ TAllowed,
        /* disallowed */ TDisallowed,
        /* default */ TDefault,
        /* isRequired */ true
      >
    )
    : never
  )

  /** Make a `Value` optional (not required). */
  export type optional<TValue extends AnyValue> = (
    TValue extends Value<infer TBase, infer TAugment, infer TAllowed, infer TDisallowed, infer TDefault, UNUSED>
    ? (
      Value<
        /* base */ TBase,
        /* augment */ TAugment,
        /* allowed */ TAllowed,
        /* disallowed */ TDisallowed,
        /* default */ TDefault,
        /* isRequired */ false
      >
    )
    : never
  )

  /** Deeply merge two values with `InternalSchemaMap` types. */
  export type deepMerge<T extends AnyValue, U extends AnyValue> = (
    T extends Value<infer TBase, infer TOriginalAugment, infer TAllowed, infer TDisallowed, infer TDefault, infer TIsRequired>
    ? U extends Value<UNUSED, infer TAugment, UNUSED, UNUSED, UNUSED, UNUSED>
      ? IsNever<TOriginalAugment, 0, TOriginalAugment> extends Schema.InternalSchemaMap
        ? IsNever<TAugment, 0, TAugment> extends Schema.InternalSchemaMap
          ? (
            Value<
              /* base */ TBase,
              /* augment */ Schema.deepMergeSchemaMap<
                Extract<TOriginalAugment, Schema.InternalSchemaMap>,
                Extract<TAugment, Schema.InternalSchemaMap>
              >,
              /* allowed */ TAllowed,
              /* disallowed */ TDisallowed,
              /* default */ TDefault,
              /* isRequired */ TIsRequired
            >
          )
          : U
        : U
      : T
    : never
  )
}

// type ObjectValue<T> = Value<Record<any, any>, Schema.InternalSchemaMap & T, never, never, never, true>
// type ObjectSchema<T> = Schema<Value<Record<any, any>, Schema.InternalSchemaMap & T, never, never, never, true>>
// type NumberSchema = Schema<Value<number, never, never, never, never, true>>
// type StringSchema = Schema<Value<string, never, never, never, never, true>>
// type BooleanSchema = Schema<Value<boolean, never, never, never, never, true>>

// interface Test {
//   a: {
//     b: {
//       c: string,
//       ccc: boolean
//     },
//     bbb: string
//   },
//   aaa: string
// }

// type A = ObjectValue<{
//   a: ObjectSchema<{
//     b: ObjectSchema<{
//       c: NumberSchema,
//       cc: NumberSchema
//     }>,
//     bb: NumberSchema
//   }>,
//   aa: NumberSchema
// }>

// type B = ObjectValue<{
//   a: ObjectSchema<{
//     b: ObjectSchema<{
//       c: StringSchema,
//       ccc: BooleanSchema
//     }>,
//     bbb: StringSchema
//   }>,
//   aaa: StringSchema
// }>

// type C = Value.deepMerge<Value<Record<any, any>>, B>
// // type C = Value.deepAssign<Value<number>, Value<string>>
// type Cv = Value.getType<C>
