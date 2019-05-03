import { Schema } from './schema'
import { IS_INTERNAL_SCHEMA_MAP } from "./symbols";
import { MakeOptional, IsNever, IsTrue, MergeArray, ExcludeFromArray, IsAny, IsInvariant, IsUndefinedOrNever } from './util';

/**
 * A structure stores all information needed to match Joi's validation logic.
 * `Value` will NEVER exist in runtime. `Value` is used only for type inference.
 * @see Value.getType - How `Value` is assembled into literal type.
 */
export interface Value<
  TBase = never,
  TAugment = never,
  TAllowed = never,
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
    /* default */ unknown,
    /* isRequired */ boolean
  >

  export type EmptyValue = Value<
    /* base */ never,
    /* augment */ never,
    /* allowed */ never,
    /* default */ never,
    /* isRequired */ true
  >

  export type isAllowOnly<TValue extends AnyValue, TrueType = true, FalseType = false> = (
    IsNever<TValue['base'], IsNever<TValue['augment'], TrueType, FalseType>, FalseType>
  )

  /** Transform a schema map into object literal type. */
  export type transformSchemaMap<T extends Schema.InternalSchemaMap> = IsNever<T, never, MakeOptional<{
    [Key in Exclude<keyof T, typeof IS_INTERNAL_SCHEMA_MAP>]: (
      T[Key] extends Schema<infer TValue>
      ? Value.literal<TValue>
      : never
    )
  }>>

  export type transformArrayType<T extends Schema.InternalArrayType<any>> = IsNever<T, never, (
    T extends Schema.InternalArrayType<infer TIsSparse> & (infer TItem)[]
    ? (TItem | IsTrue<TIsSparse, undefined, never>)[]
    : never
  )>

  /** Get the literal type of a `Value`. */
  export type literal<TValue extends AnyValue> = (
    | TValue['allowed']
    | IsTrue<TValue['isRequired'], never, TValue['default']>
    | IsNever<TValue['augment'], TValue['base'],
        | transformSchemaMap<Extract<TValue['augment'], Schema.InternalSchemaMap>>
        | transformArrayType<Extract<TValue['augment'], Schema.InternalArrayType<any>>>
        | Exclude<Exclude<TValue['augment'], Schema.InternalSchemaMap>, Schema.InternalArrayType<any>>
      >
  )

  export type replace<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ isAllowOnly<TValue, never, U>,
    /* allowed */ TValue['allowed'],
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  export type union<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'] | U,
    /* allowed */ TValue['allowed'],
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  /** Set the extra allowed type of a `Value`. */
  export type allow<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'] | U,
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
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  /** Set the disallowed type of a `Value`. */
  export type disallow<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ Exclude<TValue['allowed'], U>,
    /* default */ TValue['default'],
    /* isRequired */ TValue['isRequired']
  >

  /** Set the default type of a `Value`. */
  export type setDefault<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'],
    /* default */ U,
    /* isRequired */ TValue['isRequired']
  >

  /** Make a `Value` required. */
  export type required<TValue extends AnyValue> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'],
    /* default */ TValue['default'],
    /* isRequired */ true
  >

  /** Make a `Value` optional (not required). */
  export type optional<TValue extends AnyValue> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'],
    /* default */ TValue['default'],
    /* isRequired */ false
  >

  /** Merge two a value types by adding the rules of one type to another. */
  export type concat<T extends AnyValue, U extends AnyValue> = Value<
    /* base */ IsAny<T['base'], IsAny<U['base'], any, U['base']>, T['base']>,
    /* augment */ (
      | Schema.deepConcatSchemaMap<Extract<T['augment'], Schema.InternalSchemaMap>, Extract<U['augment'], Schema.InternalSchemaMap>>
      | mergeArrayOnly<Extract<T['augment'], Schema.InternalArrayType<any>>, Extract<U['augment'], Schema.InternalArrayType<any>> extends (infer UItem)[] ? UItem : never>
      | Exclude<Exclude<T['augment'], Schema.InternalSchemaMap>, Schema.InternalArrayType<any>>
      | Exclude<Exclude<U['augment'], Schema.InternalSchemaMap>, Schema.InternalArrayType<any>>
    ),
    /* allowed */ T['allowed'] | U['allowed'],
    /* default */ IsUndefinedOrNever<U['default'], T['default'], U['default']>,
    /* isRequired */ U['isRequired']
  >

  export type mergeArray<TValue extends AnyValue, TNewItem = never> = replace<TValue, (
    IsNever<TValue['augment'], Exclude<TNewItem, undefined>[] & Schema.InternalArrayType<false>, (
      | mergeArrayOnly<Extract<TValue['augment'], Schema.InternalArrayType<any>>, TNewItem>
      | Exclude<TValue['augment'], Schema.InternalArrayType<any>>
    )>
  )>

  export type mergeArrayOnly<TArray extends Schema.InternalArrayType<any>, TNewItem> = (
    TArray extends Schema.InternalArrayType<infer TIsSparse> & (infer TItem)[]
    ? Exclude<TItem | TNewItem, undefined>[] & Schema.InternalArrayType<TIsSparse>
    : never
  )

  export type setArraySparse<TValue extends AnyValue, TIsSparse extends boolean> = replace<TValue, (
    IsNever<TValue['augment'], never[] & Schema.InternalArrayType<TIsSparse>, (
      | setArraySparseOnly<Extract<TValue['augment'], Schema.InternalArrayType<any>>, TIsSparse>
      | Exclude<TValue['augment'], Schema.InternalArrayType<any>>
    )>
  )>

  export type setArraySparseOnly<TArray extends Schema.InternalArrayType<any>, TIsSparse extends boolean> = (
    TArray extends (infer TItem)[]
    ? TItem[] & Schema.InternalArrayType<TIsSparse>
    : never
  )

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
