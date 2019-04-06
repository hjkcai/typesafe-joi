/**
 * The value type of a schema.
 * @private DO NOT USE! This is not a real joi schema property but is required for typesafe-joi to work.
 */
export declare const VALUE: unique symbol

/**
 * The required schema type of a schema. Useful to define the `required` function.
 * @private DO NOT USE! This is not a real joi schema property but is required for typesafe-joi to work.
 */
export declare const REQUIRED_SCHEMA_TYPE: unique symbol

/**
 * The optional schema type of a schema. Useful to define the `optional` function.
 * @private DO NOT USE! This is not a real joi schema property but is required for typesafe-joi to work.
 */
export declare const OPTIONAL_SCHEMA_TYPE: unique symbol

/**
 * The nominal key to mark if a schema is required.
 * @private DO NOT USE! This is not a real joi schema property but is required for typesafe-joi to work.
 */
export declare const IS_REQUIRED: unique symbol

/**
 * THe nominal key to mark if an array is sparse
 * @private DO NOT USE! This is not a real joi schema property but is required for typesafe-joi to work.
 */
export declare const IS_SPARSE: unique symbol
