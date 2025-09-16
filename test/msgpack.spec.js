import { expect } from 'chai'
import { encode, decode } from '../src/index.js';

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

  const encodableMapsAndSets = [1, 'a', { b: 'c' }, new Set(['d']), new Map([['e', new Set([new Map([['f', 'g']])])]])]

  let encodedObject, encodedSetMap
  before(() => { encodedObject = encode(object) })
  before(() => { encodedSetMap = encode(encodableMapsAndSets) })

  it('encodes objects', () => {
    expect(encodedObject instanceof Uint8Array).to.be.true;
  });

  it('decodes objects', () => {
    const decoded = decode(encodedObject);
    expect(decoded).to.deep.equal(object);
  });


  encodedSetMap = encode(encodableMapsAndSets)

  it('encodes sets and maps', () => {
    expect(encodedSetMap instanceof Uint8Array).to.be.true
  })

  it('decodes sets and maps', () => {
    const decoded = decode(encodedSetMap)
    expect(decoded).to.deep.equal(encodableMapsAndSets)
  })
})