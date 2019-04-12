import { Value } from "../lib/value";
import { Schema } from "../lib/schema";
import { AbstractSchema } from ".";

export interface AlternativesSchema<TValue extends Value.AnyValue = Value<never>> extends AbstractSchema<'alternatives', TValue> {
  try<TSchemaLike extends Schema.SchemaLike[]> (...types: TSchemaLike): AlternativesSchema<
    Value.unionWithBase<
      TValue,
      Schema.literal<TSchemaLike[number]>
    >
  >
}
