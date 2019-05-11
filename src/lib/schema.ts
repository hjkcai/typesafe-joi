import * as Schemas from '../schema'
import { When } from './joi';
import { Value } from "./value";
import { IsNever } from './util';
import { IS_INTERNAL_OBJECT, IS_SPARSE, IS_INTERNAL_LITERAL_SCHEMA, VALUE } from "./symbols";

/**
 * The abstract schema interface.
 * @description This interface only stores the value type of the schema for general use.
 * For Joi's schemas, see `schemas` folder.
 */
export interface Schema<TValue extends Value.AnyValue> {
  /**
   * The value type of the schema.
   * @private DO NOT USE! This is not a real joi schema property but is required for typesafe-joi to work.
   */
  [VALUE]: TValue
}

export namespace Schema {
  export type SchemaMap = { [Key in keyof any]: SchemaLike }
  export type SchemaLikeBase = string | number | boolean | null | Schema<Value.AnyValue> | SchemaMap
  export type SchemaLike = SchemaLikeBase | SchemaLikeBase[]

  /**
   * The nominal type to mark a plain object as an *internal* schema map.
   * @private Internal use only.
   *
   * @description
   * Types intersect with `InternalObjectType` ensures all its keys have the value type `Schema<Value.AnyValue>`.
   * Equivalent to `{ [IS_INTERNAL_SCHEMA_MAP]: true } & Record<any, Schema<Value.AnyValue>>`.
   *
   * @example
   * type A = { a: NumberSchema } & InternalObjectType
   */
  export interface InternalObjectType {
    [IS_INTERNAL_OBJECT]: true
  }

  /**
   * The tagging type for array types.
   * @private Internal use only.
   *
   * @description
   * `InternalArrayType` stores flags for array types:
   * - `IS_SPRASE`: Indicates if the array is sparse, which means the array contains `undefined` items.
   *
   * @example
   * type A = string[] & InternalArrayType
   */
  export interface InternalArrayType<T extends boolean> {
    [IS_SPARSE]: T
  }

  /**
   * The nominal type to mark a literal value as a schema.
   * @private Internal use only.
   *
   * @description
   * Joi allows literal values to be schemas (aka `SchemaLike`).
   * typesafe-joi will make an intersection type when converting literal values into formal schema objects,
   * in order to mark them as schemas without breaking original literal types.
   *
   * @example
   * type A = LiteralSchema<Value<1 | "2" | true>> & (1 | "2" | true)
   */
  export interface LiteralSchema<TValue extends Value.AnyValue> extends Schema<TValue> {
    [IS_INTERNAL_LITERAL_SCHEMA]: true
  }

  // --------------------------------------------------------------------------
  // Schema transformations
  // --------------------------------------------------------------------------

  /**
   * Construct a `Schema` from another `Schema`.
   *
   * @description
   * The new `Schema` has the same type to the old `Schema`,
   * but the new one can have different value type.
   */
  export type from<TSchema extends Schema<Value.AnyValue>, TValue extends Value.AnyValue = Schema.valueType<TSchema>> = (
    TSchema extends LiteralSchema<any>
      ? LiteralSchema<TValue>
      : TSchema extends Schemas.AbstractSchema<any, any>
        ? Schemas.SchemaType<TSchema['schemaType'], TValue>
        : Schema<TValue>
  )

  /**
   * Construct a `Schema` type from a `SchemaLike`.
   *
   * @description
   * The literal type remains what it is but a `LiteralSchema` type is added onto it.
   * The value type of the `LiteralSchema` will be what the liter indicates.
   *
   * @example
   * type A = fromSchemaLike<1> = LiteralSchema<Value<1>> & 1;
   * type B = fromSchemaLike<{}> = LiteralSchema<Value<Record<any, any>, InternalObjectType & {}>> & {}
   */
  export type fromSchemaLike<TSchemaLike extends SchemaLike> = (
    [TSchemaLike] extends [Schema<Value.AnyValue>]
    ? TSchemaLike
    : TSchemaLike extends string | number | boolean | null
      ? LiteralSchema<Value<TSchemaLike>>
      : TSchemaLike extends any[]
        ? never // TODO: literal alternative schema is not supported yet
        : LiteralSchema<Value<
            Record<any, any>,
            fromSchemaMap<Extract<TSchemaLike, SchemaMap>>
          >>
  )

  /**
   * Compile `SchemaLike` into its corresponding schema type.
   *
   * @description
   * This is almost the same to `fromSchemaLike` but it returns the corresponding schema type.
   */
  export type compile<TSchemaLike extends SchemaLike> = (
    TSchemaLike extends Schema<Value.AnyValue>
    ? TSchemaLike
    : TSchemaLike extends string
      ? Schemas.StringSchema<Value.allow<Value, TSchemaLike>>
      : TSchemaLike extends number
        ? Schemas.NumberSchema<Value.allowOnly<Value, TSchemaLike>>
        : TSchemaLike extends boolean
          ? Schemas.BooleanSchema<Value.allowOnly<Value, TSchemaLike>>
          : TSchemaLike extends any[]
            ? never // TODO: literal alternative schema is not supported yet
            : TSchemaLike extends SchemaMap
              ? Schemas.ObjectSchema<Value<Record<any, any>, compileSchemaMap<Extract<TSchemaLike, SchemaMap>>>>
              : Schemas.AnySchema<Value.allowOnly<Value, TSchemaLike>>
  )

  /**
   * Merge two a value types by adding the rules of one type to another.
   *
   * @description
   * Here we only choose which schema type to return.
   */
  export type concat<T extends Schemas.AbstractSchema<any, Value.AnyValue>, U extends Schemas.AbstractSchema<any, Value.AnyValue>> = (
    Schemas.SchemaType<
      T['schemaType'] extends 'any'
      ? U['schemaType'] extends 'any'
        ? 'any'
        : U['schemaType']
      : T['schemaType'],
      Value.concat<T[typeof VALUE], U[typeof VALUE]>
    >
  )

  /** The `concat` but accepts `SchemaLike` types. */
  export type concatSchemaLike<T extends Schemas.AbstractSchema<any, Value.AnyValue>, U extends SchemaLike> = (
    concat<T, Extract<compile<U>, Schemas.AbstractSchema<any, Value.AnyValue>>>
  )

  // --------------------------------------------------------------------------
  // SchemaMap transformations
  // --------------------------------------------------------------------------

  /** Construct an internal `InternalObjectType` from a `SchemaMap`. */
  export type fromSchemaMap<TSchemaMap extends SchemaMap> = InternalObjectType & {
    [Key in keyof TSchemaMap]: fromSchemaLike<TSchemaMap[Key]>
  }

  /** Compile an internal `InternalObjectType` from a `SchemaMap`. */
  export type compileSchemaMap<TSchemaMap extends SchemaMap> = InternalObjectType & {
    [Key in keyof TSchemaMap]: compile<TSchemaMap[Key]>
  }

  /**
   * Deeply merge two `InternalObjectType`s.
   * @description This actually acts like deep assign.
   */
  export type deepMergeSchemaMap<T extends InternalObjectType, U extends InternalObjectType> = (
    InternalObjectType
    & {
      [Key in Exclude<keyof T, typeof IS_INTERNAL_OBJECT>]: (
        Key extends keyof U
        ? T[Key] extends Schema<infer TValue>
          ? U[Key] extends Schema<infer UValue>
            ? from<Extract<U[Key], Schema<any>>, Value.deepMerge<TValue, UValue>>
            : U[Key]
          : U[Key]
        : T[Key]
      )
    }
    & { [Key in Exclude<keyof U, keyof T>]: U[Key] }
  )

  /**
   * Deeply concat two `InternalObjectType`s.
   * @description This is similar to `deepMergeSchemaMap` but uses `concat` when merging.
   */
  export type deepConcatSchemaMap<T extends InternalObjectType, U extends InternalObjectType> = IsNever<T, IsNever<U, never, U>, IsNever<U, never, (
    InternalObjectType
    & {
      [Key in Exclude<keyof T, typeof IS_INTERNAL_OBJECT>]: (
        Key extends keyof U
        ? concat<Extract<T[Key], Schemas.AbstractSchema<any, Value.AnyValue>>, Extract<U[Key], Schemas.AbstractSchema<any, Value.AnyValue>>>
        : T[Key]
      )
    }
    & { [Key in Exclude<keyof U, keyof T>]: U[Key] }
  )>>

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  /** Helper of `when` */
  export type when<T extends Schemas.AbstractSchema<any, Value.AnyValue>, U extends When<any, any>> = (
    U extends When<infer Then, infer Otherwise>
    ? (
      | concatSchemaLike<T, Then>
      | concatSchemaLike<T, Otherwise>
    )
    : never
  )

  /** Get the value type of a `SchemaLike` */
  export type valueType<TSchemaLike extends SchemaLike> = (
    fromSchemaLike<TSchemaLike>[typeof VALUE]
  )

  /** Get the literal type of a `SchemaLike` */
  export type literal<TSchemaLike extends SchemaLike> = (
    Value.literal<valueType<TSchemaLike>>
  )
}
