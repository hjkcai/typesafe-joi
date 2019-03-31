import { OptionalSchema, RequiredSchema } from "./schema";
import { AbstractSchema } from "./base";

export interface SymbolSchema<Value = symbol | undefined> extends OptionalSchema, SymbolSchemaType<SymbolSchema, Value> {}
export interface RequiredSymbolSchema<Value = symbol> extends RequiredSchema, SymbolSchemaType<RequiredSymbolSchema, Value> {}

export interface SymbolSchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'symbol'

  map (iterable: Iterable<[string | number | boolean | symbol, symbol]> | { [key: string]: symbol }): this
}
