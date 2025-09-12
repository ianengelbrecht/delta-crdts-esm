'use strict'

import { encode, decode } from '../../src/msgpack.js';

export default function transmit(delta) {
  return decode(encode(delta))
}
