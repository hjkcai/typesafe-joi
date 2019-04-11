import { Value } from "../lib/value";
import { AbstractSchema } from "./base";

export interface AnySchema<TValue extends Value.AnyValue = Value<any>> extends AbstractSchema<'any', TValue> {
  /* This is an empty interface */
}
