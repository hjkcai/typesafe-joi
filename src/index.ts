// Type definitions for @hapi/joi 15.x
// Project: https://github.com/hapijs/joi
// Definitions by: Jingkun Hua <https://github.com/hjkcai>
// TypeScript Version: >=3.0
// @ts-ignore
/// <reference types="node" />
/// <reference lib="es2015" />

import * as Cast from './lib/cast'
import { Schema } from './lib/schema'

export * from './lib/functions'
export * from './lib/joi'
export * from './lib/schema'
export * from './lib/value'
export * from './schema'

export { Cast }
export type SchemaLike = Schema.SchemaLike
export type SchemaMap = Schema.SchemaMap

module.exports = require('@hapi/joi')
