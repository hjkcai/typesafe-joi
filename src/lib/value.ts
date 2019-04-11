import { Schema } from './schema'
import { IS_INTERNAL_SCHEMA_MAP } from "./symbols";
import { MakeOptional, IsNever, IsTrue } from './util';

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

  export type replaceBase<TValue extends AnyValue, U = never> = Value<
    /* base */ U,
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'],
    /* disallowed */ TValue['disallowed'],
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  export type unionWithBase<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'] | U,
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'],
    /* disallowed */ TValue['disallowed'],
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  export type intersectionWithBase<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'] & U,
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'],
    /* disallowed */ TValue['disallowed'],
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  export type replaceAugment<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ U,
    /* allowed */ TValue['allowed'],
    /* disallowed */ TValue['disallowed'],
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  export type unionWithAugment<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'] | U,
    /* allowed */ TValue['allowed'],
    /* disallowed */ TValue['disallowed'],
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  export type intersectionWithAugment<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ IsNever<TValue['augment'], U, TValue['augment'] & U>,
    /* allowed */ TValue['allowed'],
    /* disallowed */ TValue['disallowed'],
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

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

  export type mergeArray<TValue extends AnyValue, T = never> = unknown

  export type excludeFromArray<TValue extends AnyValue, T = never> = unknown

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
