'use strict'

import hash from 'hash-it';

export default function (object) {
  const type = typeof object
  if (type !== 'object') {
    return object
  }
  let hashValue
  if (object.hasOwnProperty('hashCode')) {
    hashValue = object.hashCode
  } else {
    hashValue = hash(object)
  }
  return hashValue
}
