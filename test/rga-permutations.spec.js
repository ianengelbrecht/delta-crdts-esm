/* eslint-env mocha */
// this was updated from the original to remove Combinations, which was causing heap overflow
// note this takes a long time to run and should probably not be part of normal CI runs; run manually as needed
'use strict'

import shuffle from 'shuffle-array'
import delay from 'delay'
import { expect } from 'chai'
import CRDT from '../src/index.js'
import transmit from './helpers/transmit.js'

const RGA = CRDT('rga')

const MAX_ITERATIONS = 5
const OP_COUNT_PER_NODE = 10
const MAX_ANALYZED_PERMUTATIONS = 1000

describe('rga permutations', function () {
  this.timeout(200000)

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    describe(`iteration ${iteration}`, () => {
      let replicas
      let allDeltas = []
      let length = 0

      before(() => {
        replicas = [RGA('id1'), RGA('id2'), RGA('id3')]
      })

      describe(`push mutations (${iteration + 1})`, () => {
        let expectedResult
        let newDeltas

        before(() => {
          const { deltas, expectedResult: _expectedResult } = pushMutations(replicas)
          newDeltas = deltas
          expectedResult = _expectedResult
          expect(expectedResult.length).to.equal(length + OP_COUNT_PER_NODE * replicas.length)
          length = expectedResult.length
        })

        after(() => {
          allDeltas = allDeltas.concat(newDeltas)
        })

        it('all (sampled) orders lead to the same result', async () => {
          const deltas = newDeltas

          // Deterministic orders first (good for debugging)
          const deterministicOrders = [
            [...deltas],                      // original order
            [...deltas].reverse(),            // reverse order
            // stable stringified order (fallback if deltas have no natural comparator)
            [...deltas].slice().sort((a, b) => String(a).localeCompare(String(b)))
          ]

          for (const order of deterministicOrders) {
            const r = RGA('read')
            for (const d of order) r.apply(transmit(d))
            expect(r.value()).to.deep.equal(expectedResult)
          }

          // Random shuffles (no allocation blow-up)
          for (let i = 0; i < MAX_ANALYZED_PERMUTATIONS; i++) {
            const perm = shuffle([...deltas]) // shuffle in place; we copied to avoid mutating source
            const r = RGA('read')
            for (const d of perm) r.apply(transmit(d))
            expect(r.value()).to.deep.equal(expectedResult)
            await delay(0) // yield to event loop to keep tests responsive
          }
        })
      })

      describe('random mutations', () => {
        let newDeltas
        let expectedResult

        before(() => {
          const { deltas, expectedResult: _expectedResult } = randomMutations(replicas, iteration)
          newDeltas = deltas
          expectedResult = _expectedResult

          // Sanity: applying all prior deltas + these deltas in original order yields expectedResult
          const r = RGA('read')
          for (const d of allDeltas) r.apply(transmit(d))
          for (const d of deltas) r.apply(transmit(d))
          expect(r.value()).to.deep.equal(expectedResult)

          // update running length
          length = expectedResult.length
        })

        after(() => {
          allDeltas = allDeltas.concat(newDeltas)
        })

        it('all (sampled) mutation orders lead to the same result', async () => {
          const baseline = [...allDeltas] // prior history stays fixed
          const deltas = newDeltas

          // Deterministic orders for the new deltas
          const deterministicOrders = [
            [...deltas],
            [...deltas].reverse(),
            [...deltas].slice().sort((a, b) => String(a).localeCompare(String(b)))
          ]

          for (const order of deterministicOrders) {
            const r = RGA('read')
            for (const d of baseline) r.apply(transmit(d))
            for (const d of order) r.apply(transmit(d))
            expect(r.value()).to.deep.equal(expectedResult)
          }

          // Random shuffles
          for (let i = 0; i < MAX_ANALYZED_PERMUTATIONS; i++) {
            const perm = shuffle([...deltas])
            const r = RGA('read')
            for (const d of baseline) r.apply(transmit(d))
            for (const d of perm) r.apply(transmit(d))
            expect(r.value()).to.deep.equal(expectedResult)
            await delay(0)
          }
        })
      })
    })
  }
})

function pushMutations(replicas) {
  const deltas = []
  replicas.forEach((replica, replicaIndex) => {
    for (let i = 0; i < OP_COUNT_PER_NODE; i++) {
      deltas.push(replica.push(`${replicaIndex}-${i}`))
    }
  })

  // apply each delta to every replica
  for (const delta of deltas) {
    for (const replica of replicas) {
      replica.apply(transmit(delta))
    }
  }

  // all replicas must converge
  let expectedResult
  for (const replica of replicas) {
    if (!expectedResult) {
      expectedResult = replica.value()
    } else {
      expect(replica.value()).to.deep.equal(expectedResult)
    }
  }

  return { deltas, expectedResult }
}

function randomMutations(replicas, iteration) {
  const deltas = []
  for (let i = 0; i < OP_COUNT_PER_NODE; i++) {
    replicas.forEach((replica, replicaIndex) => {
      // removeAt (if length > 0)
      let len = replica.value().length
      if (len > 0) {
        const index = Math.floor(Math.random() * len)
        deltas.push(replica.removeAt(index))
      }

      // insertAt
      len = replica.value().length
      const index = Math.floor(Math.random() * (len + 1))
      deltas.push(replica.insertAt(index, `${replicaIndex}-${iteration}-${i}`))
    })
  }

  // apply each delta to every replica
  for (const delta of deltas) {
    for (const replica of replicas) {
      replica.apply(transmit(delta))
    }
  }

  // all replicas must converge
  let expectedResult
  for (const replica of replicas) {
    const value = replica.value()
    if (!expectedResult) {
      expectedResult = value
    } else {
      expect(value).to.deep.equal(expectedResult)
    }
  }

  return { deltas, expectedResult }
}
