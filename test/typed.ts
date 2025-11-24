import CRDT, { MVRegFactory } from "../src/index.js";

// ---- Example with specific types ----
const MVRegFactory = CRDT("mvreg") as MVRegFactory<string>;
const mvreg1 = MVRegFactory("my-mvreg-1");
const d1 = mvreg1.write("hello");
const d2 = mvreg1.write("world");

const mvreg2 = MVRegFactory("my-mvreg-2");
mvreg2.apply(d1);
mvreg2.apply(d2);
console.log(mvreg2.value()); // Set { 'hello', 'world' }

