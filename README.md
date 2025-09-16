# delta-crdts-esm

An ESM port of [delta-crdts](https://www.npmjs.com/package/delta-crdts), just to make it a bit easier to work with, and with some updates to newer dependencies. See that page for the docs. Version number continues from there.

```
npm install delta-crdts-esm
import CRDT from 'delta-crdts-esm'
const RGA = CRDT('rga');
etc...
```

Also moved the MessagePack codec here so an additional package is not necessary. It will encode/decode plain deltas, CRDT state, and more complex objects containing CRDT state/deltas. 
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
  timestampExt: new Date(),
};

const encoded = encode(object); 
```

A tremendous thank you to the author for the comprehensive test suit, updates would not have been impossible without it. 

Note these errors in that documentation:
- `lwwreg.write()` takes two parameters, timestamp and value.
- others to follow...



