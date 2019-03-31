import { IS_SPARSE } from "./symbols";
import { OptionalSchema, RequiredSchema, SchemaLike, SchemaType, SchemaValues } from "./schema";
import { AbstractSchema } from "./base";
import { Reference } from "./joi";
import { ArrayItemType, MergeArray, ExcludeUndefined, ExcludeFromArray } from "./util";

export interface SparseSchema {
  [IS_SPARSE]: true
}

export interface NonSparseSchema {
  [IS_SPARSE]: false
}

export interface ArraySchema<Value = never[]>
  extends OptionalSchema, NonSparseSchema, ArraySchemaType<ArraySchema, Value> {}

export interface RequiredArraySchema<Value = never[]>
  extends RequiredSchema, NonSparseSchema, ArraySchemaType<RequiredArraySchema, Value> {}

export interface SparseArraySchema<Value = never[]>
  extends OptionalSchema, SparseSchema, SparseArraySchemaType<SparseArraySchema, Value> {}

export interface RequiredSparseArraySchema<Value = never[]>
  extends RequiredSchema, SparseSchema, SparseArraySchemaType<RequiredSparseArraySchema, Value> {}

export interface BaseArraySchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'array'

  /**
   * Allow single values to be checked against rules as if it were provided as an array.
   * enabled can be used with a falsy value to go back to the default behavior.
   */
  single (enabled?: any): this

  /**
   * Specifies the minimum number of items in the array.
   */
  min (limit: number): this

  /**
   * Specifies the maximum number of items in the array.
   */
  max (limit: number): this

  /**
   * Specifies the exact number of items in the array.
   */
  length (limit: number | Reference): this

  /**
   * Requires the array values to be unique.
   * Be aware that a deep equality is performed on elements of the array having a type of object,
   * a performance penalty is to be expected for this kind of operation.
   */
  unique (): this
  unique (comparator: string): this
  unique (comparator: (a: ArrayItemType<Value>, b: ArrayItemType<Value>) => boolean): this
}

export interface ArraySchemaType<Schema extends AbstractSchema, Value> extends BaseArraySchemaType<Schema, Value> {
  /**
   * List the types allowed for the array values.
   * type can be an array of values, or multiple values can be passed as individual arguments.
   * If a given type is .required() then there must be a matching item in the array.
   * If a type is .forbidden() then it cannot appear in the array.
   * Required items can be added multiple times to signify that multiple items must be found.
   * Errors will contain the number of items that didn't match.
   * Any unmatched item having a label will be mentioned explicitly.
   *
   * @param type - a joi schema object to validate each array item against.
   */
  items<T extends SchemaLike[]> (types: T): SchemaType<Schema, MergeArray<Value, ExcludeUndefined<SchemaValues<T>>>>
  items<T extends SchemaLike[]> (...types: T): SchemaType<Schema, MergeArray<Value, ExcludeUndefined<SchemaValues<T>>>>

  /**
   * Lists the types in sequence order for the array values where:
   * @param type - a joi schema object to validate against each array item in sequence order. type can be an array of values, or multiple values can be passed as individual arguments.
   * If a given type is .required() then there must be a matching item with the same index position in the array.
   * Errors will contain the number of items that didn't match.
   * Any unmatched item having a label will be mentioned explicitly.
   */
  ordered<T extends SchemaLike[]> (types: T): SchemaType<Schema, MergeArray<Value, ExcludeUndefined<SchemaValues<T>>>>
  ordered<T extends SchemaLike[]> (...types: T): SchemaType<Schema, MergeArray<Value, ExcludeUndefined<SchemaValues<T>>>>

  /**
   * Allow this array to be sparse.
   */
  sparse (enabled: false): this
  sparse (enabled: true): (
    this extends RequiredSchema
      ? RequiredSparseArraySchema<MergeArray<Value, undefined>>
      : SparseArraySchema<MergeArray<Value, undefined>>
  )
}

export interface SparseArraySchemaType<Schema extends AbstractSchema, Value> extends BaseArraySchemaType<Schema, Value> {
  /**
   * List the types allowed for the array values.
   * type can be an array of values, or multiple values can be passed as individual arguments.
   * If a given type is .required() then there must be a matching item in the array.
   * If a type is .forbidden() then it cannot appear in the array.
   * Required items can be added multiple times to signify that multiple items must be found.
   * Errors will contain the number of items that didn't match.
   * Any unmatched item having a label will be mentioned explicitly.
   *
   * @param type - a joi schema object to validate each array item against.
   */
  items<T extends SchemaLike[]> (types: T): SchemaType<Schema, MergeArray<Value, SchemaValues<T> | undefined>>
  items<T extends SchemaLike[]> (...types: T): SchemaType<Schema, MergeArray<Value, SchemaValues<T> | undefined>>

  /**
   * Lists the types in sequence order for the array values where:
   * @param type - a joi schema object to validate against each array item in sequence order. type can be an array of values, or multiple values can be passed as individual arguments.
   * If a given type is .required() then there must be a matching item with the same index position in the array.
   * Errors will contain the number of items that didn't match.
   * Any unmatched item having a label will be mentioned explicitly.
   */
  ordered<T extends SchemaLike[]> (types: T): SchemaType<Schema, MergeArray<Value, SchemaValues<T> | undefined>>
  ordered<T extends SchemaLike[]> (...types: T): SchemaType<Schema, MergeArray<Value, SchemaValues<T> | undefined>>

  /**
   * Allow this array to be sparse.
   */
  sparse (enabled: true): this
  sparse (enabled: false): (
    this extends RequiredSchema
      ? RequiredArraySchema<ExcludeFromArray<Value, undefined>>
      : ArraySchema<ExcludeFromArray<Value, undefined>>
  )
}
