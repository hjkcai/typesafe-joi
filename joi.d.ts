
// ----------------------------------------------------------------------------
// General schema definition
// ----------------------------------------------------------------------------

/**
 * Joi normal schema and literal schema
 * @todo support alternative literal schema
 */
export type SchemaLike = AbstractSchema | SchemaMap | string | number | boolean | null

/** Object literal schema */
export type SchemaMap = { [key: string]: SchemaLike }

/** Possible values of `schemaType` */
export type SchemaTypes = 'any' | 'alternatives' | 'array' | 'boolean' | 'binary' | 'date' | 'function' | 'lazy' | 'number' | 'object' | 'string'

/** All possible schemas */
export type Schema<Value = any> = (
  AnySchema<Value>
  | ArraySchema<Value>
  | SparseArraySchema<Value>
  | BooleanSchema<Value>
  | BinarySchema<Value>
  | DateSchema<Value>
  | FunctionSchema<Value>
  | NumberSchema<Value>
  | ObjectSchema<Value>
  | StringSchema<Value>
  | SymbolSchema<Value>
  | AlternativesSchema<Value>
  | LazySchema<Value>

  | RequiredAnySchema<Value>
  | RequiredArraySchema<Value>
  | RequiredSparseArraySchema<Value>
  | RequiredBooleanSchema<Value>
  | RequiredBinarySchema<Value>
  | RequiredDateSchema<Value>
  | RequiredFunctionSchema<Value>
  | RequiredNumberSchema<Value>
  | RequiredObjectSchema<Value>
  | RequiredStringSchema<Value>
  | RequiredSymbolSchema<Value>
  | RequiredAlternativesSchema<Value>
  | RequiredLazySchema<Value>
)

/**
 * Assemble `Schema` and `Value` into `Schema<Value>`
 * @description This is useful in the interface `SchemaMethods` (but a little bit tedious)
 */
type SchemaType<Schema extends AbstractSchema, Value> = (
    Schema extends AnySchema ? AnySchema<Value>
  : Schema extends ArraySchema ? ArraySchema<Value>
  : Schema extends SparseArraySchema ? SparseArraySchema<Value>
  : Schema extends BooleanSchema ? BooleanSchema<Value>
  : Schema extends BinarySchema ? BinarySchema<Value>
  : Schema extends DateSchema ? DateSchema<Value>
  : Schema extends FunctionSchema ? FunctionSchema<Value>
  : Schema extends NumberSchema ? NumberSchema<Value>
  : Schema extends ObjectSchema ? ObjectSchema<Value>
  : Schema extends StringSchema ? StringSchema<Value>
  : Schema extends SymbolSchema ? SymbolSchema<Value>
  : Schema extends AlternativesSchema ? AlternativesSchema<Value>
  : Schema extends LazySchema ? LazySchema<Value>

  : Schema extends RequiredAnySchema ? RequiredAnySchema<Value>
  : Schema extends RequiredArraySchema ? RequiredArraySchema<Value>
  : Schema extends RequiredSparseArraySchema ? RequiredSparseArraySchema<Value>
  : Schema extends RequiredBooleanSchema ? RequiredBooleanSchema<Value>
  : Schema extends RequiredBinarySchema ? RequiredBinarySchema<Value>
  : Schema extends RequiredDateSchema ? RequiredDateSchema<Value>
  : Schema extends RequiredFunctionSchema ? RequiredFunctionSchema<Value>
  : Schema extends RequiredNumberSchema ? RequiredNumberSchema<Value>
  : Schema extends RequiredObjectSchema ? RequiredObjectSchema<Value>
  : Schema extends RequiredStringSchema ? RequiredStringSchema<Value>
  : Schema extends RequiredSymbolSchema ? RequiredSymbolSchema<Value>
  : Schema extends RequiredAlternativesSchema ? RequiredAlternativesSchema<Value>
  : Schema extends RequiredLazySchema ? RequiredLazySchema<Value>
  : never
)

/** Change `Schema` to `RequiredSchema` */
type RequiredSchemaType<Schema extends AbstractSchema, Value> = (
    Schema extends AnySchema ? RequiredAnySchema<Value>
  : Schema extends ArraySchema ? RequiredArraySchema<Value>
  : Schema extends SparseArraySchema ? RequiredSparseArraySchema<Value>
  : Schema extends BooleanSchema ? RequiredBooleanSchema<Value>
  : Schema extends BinarySchema ? RequiredBinarySchema<Value>
  : Schema extends DateSchema ? RequiredDateSchema<Value>
  : Schema extends FunctionSchema ? RequiredFunctionSchema<Value>
  : Schema extends NumberSchema ? RequiredNumberSchema<Value>
  : Schema extends ObjectSchema ? RequiredObjectSchema<Value>
  : Schema extends StringSchema ? RequiredStringSchema<Value>
  : Schema extends SymbolSchema ? RequiredSymbolSchema<Value>
  : Schema extends AlternativesSchema ? RequiredAlternativesSchema<Value>
  : Schema extends LazySchema ? RequiredLazySchema<Value>
  : Schema
)

/** Change `RequiredSchema` to `Schema` */
type OptionalSchemaType<Schema extends AbstractSchema, Value> = (
    Schema extends RequiredAnySchema ? AnySchema<Value>
  : Schema extends RequiredArraySchema ? ArraySchema<Value>
  : Schema extends RequiredSparseArraySchema ? SparseArraySchema<Value>
  : Schema extends RequiredBooleanSchema ? BooleanSchema<Value>
  : Schema extends RequiredBinarySchema ? BinarySchema<Value>
  : Schema extends RequiredDateSchema ? DateSchema<Value>
  : Schema extends RequiredFunctionSchema ? FunctionSchema<Value>
  : Schema extends RequiredNumberSchema ? NumberSchema<Value>
  : Schema extends RequiredObjectSchema ? ObjectSchema<Value>
  : Schema extends RequiredStringSchema ? StringSchema<Value>
  : Schema extends RequiredSymbolSchema ? SymbolSchema<Value>
  : Schema extends RequiredAlternativesSchema ? AlternativesSchema<Value>
  : Schema extends RequiredLazySchema ? LazySchema<Value>
  : Schema
)

// ----------------------------------------------------------------------------
// Schema value types
// ----------------------------------------------------------------------------

/**
 * The literal type of a `SchemaLike`
 * @example SchemaValue<StringSchema<T>> = T | undefined
 * @example SchemaValue<RequiredStringSchema<T>> = T
 * @example SchemaValue<string | number | boolean | null> = string | number | boolean | null | undefined
 * @example SchemaValue<{ a: StringSchema<A> }> = { a?: A } | undefined
 */
export type SchemaValue<Schema extends SchemaLike> = (
  Schema extends AbstractSchema
    ? Schema extends RequiredSchema
      ? Schema[typeof VALUE]
      : Schema[typeof VALUE] | undefined        // Non-required types will be unioned with a `undefined` type

    : Schema extends SchemaMap                  // Literal schemas will always be optional
      ? SchemaMapValue<Schema> | undefined
      : Schema | undefined
)

/**
 * Build the value type of a `SchemaMap`
 * @description If a key is not `RequiredXXXSchema`, it will be marked as optional.
 * @example SchemaMapValue<{ a: StringSchema, b: RequiredStringSchema }> = { a?: string, b: string }
 */
type SchemaMapValue<Map extends SchemaMap> = (
  SchemaMapLiteral<Filter<Map, RequiredSchema>>
  & Partial<SchemaMapLiteral<FilterOut<Map, RequiredSchema>>>
)

/** Convert every entry in a `SchemaMap` into literal */
type SchemaMapLiteral<Map /* extends SchemaMap */> = {     // `Map` cannot extends `SchemaMap` because `Filter` type does not return `SchemaMap`
  [key in keyof Map]: Map[key] extends SchemaLike ? SchemaValue<Map[key]> : never
}

/** Extract the value types of multiple `SchemaLike`s */
type SchemaValues<Schemas extends SchemaLike[]> = SchemaValue<Schemas[number]>

// ----------------------------------------------------------------------------
// Schema and schema methods definition
// ----------------------------------------------------------------------------

// Common schema methods ------------------------------------------------------

/**
 * DO NOT USE!
 * This is not a real joi schema property but is required for TypeScript to work
 */
declare const VALUE: unique symbol

/**
 * DO NOT USE!
 * This is not a real joi schema property but is required for TypeScript to work
 */
declare const IS_REQUIRED: unique symbol

interface RequiredSchema {
  [IS_REQUIRED]: true
}

interface OptionalSchema {
  [IS_REQUIRED]: false
}

interface AbstractSchema<Schema extends AbstractSchema = any, Value = any> extends JoiObject {
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
  required (): RequiredSchemaType<Schema, Value>
  exist (): RequiredSchemaType<Schema, Value>

  /** Marks a key as optional which will allow undefined as values. Used to annotate the schema for readability as all keys are optional by default. */
  optional (): OptionalSchemaType<Schema, Value>

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
  error (err: Error | ValidationErrorFunction): this

  /**
   * Returns a plain object representing the schema's rules and properties
   */
  describe (): Description
}

// AnySchema ------------------------------------------------------------------

export interface AnySchema<Value = any> extends OptionalSchema, AnySchemaType<AnySchema, Value> {}
export interface RequiredAnySchema<Value = any> extends RequiredSchema, AnySchemaType<RequiredAnySchema, Value> {}
interface AnySchemaType<Schema extends AbstractSchema = any, Value = any> extends AbstractSchema<Schema, Value> {
  schemaType: 'any'
}

// ArraySchema ----------------------------------------------------------------

/**
 * DO NOT USE!
 * This is not a real joi schema property but is required for TypeScript to work
 */
declare const IS_SPARSE: unique symbol

interface SparseSchema {
  [IS_SPARSE]: true
}

interface NonSparseSchema {
  [IS_SPARSE]: false
}

export interface ArraySchema<Value = never[]>
  extends OptionalSchema, NonSparseSchema, ArraySchemaType<ArraySchema, Value> {}

export interface RequiredArraySchema<Value = never[]>
  extends RequiredSchema, NonSparseSchema, ArraySchemaType<RequiredArraySchema, Value> {}

export interface SparseArraySchema<Value = never[]>
  extends OptionalSchema, SparseSchema, SparseArraySchemaType<SparseArraySchema, Value> {}

export interface RequiredSparseArraySchema<Value = never[]>
  extends RequiredSchema, SparseSchema, SparseArraySchemaType<RequiredSparseArraySchema, Value> {}

interface BaseArraySchemaType<Schema extends AbstractSchema = any, Value = never[]> extends AbstractSchema<Schema, Value> {
  schemaType: 'array'

  /**
   * Allow single values to be checked against rules as if it were provided as an array.
   * enabled can be used with a falsy value to go back to the default behavior.
   */
  single (enabled?: any): this

  /**
   * Specifies the minimum number of items in the array.
   */
  min (limit: number): this

  /**
   * Specifies the maximum number of items in the array.
   */
  max (limit: number): this

  /**
   * Specifies the exact number of items in the array.
   */
  length (limit: number | Reference): this

  /**
   * Requires the array values to be unique.
   * Be aware that a deep equality is performed on elements of the array having a type of object,
   * a performance penalty is to be expected for this kind of operation.
   */
  unique (): this
  unique (comparator: string): this
  unique (comparator: (a: ArrayItemType<Value>, b: ArrayItemType<Value>) => boolean): this
}

interface ArraySchemaType<Schema extends AbstractSchema = any, Value = never[]> extends BaseArraySchemaType<Schema, Value> {
  /**
   * List the types allowed for the array values.
   * type can be an array of values, or multiple values can be passed as individual arguments.
   * If a given type is .required() then there must be a matching item in the array.
   * If a type is .forbidden() then it cannot appear in the array.
   * Required items can be added multiple times to signify that multiple items must be found.
   * Errors will contain the number of items that didn't match.
   * Any unmatched item having a label will be mentioned explicitly.
   *
   * @param type - a joi schema object to validate each array item against.
   */
  items<T extends SchemaLike[]> (types: T): SchemaType<Schema, MergeArray<Value, ExcludeUndefined<SchemaValues<T>>>>
  items<T extends SchemaLike[]> (...types: T): SchemaType<Schema, MergeArray<Value, ExcludeUndefined<SchemaValues<T>>>>

  /**
   * Lists the types in sequence order for the array values where:
   * @param type - a joi schema object to validate against each array item in sequence order. type can be an array of values, or multiple values can be passed as individual arguments.
   * If a given type is .required() then there must be a matching item with the same index position in the array.
   * Errors will contain the number of items that didn't match.
   * Any unmatched item having a label will be mentioned explicitly.
   */
  ordered<T extends SchemaLike[]> (types: T): SchemaType<Schema, MergeArray<Value, ExcludeUndefined<SchemaValues<T>>>>
  ordered<T extends SchemaLike[]> (...types: T): SchemaType<Schema, MergeArray<Value, ExcludeUndefined<SchemaValues<T>>>>

  /**
   * Allow this array to be sparse.
   */
  sparse (enabled: false): this
  sparse (enabled: true): (
    this extends RequiredSchema
      ? RequiredSparseArraySchema<MergeArray<Value, undefined>>
      : SparseArraySchema<MergeArray<Value, undefined>>
  )
}

interface SparseArraySchemaType<Schema extends AbstractSchema = any, Value = never[]> extends BaseArraySchemaType<Schema, Value> {
  /**
   * List the types allowed for the array values.
   * type can be an array of values, or multiple values can be passed as individual arguments.
   * If a given type is .required() then there must be a matching item in the array.
   * If a type is .forbidden() then it cannot appear in the array.
   * Required items can be added multiple times to signify that multiple items must be found.
   * Errors will contain the number of items that didn't match.
   * Any unmatched item having a label will be mentioned explicitly.
   *
   * @param type - a joi schema object to validate each array item against.
   */
  items<T extends SchemaLike[]> (types: T): SchemaType<Schema, MergeArray<Value, SchemaValues<T> | undefined>>
  items<T extends SchemaLike[]> (...types: T): SchemaType<Schema, MergeArray<Value, SchemaValues<T> | undefined>>

  /**
   * Lists the types in sequence order for the array values where:
   * @param type - a joi schema object to validate against each array item in sequence order. type can be an array of values, or multiple values can be passed as individual arguments.
   * If a given type is .required() then there must be a matching item with the same index position in the array.
   * Errors will contain the number of items that didn't match.
   * Any unmatched item having a label will be mentioned explicitly.
   */
  ordered<T extends SchemaLike[]> (types: T): SchemaType<Schema, MergeArray<Value, SchemaValues<T> | undefined>>
  ordered<T extends SchemaLike[]> (...types: T): SchemaType<Schema, MergeArray<Value, SchemaValues<T> | undefined>>

  /**
   * Allow this array to be sparse.
   */
  sparse (enabled: true): this
  sparse (enabled: false): (
    this extends RequiredSchema
      ? RequiredArraySchema<ExcludeFromArray<Value, undefined>>
      : ArraySchema<ExcludeFromArray<Value, undefined>>
  )
}

// BooleanSchema --------------------------------------------------------------

export interface BooleanSchema<Value = boolean> extends OptionalSchema, BooleanSchemaType<BooleanSchema, Value> {}
export interface RequiredBooleanSchema<Value = boolean> extends RequiredSchema, BooleanSchemaType<RequiredBooleanSchema, Value> {}
interface BooleanSchemaType<Schema extends AbstractSchema = any, Value = boolean> extends AbstractSchema<Schema, Value> {
  schemaType: 'boolean'

  /**
   * Allows for additional values to be considered valid booleans by converting them to true during validation.
   * Accepts a value or an array of values. String comparisons are by default case insensitive,
   * see boolean.insensitive() to change this behavior.
   */
  truthy (...values: Array<string | number | string[] | number[]>): this

  /**
   * Allows for additional values to be considered valid booleans by converting them to false during validation.
   * Accepts a value or an array of values. String comparisons are by default case insensitive,
   * see boolean.insensitive() to change this behavior.
   */
  falsy (...values: Array<string | number | string[] | number[]>): this

  /**
   * Allows the values provided to truthy and falsy as well as the "true" and "false" default conversion
   * (when not in strict() mode) to be matched in a case insensitive manner.
   */
  insensitive (enabled?: boolean): this
}

// BinarySchema ---------------------------------------------------------------

export interface BinarySchema<Value = Buffer> extends OptionalSchema, BinarySchemaType<BinarySchema, Value> {}
export interface RequiredBinarySchema<Value = Buffer> extends RequiredSchema, BinarySchemaType<RequiredBinarySchema, Value> {}
interface BinarySchemaType<Schema extends AbstractSchema = any, Value = Buffer> extends AbstractSchema<Schema, Value> {
  schemaType: 'binary'

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

// DateSchema -----------------------------------------------------------------

export interface DateSchema<Value = Date> extends OptionalSchema, DateSchemaType<DateSchema, Value> {}
export interface RequiredDateSchema<Value = Date> extends RequiredSchema, DateSchemaType<RequiredDateSchema, Value> {}
interface DateSchemaType<Schema extends AbstractSchema = any, Value = Date> extends AbstractSchema<Schema, Value> {
  schemaType: 'date'

  /**
   * Specifies that the value must be greater than date.
   * Notes: 'now' can be passed in lieu of date so as to always compare relatively to the current date,
   * allowing to explicitly ensure a date is either in the past or in the future.
   * It can also be a reference to another field.
   */
  greater (date: 'now' | Date | number | string | Reference): this

  /**
   * Specifies that the value must be less than date.
   * Notes: 'now' can be passed in lieu of date so as to always compare relatively to the current date,
   * allowing to explicitly ensure a date is either in the past or in the future.
   * It can also be a reference to another field.
   */
  less (date: 'now' | Date | number | string | Reference): this

  /**
   * Specifies the oldest date allowed.
   * Notes: 'now' can be passed in lieu of date so as to always compare relatively to the current date,
   * allowing to explicitly ensure a date is either in the past or in the future.
   * It can also be a reference to another field.
   */
  min (date: 'now' | Date | number | string | Reference): this

  /**
   * Specifies the latest date allowed.
   * Notes: 'now' can be passed in lieu of date so as to always compare relatively to the current date,
   * allowing to explicitly ensure a date is either in the past or in the future.
   * It can also be a reference to another field.
   */
  max (date: 'now' | Date | number | string | Reference): this

  /**
   * Specifies the allowed date format:
   * @param format - string or array of strings that follow the moment.js format.
   */
  format (format: string | string[]): this

  /**
   * Requires the string value to be in valid ISO 8601 date format.
   */
  iso (): this

  /**
   * Requires the value to be a timestamp interval from Unix Time.
   * @param type - the type of timestamp (allowed values are unix or javascript [default])
   */
  timestamp (type?: 'javascript' | 'unix'): this
}

// FunctionSchema -------------------------------------------------------------

export interface FunctionSchema<Value = never> extends OptionalSchema, FunctionSchemaType<FunctionSchema, Value> {}
export interface RequiredFunctionSchema<Value = never> extends RequiredSchema, FunctionSchemaType<RequiredFunctionSchema, Value> {}
interface FunctionSchemaType<Schema extends AbstractSchema = any, Value = never> extends AbstractSchema<Schema, Value> {
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

// NumberSchema ---------------------------------------------------------------

export interface NumberSchema<Value = number> extends OptionalSchema, NumberSchemaType<NumberSchema, Value> {}
export interface RequiredNumberSchema<Value = number> extends RequiredSchema, NumberSchemaType<RequiredNumberSchema, Value> {}
interface NumberSchemaType<Schema extends AbstractSchema = any, Value = number> extends AbstractSchema<Schema, Value> {
  schemaType: 'number'

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
}

// ObjectSchema ---------------------------------------------------------------

export interface ObjectSchema<Value = {}> extends OptionalSchema, ObjectSchemaType<ObjectSchema, Value> {}
export interface RequiredObjectSchema<Value = {}> extends RequiredSchema, ObjectSchemaType<RequiredObjectSchema, Value> {}
interface ObjectSchemaType<Schema extends AbstractSchema = any, Value = {}> extends AbstractSchema<Schema, Value> {
  schemaType: 'object'

  /**
   * Sets or extends the allowed object keys.
   */
  keys (schemaMap?: null): SchemaType<Schema, {}>
  keys<Map extends SchemaMap> (schemaMap: Map): SchemaType<Schema, MergeObject<Value, SchemaMapValue<Map>>>

  /**
   * Appends the allowed object keys. If schema is null, undefined, or {}, no changes will be applied.
   */
  append (schemaMap?: null): SchemaType<Schema, Value>
  append<Map extends SchemaMap> (schemaMap: Map): SchemaType<Schema, MergeObject<Value, SchemaMapValue<Map>>>

  /**
   * Requires the object to be an instance of a given constructor.
   *
   * @param constructor - the constructor function that the object must be an instance of.
   * @param name - an alternate name to use in validation errors. This is useful when the constructor function does not have a name.
   */
  type<T extends ConstructorOf<any>> (constructor: T, name?: string): SchemaType<Schema, MergeObject<Value, InstanceType<T>>>

  /**
   * Specifies the minimum number of keys in the object.
   */
  min (limit: number): this

  /**
   * Specifies the maximum number of keys in the object.
   */
  max (limit: number): this

  /**
   * Specifies the exact number of keys in the object.
   */
  length (limit: number): this

  /**
   * Specify validation rules for unknown keys matching a pattern.
   *
   * @param pattern - a pattern that can be either a regular expression or a joi schema that will be tested against the unknown key names
   * @param schema - the schema object matching keys must validate against
   */
  pattern (pattern: RegExp | SchemaLike, schema: SchemaLike): this

  /**
   * Defines an all-or-nothing relationship between keys where if one of the peers is present, all of them are required as well.
   * @param peers - the key names of which if one present, all are required. peers can be a single string value,
   * an array of string values, or each peer provided as an argument.
   */
  and (...peers: string[]): this
  and (peers: string[]): this

  /**
   * Defines a relationship between keys where not all peers can be present at the same time.
   * @param peers - the key names of which if one present, the others may not all be present.
   * peers can be a single string value, an array of string values, or each peer provided as an argument.
   */
  nand (...peers: string[]): this
  nand (peers: string[]): this

  /**
   * Defines a relationship between keys where one of the peers is required (and more than one is allowed).
   */
  or (...peers: string[]): this
  or (peers: string[]): this

  /**
   * Defines an exclusive relationship between a set of keys. one of them is required but not at the same time where:
   */
  xor (...peers: string[]): this
  xor (peers: string[]): this

  /**
   * Requires the presence of other keys whenever the specified key is present.
   */
  with (key: string, peers: string | string[]): this

  /**
   * Forbids the presence of other keys whenever the specified is present.
   */
  without (key: string, peers: string | string[]): this

  /**
   * Renames a key to another name (deletes the renamed key).
   */
  rename (from: string, to: string, options?: RenameOptions): this

  /**
   * Verifies an assertion where.
   */
  assert (ref: string | Reference, schema: SchemaLike, message?: string): this

  /**
   * Overrides the handling of unknown keys for the scope of the current object only (does not apply to children).
   */
  unknown (allow?: boolean): this

  /**
   * Sets the specified children to required.
   *
   * @param children - can be a single string value, an array of string values, or each child provided as an argument.
   *
   *   var schema = Joi.object().keys({ a: { b: Joi.number() }, c: { d: Joi.string() } });
   *   var requiredSchema = schema.requiredKeys('', 'a.b', 'c', 'c.d');
   *
   * Note that in this example '' means the current object, a is not required but b is, as well as c and d.
   */
  requiredKeys (children: string[]): this
  requiredKeys (...children: string[]): this

  /**
   * Sets the specified children to optional.
   *
   * @param children - can be a single string value, an array of string values, or each child provided as an argument.
   *
   * The behavior is exactly the same as requiredKeys.
   */
  optionalKeys (children: string[]): this
  optionalKeys (...children: string[]): this

  /**
   * Sets the specified children to forbidden.
   *
   * @param children - can be a single string value, an array of string values, or each child provided as an argument.
   *
   *   const schema = Joi.object().keys({ a: { b: Joi.number().required() }, c: { d: Joi.string().required() } });
   *   const optionalSchema = schema.forbiddenKeys('a.b', 'c.d');
   *
   * The behavior is exactly the same as requiredKeys.
   */
  forbiddenKeys (children: string[]): this
  forbiddenKeys (...children: string[]): this
}

// StringSchema ---------------------------------------------------------------

export interface StringSchema<Value = string> extends OptionalSchema, StringSchemaType<StringSchema, Value> {}
export interface RequiredStringSchema<Value = string> extends RequiredSchema, StringSchemaType<RequiredStringSchema, Value> {}
interface StringSchemaType<Schema extends AbstractSchema = any, Value = string> extends AbstractSchema<Schema, Value> {
  schemaType: 'string'

  /**
   * Allows the value to match any whitelist of blacklist item in a case insensitive comparison.
   */
  insensitive (): this

  /**
   * Specifies the minimum number string characters.
   * @param limit - the minimum number of string characters required. It can also be a reference to another field.
   * @param encoding - if specified, the string length is calculated in bytes using the provided encoding.
   */
  min (limit: number | Reference, encoding?: string): this

  /**
   * Specifies the maximum number of string characters.
   * @param limit - the maximum number of string characters allowed. It can also be a reference to another field.
   * @param encoding - if specified, the string length is calculated in bytes using the provided encoding.
   */
  max (limit: number | Reference, encoding?: string): this

  /**
   * Specifies whether the string.max() limit should be used as a truncation.
   * @param enabled - optional parameter defaulting to true which allows you to reset the behavior of truncate by providing a falsy value.
   */
  truncate (enabled?: boolean): this

  /**
   * Requires the string value to be in a unicode normalized form. If the validation convert option is on (enabled by default), the string will be normalized.
   * @param form - The unicode normalization form to use. Valid values: NFC [default], NFD, NFKC, NFKD
   */
  normalize (form?: 'NFC' | 'NFD' | 'NFKC' | 'NFKD'): this

  /**
   * Requires the string value to be a valid base64 string; does not check the decoded value.
   * @param options - optional settings: The unicode normalization options to use. Valid values: NFC [default], NFD, NFKC, NFKD
   */
  base64 (options?: Base64Options): this

  /**
   * Requires the number to be a credit card number (Using Lunh Algorithm).
   */
  creditCard (): this

  /**
   * Specifies the exact string length required
   * @param limit - the required string length. It can also be a reference to another field.
   * @param encoding - if specified, the string length is calculated in bytes using the provided encoding.
   */
  length (limit: number | Reference, encoding?: string): this

  /**
   * Defines a regular expression rule.
   * @param pattern - a regular expression object the string value must match against.
   * @param options - optional, can be:
   *   Name for patterns (useful with multiple patterns). Defaults to 'required'.
   *   An optional configuration object with the following supported properties:
   *     name - optional pattern name.
   *     invert - optional boolean flag. Defaults to false behavior. If specified as true, the provided pattern will be disallowed instead of required.
   */
  regex (pattern: RegExp, options?: string | StringRegexOptions): this

  /**
   * Replace characters matching the given pattern with the specified replacement string where:
   * @param pattern - a regular expression object to match against, or a string of which all occurrences will be replaced.
   * @param replacement - the string that will replace the pattern.
   */
  replace (pattern: RegExp | string, replacement: string): this

  /**
   * Requires the string value to only contain a-z, A-Z, and 0-9.
   */
  alphanum (): this

  /**
   * Requires the string value to only contain a-z, A-Z, 0-9, and underscore _.
   */
  token (): this

  /**
   * Requires the string value to be a valid email address.
   */
  email (options?: EmailOptions): this

  /**
   * Requires the string value to be a valid ip address.
   */
  ip (options?: IpOptions): this

  /**
   * Requires the string value to be a valid RFC 3986 URI.
   */
  uri (options?: UriOptions): this

  /**
   * Requires the string value to be a valid data URI string.
   */
  dataUri (options?: DataUriOptions): this

  /**
   * Requires the string value to be a valid GUID.
   */
  guid (options?: GuidOptions): this

  /**
   * Alias for `guid` -- Requires the string value to be a valid GUID
   */
  uuid (options?: GuidOptions): this

  /**
   * Requires the string value to be a valid hexadecimal string.
   */
  hex (options?: HexOptions): this

  /**
   * Requires the string value to be a valid hostname as per RFC1123.
   */
  hostname (): this

  /**
   * Requires the string value to be in valid ISO 8601 date format.
   */
  isoDate (): this

  /**
   * Requires the string value to be all lowercase. If the validation convert option is on (enabled by default), the string will be forced to lowercase.
   */
  lowercase (): this

  /**
   * Requires the string value to be all uppercase. If the validation convert option is on (enabled by default), the string will be forced to uppercase.
   */
  uppercase (): this

  /**
   * Requires the string value to contain no whitespace before or after. If the validation convert option is on (enabled by default), the string will be trimmed.
   */
  trim (): this
}

// AlternativeSchema ----------------------------------------------------------

export interface When<Then extends SchemaLike = never, Otherwise extends SchemaLike = never> {
  then?: Then,
  otherwise?: Otherwise
}

export interface WhenIs<Then extends SchemaLike = never, Otherwise extends SchemaLike = never> extends When<Then, Otherwise> {
  is: SchemaLike
}

export interface AlternativesSchema<Value = never> extends OptionalSchema, AlternativesSchemaType<AlternativesSchema, Value> {}
export interface RequiredAlternativesSchema<Value = never> extends RequiredSchema, AlternativesSchemaType<RequiredAlternativesSchema, Value> {}
interface AlternativesSchemaType<Schema extends AbstractSchema = any, Value = never> extends AbstractSchema<Schema, Value> {
  schemaType: 'alternatives'

  try<T extends SchemaLike[]> (...types: T): AlternativesSchema<Value | SchemaValues<T>>
}

// SymbolSchema ---------------------------------------------------------------

export interface SymbolSchema<Value = symbol> extends OptionalSchema, SymbolSchemaType<SymbolSchema, Value> {}
export interface RequiredSymbolSchema<Value = symbol> extends RequiredSchema, SymbolSchemaType<RequiredSymbolSchema, Value> {}
interface SymbolSchemaType<Schema extends AbstractSchema = any, Value = symbol> extends AbstractSchema<Schema, Value> {
  schemaType: 'symbol'

  map (iterable: Iterable<[string | number | boolean | symbol, symbol]> | { [key: string]: symbol }): this
}

// LazySchema -----------------------------------------------------------------

export interface LazySchema<Value = never> extends OptionalSchema, LazySchemaType<LazySchema, Value> {}
export interface RequiredLazySchema<Value = never> extends RequiredSchema, LazySchemaType<RequiredLazySchema, Value> {}
interface LazySchemaType<Schema extends AbstractSchema = any, Value = never> extends AbstractSchema<Schema, Value> {
  schemaType: 'lazy'
}

// ----------------------------------------------------------------------------
// General joi types
// ----------------------------------------------------------------------------

export type LanguageOptions = string | boolean | null | {
  [key: string]: LanguageOptions;
}

export type LanguageRootOptions = {
  root?: string;
  key?: string;
  messages?: { wrapArrays?: boolean; };
} & Partial<Record<SchemaTypes, LanguageOptions>> & { [key: string]: LanguageOptions; }

export interface ValidationOptions {
  /**
   * when true, stops validation on the first error, otherwise returns all the errors found. Defaults to true.
   */
  abortEarly?: boolean
  /**
   * when true, attempts to cast values to the required types (e.g. a string to a number). Defaults to true.
   */
  convert?: boolean
  /**
   * when true, allows object to contain unknown keys which are ignored. Defaults to false.
   */
  allowUnknown?: boolean
  /**
   * when true, ignores unknown keys with a function value. Defaults to false.
   */
  skipFunctions?: boolean
  /**
   * remove unknown elements from objects and arrays. Defaults to false
   * - when true, all unknown elements will be removed
   * - when an object:
   *      - objects - set to true to remove unknown keys from objects
   */
  stripUnknown?: boolean | { arrays?: boolean; objects?: boolean }
  /**
   * overrides individual error messages. Defaults to no override ({}).
   */
  language?: LanguageRootOptions
  /**
   * sets the default presence requirements. Must be 'optional'.
   */
  presence?: 'optional'
  /**
   * provides an external data set to be used in references
   */
  context?: Context
  /**
   * when true, do not apply default values. Defaults to false.
   */
  noDefaults?: boolean
}

export interface RenameOptions {
  /**
   * if true, does not delete the old key name, keeping both the new and old keys in place. Defaults to false.
   */
  alias?: boolean
  /**
   * if true, allows renaming multiple keys to the same destination where the last rename wins. Defaults to false.
   */
  multiple?: boolean
  /**
   * if true, allows renaming a key over an existing key. Defaults to false.
   */
  override?: boolean
  /**
   * if true, skip renaming of a key if it's undefined. Defaults to false.
   */
  ignoreUndefined?: boolean
}

export interface EmailOptions {
  /**
   * Numerical threshold at which an email address is considered invalid
   */
  errorLevel?: number | boolean
  /**
   * Specifies a list of acceptable TLDs.
   */
  tldWhitelist?: string[] | object
  /**
   * Number of atoms required for the domain. Be careful since some domains, such as io, directly allow email.
   */
  minDomainAtoms?: number
}

export interface HexOptions {
  /**
   * hex decoded representation must be byte aligned
   */
  byteAligned: boolean
}

export interface IpOptions {
  /**
   * One or more IP address versions to validate against. Valid values: ipv4, ipv6, ipvfuture
   */
  version?: string | string[]
  /**
   * Used to determine if a CIDR is allowed or not. Valid values: optional, required, forbidden
   */
  cidr?: string
}

export type GuidVersions = 'uuidv1' | 'uuidv2' | 'uuidv3' | 'uuidv4' | 'uuidv5'

export interface GuidOptions {
  version: GuidVersions[] | GuidVersions
}

export interface UriOptions {
  /**
   * Specifies one or more acceptable Schemes, should only include the scheme name.
   * Can be an Array or String (strings are automatically escaped for use in a Regular Expression).
   */
  scheme?: string | RegExp | Array<string | RegExp>
  /**
   * Allow relative URIs. Defaults to `false`.
   */
  allowRelative?: boolean
  /**
   * Restrict only relative URIs. Defaults to `false`.
   */
  relativeOnly?: boolean
}

export interface DataUriOptions {
  /**
   * optional parameter defaulting to true which will require = padding if true or make padding optional if false
   */
  paddingRequired?: boolean
}

export interface Base64Options {
  /**
   * optional parameter defaulting to true which will require = padding if true or make padding optional if false
   */
  paddingRequired?: boolean
}

export interface ReferenceOptions {
  separator?: string
  contextPrefix?: string
  default?: any
  strict?: boolean
  functions?: boolean
}

// tslint:disable-next-line:interface-name
export interface IPOptions {
  version?: string[]
  cidr?: string
}

export interface StringRegexOptions {
  name?: string
  invert?: boolean
}

export interface JoiObject {
  isJoi: boolean
}

export interface ValidationResult<T> extends PromiseLike<T> {
  error: ValidationError
  value: T
}

export interface Description {
  type?: SchemaTypes | string
  label?: string
  description?: string
  flags?: object
  notes?: string[]
  tags?: string[]
  meta?: any[]
  example?: any[]
  valids?: any[]
  invalids?: any[]
  unit?: string
  options?: ValidationOptions
  [key: string]: any
}

export interface Context {
  [key: string]: any
  key?: string
  label?: string
}

export interface State {
  key?: string
  path?: string
  parent?: any
  reference?: any
}

export interface ValidationError extends Error, JoiObject {
  details: ValidationErrorItem[]
  annotate (): string
  _object: any
}

export interface ValidationErrorItem {
  message: string
  type: string
  path: string[]
  options?: ValidationOptions
  context?: Context
}

export type ValidationErrorFunction = (
  (errors: ValidationErrorItem[]) => string | ValidationErrorItem | ValidationErrorItem[] | Error
)

export interface Reference extends JoiObject {
  (value: any, validationOptions: ValidationOptions): any
  isContext: boolean
  key: string
  path: string
  toString (): string
}

export type ExtensionBoundSchema = Schema & {
  /**
   * Creates a joi error object.
   * Used in conjunction with custom rules.
   * @param type - the type of rule to create the error for.
   * @param context - provide properties that will be available in the `language` templates.
   * @param state - should the context passed into the `validate` function in a custom rule
   * @param options - should the context passed into the `validate` function in a custom rule
   */
  createError (type: string, context: Context, state: State, options: ValidationOptions): Err;
}

export interface Rules<P extends object = any> {
  name: string
  params?: ObjectSchema | {[key in keyof P]: SchemaLike; }
  setup? (this: ExtensionBoundSchema, params: P): Schema | void
  validate? (this: ExtensionBoundSchema, params: P, value: any, state: State, options: ValidationOptions): any
  description?: string | ((params: P) => string)
}

export interface Extension {
  name: string
  base?: Schema
  language?: LanguageOptions
  coerce? (this: ExtensionBoundSchema, value: any, state: State, options: ValidationOptions): any
  pre? (this: ExtensionBoundSchema, value: any, state: State, options: ValidationOptions): any
  describe? (this: Schema, description: Description): Description
  rules?: Rules[]
}

export interface Err extends JoiObject {
  toString (): string
}

export interface LazyOptions {
  /**
   * If true the schema generator will only be called once and the result will be cached.
   */
  once?: boolean
}

// ----------------------------------------------------------------------------
// Type utilities
// ----------------------------------------------------------------------------

type AnyType = string | number | boolean | symbol | object | null | undefined
type ConstructorOf<T> = new (...args: any[]) => T
type ExcludeUndefined<T> = Exclude<T, undefined>
type ArrayItemType<T> = T extends (infer U)[] ? U : never

/** Find keys that its value extends `U` of an object */
type FilterKeys<T extends object, U> = { [key in keyof T]: T[key] extends U ? key : never }[keyof T]

/** Keep keys that its value extends `U` */
type Filter<T extends object, U> = { [key in FilterKeys<T, U>]: T[key] }

// Reversed version of `FilterKeys` and `Filter`
type FilterOutKeys<T extends object, U> = { [key in keyof T]: T[key] extends U ? never : key }[keyof T]
type FilterOut<T extends object, U> = { [key in FilterOutKeys<T, U>]: T[key] }

/**
 * Union the array types of `T` and `U`, leaving other types of `T` unmodified
 * @example MergeArray<A[] | B, C> = (A | C)[] | B
 */
type MergeArray<T, U> = (
  T extends (infer TValue)[]
    ? (TValue | U)[]
    : T
)

/**
 * Exclude `U` from the array types of `T`, leaving other types of `T` unmodified
 * @example ExcludeFromArray<(A | C)[] | B, C> = A[] | B
 */
type ExcludeFromArray<T, U> = (
  T extends (infer TValue)[]
    ? Exclude<T, U>[]
    : T
)

/**
 * Merge the object types of `T` and `U`, leaving other types of `T` unmodified
 * @example MergeObject<{ a: A } | B, { c: C }> = { a: A, c: C } | B
 */
type MergeObject<T, U extends object> = (Extract<T, object> & U) | Exclude<T, object>

// ----------------------------------------------------------------------------
// Schema functions
// ----------------------------------------------------------------------------

/** Generates a schema object that matches any data type. */
export function any (): AnySchema

/** Generates a schema object that matches an array data type. */
export function array (): ArraySchema

/** Generates a schema object that matches a boolean data type (as well as the strings 'true', 'false', 'yes', and 'no'). Can also be called via bool(). */
export function bool (): BooleanSchema

/** Generates a schema object that matches a boolean data type (as well as the strings 'true', 'false', 'yes', and 'no'). Can also be called via bool(). */
export function boolean (): BooleanSchema

/* Generates a schema object that matches a Buffer data type (as well as the strings which will be converted to Buffers). */
export function binary (): BinarySchema

/** Generates a schema object that matches a date type (as well as a JavaScript date string or number of milliseconds). */
export function date (): DateSchema

/** Generates a schema object that matches a number data type (as well as strings that can be converted to numbers). */
export function number (): NumberSchema

/** Generates a schema object that matches an object data type (as well as JSON strings that have been parsed into objects). */
export function object<T extends SchemaMap = {}> (schema?: T): ObjectSchema<SchemaMapValue<T>>

/** Generates a schema object that matches a string data type. Note that empty strings are not allowed by default and must be enabled with allow(''). */
export function string (): StringSchema

/** Generates a type that will match one of the provided alternative schemas */
export function alternatives<T extends SchemaLike[]> (types: T): AlternativesSchema<SchemaValues<T>>
export function alternatives<T extends SchemaLike[]> (...types: T): AlternativesSchema<SchemaValues<T>>

/** Generates a type that will match one of the provided alternative schemas */
export function alt<T extends SchemaLike[]> (types: T): AlternativesSchema<SchemaValues<T>>
export function alt<T extends SchemaLike[]> (...types: T): AlternativesSchema<SchemaValues<T>>

/**
 * Generates a placeholder schema for a schema that you would provide with the fn.
 * Supports the same methods of the any() type.
 * This is mostly useful for recursive schemas
 */
export function lazy<T> (cb: () => AbstractSchema<any, T>, options?: LazyOptions): LazySchema<T>

// ----------------------------------------------------------------------------
// Other joi exports
// ----------------------------------------------------------------------------

/** Current version of the joi package. */
export const version: string

/** Validates a value using the schema and options. */
export function validate<Schema extends SchemaLike> (value: any, schema: Schema, options?: ValidationOptions): ValidationResult<SchemaValue<Schema>>
export function validate<Schema extends SchemaLike> (value: any, schema: Schema, callback: (err: ValidationError, value: SchemaValue<Schema>) => void): void
export function validate<Schema extends SchemaLike> (value: any, schema: Schema, options: ValidationOptions, callback: (err: ValidationError, value: SchemaValue<Schema>) => void): void

/** Converts literal schema definition to joi schema object (or returns the same back if already a joi schema object). */
export function compile<Value = any> (schema: SchemaLike): Schema<Value>

/**
 * Validates a value against a schema and throws if validation fails.
 *
 * @param value - the value to validate.
 * @param schema - the schema object.
 * @param message - optional message string prefix added in front of the error message. may also be an Error object.
 */
export function assert (value: any, schema: SchemaLike, message?: string | Error): void

/**
 * Validates a value against a schema, returns valid object, and throws if validation fails where:
 *
 * @param value - the value to validate.
 * @param schema - the schema object.
 * @param message - optional message string prefix added in front of the error message. may also be an Error object.
 */
export function attempt<Schema extends SchemaLike> (value: any, schema: Schema, message?: string | Error): SchemaValue<Schema>

/**
 * Generates a reference to the value of the named key.
 */
export function ref (key: string, options?: ReferenceOptions): Reference

/**
 * Checks whether or not the provided argument is a reference. It's especially useful if you want to post-process error messages.
 */
export function isRef (ref: any): ref is Reference

/**
 * Get a sub-schema of an existing schema based on a `path` that can be either a string or an array
 * of strings For string values path separator is a dot (`.`)
 */
export function reach (schema: ObjectSchema, path: string | string[]): Schema

/**
 * Creates a new Joi instance customized with the extension(s) you provide included.
 */
export function extend (extension: Extension | Extension[], ...extensions: Array<Extension | Extension[]>): any

import * as Module from 'typesafe-joi'
export type Root = typeof Module
export type DefaultsFunction = (root: Schema) => Schema

/**
 * Creates a new Joi instance that will apply defaults onto newly created schemas
 * through the use of the fn function that takes exactly one argument, the schema being created.
 *
 * @param fn - The function must always return a schema, even if untransformed.
 */
export function defaults (fn: DefaultsFunction): Root
