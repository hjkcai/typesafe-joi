import { Value } from '../lib/value'
import { Schema } from '../lib/schema'
import { AnyType } from '../lib/util';
import * as JoiLib from "../lib/joi";

import { AlternativesSchema } from './alternative';
import { AnySchema } from './any';
import { ArraySchema } from './array';
import { BinarySchema } from './binary';
import { BooleanSchema } from './boolean';
import { DateSchema } from './date';
import { FunctionSchema } from './function';
import { LazySchema } from './lazy';
import { NumberSchema } from './number';
import { ObjectSchema } from './object';
import { StringSchema } from './string';
import { SymbolSchema } from './symbol';

/** The collection of all available schemas */
export interface SchemaCollection<TValue extends Value.AnyValue> {
  alternatives: AlternativesSchema<TValue>,
  any: AnySchema<TValue>,
  array: ArraySchema<TValue>,
  binary: BinarySchema<TValue>,
  boolean: BooleanSchema<TValue>,
  date: DateSchema<TValue>,
  function: FunctionSchema<TValue>,
  lazy: LazySchema<TValue>,
  number: NumberSchema<TValue>,
  object: ObjectSchema<TValue>,
  string: StringSchema<TValue>,
  symbol: SymbolSchema<TValue>
}

/**
 * Assemble a schema type (e.g. `string`, `any`) and a value type into a schema.
 * This is basically a lookup in `SchemaCollection`.
 */
export type SchemaType<TSchemaType extends string, TValue extends Value.AnyValue> = (
  TSchemaType extends keyof SchemaCollection<any>
  ? SchemaCollection<TValue>[TSchemaType]
  : never
)

/**
 * `Schema` with a `schemaType` tag.
 *
 * @description
 * There is no functions defined in `AbstractSchema` because these functions may make trouble to type matching.
 * `AbstractSchema` is being used to let TypeScript know what is the kind of a `Schema`.
 */
export interface AbstractSchema<TSchemaType extends string, TValue extends Value.AnyValue> extends Schema<TValue> {
  schemaType: TSchemaType
}

/**
 * The schema type with all the instance methods of `AnySchema` of joi.
 *
 * @description
 * Notice: do not use `BaseSchema` as the constraint pf a type variable.
 * The functions of `BaseSchema` will make all specific schema types fail.
 */
export interface BaseSchema<TSchemaType extends string, TValue extends Value.AnyValue> extends AbstractSchema<TSchemaType, TValue>, JoiLib.JoiObject {
  /** Validates a value using the schema and options. */
  validate (value: any, options?: JoiLib.ValidationOptions): JoiLib.ValidationResult<Value.literal<TValue>>
  validate (value: any, callback: JoiLib.ValidationCallback<Value.literal<TValue>>): void
  validate (value: any, options: JoiLib.ValidationOptions, callback: JoiLib.ValidationCallback<Value.literal<TValue>>): void

  /** Whitelists a value */
  allow<T extends AnyType[]> (values: T): SchemaType<TSchemaType, Value.allow<TValue, T[number]>>
  allow<T extends AnyType[]> (...values: T): SchemaType<TSchemaType, Value.allow<TValue, T[number]>>

  /** Adds the provided values into the allowed whitelist and marks them as the only valid values allowed. */
  valid<T extends AnyType[]> (values: T): SchemaType<TSchemaType, Value.allowOnly<TValue, T[number]>>
  valid<T extends AnyType[]> (...values: T): SchemaType<TSchemaType, Value.allowOnly<TValue, T[number]>>

  /** Adds the provided values into the allowed whitelist and marks them as the only valid values allowed. */
  only<T extends AnyType[]> (values: T): SchemaType<TSchemaType, Value.allowOnly<TValue, T[number]>>
  only<T extends AnyType[]> (...values: T): SchemaType<TSchemaType, Value.allowOnly<TValue, T[number]>>

  /** Adds the provided values into the allowed whitelist and marks them as the only valid values allowed. */
  equal<T extends AnyType[]> (values: T): SchemaType<TSchemaType, Value.allowOnly<TValue, T[number]>>
  equal<T extends AnyType[]> (...values: T): SchemaType<TSchemaType, Value.allowOnly<TValue, T[number]>>

  /** Blacklists a value */
  invalid<T extends AnyType[]> (values: T): SchemaType<TSchemaType, Value.disallow<TValue, T[number]>>
  invalid<T extends AnyType[]> (...values: T): SchemaType<TSchemaType, Value.disallow<TValue, T[number]>>

  /** Blacklists a value */
  disallow<T extends AnyType[]> (values: T): SchemaType<TSchemaType, Value.disallow<TValue, T[number]>>
  disallow<T extends AnyType[]> (...values: T): SchemaType<TSchemaType, Value.disallow<TValue, T[number]>>

  /** Blacklists a value */
  not<T extends AnyType[]> (values: T): SchemaType<TSchemaType, Value.disallow<TValue, T[number]>>
  not<T extends AnyType[]> (...values: T): SchemaType<TSchemaType, Value.disallow<TValue, T[number]>>

  /**
   * By default, some Joi methods to function properly need to rely on the Joi instance they are attached to because
   * they use `this` internally.
   * So `Joi.string()` works but if you extract the function from it and call `string()` it won't.
   * `bind()` creates a new Joi instance where all the functions relying on `this` are bound to the Joi instance.
   */
  bind(): this

  /** Returns a new type that is the result of adding the rules of one type to another. */
  concat<TSchema extends AbstractSchema<string, Value.AnyValue>> (schema: TSchema): Schema.concat<this, TSchema>

  /** Marks a key as required which will not allow undefined as value. All keys are optional by default. */
  required (): SchemaType<TSchemaType, Value.required<TValue>>

  /** Marks a key as required which will not allow undefined as value. All keys are optional by default. */
  exist (): SchemaType<TSchemaType, Value.required<TValue>>

  /** Marks a key as optional which will allow undefined as values. Used to annotate the schema for readability as all keys are optional by default. */
  optional (): SchemaType<TSchemaType, Value.optional<TValue>>

  /** Marks a key as forbidden which will not allow any value except undefined. Used to explicitly forbid keys. */
  forbidden (): SchemaType<TSchemaType, Value.EmptyValue>

  /** Marks a key to be removed from a resulting object or array after validation. Used to sanitize output. */
  strip (): SchemaType<TSchemaType, Value.EmptyValue>

  /** Annotates the key. */
  description (desc: string): this

  /** Annotates the key. */
  notes (notes: string | string[]): this

  /** Annotates the key. */
  tags (notes: string | string[]): this

  /** Attaches metadata to the key. */
  meta (meta: Record<any, any>): this

  /** Annotates the key with an example value, must be valid. */
  example (...value: any[]): this

  /** Annotates the key with an unit name. */
  unit (name: string): this

  /** Overrides the global validate() options for the current key and any sub-key. */
  options (options: JoiLib.ValidationOptions): this

  /** Sets the options.convert options to false which prevent type casting for the current key and any child keys. */
  strict (isStrict?: boolean): this

  /**
   * Sets a default value if the original value is undefined.
   * @param value - the value.
   *   value supports references.
   *   value may also be a function which returns the default value.
   *   If value is specified as a function that accepts a single parameter, that parameter will be a context
   *    object that can be used to derive the resulting value. This clones the object however, which incurs some
   *    overhead so if you don't need access to the context define your method so that it does not accept any
   *    parameters.
   *   Without any value, default has no effect, except for object that will then create nested defaults
   *    (applying inner defaults of that object).
   *
   * Note that if value is an object, any changes to the object after default() is called will change the
   *  reference and any future assignment.
   *
   * Additionally, when specifying a method you must either have a description property on your method or the
   *  second parameter is required.
   */
  default<TDefault> (value?: TDefault, description?: string): SchemaType<TSchemaType, Value.setDefault<TValue, TDefault>>

  /** Converts the type into an alternatives type where the conditions are merged into the type definition where. */
  when<T extends JoiLib.WhenIs> (ref: string | JoiLib.Reference, options: T): AlternativesSchema<Schema.valueType<Schema.when<this, T>>>
  when<T extends JoiLib.When> (ref: Schema.SchemaLike, options: T): AlternativesSchema<Schema.valueType<Schema.when<this, T>>>

  /** Overrides the key name in error messages. */
  label (name: string): this

  /** Outputs the original untouched value instead of the casted value. */
  raw (isRaw?: boolean): this

  /**
   * Considers anything that matches the schema to be empty (undefined).
   * @param schema - any object or joi schema to match. An undefined schema unsets that rule.
   */
  empty (schema?: Schema.SchemaLike): this

  /**
   * Overrides the default joi error with a custom error if the rule fails where:
   * @param err - can be:
   *   an instance of `Error` - the override error.
   *   a `function(errors)`, taking an array of errors as argument, where it must either:
   *    return a `string` - substitutes the error message with this text
   *    return a single ` object` or an `Array` of it, where:
   *     `type` - optional parameter providing the type of the error (eg. `number.min`).
   *     `message` - optional parameter if `template` is provided, containing the text of the error.
   *     `template` - optional parameter if `message` is provided, containing a template string, using the same format as usual joi language errors.
   *     `context` - optional parameter, to provide context to your error if you are using the `template`.
   *    return an `Error` - same as when you directly provide an `Error`, but you can customize the error message based on the errors.
   *
   * Note that if you provide an `Error`, it will be returned as-is, unmodified and undecorated with any of the
   * normal joi error properties. If validation fails and another error is found before the error
   * override, that error will be returned and the override will be ignored (unless the `abortEarly`
   * option has been set to `false`).
   */
  error (err: Error | JoiLib.ValidationErrorFunction, options?: JoiLib.ErrorOptions): this

  /** Returns a plain object representing the schema's rules and properties. */
  describe (): JoiLib.Description
}

export {
  AlternativesSchema,
  AnySchema,
  ArraySchema,
  BinarySchema,
  BooleanSchema,
  DateSchema,
  FunctionSchema,
  LazySchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
  SymbolSchema
}
