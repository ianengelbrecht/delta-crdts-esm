/* eslint-env mocha */
'use strict'

import { expect } from 'chai'
import CRDT from '../src/index.js'
import transmit from './helpers/transmit.js'

describe('mvreg', () => {
  describe('local', () => {
    let MVReg
    let mvreg
    let delta

    it('type can be created', () => {
      MVReg = CRDT('mvreg')
    })

    it('can be instantiated', () => {
      mvreg = MVReg('id1')
    })

    it('indicates its type', () => {
      expect(mvreg.type).to.equal('mvreg')
    })

    it('starts empty', () => {
      expect(mvreg.value().size).to.equal(0)
    })

    it('can write value', () => {
      mvreg.write('a')
      delta = mvreg.write('b')
    })

    it('delta has __crdt property', () => {
      expect(delta).to.have.property('__crdt')
    })

    it('has the type on the delta', () => {
      expect(delta.__crdt.type).to.equal('mvreg')
    })

    it('and the value is inserted', () => {
      expect(Array.from(mvreg.value())).to.deep.equal(['b'])
    })
  })

  describe('together', () => {
    let MVReg = CRDT('mvreg')

    let replica1, replica2
    let deltas = [[], []]
    before(() => {
      replica1 = MVReg('id1')
      replica2 = MVReg('id2')
    })

    it('values can be written concurrently', () => {
      deltas[0].push(replica1.write('hello'))
      deltas[0].push(replica1.write('world'))
      deltas[1].push(replica2.write('world'))
      deltas[1].push(replica2.write('hello'))
    })

    it('has local values', () => {
      expect(Array.from(replica1.value()).sort()).to.deep.equal(['world'])
      expect(Array.from(replica2.value()).sort()).to.deep.equal(['hello'])
    })

    it('changes can be raw joined', () => {
      const state = MVReg('joiner').join(transmit(replica1.state()), transmit(replica2.state()))
      const replica = MVReg('replica')
      replica.apply(state)
      expect(Array.from(replica.value()).sort()).to.deep.equal(['hello', 'world'])
    })

    it('changes from one can be joined to the other', () => {
      deltas[0].forEach((delta) => replica2.apply(transmit(delta)))
    })

    it('and vice versa', () => {
      deltas[1].forEach((delta) => replica1.apply(transmit(delta)))
    })

    it('the first converges', () => {
      expect(Array.from(replica1.value()).sort()).to.deep.equal(['hello', 'world'])
    })

    it('and the second also converges', () => {
      expect(Array.from(replica2.value()).sort()).to.deep.equal(['hello', 'world'])
    })

    it('binary ids also converge', () => {
      const replicaA = MVReg(Buffer.from('idA'))
      const deltaA = replicaA.write('a')
      const replicaB = MVReg(Buffer.from('idB'))
      replicaB.apply(deltaA)
      const deltaB = replicaB.write('b')
      replicaA.apply(deltaB)
      expect(Array.from(replicaA.value()).sort()).to.deep.equal(['b'])
    })
  })
})
