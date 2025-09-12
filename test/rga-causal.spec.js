/* eslint-env mocha */
'use strict'

import { expect } from 'chai'
import CRDT from '../src/index.js'
const RGA = CRDT('rga')
const rgaType = CRDT.type('rga')

describe('rga causal', () => {
  let deltaP, deltaE, deltaA, deltaR

  //create all the deltas
  before(() => {

    let consonants = RGA('cons')
    let vowels = RGA('vows')
    deltaP = consonants.push('p')
    deltaE = vowels.push('e')
    deltaA = vowels.push('a')
    deltaR = consonants.push('r')

  })

  // Let's create the word 'pear' using two replicas
  // 1. push 'p' to replicaPear
  // 2. push 'e' and 'a' to replicaVowels
  // 3. apply replicaVowels state to replicaPear
  // 3. push 'r' to replicaPear ... spelling 'pear'
  it('should be p', () => {
    const replicaPear = RGA('id2')
    replicaPear.apply(deltaP)
    expect(replicaPear.value().join('')).to.equal('p')
  })

  it('should be ea', () => {
    const replicaVowels = RGA('id1')
    replicaVowels.apply(deltaE)
    replicaVowels.apply(deltaA)
    expect(replicaVowels.value().join('')).to.equal('ea')
  })

  it('should be pea', () => {
    const replicaPear = RGA('id2')
    const replicaVowels = RGA('id1')
    replicaPear.apply(deltaP)
    replicaVowels.apply(deltaE)
    replicaVowels.apply(deltaA)
    replicaPear.apply(replicaVowels.state())
    expect(replicaPear.value().join('')).to.equal('pea')
  })



  it('behaves when applied in the original order', () => {
    const replica1 = RGA('replica1')
    replica1.apply(deltaP)
    replica1.apply(deltaE)
    replica1.apply(deltaA)
    replica1.apply(deltaR)

    expect(replica1.value().join('')).to.equal('pear')
  })

  it('can be applied in modified order (1)', () => {
    const replica2 = RGA('replica2')
    replica2.apply(deltaE)
    replica2.apply(deltaA)
    replica2.apply(deltaP)
    replica2.apply(deltaR)

    expect(replica2.value().join('')).to.equal('pear')
  })

  it('can be applied in different order (2)', () => {
    const replica3 = RGA('replica3')
    replica3.apply(deltaE)
    replica3.apply(deltaA)
    replica3.apply(deltaR)
    replica3.apply(deltaP)

    expect(replica3.value().join('')).to.equal('pear')
  })

  it('can be applied in different order (3)', () => {
    const replica4 = RGA('replica4')
    replica4.apply(deltaE)
    replica4.apply(deltaP)
    replica4.apply(deltaA)
    replica4.apply(deltaR)

    expect(replica4.value().join('')).to.equal('pear')
  })

  it('batching uncausally works', () => {
    const replica5 = RGA('replica5')
    replica5.apply(deltaE)
    replica5.apply(deltaA)
    const batchReplica5PR = rgaType.join(deltaP, deltaR)
    replica5.apply(batchReplica5PR)
    expect(replica5.value().join('')).to.equal('pear')
  })

  it('batching uncausally works (2)', () => {
    const replica6 = RGA('replica6')
    replica6.apply(deltaE)
    replica6.apply(deltaA)
    const batchReplica6RP = rgaType.join(deltaR, deltaP)
    replica6.apply(batchReplica6RP)
    expect(replica6.value().join('')).to.equal('pear')
  })
})
