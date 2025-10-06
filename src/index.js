'use strict'

import Type from './type.js'
import gcounter from './gcounter.js'
import pncounter from './pncounter.js'
import lexcounter from './lexcounter.js'
import ccounter from './ccounter.js'
import gset from './gset.js'
import twopset from './2pset.js'
import aworset from './aworset.js'
import rworset from './rworset.js'
import mvreg from './mvreg.js'
import ewflag from './ewflag.js'
import dwflag from './dwflag.js'
import rwlwwset from './rwlwwset.js'
import lwwreg from './lwwreg.js'
import rga from './rga.js'
import ormap from './ormap.js'

const types = {
  gcounter,
  pncounter,
  lexcounter,
  ccounter,
  gset,
  '2pset': twopset,
  aworset,
  rworset,
  mvreg,
  ewflag,
  dwflag,
  rwlwwset,
  lwwreg,
  rga,
  ormap
}

export default function CRDT(typeName) {
  const impl = type(typeName)
  impl.__typeName = typeName // optional: carry on the impl itself
  return Type(impl, typeName) // pass through
}


function type(typeName) {
  const type = types[typeName]
  if (!type) { throw new Error(`unknown type named ${typeName}`) }
  return type
}

function define(typeName, impl) {
  if (types[typeName]) {
    throw new Error(`${typeName} is already defined as a type`)
  }
  types[typeName] = impl
}

CRDT.define = define
CRDT.type = type

export { encode, decode } from './msgpack.js'
