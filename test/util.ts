import * as Joi from '../src'

export declare type IfAny<Condition, Then> = 1 extends (Condition extends never ? 1 : 0) ? Then : false
export declare type IfNotAny<Condition, Then> = 1 extends (Condition extends never ? 1 : 0) ? false : Then
export declare type IsInvariant<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false
export declare type IsInvariantWithoutAny<T, U> = IfNotAny<T, IfNotAny<U, IsInvariant<T, U>>>

export declare function testInvariant<T, U> (matches: IsInvariantWithoutAny<T, U>): void
export declare function testInvariant<T, U> (t: T, u: U, matches: IsInvariantWithoutAny<T, U>): void
export declare function testAny<T> (matches: IfAny<T, true>): void
export declare function testNever<T> (matches: IsInvariant<T, never>): void

export declare function type<T> (): T
export declare function testSchema<Schema extends Joi.SchemaLike, T> (schema: Schema, type: T, matches: IsInvariantWithoutAny<Joi.SchemaValue<Schema>, T>): void
export declare type RawSchemaValue<Schema> = Schema extends Joi.AbstractSchema<any, infer T> ? T : unknown

export declare interface StubObject { a?: string, b: number }
export declare type StubObjectIntersection = { a?: string } & { b: number }
export declare class StubClass { private a: string }
