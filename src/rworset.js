'use strict'

import DotSet from './dot-set.js'

export default {
  initial() { return new DotSet() },
  join(s1, s2) { return DotSet.join(s1, s2) },
  value(s) {
    const keeps = new Map()
    for (let [, [key, value]] of s.ds) {
      let previous = keeps.has(key) ? keeps.get(key) : true
      keeps.set(key, previous && value)
    }
    const ret = new Set()
    for (let [value, keep] of keeps) {
      if (keep) {
        ret.add(value)
      }
    }
    return ret
  },
  mutators: {
    add(id, s, value) {
      return s.join(
        s.removeValue([value, true]),
        s.removeValue([value, false]),
        s.add(id, [value, true]))
    },
    remove(id, s, value) {
      return s.join(
        s.removeValue([value, true]),
        s.removeValue([value, false]),
        s.add(id, [value, false]))
    }
  }
}
