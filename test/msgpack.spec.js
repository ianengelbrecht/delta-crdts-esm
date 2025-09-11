import { expect } from 'chai'
import { encode, decode } from '../src/msgpack.js';

describe('msgpack', () => {

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

  it('encodes objects', () => {
    const encoded = encode(object);
    expect(encoded instanceof Uint8Array).to.be.true;
  });

  it('decodes objects', () => {
    const decoded = decode(encoded);
    expect(decoded).to.deep.equal(object);
  });

  const encodable = [1, 'a', { b: 'c' }, new Set(['d']), new Map([['e', new Set([new Map([['f', 'g']])])]])]
  let encoded
  it('encodes sets and maps', () => {
    encoded = codec.encode(encodable)
    expect(encoded instanceof Uint8Array).to.be.true
  })

  it('decodes sets and maps', () => {
    const decoded = codec.decode(encoded)
    expect(decoded).to.deep.equal(encodable)
  })
})