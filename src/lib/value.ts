import { Schema } from './schema'
import { IS_INTERNAL_OBJECT } from "./symbols";
import { MakeOptional, IsNever, IsTrue, IsAny, IsUndefinedOrNever, ArrayItemType, IsInvariant } from './util';

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
  TPresence extends Value.Presence = never
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
   * The allowed type is added by `Schema.allow()`, `Schema.valid()`, `Schema.only()`, `Schema.equal()`.
   * This type will be the part of the final literal type.
   */
  allowed: TAllowed,

  /**
   * The default type of a schema.
   *
   * @description
   * The default type is specified by `Schema.default()`.
   * This type will be the part of the final literal type if `presence` is `Optional` or `never`.
   */
  default: TDefault,

  /**
   * The presence of a schema.
   *
   * @description
   * The presence is the same to the presence flag internally defined in joi.
   * It has 4 valid values: `Optional`, `Required`, `Forbidden`, `never`.
   * When presense is `never`, it equals to `Optional`.
   */
  presence: TPresence
}

export namespace Value {
  export const enum Presence {
    Optional,
    Required,
    Forbidden
  }

  // --------------------------------------------------------------------------
  // Alias
  // --------------------------------------------------------------------------

  export type AnyValue = Value<
    /* base */ unknown,
    /* augment */ unknown,
    /* allowed */ unknown,
    /* default */ unknown,
    /* isRequired */ Value.Presence
  >

  export type EmptyValue = Value<
    /* base */ never,
    /* augment */ never,
    /* allowed */ never,
    /* default */ never,
    /* isRequired */ never
  >

  // --------------------------------------------------------------------------
  // Building literal
  // --------------------------------------------------------------------------

  /**
   * Transform `InternalObjectType` into object literal type.
   * @private
   */
  export type transformSchemaMap<T extends Schema.InternalObjectType> = IsNever<T, never, MakeOptional<{
    [Key in excludeForbiddenKeys<T>]: (
      T[Key] extends Schema<infer TValue>
      ? Value.literal<TValue>
      : never
    )
  }>>

  /**
   * Transform `InternalArrayType` into array literal type.
   * @private
   */
  export type transformArrayType<T extends Schema.InternalArrayType<any>> = IsNever<T, never, (
    T extends Schema.InternalArrayType<infer TIsSparse> & (infer TItem)[]
    ? (TItem | IsTrue<TIsSparse, undefined, never>)[]
    : never
  )>

  /** Wrap `U` with the presence type. */
  export type literalPresence<TValue extends AnyValue, TLiteral> = (
    IsNever<TValue['presence'], TLiteral | TValue['default'],
      IsInvariant<TValue['presence'], Presence.Forbidden, never,
        TLiteral | IsInvariant<TValue['presence'], Presence.Required, never, TValue['default']>
      >
    >
  )

  /** Get the literal type of a `Value`. */
  export type literal<TValue extends AnyValue> = (
    TValue extends any    // force typescript to handle unions one by one
    ? (
        literalPresence<TValue,
        TValue['allowed']
        | IsNever<TValue['augment'], TValue['base'],
            | transformSchemaMap<Extract<TValue['augment'], Schema.InternalObjectType>>
            | transformArrayType<Extract<TValue['augment'], Schema.InternalArrayType<any>>>
            | Exclude<Exclude<TValue['augment'], Schema.InternalObjectType>, Schema.InternalArrayType<any>>
          >
        >
      )
    : never
  )

  // --------------------------------------------------------------------------
  // Value structure manipulation
  // --------------------------------------------------------------------------

  /** Replace the augment type of `TValue` with `U` */
  export type replace<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ isAllowOnly<TValue, never, U>,
    /* allowed */ TValue['allowed'],
    /* default */ TValue['default'],
    /* isRequired */ TValue['presence']
  >

  /** Set the extra allowed type of a `Value`. */
  export type allow<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'] | U,
    /* default */ TValue['default'],
    /* isRequired */ TValue['presence']
  >

  /**
   * Set the only allowed type of a `Value`.
   * @description This removes the base type and the augment type
   */
  export type allowOnly<TValue extends AnyValue, U = never> = Value<
    /* base */ never,
    /* augment */ never,
    /* allowed */ TValue['allowed'] | U,
    /* default */ TValue['default'],
    /* isRequired */ TValue['presence']
  >

  /** Remove types from the allowed type. */
  export type disallow<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ Exclude<TValue['allowed'], U>,
    /* default */ TValue['default'],
    /* isRequired */ TValue['presence']
  >

  /** Set the default type of a `Value`. */
  export type setDefault<TValue extends AnyValue, U = never> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'],
    /* default */ U,
    /* isRequired */ TValue['presence']
  >

  /** Set the presence of a `Value`. */
  export type presence<TValue extends AnyValue, TIsRequired extends Value.Presence> = Value<
    /* base */ TValue['base'],
    /* augment */ TValue['augment'],
    /* allowed */ TValue['allowed'],
    /* default */ TValue['default'],
    /* isRequired */ TIsRequired
  >

  /** Merge two a value types by adding the rules of one type to another. */
  export type concat<T extends AnyValue, U extends AnyValue> = Value<
    /* base */ IsAny<T['base'], IsAny<U['base'], any, U['base']>, T['base']>,
    /* augment */ (
      | Schema.deepConcatSchemaMap<Extract<T['augment'], Schema.InternalObjectType>, Extract<U['augment'], Schema.InternalObjectType>>
      | mergeArrayOnly<Extract<T['augment'], Schema.InternalArrayType<any>>, ArrayItemType<Extract<U['augment'], Schema.InternalArrayType<any>>>>
      | Exclude<Exclude<T['augment'], Schema.InternalObjectType>, Schema.InternalArrayType<any>>
      | Exclude<Exclude<U['augment'], Schema.InternalObjectType>, Schema.InternalArrayType<any>>
    ),
    /* allowed */ T['allowed'] | U['allowed'],
    /* default */ IsUndefinedOrNever<U['default'], T['default'], U['default']>,
    /* isRequired */ IsNever<U['presence'], T['presence'], U['presence']>
  >

  // --------------------------------------------------------------------------
  // Value manipulation
  // --------------------------------------------------------------------------

  /** Make a `Value` required. */
  export type required<TValue extends AnyValue> = presence<TValue, Value.Presence.Required>

  /** Make a `Value` optional. */
  export type optional<TValue extends AnyValue> = presence<TValue, Value.Presence.Optional>

  /** Make a `Value` forbidden. */
  export type forbidden<TValue extends AnyValue> = presence<TValue, Value.Presence.Forbidden>

  /** Replace the augment type with the original augment type unioned with `U` */
  export type union<TValue extends AnyValue, U = never> = replace<TValue, TValue['augment'] | U>

  /**
   * Add `TNewItem` into the array type of a `Value`.
   *
   * @description
   * This is similar to merge two array types and leaving other types unmodified.
   * e.g. `mergeArray<A[] | B, C> -> (A | C)[] | B`
   */
  export type mergeArray<TValue extends AnyValue, TNewItem = never> = replace<TValue, (
    IsNever<TValue['augment'], Exclude<TNewItem, undefined>[] & Schema.InternalArrayType<false>, (
      | mergeArrayOnly<Extract<TValue['augment'], Schema.InternalArrayType<any>>, TNewItem>
      | Exclude<TValue['augment'], Schema.InternalArrayType<any>>
    )>
  )>

  /** Set the sparse flag of the array type of a `Value` */
  export type setArraySparse<TValue extends AnyValue, TIsSparse extends boolean> = replace<TValue, (
    IsNever<TValue['augment'], never[] & Schema.InternalArrayType<TIsSparse>, (
      | (ArrayItemType<Extract<TValue['augment'], Schema.InternalArrayType<any>>>[] & Schema.InternalArrayType<TIsSparse>)
      | Exclude<TValue['augment'], Schema.InternalArrayType<any>>
    )>
  )>

  /**
   * Deeply merge two `Value`s.
   *
   * @description
   * - If `T` and `U` both have `InternalObjectType` type, merge them.
   * - Otherwise just directly use `U` as the result.
   */
  export type deepMerge<T extends AnyValue, U extends AnyValue> = (
    IsNever<T['augment'], 0, T['augment']> extends Schema.InternalObjectType
    ? IsNever<U['augment'], 0, U['augment']> extends Schema.InternalObjectType
      ? replace<U, Schema.deepMergeSchemaMap<
          Extract<T['augment'], Schema.InternalObjectType>,
          Extract<U['augment'], Schema.InternalObjectType>
        >>
      : U
    : U
  )

  /** Make intersection to the augment type of a `Value` with `InternalObjectType` and `U`. */
  export type appendSchemaMap<TValue extends AnyValue, U> = (
    replace<TValue, IsNever<TValue['augment'], Schema.InternalObjectType & U, TValue['augment'] & Schema.InternalObjectType & U>>
  )

  /**
   * Make some keys of the object optional.
   * If one of the key is an empty string, make the entire object optional.
   */
  export type setOptionalKeys<TValue extends AnyValue, TKeys extends string> = (
    IsInvariant<TKeys, string, TValue,
      TValue['augment'] extends Schema.InternalSchemaMap
      ? '' extends TKeys
        ? Value.optional<Value.replace<TValue, setOptionalKeysInternal<TValue['augment'], TKeys>>>
        : Value.replace<TValue, setOptionalKeysInternal<TValue['augment'], TKeys>>
      : never
    >
  )

  /**
   * Make some keys of the object required.
   * If one of the key is an empty string, make the entire object required.
   */
  export type setRequiredKeys<TValue extends AnyValue, TKeys extends string> = (
    IsInvariant<TKeys, string, TValue,
      TValue['augment'] extends Schema.InternalSchemaMap
      ? '' extends TKeys
        ? Value.required<Value.replace<TValue, setRequiredKeysInternal<TValue['augment'], TKeys>>>
        : Value.replace<TValue, setOptionalKeysInternal<TValue['augment'], TKeys>>
      : never
    >
  )

  /**
   * Make some keys of the object forbidden.
   * If one of the key is an empty string, make the entire object forbidden.
   */
  export type setForbiddenKeys<TValue extends AnyValue, TKeys extends string> = (
    IsInvariant<TKeys, string, TValue,
      TValue['augment'] extends Schema.InternalSchemaMap
      ? '' extends TKeys
        ? Value.forbidden<Value.replace<TValue, setForbiddenKeysInternal<TValue['augment'], TKeys>>>
        : Value.replace<TValue, setForbiddenKeysInternal<TValue['augment'], TKeys>>
      : never
    >
  )

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  /**
   * Test if the base type of a `Value` is `never`.
   * @private
   */
  export type isAllowOnly<TValue extends AnyValue, TrueType = true, FalseType = false> = (
    IsNever<TValue['base'], IsNever<TValue['augment'], TrueType, FalseType>, FalseType>
  )

  /**
   * Do the real array merge of `mergeArray`.
   * @private
   */
  export type mergeArrayOnly<TArray extends Schema.InternalArrayType<any>, TNewItem> = (
    TArray extends Schema.InternalArrayType<infer TIsSparse> & (infer TItem)[]
    ? Exclude<TItem | TNewItem, undefined>[] & Schema.InternalArrayType<TIsSparse>
    : never
  )

  /**
   * Extract object keys without forbidden keys from an internal object type
   * @private
   */
  export type excludeForbiddenKeys<T extends Schema.InternalObjectType> = (
    { [Key in keyof T]: IsInvariant<Schema.valueType<Extract<T[Key], Schema>>['presence'], Presence.Forbidden, never, Key> }[Exclude<keyof T, typeof IS_INTERNAL_OBJECT>]
  )

  /**
   * Make some keys of the object optional.
   * @private
   */
  export type setOptionalKeysInternal<TSchemaMap extends Schema.InternalSchemaMap, TKeys extends string> = (
    Schema.InternalObjectType & {
      [key in Exclude<keyof TSchemaMap, typeof IS_INTERNAL_OBJECT>]: key extends TKeys
        ? Schema.from<TSchemaMap[key], Value.optional<Schema.valueType<TSchemaMap[key]>>>
        : TSchemaMap[key]
    }
  )

  /**
   * Make some keys of the object forbidden.
   * @private
   */
  export type setRequiredKeysInternal<TSchemaMap extends Schema.InternalSchemaMap, TKeys extends string> = (
    Schema.InternalObjectType & {
      [key in Exclude<keyof TSchemaMap, typeof IS_INTERNAL_OBJECT>]: key extends TKeys
      ? Schema.from<TSchemaMap[key], Value.required<Schema.valueType<TSchemaMap[key]>>>
        : TSchemaMap[key]
    }
  )

  /**
   * Make some keys of the object forbidden.
   * @private
   */
  export type setForbiddenKeysInternal<TSchemaMap extends Schema.InternalSchemaMap, TKeys extends string> = (
    Schema.InternalObjectType & {
      [key in Exclude<keyof TSchemaMap, typeof IS_INTERNAL_OBJECT>]: key extends TKeys
      ? Schema.from<TSchemaMap[key], Value.forbidden<Schema.valueType<TSchemaMap[key]>>>
        : TSchemaMap[key]
    }
  )
}
