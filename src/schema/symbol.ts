import { OptionalSchema, RequiredSchema } from ".";
import { AbstractSchema } from "./base";
import { OPTIONAL_SCHEMA_TYPE, REQUIRED_SCHEMA_TYPE } from "../lib/symbols";

export interface SymbolSchema<Value = symbol | undefined> extends OptionalSchema, SymbolSchemaType<SymbolSchema, Value> {}
export interface RequiredSymbolSchema<Value = symbol> extends RequiredSchema, SymbolSchemaType<RequiredSymbolSchema, Value> {}

export interface SymbolSchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'symbol'
  [OPTIONAL_SCHEMA_TYPE]: SymbolSchema
  [REQUIRED_SCHEMA_TYPE]: RequiredSymbolSchema

  map (iterable: Iterable<[string | number | boolean | symbol, symbol]> | Record<string, symbol>): this
}
