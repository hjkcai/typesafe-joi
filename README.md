# typesafe-joi

typesafe-joi is a fork of [@hapi/joi](https://github.com/hapijs/joi). More precisely, this is a fork of [@types/hapi__joi](https://www.npmjs.com/package/@types/hapi__joi) because it has just redefined the essential APIs of joi. **Almost** all the APIs are the same as the original APIs, but limitations **exists**. That is why I create a new package.

typesafe-joi currently matches the API of @hapi/joi 15.x. And it requires TypeScript >=3.0.0 to work.

> NOTE: typesafe-joi is still WIP. Sorry but I do not have enough time to write a unit test for it. Please feel free to open an issue when you find bugs or suggestions. I am glad to help!

## What’s the difference?

The JavaScript APIs of typesafe-joi and joi are **identical**. However, its type definition lacks of the type information of the “value” behind the schema. That means, JavaScript knows what the validated object look like at runtime, but TypeScript does not know it at all at compile time. typesafe-joi records more information into schemas so that TypeScript is able to know what object you are validating at compile time.

Unfortunately *not all* joi APIs are able to be properly described in TypeScript. See [Reference](#Reference) for more information.

## Usage

Import and use joi from `typesafe-joi`:

```typescript
import * as Joi from 'typesafe-joi'
```

The TypeScript magic is shown when you call `.validate` or `.attempt`:

```typescript
const data: any = dataFromAnywhere

// { foo?: string } | undefined
Joi.object({ foo: Joi.string() }).validate(data).value

// { id: number, email?: string }[]
Joi.attempt(data, Joi.array()
  .items({
    id: Joi.number().integer().required(),
    email: Joi.string().email()
  })
  .required()
)
```

You can also use `Literal` to pull the data type out of the schema:

```typescript
const schema = Joi.array()
  .items({
    id: Joi.number().integer().required(),
    email: Joi.string().email()
  })
  .required()

type T = Joi.Literal<typeof schema>
```

> NOTE: I suggest to turn on `strict` option in the compiler options of TypeScript.

## Typecasting

Not every API of typesafe-joi matches the original joi in types. typesafe-joi provides typecast helpers in case you have to define the resulting type manually.

```typescript
// 'foo'
Joi.string().required() as Joi.Cast.String<'foo'>
```

If the typecast includes `undefined` type, the key will be optional.

```typescript
// { foo?: Foo }
Joi.object({ foo: number().required() as Joi.Cast.Object<Foo | undefined> })
```

Typecasting means you have to define everything by yourself. Schema attributes like `allow` is discarded.

```typescript
// number | 'foo' | true
Joi.number().allow('foo').default(true)

// 123
Joi.number().allow('foo').default(true) as Joi.Cast.Number<123>
```

 TypeScript may complain about type mismatch. In this case assert the expression to `any` firstly.

```typescript
// Error
Joi.object({
  foo: Joi.object().pattern(/\d+/, 1).allow(1) as Joi.Cast.Object<Foo>
})

// { map: Foo | 1 }
Joi.object({
  foo: Joi.object().pattern(/\d+/, 1).allow(1) as any as Joi.Cast.Object<Foo | 1>
})
```

I recommend *not* to use the schema anymore after typecast. The behavior will be undefined.

Supported schema types to cast:

* `Cast.Alternatives`
* `Cast.Any`
* `Cast.Array`
* `Cast.Binary`
* `Cast.Boolean`
* `Cast.Date`
* `Cast.Function`
* `Cast.Lazy`
* `Cast.Number`
* `Cast.Object`
* `Cast.String`

## Reference

Here is a list of APIs of joi.

* ✅ - Fully supported
* ✔️ - Supported but might be incorrect (not well tested)
* ⚠️ - Partially supported (with limitations)
* ❌ - Not supported (however you can use it without auto type generation)
* 🔘 - Supported but *no type generation needed*

| API | Status | Note |
|-----|--------|------|
| [Joi](https://github.com/hapijs/joi/blob/master/API.md#joi) | | |
| [`version`](https://github.com/hapijs/joi/blob/master/API.md#version) | 🔘 | |
| [`validate(value, schema, [options], [callback])`](https://github.com/hapijs/joi/blob/master/API.md#validatevalue-schema-options-callback) | ✅ | |
| [`compile(schema)`](https://github.com/hapijs/joi/blob/master/API.md#compileschema) | ✔️ | |
| [`describe(schema)`](https://github.com/hapijs/joi/blob/master/API.md#describeschema) | 🔘 | |
| [`assert(value, schema, [message])`](https://github.com/hapijs/joi/blob/master/API.md#assertvalue-schema-message) | ✅ | |
| [`attempt(value, schema, [message])`](https://github.com/hapijs/joi/blob/master/API.md#attemptvalue-schema-message) | ✅ | |
| [`ref(key, [options])`](https://github.com/hapijs/joi/blob/master/API.md#refkey-options) | 🔘 | |
| [`isRef(ref)`](https://github.com/hapijs/joi/blob/master/API.md#isrefref) | 🔘 | |
| [`reach(schema, path)`](https://github.com/hapijs/joi/blob/master/API.md#reachschema-path) | ❌      | |
| [`defaults(fn)`](https://github.com/hapijs/joi/blob/master/API.md#defaultsfn) | 🔘 | |
| [`bind()`](https://github.com/hapijs/joi/blob/master/API.md#bind) | 🔘 | |
| [`extend(extension)`](https://github.com/hapijs/joi/blob/master/API.md#extendextension) | 🔘 | Requires [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) to typesafe-joi |
| **[any](https://github.com/hapijs/joi/blob/master/API.md#any)** | | |
| [`any.validate(value, [options], [callback])`](https://github.com/hapijs/joi/blob/master/API.md#anyvalidatevalue-options-callback) | ✅ | |
| [`any.allow(value)`](https://github.com/hapijs/joi/blob/master/API.md#anyallowvalue) | ✅ | |
| [`any.valid(value)`](https://github.com/hapijs/joi/blob/master/API.md#anyvalidvalue---aliases-only-equal) | ✅ | |
| [`any.invalid(value)`](https://github.com/hapijs/joi/blob/master/API.md#anyinvalidvalue---aliases-disallow-not) | ✅ |  |
| [`any.required()`](https://github.com/hapijs/joi/blob/master/API.md#anyrequired---aliases-exist) | ✅ | |
| [`any.optional()`](https://github.com/hapijs/joi/blob/master/API.md#anyoptional) | ✅ | |
| [`any.forbidden()`](https://github.com/hapijs/joi/blob/master/API.md#anyforbidden) | ✅ | |
| [`any.strip()`](https://github.com/hapijs/joi/blob/master/API.md#anystrip) | ⚠️ | The object key will still exist. It will have `never` type. |
| [`any.description(desc)`](https://github.com/hapijs/joi/blob/master/API.md#anydescriptiondesc) | 🔘 | |
| [`any.notes(notes)`](https://github.com/hapijs/joi/blob/master/API.md#anynotesnotes) | 🔘 | |
| [`any.tags(tags)`](https://github.com/hapijs/joi/blob/master/API.md#anytagstags) | 🔘 | |
| [`any.meta(meta)`](https://github.com/hapijs/joi/blob/master/API.md#anymetameta) | 🔘 | |
| [`any.example(...values)`](https://github.com/hapijs/joi/blob/master/API.md#anyexamplevalues) | 🔘 | |
| [`any.unit(name)`](https://github.com/hapijs/joi/blob/master/API.md#anyunitname) | 🔘 | |
| [`any.options(options)`](https://github.com/hapijs/joi/blob/master/API.md#anyoptionsoptions) | 🔘 | To properly use typesafe-joi, do not change `convert`, `presence`, `noDefaults`. |
| [`any.strict(isStrict)`](https://github.com/hapijs/joi/blob/master/API.md#anystrictisstrict) | 🔘 | |
| [`any.default(value, [description])`](https://github.com/hapijs/joi/blob/master/API.md#anydefaultvalue-description) | ⚠️ | Manually define the default type when  using reference as default. |
| [`any.concat(schema)`](https://github.com/hapijs/joi/blob/master/API.md#anyconcatschema) | ✔️ | |
| [`any.when(condition, options)`](https://github.com/hapijs/joi/blob/master/API.md#anywhencondition-options) | ✔️ | |
| [`any.label(name)`](https://github.com/hapijs/joi/blob/master/API.md#anylabelname) | 🔘 | |
| [`any.raw(isRaw)`](https://github.com/hapijs/joi/blob/master/API.md#anyrawisraw) | 🔘 | |
| [`any.empty(schema)`](https://github.com/hapijs/joi/blob/master/API.md#anyemptyschema) | ❌      | |
| [`any.error(err, [options])`](https://github.com/hapijs/joi/blob/master/API.md#anyerrorerr-options) | 🔘 | |
| [`any.describe()`](https://github.com/hapijs/joi/blob/master/API.md#anydescribe) | 🔘 | |
| **[array](https://github.com/hapijs/joi/blob/master/API.md#array---inherits-from-any)** | | |
| [`array.sparse([enabled])`](https://github.com/hapijs/joi/blob/master/API.md#arraysparseenabled) | ✅ | |
| [`array.single([enabled])`](https://github.com/hapijs/joi/blob/master/API.md#arraysingleenabled) | 🔘 | |
| [`array.items(type)`](https://github.com/hapijs/joi/blob/master/API.md#arrayitemstype) | ✅ | |
| [`array.ordered(type)`](https://github.com/hapijs/joi/blob/master/API.md#arrayorderedtype) | ⚠️ | No actual item order in the resulting type |
| [`array.min(limit)`](https://github.com/hapijs/joi/blob/master/API.md#arrayminlimit) | 🔘 | |
| [`array.max(limit)`](https://github.com/hapijs/joi/blob/master/API.md#arraymaxlimit) | 🔘 | |
| [`array.length(limit)`](https://github.com/hapijs/joi/blob/master/API.md#arraylengthlimit) | 🔘 | |
| [`array.unique([comparator], [options])`](https://github.com/hapijs/joi/blob/master/API.md#arrayuniquecomparator-options) | 🔘 | |
| [`array.has(schema)`](https://github.com/hapijs/joi/blob/master/API.md#arrayhasschema) | 🔘 | |
| **[boolean](https://github.com/hapijs/joi/blob/master/API.md#boolean---inherits-from-any)** | | |
| [`boolean.truthy(value)`](https://github.com/hapijs/joi/blob/master/API.md#booleantruthyvalue) | 🔘 | |
| [`boolean.falsy(value)`](https://github.com/hapijs/joi/blob/master/API.md#booleanfalsyvalue) | 🔘 | |
| [`boolean.insensitive([enabled])`](https://github.com/hapijs/joi/blob/master/API.md#booleaninsensitiveenabled) | 🔘 | |
| **[binary](https://github.com/hapijs/joi/blob/master/API.md#binary---inherits-from-any)** | | |
| [`binary.encoding(encoding)`](https://github.com/hapijs/joi/blob/master/API.md#binaryencodingencoding) | 🔘 | |
| [`binary.min(limit)`](https://github.com/hapijs/joi/blob/master/API.md#binaryminlimit) | 🔘 | |
| [`binary.max(limit)`](https://github.com/hapijs/joi/blob/master/API.md#binarymaxlimit) | 🔘 | |
| [`binary.length(limit)`](https://github.com/hapijs/joi/blob/master/API.md#binarylengthlimit) | 🔘 | |
| **[date](https://github.com/hapijs/joi/blob/master/API.md#date---inherits-from-any)** | | |
| [`date.min(date)`](https://github.com/hapijs/joi/blob/master/API.md#datemindate) | 🔘 | |
| [`date.max(date)`](https://github.com/hapijs/joi/blob/master/API.md#datemaxdate) | 🔘 | |
| [`date.greater(date)`](https://github.com/hapijs/joi/blob/master/API.md#dategreaterdate) | 🔘 | |
| [`date.less(date)`](https://github.com/hapijs/joi/blob/master/API.md#datelessdate) | 🔘 | |
| [`date.iso()`](https://github.com/hapijs/joi/blob/master/API.md#dateiso) | 🔘 | |
| [`date.timestamp([type])`](https://github.com/hapijs/joi/blob/master/API.md#datetimestamptype) | 🔘 | |
| **[func](https://github.com/hapijs/joi/blob/master/API.md#func---inherits-from-any)** | | |
| [`func.arity(n)`](https://github.com/hapijs/joi/blob/master/API.md#funcarityn) | 🔘 | |
| [`func.minArity(n)`](https://github.com/hapijs/joi/blob/master/API.md#funcminarityn) | 🔘 | |
| [`func.maxArity(n)`](https://github.com/hapijs/joi/blob/master/API.md#funcmaxarityn) | 🔘 | |
| [`func.class()`](https://github.com/hapijs/joi/blob/master/API.md#funcclass) | 🔘 | |
| [`func.ref()`](https://github.com/hapijs/joi/blob/master/API.md#funcref) | 🔘 | |
| **[number](https://github.com/hapijs/joi/blob/master/API.md#number---inherits-from-any)** | | |
| [`number.unsafe([enabled])`](https://github.com/hapijs/joi/blob/master/API.md#numberunsafeenabled) | 🔘 | |
| [`number.min(limit)`](https://github.com/hapijs/joi/blob/master/API.md#numberminlimit) | 🔘 | |
| [`number.max(limit)`](https://github.com/hapijs/joi/blob/master/API.md#numbermaxlimit) | 🔘 | |
| [`number.greater(limit)`](https://github.com/hapijs/joi/blob/master/API.md#numbergreaterlimit) | 🔘 | |
| [`number.less(limit)`](https://github.com/hapijs/joi/blob/master/API.md#numberlesslimit) | 🔘 | |
| [`number.integer()`](https://github.com/hapijs/joi/blob/master/API.md#numberinteger) | 🔘 | |
| [`number.precision(limit)`](https://github.com/hapijs/joi/blob/master/API.md#numberprecisionlimit) | 🔘 | |
| [`number.multiple(base)`](https://github.com/hapijs/joi/blob/master/API.md#numbermultiplebase) | 🔘 | |
| [`number.positive()`](https://github.com/hapijs/joi/blob/master/API.md#numberpositive) | 🔘 | |
| [`number.negative()`](https://github.com/hapijs/joi/blob/master/API.md#numbernegative) | 🔘 | |
| [`number.port()`](https://github.com/hapijs/joi/blob/master/API.md#numberport) | 🔘 | |
| **[object](https://github.com/hapijs/joi/blob/master/API.md#object---inherits-from-any)** | | |
| [`object.keys([schema])`](https://github.com/hapijs/joi/blob/master/API.md#objectkeysschema) | ✅ | |
| [`object.append([schema])`](https://github.com/hapijs/joi/blob/master/API.md#objectappendschema) | ✅ | |
| [`object.min(limit)`](https://github.com/hapijs/joi/blob/master/API.md#objectminlimit) | ❌      | |
| [`object.max(limit)`](https://github.com/hapijs/joi/blob/master/API.md#objectmaxlimit) | ❌      | |
| [`object.length(limit)`](https://github.com/hapijs/joi/blob/master/API.md#objectlengthlimit) | ❌      | |
| [`object.pattern(pattern, schema)`](https://github.com/hapijs/joi/blob/master/API.md#objectpatternpattern-schema) | ⚠️ | The result type of `pattern` may be useless. |
| [`object.and(peers)`](https://github.com/hapijs/joi/blob/master/API.md#objectandpeers) | ❌      | |
| [`object.nand(peers)`](https://github.com/hapijs/joi/blob/master/API.md#objectnandpeers) | ❌      | |
| [`object.or(peers)`](https://github.com/hapijs/joi/blob/master/API.md#objectorpeers) | ❌      | |
| [`object.xor(peers)`](https://github.com/hapijs/joi/blob/master/API.md#objectxorpeers) | ❌      | |
| [`object.oxor(...peers)`](https://github.com/hapijs/joi/blob/master/API.md#objectoxorpeers) | ❌      | |
| [`object.with(key, peers)`](https://github.com/hapijs/joi/blob/master/API.md#objectwithkey-peers) | ❌      | |
| [`object.without(key, peers)`](https://github.com/hapijs/joi/blob/master/API.md#objectwithoutkey-peers) | ❌      | |
| [`object.rename(from, to, [options])`](https://github.com/hapijs/joi/blob/master/API.md#objectrenamefrom-to-options) | ❌      | |
| [`object.assert(ref, schema, [message])`](https://github.com/hapijs/joi/blob/master/API.md#objectassertref-schema-message) | 🔘 | |
| [`object.unknown([allow])`](https://github.com/hapijs/joi/blob/master/API.md#objectunknownallow) | 🔘 | |
| [`object.type(constructor, [name])`](https://github.com/hapijs/joi/blob/master/API.md#objecttypeconstructor-name) | ⚠️ | If you need to combine `keys` and `type`, make sure `type` is the last call (`.keys(...).type(...)`), or the resulting type will be incorrect. |
| [`object.schema()`](https://github.com/hapijs/joi/blob/master/API.md#objectschema) | ⚠️ | Same as `type`. |
| [`object.requiredKeys(children)`](https://github.com/hapijs/joi/blob/master/API.md#objectrequiredkeyschildren) | ⚠️ | Nested key is not supported (e.g. `a.b`, `a.b.c`). |
| [`object.optionalKeys(children)`](https://github.com/hapijs/joi/blob/master/API.md#objectoptionalkeyschildren) | ⚠️ | Nested key is not supported (e.g. `a.b`, `a.b.c`). |
| [`object.forbiddenKeys(children)`](https://github.com/hapijs/joi/blob/master/API.md#objectforbiddenkeyschildren) | ⚠️ | Nested key is not supported (e.g. `a.b`, `a.b.c`). |
| **[string](https://github.com/hapijs/joi/blob/master/API.md#string---inherits-from-any)** | | |
| [`string.insensitive()`](https://github.com/hapijs/joi/blob/master/API.md#stringinsensitive) | 🔘 | |
| [`string.min(limit, [encoding])`](https://github.com/hapijs/joi/blob/master/API.md#stringminlimit-encoding) | 🔘 | |
| [`string.max(limit, [encoding])`](https://github.com/hapijs/joi/blob/master/API.md#stringmaxlimit-encoding) | 🔘 | |
| [`string.truncate([enabled])`](https://github.com/hapijs/joi/blob/master/API.md#stringtruncateenabled) | 🔘 | |
| [`string.creditCard()`](https://github.com/hapijs/joi/blob/master/API.md#stringcreditcard) | 🔘 | |
| [`string.length(limit, [encoding])`](https://github.com/hapijs/joi/blob/master/API.md#stringlengthlimit-encoding) | 🔘 | |
| [`string.regex(pattern, [options])`](https://github.com/hapijs/joi/blob/master/API.md#stringregexpattern-name--options) | 🔘 | |
| [`string.replace(pattern, replacement)`](https://github.com/hapijs/joi/blob/master/API.md#stringreplacepattern-replacement) | 🔘 | |
| [`string.alphanum()`](https://github.com/hapijs/joi/blob/master/API.md#stringalphanum) | 🔘 | |
| [`string.token()`](https://github.com/hapijs/joi/blob/master/API.md#stringtoken) | 🔘 | |
| [`string.email([options])`](https://github.com/hapijs/joi/blob/master/API.md#stringemailoptions) | 🔘 | |
| [`string.ip([options])`](https://github.com/hapijs/joi/blob/master/API.md#stringipoptions) | 🔘 | |
| [`string.uri([options])`](https://github.com/hapijs/joi/blob/master/API.md#stringurioptions) | 🔘 | |
| [`string.guid()` - aliases: `uuid`](https://github.com/hapijs/joi/blob/master/API.md#stringguid---aliases-uuid) | 🔘 | |
| [`string.hex([options])`](https://github.com/hapijs/joi/blob/master/API.md#stringhexoptions) | 🔘 | |
| [`string.base64([options])`](https://github.com/hapijs/joi/blob/master/API.md#stringbase64options) | 🔘 | |
| [`string.dataUri([options])`](https://github.com/hapijs/joi/blob/master/API.md#stringdataurioptions) | 🔘 | |
| [`string.hostname()`](https://github.com/hapijs/joi/blob/master/API.md#stringhostname) | 🔘 | |
| [`string.normalize([form])`](https://github.com/hapijs/joi/blob/master/API.md#stringnormalizeform) | 🔘 | |
| [`string.lowercase()`](https://github.com/hapijs/joi/blob/master/API.md#stringlowercase) | 🔘 | |
| [`string.uppercase()`](https://github.com/hapijs/joi/blob/master/API.md#stringuppercase) | 🔘 | |
| [`string.trim([enabled])`](https://github.com/hapijs/joi/blob/master/API.md#stringtrimenabled) | 🔘 | |
| [`string.isoDate()`](https://github.com/hapijs/joi/blob/master/API.md#stringisodate) | 🔘 | |
| **[symbol](https://github.com/hapijs/joi/blob/master/API.md#symbol---inherits-from-any)** | | |
| [`symbol.map(map)`](https://github.com/hapijs/joi/blob/master/API.md#symbolmapmap) | 🔘 | |
| **[alternatives](https://github.com/hapijs/joi/blob/master/API.md#alternatives---inherits-from-any)** | | Array literal alternatives schema is not supported yet. |
| [`alternatives.try(schemas)`](https://github.com/hapijs/joi/blob/master/API.md#alternativestryschemas) | ✅ | |
| [`alternatives.when(condition, options)`](https://github.com/hapijs/joi/blob/master/API.md#alternativeswhencondition-options) | ✔️ | |
| **[lazy](https://github.com/hapijs/joi/blob/master/API.md#lazyfn-options---inherits-from-any)** | | |

## Contribution

Feel free to submit an issue or PR if you have any ideas, or found any bugs.

## License

MIT
