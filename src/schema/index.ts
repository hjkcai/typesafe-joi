import { AbstractSchema } from "./base";
import { AnySchema, RequiredAnySchema } from "./any";
import { ArraySchema, SparseArraySchema, RequiredArraySchema, RequiredSparseArraySchema } from "./array";
import { BooleanSchema, RequiredBooleanSchema } from "./boolean";
import { BinarySchema, RequiredBinarySchema } from "./binary";
import { DateSchema, RequiredDateSchema } from "./date";
import { FunctionSchema, RequiredFunctionSchema } from "./function";
import { NumberSchema, RequiredNumberSchema } from "./number";
import { ObjectSchema, RequiredObjectSchema } from "./object";
import { StringSchema, RequiredStringSchema } from "./string";
import { SymbolSchema, RequiredSymbolSchema } from "./symbol";
import { AlternativesSchema, RequiredAlternativesSchema } from "./alternative";
import { LazySchema, RequiredLazySchema } from "./lazy";
import { VALUE, IS_REQUIRED } from "../lib/symbols";
import { FilterValues, OmitValues } from "../lib/util";

/**
 * Joi normal schema and literal schema
 * @todo support alternative literal schema
 */
export type SchemaLike = AbstractSchema | SchemaMap | string | number | boolean | null

/** Object literal schema */
export type SchemaMap = { [key: string]: SchemaLike }

/** Possible values of `schemaType` */
export type SchemaTypes = 'any' | 'alternatives' | 'array' | 'boolean' | 'binary' | 'date' | 'function' | 'lazy' | 'number' | 'object' | 'string'

/** All possible schemas */
export type Schema<Value = any> = (
  AnySchema<Value>
  | ArraySchema<Value>
  | SparseArraySchema<Value>
  | BooleanSchema<Value>
  | BinarySchema<Value>
  | DateSchema<Value>
  | FunctionSchema<Value>
  | NumberSchema<Value>
  | ObjectSchema<Value>
  | StringSchema<Value>
  | SymbolSchema<Value>
  | AlternativesSchema<Value>
  | LazySchema<Value>

  | RequiredAnySchema<Value>
  | RequiredArraySchema<Value>
  | RequiredSparseArraySchema<Value>
  | RequiredBooleanSchema<Value>
  | RequiredBinarySchema<Value>
  | RequiredDateSchema<Value>
  | RequiredFunctionSchema<Value>
  | RequiredNumberSchema<Value>
  | RequiredObjectSchema<Value>
  | RequiredStringSchema<Value>
  | RequiredSymbolSchema<Value>
  | RequiredAlternativesSchema<Value>
  | RequiredLazySchema<Value>
)

/** All possible schemas */
export type SchemaInstance<Value = any> = Schema<Value>

/**
 * Assemble `Schema` and `Value` into `Schema<Value>`
 * @description This is useful in the interface `SchemaMethods` (but a little bit tedious)
 */
export type SchemaType<Schema extends AbstractSchema, Value> = (
    Schema extends AnySchema ? AnySchema<Value>
  : Schema extends ArraySchema ? ArraySchema<Value>
  : Schema extends SparseArraySchema ? SparseArraySchema<Value>
  : Schema extends BooleanSchema ? BooleanSchema<Value>
  : Schema extends BinarySchema ? BinarySchema<Value>
  : Schema extends DateSchema ? DateSchema<Value>
  : Schema extends FunctionSchema ? FunctionSchema<Value>
  : Schema extends NumberSchema ? NumberSchema<Value>
  : Schema extends ObjectSchema ? ObjectSchema<Value>
  : Schema extends StringSchema ? StringSchema<Value>
  : Schema extends SymbolSchema ? SymbolSchema<Value>
  : Schema extends AlternativesSchema ? AlternativesSchema<Value>
  : Schema extends LazySchema ? LazySchema<Value>

  : Schema extends RequiredAnySchema ? RequiredAnySchema<Value>
  : Schema extends RequiredArraySchema ? RequiredArraySchema<Value>
  : Schema extends RequiredSparseArraySchema ? RequiredSparseArraySchema<Value>
  : Schema extends RequiredBooleanSchema ? RequiredBooleanSchema<Value>
  : Schema extends RequiredBinarySchema ? RequiredBinarySchema<Value>
  : Schema extends RequiredDateSchema ? RequiredDateSchema<Value>
  : Schema extends RequiredFunctionSchema ? RequiredFunctionSchema<Value>
  : Schema extends RequiredNumberSchema ? RequiredNumberSchema<Value>
  : Schema extends RequiredObjectSchema ? RequiredObjectSchema<Value>
  : Schema extends RequiredStringSchema ? RequiredStringSchema<Value>
  : Schema extends RequiredSymbolSchema ? RequiredSymbolSchema<Value>
  : Schema extends RequiredAlternativesSchema ? RequiredAlternativesSchema<Value>
  : Schema extends RequiredLazySchema ? RequiredLazySchema<Value>
  : never
)

/** Change `Schema` to `RequiredSchema` */
export type RequiredSchemaType<Schema extends AbstractSchema, Value> = (
    Schema extends AnySchema ? RequiredAnySchema<Value>
  : Schema extends ArraySchema ? RequiredArraySchema<Value>
  : Schema extends SparseArraySchema ? RequiredSparseArraySchema<Value>
  : Schema extends BooleanSchema ? RequiredBooleanSchema<Value>
  : Schema extends BinarySchema ? RequiredBinarySchema<Value>
  : Schema extends DateSchema ? RequiredDateSchema<Value>
  : Schema extends FunctionSchema ? RequiredFunctionSchema<Value>
  : Schema extends NumberSchema ? RequiredNumberSchema<Value>
  : Schema extends ObjectSchema ? RequiredObjectSchema<Value>
  : Schema extends StringSchema ? RequiredStringSchema<Value>
  : Schema extends SymbolSchema ? RequiredSymbolSchema<Value>
  : Schema extends AlternativesSchema ? RequiredAlternativesSchema<Value>
  : Schema extends LazySchema ? RequiredLazySchema<Value>
  : Schema
)

/** Change `RequiredSchema` to `Schema` */
export type OptionalSchemaType<Schema extends AbstractSchema, Value> = (
    Schema extends RequiredAnySchema ? AnySchema<Value>
  : Schema extends RequiredArraySchema ? ArraySchema<Value>
  : Schema extends RequiredSparseArraySchema ? SparseArraySchema<Value>
  : Schema extends RequiredBooleanSchema ? BooleanSchema<Value>
  : Schema extends RequiredBinarySchema ? BinarySchema<Value>
  : Schema extends RequiredDateSchema ? DateSchema<Value>
  : Schema extends RequiredFunctionSchema ? FunctionSchema<Value>
  : Schema extends RequiredNumberSchema ? NumberSchema<Value>
  : Schema extends RequiredObjectSchema ? ObjectSchema<Value>
  : Schema extends RequiredStringSchema ? StringSchema<Value>
  : Schema extends RequiredSymbolSchema ? SymbolSchema<Value>
  : Schema extends RequiredAlternativesSchema ? AlternativesSchema<Value>
  : Schema extends RequiredLazySchema ? LazySchema<Value>
  : Schema
)

/**
 * The literal type of a `SchemaLike`
 * @example SchemaValue<StringSchema<T>> = T | undefined
 * @example SchemaValue<RequiredStringSchema<T>> = T
 * @example SchemaValue<string | number | boolean | null> = string | number | boolean | null | undefined
 * @example SchemaValue<{ a: StringSchema<A> }> = { a?: A } | undefined
 */
export type SchemaValue<Schema extends SchemaLike> = (
  Schema extends AbstractSchema
    ? Schema extends RequiredSchema
      ? Schema[typeof VALUE]
      : Schema[typeof VALUE] | undefined        // Non-required types will be unioned with a `undefined` type

    : Schema extends SchemaMap                  // Literal schemas will always be optional
      ? SchemaMapValue<Schema> | undefined
      : Schema | undefined
)

/**
 * Build the value type of a `SchemaMap`
 * @description If a key is not `RequiredXXXSchema`, it will be marked as optional.
 * @example
 * type A = SchemaMapValue<{ a: StringSchema, b: RequiredStringSchema }> // { a?: string, b: string }
 */
export type SchemaMapValue<Map extends SchemaMap> = (
  { [key in keyof SchemaMapLiteral<FilterValues<Map, RequiredSchema>>]: SchemaMapLiteral<FilterValues<Map, RequiredSchema>>[key] }
  & { [key in keyof SchemaMapLiteral<OmitValues<Map, RequiredSchema>>]?: SchemaMapLiteral<OmitValues<Map, RequiredSchema>>[key] }
)

/** Convert every entry in a `SchemaMap` into literal */
export type SchemaMapLiteral<Map /* extends SchemaMap */> = {     // `Map` cannot extends `SchemaMap` because `Filter` type does not return `SchemaMap`
  [key in keyof Map]: Map[key] extends SchemaLike ? SchemaValue<Map[key]> : never
}

/** Extract the value types of multiple `SchemaLike`s */
export type SchemaValues<Schemas extends SchemaLike[]> = SchemaValue<Schemas[number]>

export interface RequiredSchema {
  [IS_REQUIRED]: true
}

export interface OptionalSchema {
  [IS_REQUIRED]: false
}
