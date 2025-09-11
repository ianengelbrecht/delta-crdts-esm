/* eslint-env mocha */
'use strict'

import { expect } from 'chai'
import CRDT from '../src/index.js'
import transmit from './helpers/transmit.js'

describe('pncounter', () => {
  describe('local', () => {
    let PNCounter
    let pncounter
    it('type can be created', () => {
      PNCounter = CRDT('pncounter')
    })

    it('can be instantiated', () => {
      pncounter = PNCounter('id1')
    })

    it('starts with a value of 0', () => {
      expect(pncounter.value()).to.equal(0)
    })

    it('can be incremented', () => {
      pncounter.inc()
    })

    it('and the value is incremented', () => {
      expect(pncounter.value()).to.equal(1)
    })

    it('can be decremented', () => {
      pncounter.dec()
    })

    it('and the value is decremented', () => {
      expect(pncounter.value()).to.equal(0)
    })
  })

  describe('together', () => {
    let GCounter = CRDT('gcounter')

    let replica1, replica2
    let deltas = [[], []]
    before(() => {
      replica1 = GCounter('id1')
      replica2 = GCounter('id2')
    })

    it('can be incremented', () => {
      deltas[0].push(replica1.inc())
      deltas[0].push(replica1.inc())
      deltas[1].push(replica2.inc())
      deltas[1].push(replica2.inc())
    })

    it('changes from one can be joined to the other', () => {
      deltas[0].forEach((delta) => replica2.apply(transmit(delta)))
    })

    it('and vice versa', () => {
      deltas[1].forEach((delta) => replica1.apply(transmit(delta)))
    })

    it('the first converges', () => {
      expect(replica1.value()).to.equal(4)
    })
    it('and the second also converges', () => {
      expect(replica2.value()).to.equal(4)
    })
  })
})
