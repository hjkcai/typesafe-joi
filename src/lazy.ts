import { OptionalSchema, RequiredSchema } from "./schema";
import { AbstractSchema } from "./base";

export interface LazySchema<Value = undefined> extends OptionalSchema, LazySchemaType<LazySchema, Value> {}
export interface RequiredLazySchema<Value = never> extends RequiredSchema, LazySchemaType<RequiredLazySchema, Value> {}

export interface LazySchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'lazy'
}
