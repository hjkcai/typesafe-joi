import { SchemaLike, OptionalSchema, RequiredSchema, SchemaValues } from ".";
import { AbstractSchema } from "./base";
import { OPTIONAL_SCHEMA_TYPE, REQUIRED_SCHEMA_TYPE } from "../lib/symbols";

export interface AlternativesSchema<Value = undefined> extends OptionalSchema, AlternativesSchemaType<AlternativesSchema, Value> {}
export interface RequiredAlternativesSchema<Value = never> extends RequiredSchema, AlternativesSchemaType<RequiredAlternativesSchema, Value> {}

export interface AlternativesSchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'alternatives'
  [OPTIONAL_SCHEMA_TYPE]: AlternativesSchema
  [REQUIRED_SCHEMA_TYPE]: RequiredAlternativesSchema

  try<T extends SchemaLike[]> (...types: T): AlternativesSchema<Value | SchemaValues<T>>
}
