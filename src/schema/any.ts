import { Value } from "../lib/value";
import { BaseSchema } from ".";

export interface AnySchema<TValue extends Value.AnyValue = Value<any>> extends BaseSchema<'any', TValue> {
  /* This is an empty interface */
}
