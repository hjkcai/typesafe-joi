import * as Joi from '@hapi/joi'
import { Value } from './value';
import { Schema } from './schema';
import { ObjectSchema, AbstractSchema } from '../schema';

export {
  LanguageOptions,
  LanguageRootOptions,
  ValidationOptions,
  RenameOptions,
  EmailOptions,
  ErrorOptions,
  HexOptions,
  IpOptions,
  GuidOptions,
  UriOptions,
  DataUriOptions,
  Base64Options,
  ReferenceOptions,
  IPOptions,
  StringRegexOptions,
  JoiObject,
  Description,
  Context,
  State,
  ValidationError,
  ValidationErrorItem,
  ValidationErrorFunction,
  Reference,
  Err,
  LazyOptions
} from '@hapi/joi'

export interface DefaultFunction<T> {
  (context: Joi.Context): T
}

export interface DefaultFunctionWithDescription<T> extends DefaultFunction<T> {
  description: string
}

export interface ValidationResultSuccess<T> extends Pick<Promise<T>, 'then' | 'catch'> {
  error: null;
  value: T;
}

export interface ValidationResultError<T> {
  error: Joi.ValidationError;
  // Make sure the keys exist so destructing works
  value: T extends { [key: string]: any } ? { [key in keyof T]: undefined } : undefined;
}

export interface ValidationResultUnchecked<T> {
  error: Joi.ValidationError;
  // Make sure the keys exist so destructing works and change the values to possibly undefined
  value: T extends { [key: string]: any } ? { [key in keyof T]?: T[key] } : T;
}

export type ValidationCallback<T> = (err: Joi.ValidationError, value: T) => void

export interface Extension {
  name: string;
  base?: AbstractSchema<any, any>;
  language?: Joi.LanguageOptions;
  coerce?(this: ExtensionBoundSchema, value: any, state: Joi.State, options: Joi.ValidationOptions): any;
  pre?(this: ExtensionBoundSchema, value: any, state: Joi.State, options: Joi.ValidationOptions): any;
  describe?(this: Schema, description: Joi.Description): Joi.Description;
  rules?: Rules[];
}

export interface ExtensionBoundSchema<TValue extends Value.AnyValue = Value.AnyValue> extends AbstractSchema<string, TValue> {
  /**
   * Creates a joi error object.
   * Used in conjunction with custom rules.
   * @param type - the type of rule to create the error for.
   * @param context - provide properties that will be available in the `language` templates.
   * @param state - should the context passed into the `validate` function in a custom rule
   * @param options - should the context passed into the `validate` function in a custom rule
   */
  createError (type: string, context: Joi.Context, state: Joi.State, options: Joi.ValidationOptions): Joi.Err;
}

export interface Rules<P extends object = any> {
  name: string
  params?: ObjectSchema | { [key in keyof P]: Schema.SchemaLike; }
  setup? (this: ExtensionBoundSchema, params: P): AbstractSchema<any, any> | void
  validate? (this: ExtensionBoundSchema, params: P, value: any, state: Joi.State, options: Joi.ValidationOptions): any
  description?: string | ((params: P) => string)
}

export interface When<Then extends Schema.SchemaLike = any, Otherwise extends Schema.SchemaLike = any> {
  then?: Then,
  otherwise?: Otherwise
}

export interface WhenIs<Then extends Schema.SchemaLike = any, Otherwise extends Schema.SchemaLike = any> extends When<Then, Otherwise> {
  is: Schema.SchemaLike
}
