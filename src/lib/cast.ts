import { Value } from './value';
import * as Schemas from '../schema'

type CastValue<T> = Value<T, never, never, never, true>

/** Cast the value type of a AlternativesSchema. */
export type Alternatives<T> = Schemas.AlternativesSchema<CastValue<T>>

/** Cast the value type of a AnySchema. */
export type Any<T> = Schemas.AnySchema<CastValue<T>>

/** Cast the value type of a ArraySchema. */
export type Array<T> = Schemas.ArraySchema<CastValue<T>>

/** Cast the value type of a BinarySchema. */
export type Binary<T> = Schemas.BinarySchema<CastValue<T>>

/** Cast the value type of a BooleanSchema. */
export type Boolean<T> = Schemas.BooleanSchema<CastValue<T>>

/** Cast the value type of a DateSchema. */
export type Date<T> = Schemas.DateSchema<CastValue<T>>

/** Cast the value type of a FunctionSchema. */
export type Function<T> = Schemas.FunctionSchema<CastValue<T>>

/** Cast the value type of a LazySchema. */
export type Lazy<T> = Schemas.LazySchema<CastValue<T>>

/** Cast the value type of a NumberSchema. */
export type Number<T> = Schemas.NumberSchema<CastValue<T>>

/** Cast the value type of a ObjectSchema. */
export type Object<T> = Schemas.ObjectSchema<CastValue<T>>

/** Cast the value type of a StringSchema. */
export type String<T> = Schemas.StringSchema<CastValue<T>>
