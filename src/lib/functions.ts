import * as JoiLib from './joi'
import * as Schemas from '../schema'
import { Value } from './value';
import { Schema } from './schema';

/** Generates a schema object that matches any data type. */
export declare function any (): Schemas.AnySchema

/** Generates a schema object that matches an array data type. */
export declare function array (): Schemas.ArraySchema

/** Generates a schema object that matches a boolean data type (as well as the strings 'true', 'false', 'yes', and 'no'). Can also be called via bool(). */
export declare function bool (): Schemas.BooleanSchema

/** Generates a schema object that matches a boolean data type (as well as the strings 'true', 'false', 'yes', and 'no'). Can also be called via bool(). */
export declare function boolean (): Schemas.BooleanSchema

/* Generates a schema object that matches a Buffer data type (as well as the strings which will be converted to Buffers). */
export declare function binary (): Schemas.BinarySchema

/** Generates a schema object that matches a date type (as well as a JavaScript date string or number of milliseconds). */
export declare function date (): Schemas.DateSchema

/** Generates a schema object that matches a function type. */
export declare function func (): Schemas.FunctionSchema

/** Generates a schema object that matches a number data type (as well as strings that can be converted to numbers). */
export declare function number (): Schemas.NumberSchema

/** Generates a schema object that matches an object data type (as well as JSON strings that have been parsed into objects). */
export declare function object (): Schemas.ObjectSchema
export declare function object<TSchemaMap extends Schema.SchemaMap = {}> (schema: TSchemaMap): Schemas.ObjectSchema<Schema.valueType<TSchemaMap>>

/** Generates a schema object that matches a string data type. Note that empty strings are not allowed by default and must be enabled with allow(''). */
export declare function string (): Schemas.StringSchema

/** Generates a type that will match one of the provided alternative schemas */
export declare function alternatives<T extends Schema.SchemaLike[]> (types: T): Schemas.AlternativesSchema<Schema.valueType<T[number]>>
export declare function alternatives<T extends Schema.SchemaLike[]> (...types: T): Schemas.AlternativesSchema<Schema.valueType<T[number]>>

/** Generates a type that will match one of the provided alternative schemas */
export declare function alt<T extends Schema.SchemaLike[]> (types: T): Schemas.AlternativesSchema<Schema.valueType<T[number]>>
export declare function alt<T extends Schema.SchemaLike[]> (...types: T): Schemas.AlternativesSchema<Schema.valueType<T[number]>>

/**
 * Generates a placeholder schema for a schema that you would provide with the fn.
 * Supports the same methods of the any() type.
 * This is mostly useful for recursive schemas
 */
export declare function lazy<TSchema extends Schema.SchemaLike> (cb: () => TSchema, options?: JoiLib.LazyOptions): Schemas.LazySchema<Schema.valueType<TSchema>>

// ----------------------------------------------------------------------------
// Other joi exports
// ----------------------------------------------------------------------------

/** Current version of the joi package. */
export declare const version: string

/** Validates a value using the schema and options. */
export declare function validate<TSchemaLike extends Schema.SchemaLike> (value: any, schema: TSchemaLike, options?: JoiLib.ValidationOptions): JoiLib.ValidationResult<Schema.literal<TSchemaLike>>
export declare function validate<TSchemaLike extends Schema.SchemaLike> (value: any, schema: TSchemaLike, callback: JoiLib.ValidationCallback<Schema.literal<TSchemaLike>>): void
export declare function validate<TSchemaLike extends Schema.SchemaLike> (value: any, schema: TSchemaLike, options: JoiLib.ValidationOptions, callback: JoiLib.ValidationCallback<Schema.literal<TSchemaLike>>): void

/** Converts literal schema definition to joi schema object (or returns the same back if already a joi schema object). */
export declare function compile<TSchemaLike extends Schema.SchemaLike> (schema: TSchemaLike): Schema.compile<TSchemaLike>

/**
 * Validates a value against a schema and throws if validation fails.
 *
 * @param value - the value to validate.
 * @param schema - the schema object.
 * @param message - optional message string prefix added in front of the error message. may also be an Error object.
 */
export declare function assert (value: any, schema: Schema.SchemaLike, message?: string | Error): void

/**
 * Validates a value against a schema, returns valid object, and throws if validation fails where:
 *
 * @param value - the value to validate.
 * @param schema - the schema object.
 * @param message - optional message string prefix added in front of the error message. may also be an Error object.
 */
export declare function attempt<TSchemaLike extends Schema.SchemaLike> (value: any, schema: TSchemaLike, message?: string | Error): Schema.literal<TSchemaLike>

/**
 * Generates a reference to the value of the named key.
 */
export declare function ref (key: string, options?: JoiLib.ReferenceOptions): JoiLib.Reference

/**
 * Checks whether or not the provided argument is a reference. It's especially useful if you want to post-process error messages.
 */
export declare function isRef (ref: any): ref is JoiLib.Reference

/**
 * Get a sub-schema of an existing schema based on a `path` that can be either a string or an array
 * of strings For string values path separator is a dot (`.`)
 */
export declare function reach<TShcemaMap extends Schema.InternalSchemaMap, TSubSchemaKey extends keyof TShcemaMap> (schema: Schemas.ObjectSchema<Value<Record<any, any>, TShcemaMap>>, path: TSubSchemaKey | [TSubSchemaKey]): TShcemaMap[TSubSchemaKey]
export declare function reach (schema: Schemas.AbstractSchema<any, any>, path: string | string[]): Schemas.AbstractSchema<any, any> | undefined

/**
 * Creates a new Joi instance customized with the extension(s) you provide included.
 */
export declare function extend (extension: JoiLib.Extension | JoiLib.Extension[], ...extensions: Array<JoiLib.Extension | JoiLib.Extension[]>): any

export type Root = typeof import('..')
export type DefaultsFunction = (root: Schemas.AbstractSchema<any, any>) => Schemas.AbstractSchema<any, any>

/**
 * Creates a new Joi instance that will apply defaults onto newly created schemas
 * through the use of the fn function that takes exactly one argument, the schema being created.
 *
 * @param fn - The function must always return a schema, even if untransformed.
 */
export declare function defaults (fn: DefaultsFunction): Root

/**
 * By default, some Joi methods to function properly need to rely on the Joi instance they are attached to
 * because they use `this` internally. So `Joi.string()` works but if you extract the function from it
 * and call `string()` it won't. `bind()` creates a new Joi instance
 * where all the functions relying on `this` are bound to the Joi instance.
 */
export declare function bind (): Root
