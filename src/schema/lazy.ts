import { Value } from "../lib/value";
import { AbstractSchema } from ".";

export interface LazySchema<TValue extends Value.AnyValue = Value<any>> extends AbstractSchema<'lazy', TValue> {
  /* This is an empty interface */
}
