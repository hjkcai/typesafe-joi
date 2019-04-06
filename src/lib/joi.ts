import * as Joi from 'joi'
import { ObjectSchema } from '../schema/object';
import { Schema, SchemaLike } from '../schema';

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
  ValidationResult,
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
} from 'joi'

export type ExtensionBoundSchema = Schema & {
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
  params?: ObjectSchema | {[key in keyof P]: SchemaLike; }
  setup? (this: ExtensionBoundSchema, params: P): Schema | void
  validate? (this: ExtensionBoundSchema, params: P, value: any, state: Joi.State, options: Joi.ValidationOptions): any
  description?: string | ((params: P) => string)
}
