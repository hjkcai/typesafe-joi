import { OptionalSchema, RequiredSchema } from ".";
import { AbstractSchema } from "./base";
import { OPTIONAL_SCHEMA_TYPE, REQUIRED_SCHEMA_TYPE } from "../lib/symbols";

export interface AnySchema<Value = undefined> extends OptionalSchema, AnySchemaType<AnySchema, Value> {}
export interface RequiredAnySchema<Value = never> extends RequiredSchema, AnySchemaType<RequiredAnySchema, Value> {}

export interface AnySchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'any'
  [OPTIONAL_SCHEMA_TYPE]: AnySchema
  [REQUIRED_SCHEMA_TYPE]: RequiredAnySchema
}
