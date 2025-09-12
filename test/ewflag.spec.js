/* eslint-env mocha */
'use strict'

import { expect } from 'chai'
import CRDT from '../src/index.js'
import transmit from './helpers/transmit.js'

describe('ewflag', () => {
  describe('local', () => {
    let EWFlag
    let ewflag
    it('type can be created', () => {
      EWFlag = CRDT('ewflag')
    })

    it('can be instantiated', () => {
      ewflag = EWFlag('id1')
    })

    it('starts false', () => {
      expect(ewflag.value()).to.equal(false)
    })

    it('can be enabled', () => {
      ewflag.enable()
    })

    it('and the value is true', () => {
      expect(ewflag.value()).to.equal(true)
    })
  })

  describe('together', () => {
    let EWFlag = CRDT('ewflag')

    let replica1, replica2
    let deltas = [[], []]
    before(() => {
      replica1 = EWFlag('id1')
      replica2 = EWFlag('id2')
    })

    it('values can be written concurrently', () => {
      deltas[0].push(replica1.enable())
      deltas[0].push(replica1.disable())
      deltas[1].push(replica2.disable())
      deltas[1].push(replica2.enable())
    })

    it('has local values', () => {
      expect(replica1.value()).to.equal(false)
      expect(replica2.value()).to.equal(true)
    })

    it('changes can be raw joined', () => {
      const state = EWFlag('joiner').join(transmit(replica1.state()), transmit(replica2.state()))
      const replica = EWFlag('replica')
      replica.apply(state)
      expect(replica.value()).to.equal(true)
    })

    it('changes from one can be joined to the other', () => {
      deltas[0].forEach((delta) => replica2.apply(transmit(delta)))
    })

    it('and vice versa', () => {
      deltas[1].forEach((delta) => replica1.apply(transmit(delta)))
    })

    it('the first converges', () => {
      expect(replica1.value()).to.equal(true)
    })

    it('and the second also converges', () => {
      expect(replica2.value()).to.equal(true)
    })
  })
})
