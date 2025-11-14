/* eslint-env mocha */
'use strict'

import { expect } from 'chai'
import CRDT from '../src/index.js'
import transmit from './helpers/transmit.js'

describe('aworset', () => {
  describe('local', () => {
    let AWORSet
    let aworset
    let delta

    it('type can be created', () => {
      AWORSet = CRDT('aworset')
    })

    it('can be instantiated', () => {
      aworset = AWORSet('id1')
    })

    it('indicates its type', () => {
      expect(aworset.type).to.equal('aworset')
    })

    it('starts empty', () => {
      expect(aworset.value().size).to.equal(0)
    })

    it('can add element', () => {
      delta = aworset.add('a')
    })

    it('delta has __crdt property', () => {
      expect(delta).to.have.property('__crdt')
    })

    it('has the type on the delta', () => {
      expect(delta.__crdt.type).to.equal('aworset')
    })

    it('and the value is inserted', () => {
      expect(Array.from(aworset.value())).to.deep.equal(['a'])
    })

    it('can remove element', () => {
      aworset.remove('a')
    })

    it('is now empty', () => {
      expect(aworset.value().size).to.equal(0)
    })

    it('deduplicates object with id', () => {
      aworset.add({ value: 'AAA' })
      aworset.add({ value: 'AAA' })
      expect(aworset.value().size).to.equal(1)
      expect(aworset.value()).to.deep.equal(new Set([{ value: 'AAA' }]))
    })

    it('can remove', () => {
      aworset.remove({ value: 'AAA' })
      expect(aworset.value().size).to.equal(0)
    })
  })

  describe('together', () => {
    let AWORSet = CRDT('aworset')

    let replica1, replica2
    let deltas = [[], []]
    before(() => {
      replica1 = AWORSet('id1')
      replica2 = AWORSet('id2')
    })

    it('elements can be added', () => {
      deltas[0].push(replica1.add('a'))
      deltas[0].push(replica1.add('b'))
      deltas[0].push(replica1.remove('b'))
      deltas[0].push(replica1.add('c'))
      deltas[1].push(replica2.add('a'))
      deltas[1].push(replica2.remove('a'))
      deltas[1].push(replica2.add('b'))
      deltas[1].push(replica2.add('d'))
      deltas[1].push(replica2.add('e'))
    })

    it('has local values', () => {
      expect(Array.from(replica1.value()).sort()).to.deep.equal(['a', 'c'])
      expect(Array.from(replica2.value()).sort()).to.deep.equal(['b', 'd', 'e'])
    })

    it('changes can be raw joined', () => {
      const state = AWORSet('joiner').join(transmit(replica1.state()), transmit(replica2.state()))
      const replica = AWORSet('replica')
      replica.apply(state)
      expect(Array.from(replica.value()).sort()).to.deep.equal(['a', 'b', 'c', 'd', 'e'])
    })

    it('changes from one can be joined to the other', () => {
      deltas[0].forEach((delta) => replica2.apply(transmit(delta)))
    })

    it('and vice versa', () => {
      deltas[1].forEach((delta) => replica1.apply(transmit(delta)))
    })

    it('the first converges', () => {
      expect(Array.from(replica1.value()).sort()).to.deep.equal(['a', 'b', 'c', 'd', 'e'])
    })
    it('and the second also converges', () => {
      expect(Array.from(replica2.value()).sort()).to.deep.equal(['a', 'b', 'c', 'd', 'e'])
    })
  })
})
