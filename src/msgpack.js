// the encoder and decoder
import { encode as msgpack_encode, decode as msgpack_decode, ExtensionCodec } from "@msgpack/msgpack";

const extensionCodec = new ExtensionCodec();

// Set<T>
const SET_EXT_TYPE = 0 // Any in 0-127
extensionCodec.register({
  type: SET_EXT_TYPE,
  encode: (object) => {
    if (object instanceof Set) {
      return msgpack_encode([...object], { extensionCodec });
    } else {
      return null;
    }
  },
  decode: (data) => {
    const array = msgpack_decode(data, { extensionCodec });
    return new Set(array);
  },
});

// Map<K, V>
const MAP_EXT_TYPE = 1; // Any in 0-127
extensionCodec.register({
  type: MAP_EXT_TYPE,
  encode: (object) => {
    if (object instanceof Map) {
      return msgpack_encode([...object], { extensionCodec });
    } else {
      return null;
    }
  },
  decode: (data) => {
    const array = msgpack_decode(data, { extensionCodec });
    return new Map(array);
  },
});

export function encode(object) {
  return msgpack_encode(object, { extensionCodec });
}

export function decode(data) {
  return msgpack_decode(data, { extensionCodec });
}