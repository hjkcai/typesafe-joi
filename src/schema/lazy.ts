import { OptionalSchema, RequiredSchema } from ".";
import { AbstractSchema } from "./base";
import { OPTIONAL_SCHEMA_TYPE, REQUIRED_SCHEMA_TYPE } from "../lib/symbols";

export interface LazySchema<Value = undefined> extends OptionalSchema, LazySchemaType<LazySchema, Value> {}
export interface RequiredLazySchema<Value = never> extends RequiredSchema, LazySchemaType<RequiredLazySchema, Value> {}

export interface LazySchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'lazy'
  [OPTIONAL_SCHEMA_TYPE]: LazySchema
  [REQUIRED_SCHEMA_TYPE]: RequiredLazySchema
}
