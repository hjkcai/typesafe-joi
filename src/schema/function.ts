import { Value } from "../lib/value";
import { Reference } from "../lib/joi";
import { BaseSchema } from ".";

export interface FunctionSchema<TValue extends Value.AnyValue = Value<Function>> extends BaseSchema<'boolean', TValue> {
  /**
   * Specifies the arity of the function where:
   * @param n - the arity expected.
   */
  arity (n: number): this

  /**
   * Specifies the minimal arity of the function where:
   * @param n - the minimal arity expected.
   */
  minArity (n: number): this

  /**
   * Specifies the minimal arity of the function where:
   * @param n - the minimal arity expected.
   */
  maxArity (n: number): this

  /**
   * Requires the function to be a Joi reference.
   */
  ref (): FunctionSchema<Value.replace<TValue, Reference>>
}
