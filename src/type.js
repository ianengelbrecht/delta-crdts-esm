'use strict'
//TODO replace eventemmitter

// replacing the old version from immutable.js -- immutable types are not created anywhere in the code
export function isCollection(value) {
  return value instanceof Map || value instanceof Set;
}

export default function createTypeInstance(Type) {
  return (id) => {
    let state = Type.initial()
    const ret = new Emitter()
    const emitter = new ChangeEmitter(ret)
    let valueCache

    Object.keys(Type.mutators || {}).forEach((mutatorName) => {
      const mutator = Type.mutators[mutatorName]
      ret[mutatorName] = (...args) => {
        const delta = mutator(id, state, ...args)
        const newState = Type.join.call(emitter, state, delta)
        if (Type.incrementalValue) {
          valueCache = Type.incrementalValue(state, newState, delta, valueCache)
        }
        state = newState
        emitter.emitAll()
        ret.emit('state changed', state)
        return delta
      }
    })

    ret.id = id

    ret.value = () => {
      if (Type.incrementalValue && (valueCache !== undefined)) {
        let returnValue = valueCache.value
        if (isCollection(returnValue)) {
          returnValue = returnValue.toJS()
        }
        return returnValue
      } else {
        return Type.value(state)
      }
    }

    ret.apply = (delta) => {
      const newState = Type.join.call(emitter, state, delta, { strict: true })
      if (Type.incrementalValue) {
        valueCache = Type.incrementalValue(state, newState, delta, valueCache)
      }
      state = newState
      emitter.emitAll()
      ret.emit('state changed', state)
      return state
    }

    ret.state = () => state

    ret.join = Type.join

    return ret
  }
}

// EventEmitter shim from ChatGPT
class Emitter {
  constructor() {
    this._target = new EventTarget();
  }

  on(type, listener, options) {
    this._target.addEventListener(type, listener, options);
    return this; // chainable
  }

  off(type, listener, options) {
    this._target.removeEventListener(type, listener, options);
    return this;
  }

  once(type, listener, options) {
    const wrapper = (event) => {
      this.off(type, wrapper, options);
      listener(event);
    };
    this.on(type, wrapper, options);
    return this;
  }

  emit(type, detail) {
    return this._target.dispatchEvent(new CustomEvent(type, { detail }));
  }
}


class ChangeEmitter {
  constructor(client) {
    this._client = client
    this._events = []
  }

  changed(event) {
    this._events.push(event)
  }

  emitAll() {
    const events = this._events
    this._events = []
    events.forEach((event) => {
      this._client.emit('change', event)
    })
  }
}
