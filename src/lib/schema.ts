import { Value } from "./value";
import { IS_INTERNAL_SCHEMA_MAP, IS_INTERNAL_LITERAL_SCHEMA, VALUE } from "./symbols";

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
  [VALUE]?: TValue
}

export namespace Schema {
  export type AnySchema = Schema<Value.AnyValue>

  export type SchemaMap = { [Key in keyof any]: SchemaLike }
  export type SchemaLike = string | number | boolean | null | Schema<Value.AnyValue> | Schema<Value.AnyValue>[] | SchemaMap

  /**
   * The nominal type to mark a plain object as an *internal* schema map.
   * @private Internal use only.
   *
   * @description
   * `InternalSchemaMap` ensures all its keys have the value type `Schema<Value.AnyValue>`.
   * Equivalent to `{ [IS_SCHEMA_MAP]?: never } & Record<any, Schema<Value.AnyValue>>`.
   *
   * @example
   * type A = InternalSchemaMap & { a: NumberSchema }
   */
  export interface InternalSchemaMap {
    [IS_INTERNAL_SCHEMA_MAP]?: never
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
    [IS_INTERNAL_LITERAL_SCHEMA]?: never
  }

  /**
   * Construct a `Schema` type from a `SchemaLike`.
   */
  export type fromSchemaLike<TSchemaLike extends SchemaLike> = (
    TSchemaLike extends Schema<Value.AnyValue>
    ? TSchemaLike
    : TSchemaLike extends string | number | boolean | null
      ? TSchemaLike & LiteralSchema<Value<TSchemaLike>>
      : TSchemaLike extends any[]
        ? never // fromSchemaLike[TSchemaLike[number]]
        : TSchemaLike & LiteralSchema<Value<Record<any, any>, fromSchemaMap<Extract<TSchemaLike, SchemaMap>>>>
  )

  /**
   * Construct an internal `InternalSchemaMap` from a `SchemaMap`.
   */
  export type fromSchemaMap<TSchemaMap extends SchemaMap> = InternalSchemaMap & {
    [Key in keyof TSchemaMap]: fromSchemaLike<TSchemaMap[Key]>
  }

  export type compile<TSchemaLike extends SchemaLike> = unknown

  export type deepMergeSchemaMap<T extends InternalSchemaMap, U extends InternalSchemaMap> = (
    InternalSchemaMap
    & {
      [Key in Exclude<keyof T, typeof IS_INTERNAL_SCHEMA_MAP>]: (
        Key extends keyof U
        ? T[Key] extends Schema<infer TValue>
          ? U[Key] extends Schema<infer UValue>
            ? Schema<Value.deepMergeSchemaMap<TValue, UValue>>  // TODO: Preserve the original schema type from T[Key]
            : U[Key]
          : U[Key]
        : T[Key]
      )
    }
    & {
      [Key in Exclude<keyof U, keyof T>]: U[Key]
    }
  )

  export type valueType<TSchemaLike extends SchemaLike> = (
    fromSchemaLike<TSchemaLike> extends Schema<infer TValue>
    ? TValue
    : never
  )

  export type literal<TSchemaLike extends SchemaLike> = (
    fromSchemaLike<TSchemaLike> extends Schema<infer TValue>
    ? Value.literal<TValue>
    : never
  )
}
