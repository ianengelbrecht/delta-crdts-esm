/* eslint-env mocha */
'use strict'

import { expect } from 'chai'
import CRDT from '../src/index.js'

const ZERO = {
  initial: () => 0,
  join: (s1, s2) => 0,
  value: (state) => state
}


describe('extension', () => {
  let Type, replica

  it('allows user to register extension', () => {
    CRDT.define('zero', ZERO)
  })

  it('allows to create type', () => {
    Type = CRDT('zero')
  })

  it('allows to create a replica', () => {
    replica = Type('node id')
  })

  it('replica is working', () => {
    expect(replica.value()).to.equal(0)
    replica.apply('whatever')
    expect(replica.value()).to.equal(0)
  })
})
