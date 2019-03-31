import { OptionalSchema, RequiredSchema } from "./schema";
import { AbstractSchema } from "./base";

export interface AnySchema<Value = undefined> extends OptionalSchema, AnySchemaType<AnySchema, Value> {}
export interface RequiredAnySchema<Value = never> extends RequiredSchema, AnySchemaType<RequiredAnySchema, Value> {}

export interface AnySchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'any'
}
