import { IsAny, IsInvariant, IsInvariantWithoutAny } from '../src/lib/util';

export declare function testInvariant<T, U> (matches: IsInvariantWithoutAny<T, U>): void
export declare function testInvariant<T, U> (t: T, u: U, matches: IsInvariantWithoutAny<T, U>): void
export declare function testAny<T> (matches: IsAny<T>): void
export declare function testNever<T> (matches: IsInvariant<T, never>): void

export declare function type<T> (): T

export declare interface StubObject { a?: string, b: number }
export declare type StubObjectIntersection = { a?: string } & { b: number }
export declare class StubClass { private a: string }
