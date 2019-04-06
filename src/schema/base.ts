import { JoiObject, ValidationOptions, ValidationResult, ValidationError, Reference, ValidationErrorFunction, ErrorOptions, Description } from "../lib/joi";
import { VALUE } from "../lib/symbols";
import { AnyType, ExcludeUndefined } from "../lib/util";
import { SchemaType, SchemaValue, RequiredSchemaType, OptionalSchemaType, SchemaLike } from ".";
import { WhenIs, AlternativesSchema, When } from "./alternative";

export interface AbstractSchema<Schema extends AbstractSchema<any, any> = any, Value = any> extends JoiObject {
  schemaType: string
  [VALUE]: Value

  /** Validates a value using the schema and options. */
  validate (value: any, options?: ValidationOptions): ValidationResult<Value>
  validate (value: any, callback: (err: ValidationError, value: Value) => void): void
  validate (value: any, options: ValidationOptions, callback: (err: ValidationError, value: Value) => void): void

  /** Whitelists a value */
  allow<T extends AnyType[]> (values: T): SchemaType<Schema, Value | T[number]>
  allow<T extends AnyType[]> (...values: T): SchemaType<Schema, Value | T[number]>

  /** Adds the provided values into the allowed whitelist and marks them as the only valid values allowed. */
  valid<T extends AnyType[]> (values: T): SchemaType<Schema, T[number]>
  valid<T extends AnyType[]> (...values: T): SchemaType<Schema, T[number]>
  only<T extends AnyType[]> (values: T): SchemaType<Schema, T[number]>
  only<T extends AnyType[]> (...values: T): SchemaType<Schema, T[number]>
  equal<T extends AnyType[]> (values: T): SchemaType<Schema, T[number]>
  equal<T extends AnyType[]> (...values: T): SchemaType<Schema, T[number]>

  /** Blacklists a value */
  invalid<T extends AnyType[]> (values: T): SchemaType<Schema, T[number] extends never ? Value : Exclude<Value, T[number]>>
  invalid<T extends AnyType[]> (...values: T): SchemaType<Schema, T[number] extends never ? Value : Exclude<Value, T[number]>>
  disallow<T extends AnyType[]> (values: T): SchemaType<Schema, T[number] extends never ? Value : Exclude<Value, T[number]>>
  disallow<T extends AnyType[]> (...values: T): SchemaType<Schema, T[number] extends never ? Value : Exclude<Value, T[number]>>
  not<T extends AnyType[]> (values: T): SchemaType<Schema, T[number] extends never ? Value : Exclude<Value, T[number]>>
  not<T extends AnyType[]> (...values: T): SchemaType<Schema, T[number] extends never ? Value : Exclude<Value, T[number]>>

  /** Returns a new type that is the result of adding the rules of one type to another. */
  concat<T extends AbstractSchema> (schema: T): SchemaType<Schema, Value | SchemaValue<T>>

  /** Marks a key as required which will not allow undefined as value. All keys are optional by default. */
  required (): RequiredSchemaType<Schema, ExcludeUndefined<Value>>
  exist (): RequiredSchemaType<Schema, ExcludeUndefined<Value>>

  /** Marks a key as optional which will allow undefined as values. Used to annotate the schema for readability as all keys are optional by default. */
  optional (): OptionalSchemaType<Schema, Value | undefined>

  /** Marks a key as forbidden which will not allow any value except undefined. Used to explicitly forbid keys. */
  forbidden (): SchemaType<Schema, never>

  /**
   * Marks a key to be removed from a resulting object or array after validation. Used to sanitize output.
   */
  strip (): this

  /**
   * Annotates the key
   */
  description (desc: string): this

  /**
   * Annotates the key
   */
  notes (notes: string | string[]): this

  /**
   * Annotates the key
   */
  tags (notes: string | string[]): this

  /**
   * Attaches metadata to the key.
   */
  meta (meta: object): this

  /**
   * Annotates the key with an example value, must be valid.
   */
  example (value: any): this

  /**
   * Annotates the key with an unit name.
   */
  unit (name: string): this

  /**
   * Overrides the global validate() options for the current key and any sub-key.
   */
  options (options: ValidationOptions): this

  /**
   * Sets the options.convert options to false which prevent type casting for the current key and any child keys.
   */
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
  default (value?: any, description?: string): this

  /**
   * Returns a new type that is the result of adding the rules of one type to another.
   */
  concat (schema: this): this

  /**
   * Converts the type into an alternatives type where the conditions are merged into the type definition where:
   */
  when<T extends WhenIs> (ref: string | Reference, options: T): AlternativesSchema<T extends When<infer Then, infer Otherwise> ? SchemaValue<Then | Otherwise> : never>
  when<T extends When> (ref: AbstractSchema, options: T): AlternativesSchema<T extends When<infer Then, infer Otherwise> ? SchemaValue<Then | Otherwise> : never>

  /**
   * Overrides the key name in error messages.
   */
  label (name: string): this

  /**
   * Outputs the original untouched value instead of the casted value.
   */
  raw (isRaw?: boolean): this

  /**
   * Considers anything that matches the schema to be empty (undefined).
   * @param schema - any object or joi schema to match. An undefined schema unsets that rule.
   */
  empty (schema?: SchemaLike): this

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
  error (err: Error | ValidationErrorFunction, options?: ErrorOptions): this

  /**
   * Returns a plain object representing the schema's rules and properties
   */
  describe (): Description
}
