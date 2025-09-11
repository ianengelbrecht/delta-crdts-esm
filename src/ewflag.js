'use strict'

import DotSet from './dot-set.js'

export default {
  initial() { return new DotSet() },
  join(s1, s2) { return DotSet.join(s1, s2) },
  value(s) { return s.ds.size > 0 },
  mutators: {
    enable(id, s) {
      return s.join(
        s.removeValue(true),
        s.add(id, true))
    },
    disable(id, s) {
      return s.removeValue(true)
    }
  }
}
