// Type definitions for @hapi/joi 15.x
// Project: https://github.com/hapijs/joi
// Definitions by: Jingkun Hua <https://github.com/hjkcai>
// TypeScript Version: >=3.0
// @ts-ignore
/// <reference types="node" />
/// <reference lib="es2015" />

export * from './lib/functions'
export * from './lib/joi'
export * from './lib/schema'
export * from './lib/value'
export * from './schema'

export type SchemaLike = import('./lib/schema').Schema.SchemaLike

module.exports = require('@hapi/joi')
