# delta-crdts-esm

### This is a fork
An ESM/Typescript port of [delta-crdts](https://www.npmjs.com/package/delta-crdts), just to make it a bit easier to work with, and with some updates to newer dependencies. See the original page for the docs and a video demonstration. 

A tremendous thank you to the original author for the comprehensive test suite, updates would have been impossible without it.

```
npm install delta-crdts-esm
import CRDT from 'delta-crdts-esm'
const RGA = CRDT('rga');
const rga = RGA('identifier')
etc...
```

Note these omissions in the original documentation:
- `lwwreg.write()` takes two parameters, timestamp and value.
- `rwlwwset.add()` and `rwlwwset.remove()` also take timestamp, value.

Timestamps can be anything comparable with < and > but you probably want to use something like an [HLC](https://www.npmjs.com/package/@tpp/hybrid-logical-clock).

Note also that joining states or deltas requires a CRDT instance (e.g. MVREG('random').join()), and not the CRDT factory as indicated in the original documentation.

The CRDT type ('gcounter', 'rga', etc.) is also now accessible with [mycrdtinstance].type, and on deltas with [mydeltainstance].__crdt.type.

### Encoding and decoding

Also moved the MessagePack codec here so an additional dependency is not necessary. It will encode/decode plain deltas, CRDT state, and more complex objects containing CRDT state/deltas. 

```js
import { encode, decode } from 'delta-crdts-esm'

const object = {
  nil: null,
  integer: 1,
  float: Math.PI,
  string: "Hello, world!",
  binary: Uint8Array.from([1, 2, 3]),
  array: [10, 20, 30],
  map: { foo: "bar" },
  delta: someCRDTDelta, 
  timestampExt: new Date(),
};

const encoded = encode(object); 
const decoded = decode(encoded);
```
This works fine for transmitting over the wire, but if you're saving to a database, you probably only want to encode/decode the deltas or CRDTs themselves and not the associated metadata.

### Types

With types:

```ts
import CRDT, { type RGAFactory } from "delta-crdts-esm";

const RGA = CRDT("rga") as RGAFactory<string>;
const rga = RGA("list");

rga.push("hello");
rga.push("world");

const list = rga.value();

```

And we also have instance types:

```ts
import type { MVRegInstance } from "delta-crdts-esm";

let mvreg: MVRegInstance<string>;
```

#### Dev
Run the test Typescript file as follows:

`node --loader ts-node/esm test/typed.ts`

### Acknowledgements

ChatGPT ^5.0 did most of the work here...