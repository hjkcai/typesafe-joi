import { Value } from './value';
import * as Schemas from '../schema'

type CastValue<T> = Value<T, never, never, never, true>

/** Cast the value type of a AlternativesSchema. */
export type Alternatives<T = any> = Schemas.AlternativesSchema<CastValue<T>>

/** Cast the value type of a AnySchema. */
export type Any<T = any> = Schemas.AnySchema<CastValue<T>>

/** Cast the value type of a ArraySchema. */
export type Array<T = any> = Schemas.ArraySchema<CastValue<T>>

/** Cast the value type of a BinarySchema. */
export type Binary<T = any> = Schemas.BinarySchema<CastValue<T>>

/** Cast the value type of a BooleanSchema. */
export type Boolean<T = any> = Schemas.BooleanSchema<CastValue<T>>

/** Cast the value type of a DateSchema. */
export type Date<T = any> = Schemas.DateSchema<CastValue<T>>

/** Cast the value type of a FunctionSchema. */
export type Function<T = any> = Schemas.FunctionSchema<CastValue<T>>

/** Cast the value type of a LazySchema. */
export type Lazy<T = any> = Schemas.LazySchema<CastValue<T>>

/** Cast the value type of a NumberSchema. */
export type Number<T = any> = Schemas.NumberSchema<CastValue<T>>

/** Cast the value type of a ObjectSchema. */
export type Object<T = any> = Schemas.ObjectSchema<CastValue<T>>

/** Cast the value type of a StringSchema. */
export type String<T = any> = Schemas.StringSchema<CastValue<T>>
