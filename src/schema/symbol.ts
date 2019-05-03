import { Value } from "../lib/value";
import { BaseSchema } from ".";

export interface SymbolSchema<TValue extends Value.AnyValue = Value<symbol>> extends BaseSchema<'symbol', TValue> {
  map (iterable: Iterable<[string | number | boolean | symbol, symbol]> | Record<string, symbol>): this
}
