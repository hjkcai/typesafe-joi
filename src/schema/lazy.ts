import { Value } from "../lib/value";
import { BaseSchema } from ".";

export interface LazySchema<TValue extends Value.AnyValue = Value<any>> extends BaseSchema<'lazy', TValue> {
  /* This is an empty interface */
}
