import * as Joi from '../src'
import {
  testAny, testInvariant, testNever,
  StubClass, StubObject, StubObjectIntersection
} from './util';

// SchemaValue should extract `VALUE | undefined` out of OptionalSchema
testAny<Joi.SchemaValue<Joi.AnySchema<any>>>(true)
testInvariant<Joi.SchemaValue<Joi.AnySchema<never>>, undefined>(true)
testInvariant<Joi.SchemaValue<Joi.AnySchema<string>>, string | undefined>(true)
testInvariant<Joi.SchemaValue<Joi.AnySchema<StubClass>>, StubClass | undefined>(true)

// SchemaValue should extract `VALUE` out of RequiredSchema
testAny<Joi.SchemaValue<Joi.RequiredAnySchema<any>>>(true)
testNever<Joi.SchemaValue<Joi.RequiredAnySchema<never>>>(true)
testInvariant<Joi.SchemaValue<Joi.RequiredAnySchema<StubClass>>, StubClass>(true)

// SchemaValue should convert SchemaMap into object literal type or undefined
testInvariant<Joi.SchemaValue<{ a: Joi.StringSchema, b: Joi.RequiredNumberSchema }>, StubObject | undefined>(true)

// SchemaValue should leave `string | number | boolean | null` unmodified with `undefined` added (these are supported `SchemaLike` types)
testInvariant<Joi.SchemaValue<string>, string | undefined>(true)
testInvariant<Joi.SchemaValue<''>, '' | undefined>(true)
testInvariant<Joi.SchemaValue<number>, number | undefined>(true)
testInvariant<Joi.SchemaValue<0>, 0 | undefined>(true)
testInvariant<Joi.SchemaValue<boolean>, boolean | undefined>(true)
testInvariant<Joi.SchemaValue<false>, false | undefined>(true)
testInvariant<Joi.SchemaValue<true>, true | undefined>(true)
testInvariant<Joi.SchemaValue<null>, null | undefined>(true)

// SchemaValue should convert nested `SchemaMap` into nested object literal type
type DoubleNestedSchema = { a: { b: Joi.StringSchema } }
type DoubleNestedLiteral = { a?: { b?: string } | undefined } | undefined;
testInvariant<Joi.SchemaValue<DoubleNestedSchema>, DoubleNestedLiteral>(true)

type TripleNestedSchema = { a: { b: { c: Joi.StringSchema } } }
type TripleNestedLiteral = { a?: { b?: { c?: string } | undefined } | undefined } | undefined;
testInvariant<Joi.SchemaValue<TripleNestedSchema>, TripleNestedLiteral>(true)

type QuadrupleNestedSchema = { a: { b: { c: { d: Joi.StringSchema } } } }
type QuadrupleNestedLiteral = { a?: { b?: { c?: { d?: string | undefined } } | undefined } | undefined } | undefined;
testInvariant<Joi.SchemaValue<QuadrupleNestedSchema>, QuadrupleNestedLiteral>(true)

// TODO: SchemaValue should correctly handle `SchemaLike` tuple as alternatives schema

// SchemaMapValue should reassembly an object schema into intersection of the required part and the optional part
testInvariant<Joi.SchemaMapValue<{ a: Joi.StringSchema, b: Joi.RequiredNumberSchema }>, StubObjectIntersection>(true)

// SchemaMapLiteral should convert `SchemaMap` into object literal type
testInvariant<Joi.SchemaMapLiteral<any>, Record<any, any>>(true)
testInvariant<Joi.SchemaMapLiteral<never>, never>(true)
testInvariant<Joi.SchemaMapLiteral<{}>, {}>(true)
testInvariant<Joi.SchemaMapLiteral<{ a: Joi.StringSchema, b: Joi.RequiredNumberSchema }>, { a: string | undefined, b: number }>(true)

// SchemaValues should convert `SchemaLike` tuple into unioned literal type
testAny<Joi.SchemaValues<any>>(true)
testAny<Joi.SchemaValues<any[]>>(true)
testInvariant<Joi.SchemaValues<[]>, never>(true)
testInvariant<Joi.SchemaValues<never[]>, never>(true)
testInvariant<Joi.SchemaValues<[Joi.StringSchema, 1, true]>, string | 1 | true | undefined>(true)
testInvariant<Joi.SchemaValues<string[]>, string | undefined>(true)
testInvariant<Joi.SchemaValues<(Joi.StringSchema | Joi.BooleanSchema | 1)[]>, string | boolean | 1 | undefined>(true)
