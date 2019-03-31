import { SchemaLike, OptionalSchema, RequiredSchema, SchemaValues } from "./schema";
import { AbstractSchema } from "./base";

export interface When<Then extends SchemaLike = never, Otherwise extends SchemaLike = never> {
  then?: Then,
  otherwise?: Otherwise
}

export interface WhenIs<Then extends SchemaLike = never, Otherwise extends SchemaLike = never> extends When<Then, Otherwise> {
  is: SchemaLike
}

export interface AlternativesSchema<Value = undefined> extends OptionalSchema, AlternativesSchemaType<AlternativesSchema, Value> {}
export interface RequiredAlternativesSchema<Value = never> extends RequiredSchema, AlternativesSchemaType<RequiredAlternativesSchema, Value> {}

export interface AlternativesSchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'alternatives'

  try<T extends SchemaLike[]> (...types: T): AlternativesSchema<Value | SchemaValues<T>>
}
