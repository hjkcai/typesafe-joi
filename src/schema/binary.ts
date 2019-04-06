import { OptionalSchema, RequiredSchema } from ".";
import { AbstractSchema } from "./base";
import { OPTIONAL_SCHEMA_TYPE, REQUIRED_SCHEMA_TYPE } from "../lib/symbols";

export interface BinarySchema<Value = Buffer | undefined> extends OptionalSchema, BinarySchemaType<BinarySchema, Value> {}
export interface RequiredBinarySchema<Value = Buffer> extends RequiredSchema, BinarySchemaType<RequiredBinarySchema, Value> {}

export interface BinarySchemaType<Schema extends AbstractSchema, Value> extends AbstractSchema<Schema, Value> {
  schemaType: 'binary'
  [OPTIONAL_SCHEMA_TYPE]: BinarySchema
  [REQUIRED_SCHEMA_TYPE]: RequiredBinarySchema

  /**
   * Sets the string encoding format if a string input is converted to a buffer.
   */
  encoding (encoding: string): this

  /**
   * Specifies the minimum length of the buffer.
   */
  min (limit: number): this

  /**
   * Specifies the maximum length of the buffer.
   */
  max (limit: number): this

  /**
   * Specifies the exact length of the buffer:
   */
  length (limit: number): this
}
