import { Schema } from './schema'
import { IS_INTERNAL_SCHEMA_MAP } from "./symbols";
import { MakeOptional, IsNever, IsTrue, MergeArray, ExcludeFromArray } from './util';

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
   * The base type should not be modified once the value type is created.
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

  export type isAllowOnly<TValue extends AnyValue, TrueType = true, FalseType = false> = (
    IsNever<TValue['base'], IsNever<TValue['augment'], TrueType, FalseType>, FalseType>
  )

  /** Transform a schema map into object literal type. */
  export type transformSchemaMap<T extends Schema.InternalSchemaMap> = MakeOptional<{
    [Key in Exclude<keyof T, typeof IS_INTERNAL_SCHEMA_MAP>]: (
      T[Key] extends Schema<infer TValue>
      ? Value.literal<TValue>
      : never
    )
  }>

  /** Get the literal type of a `Value`. */
  export type literal<TValue extends AnyValue> = (
    Exclude<(
      // the extra allowed types
      TValue['allowed']
      | IsTrue<TValue['isRequired'], never, TValue['default']>
      | IsNever<TValue['augment'], TValue['base'],
          TValue['augment'] extends Schema.InternalSchemaMap
          ? transformSchemaMap<TValue['augment']>
          : TValue['augment']
        >
    ), TValue['disallowed']>
  )

  export type replace<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ isAllowOnly<TValue, never, U>,
    /* allowed */ TValue['allowed'],
    /* disallowed */ TValue['disallowed'],
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  /** Set the extra allowed type of a `Value`. */
  export type allow<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'] | U,
    /* disallowed */ Exclude<TValue['disallowed'], U>,
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  /**
   * Set the only allowed type of a `Value`.
   * `allowOnly` removes the base type and the augment type
   */
  export type allowOnly<TValue extends AnyValue, U = never> = Value<
    /* base */ never,
    /* augment */ never,
    /* allowed */ TValue['allowed'] | U,
    /* disallowed */ Exclude<TValue['disallowed'], U>,
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  /** Set the disallowed type of a `Value`. */
  export type disallow<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ Exclude<TValue['allowed'], U>,
    /* disallowed */ TValue['disallowed'] | U,
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  /** Set the default type of a `Value`. */
  export type setDefault<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'],
    /* disallowed */ TValue['disallowed'],
    /* default */ U,
    /* isRequired */ TValue['isRequired']
  >

  /** Make a `Value` required. */
  export type required<TValue extends AnyValue> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'],
    /* disallowed */ TValue['disallowed'],
    /* default */ TValue['default'],
    /* isRequired */ true
  >

  /** Make a `Value` optional (not required). */
  export type optional<TValue extends AnyValue> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'],
    /* disallowed */ TValue['disallowed'],
    /* default */ TValue['default'],
    /* isRequired */ false
  >

  /** Merge two a value types by adding the rules of one type to another. */
  export type concat<T extends AnyValue, U extends AnyValue> = unknown

  export type mergeArray<TValue extends AnyValue, T = never> = replace<TValue, MergeArray<TValue['augment'], T>>

  export type excludeFromArray<TValue extends AnyValue, T = never> = replace<TValue, ExcludeFromArray<TValue['augment'], T>>

  /** Deeply merge two values with `InternalSchemaMap` types. */
  export type deepMergeSchemaMap<T extends AnyValue, U extends AnyValue> = (
    IsNever<T['augment'], 0, T['augment']> extends Schema.InternalSchemaMap
      ? IsNever<U['augment'], 0, U['augment']> extends Schema.InternalSchemaMap
        ? (
          replace<T,
            Schema.deepMergeSchemaMap<
              Extract<T['augment'], Schema.InternalSchemaMap>,
              Extract<U['augment'], Schema.InternalSchemaMap>
            >
          >
        )
        : U
      : U
  )

  export type appendSchemaMap<TValue extends AnyValue, U> = (
    replace<TValue, IsNever<TValue['augment'], Schema.InternalSchemaMap & U, TValue['augment'] & Schema.InternalSchemaMap & U>>
  )
}
