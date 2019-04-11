import { Value } from "../lib/value";
import { AbstractSchema } from ".";

export interface SymbolSchema<TValue extends Value.AnyValue = Value<symbol>> extends AbstractSchema<'symbol', TValue> {
  map (iterable: Iterable<[string | number | boolean | symbol, symbol]> | Record<string, symbol>): this
}
