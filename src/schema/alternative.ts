import { Value } from "../lib/value";
import { Schema } from "../lib/schema";
import { BaseSchema } from ".";

export interface AlternativesSchema<TValue extends Value.AnyValue = Value> extends BaseSchema<'alternatives', TValue> {
  try<TSchemaLike extends Schema.SchemaLike[]> (...types: TSchemaLike): AlternativesSchema<
    Value.union<TValue,Schema.literal<TSchemaLike[number]>>
  >
}
