import { Value } from "../lib/value";
import { Schema } from "../lib/schema";
import { BaseSchema } from ".";
import { ConstructorOf } from "../lib/util";
import { RenameOptions, Reference } from "../lib/joi";

export interface ObjectSchema<TValue extends Value.AnyValue = Value<Record<any, any>>> extends BaseSchema<'object', TValue> {
  /**
   * Sets or extends the allowed object keys.
   */
  keys (schemaMap?: null): ObjectSchema<Value.replace<TValue, never>>
  keys<TSchemaMap extends Schema.SchemaMap> (schemaMap: TSchemaMap): ObjectSchema<
    Value.deepMerge<TValue, Schema.valueType<Schema.fromSchemaLike<TSchemaMap>>>
  >

  /**
   * Appends the allowed object keys. If schema is null, undefined, or {}, no changes will be applied.
   */
  append (schemaMap?: null): this
  append<TSchemaMap extends Schema.SchemaMap> (schemaMap: TSchemaMap): ObjectSchema<
    Value.deepMerge<TValue, Schema.valueType<Schema.fromSchemaLike<TSchemaMap>>>
  >

  /**
   * Requires the object to be an instance of a given constructor.
   *
   * @param constructor - the constructor function that the object must be an instance of.
   * @param name - an alternate name to use in validation errors. This is useful when the constructor function does not have a name.
   */
  type<T> (constructor: ConstructorOf<T>, name?: string): ObjectSchema<Value.appendSchemaMap<TValue, T>>

  /**
   * Requires the object to be a Joi schema instance.
   */
  schema (): ObjectSchema<Value.replace<TValue, BaseSchema<any, any>>>

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
  pattern<TSchemaLike extends Schema.SchemaLike> (pattern: RegExp | Schema.SchemaLike, schema: TSchemaLike): ObjectSchema<
    Value.appendSchemaMap<TValue, Record<any, Schema.literal<TSchemaLike>>>
  >

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
   * Defines an exclusive relationship between a set of keys where only one is allowed but none are required where:
   * `peers` - the exclusive key names that must not appear together but where none are required.
   */
  oxor(...peers: string[]): this;
  oxor(peers: string[]): this;

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
  assert (ref: string | Reference, schema: Schema.SchemaLike, message?: string): this

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
