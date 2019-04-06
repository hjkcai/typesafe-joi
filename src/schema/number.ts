import { OptionalSchema, RequiredSchema } from ".";
import { AbstractSchema } from "./base";
import { Reference } from "../lib/joi";
import { OPTIONAL_SCHEMA_TYPE, REQUIRED_SCHEMA_TYPE } from "../lib/symbols";

export interface NumberSchema<Value = number | undefined> extends OptionalSchema, NumberSchemaType<NumberSchema, Value> {}
export interface RequiredNumberSchema<Value = number> extends RequiredSchema, NumberSchemaType<RequiredNumberSchema, Value> {}

export interface NumberSchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'number'
  [OPTIONAL_SCHEMA_TYPE]: NumberSchema
  [REQUIRED_SCHEMA_TYPE]: RequiredNumberSchema

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
