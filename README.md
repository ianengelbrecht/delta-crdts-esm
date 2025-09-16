# delta-crdts-esm

An ESM port of [delta-crdts](https://www.npmjs.com/package/delta-crdts), just to make it a bit easier to work with, and with some updates to newer dependencies. See that page for the docs. Version number continues from there.

```
npm install delta-crdts-esm
import CRDT from 'delta-crdts-esm
const RGA = CRDT('rga')
etc...
```

A tremendous thank you to the author for the comprehensive test suit, updates would not have been impossible without it. 

Note these errors in that documentation:
- `lwwreg.write()` takes two parameters, timestamp and value.
- others to follow...



