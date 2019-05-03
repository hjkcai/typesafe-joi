import { Value } from "../lib/value";
import { Reference } from "../lib/joi";
import { BaseSchema } from ".";

export interface NumberSchema<TValue extends Value.AnyValue = Value<number>> extends BaseSchema<'number', TValue> {
  /**
   * Specifies the minimum value.
   * It can also be a reference to another field.
   */
  min (limit: number | Reference): this

  /**
   * Specifies the maximum value.
   * It can also be a reference to another field.
   */
  max (limit: number | Reference): this

  /**
   * Specifies that the value must be greater than limit.
   * It can also be a reference to another field.
   */
  greater (limit: number | Reference): this

  /**
   * Specifies that the value must be less than limit.
   * It can also be a reference to another field.
   */
  less (limit: number | Reference): this

  /**
   * Requires the number to be an integer (no floating point).
   */
  integer (): this

  /**
   * Specifies the maximum number of decimal places where:
   * @param limit - the maximum number of decimal places allowed.
   */
  precision (limit: number): this

  /**
   * Specifies that the value must be a multiple of base.
   */
  multiple (base: number): this

  /**
   * Requires the number to be positive.
   */
  positive (): this

  /**
   * Requires the number to be negative.
   */
  negative (): this

  /**
   * Requires the number to be a TCP port, so between 0 and 65535.
   */
  port (): this

  /**
   * Allows the number to be outside of JavaScript's safety range (Number.MIN_SAFE_INTEGER & Number.MAX_SAFE_INTEGER).
   */
  unsafe (enabled: boolean): this;
}
