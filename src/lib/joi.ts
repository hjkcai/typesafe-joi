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
  Extension,
  Err,
  LazyOptions
} from '@hapi/joi'

export interface ValidationResult<T> extends Pick<Promise<T>, 'then' | 'catch'> {
  error: Joi.ValidationError | null;
  value: T;
}

export type ValidationCallback<T> = (err: Joi.ValidationError, value: T) => void

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
