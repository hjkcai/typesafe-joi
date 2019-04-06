import { OptionalSchema, RequiredSchema, SchemaType } from ".";
import { AbstractSchema } from "./base";
import { Reference } from "../lib/joi";

export interface FunctionSchema<Value = Function | undefined> extends OptionalSchema, FunctionSchemaType<FunctionSchema, Value> {}
export interface RequiredFunctionSchema<Value = Function> extends RequiredSchema, FunctionSchemaType<RequiredFunctionSchema, Value> {}

export interface FunctionSchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'function'

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
  ref (): SchemaType<Schema, Reference>
}
