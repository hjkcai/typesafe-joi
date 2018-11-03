# typesafe-joi

typesafe-joi is a fork of [joi](https://github.com/hapijs/joi). More precisely, this is a fork of [@types/joi](https://www.npmjs.com/package/@types/joi) because it has just redefined the essential APIs of joi. *Almost* all the APIs are the same as the original APIs, but limitations *exists*. That is why I create a new package, rather than submit a PR to @types/joi.

## Usage

> IMPORTANT: typesafe-joi requires at least TypeScript 3 to work. Because some declarations are impossible without the TypeScript 3 tuple updates.

Import and use joi from `typesafe-joi`:

```typescript
import * as Joi from 'typesafe-joi'
```

The TypeScript magic is shown when you call `.validate`:

```typescript
const data: any = dataFromAnywhere

// { foo?: string } | undefined
Joi.object({ foo: Joi.string() }).validate(data).value

// { id: number, email?: string }[]
Joi.validate(
  data,
  Joi.array()
    .items(Joi.object({
      id: Joi.number().integer().required(),
      email: Joi.string().email()
    }))
    .required()
)
```

> NOTE: I suggest to turn on `strict` option in the compiler options of TypeScript.

## What’s the difference?

The JavaScript APIs of typesafe-joi and joi are **identical**. However, its type definition lacks of the type information of the “value” behind the schema. That means, JavaScript knows what the validated object look like at runtime, but TypeScript does not know it at all at compile time. typesafe-joi records more information into schemas so that TypeScript is able to know what object you are validating at compile time.

Unfortunately *not all* joi APIs are able to be properly described in TypeScript. See [Limitations](#Limitations) for more information.

## Limitations

joi is so powerful that TypeScript cannot describe all its APIs statically. Here are some limitations:

### Shrink-then-expand problem

**TL;DR**:

* `Joi.array()` starts with type `never[]`. You *must* call `.items` on it to get a proper type. If you want `any[]`, call `Joi.array().items(Joi.any())`.
* `Joi.object()` starts with type `{}` (the object type without any keys). You *must* call `.keys` on it, or pass arguments to it, to get a proper type. If you do not care about the content of the object, call `Joi.object<any>()`.

---

Some of APIs of joi (`Joi.array`  and `Joi.object`) are designed to match all cases and shrinks in later schema definitions. However, these cases can be expanded *again*! For example:

```javascript
const a = Joi.object()  // matches `object`
const b = a.keys({ foo: Joi.string()})  // matches `{ foo?: string }`
const c = b.append({ bar: Joi.number() })  // matches `{ foo?: string, bar?: number }`

const d = Joi.array()  // matches `any[]`
const e = d.items(Joi.string())  // matches `string[]`
const f = e.items(Joi.number())  // matches `(string | number)[]`
```

As you can see, `a` matches any `object` type at the beginning. After invoking `.keys`, the types it matches shrank to `{ foo?: string }`. Then if I call `.append` (or `.keys` since they are almost the same) again, the types it matches expanded to `{ foo?: string, bar?: number }`.

The problem is, as far as I have found, **shrinking types in TypeScript cannot be easily achieved**. It is able to shrink from `{ foo?: string, bar?: number }` to `{ foo?: string }` by omitting the key `bar`. But it is not possible to shrink from `any` to any other types, because there is no way to know if a type is `any` or not. Conditional type expression `T extends any` and `any extends T` are always true. 

Because of this limitation, I have to choose to only expand the types. The initial type will be the least expressive type of an array or an object, which is `never[]` on arrays and `{}` on objects. Then `.items` and `.keys` augment the type:

```javascript
const a = Joi.object()  // returns `{}`, but matches `object`
const b = a.keys({ foo: Joi.string()})  // matches `{ foo?: string }`
const c = b.append({ bar: Joi.number() })  // matches `{ foo?: string, bar?: number }`

const d = Joi.array()  // returns `never[]`, but matches `any[]`
const e = d.items(Joi.string())  // matches `string[]`
const f = e.items(Joi.number())  // matches `(string | number)[]`
```

Be careful. **Once your types reach `any`, they never come back again**.

### Inconsistent type

**TL;DR**: Do *not* use a single array as the only argument on methods like `.allow`, `.disallow`, etc.

---

Some of the methods of joi have two call signatures. For example:

```typescript
valid<T extends AnyType[]> (values: T): SchemaType<Schema, T[number]>
valid<T extends AnyType[]> (...values: T): SchemaType<Schema, T[number]>
```

However, the type parameter `T` resolves to different results:

```typescript
// T is `(number | string | boolean)[]`
// returns `{ foo?: string } | number | string | boolean | undefined`
Joi.object({ foo: Joi.string() }).valid([1, '2', true])

// T is `[1, '2', true]` (tuple type)
// returns `{ foo?: string } | 1 | '2' | true | undefined`
Joi.object({ foo: Joi.string() }).valid(1, '2', true)
```

You'd better let TypeScript know everything. So do *not* use a single array as the only argument on methods like `.allow`, `.disallow`, etc.

## Help me improve

Sorry but I do not have enough time to write a unit test for it. Please feel free to open an issue when you find bugs or suggestions. I am glad to help!