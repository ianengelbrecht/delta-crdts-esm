# delta-crdts-esm

An ESM port of [delta-crdts](https://www.npmjs.com/package/delta-crdts), just to make it a bit easier to work with, and with some updates to newer dependencies. See that page for the docs and a video demonstration. Version number continues from there. A tremendous thank you to the original author for the comprehensive test suite, updates would have been impossible without it.

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

Note also that joining states or deltas requires a CRDT instance (e.g. MVREG('random').join()), and not the CRDT factory as indicated in the documentation.

The CRDT type ('gcounter', 'rga', etc) is also now accessible with [mycrdtinstance].type, and on deltas with [mydeltainstance].__crdt.type.

Also moved the MessagePack codec here so an additional dependency is not necessary. It will encode/decode plain deltas, CRDT state, and more complex objects containing CRDT state/deltas. 
```
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
```
This works fine for transmitting over the wire, but if you're saving to a database, you probably only want to encode/decode the deltas or CRDTs themselves and not the associated metadata.