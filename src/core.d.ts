// ---- Basic event API (matches your Emitter shim) ----
export interface EmitterLike {
  on(type: string, listener: (event: any) => void, options?: any): this;
  off(type: string, listener: (event: any) => void, options?: any): this;
  once(type: string, listener: (event: any) => void, options?: any): this;
  emit(type: string, detail?: any): boolean;
}

export interface DotSet<T = any> {
  ds: Map<any, T>;
}

// Wrapped delta shape produced by instance mutators / apply / join
export interface WrappedDelta<T = unknown> {
  __crdt: {
    type: string;
    id: string;
  };
  delta: T;
}

// ---- Generic “type descriptor” (the thing in gset.js, mvreg.js, etc.) ----
export type MutatorFn<R = any> = (id: string, state: any, ...args: any[]) => R;

export interface MutatorMap {
  [key: string]: MutatorFn<any>;
}

interface TypeDescriptor<S, V, M extends MutatorMap = MutatorMap> {
  initial(): S;
  join(this: any, s1: S, s2: any, ...rest: any[]): S;
  value(state: S): V;
  incrementalValue?(
    prevState: S,
    nextState: S,
    delta: any,
    prevCache: any
  ): { value: V } | undefined;
  mutators: M;
}

// Helper: get the `...args` part of a mutator (drop id + state)
export type MutatorArgs<F> =
  F extends (id: any, state: any, ...args: infer A) => any ? A : never;

// Helper: get the core return type of a mutator
export type MutatorCoreReturn<F> =
  F extends (...args: any[]) => infer R ? R : never;

// Helper: map mutators to instance methods, returning wrapped deltas
type MutatorMethods<M extends MutatorMap> = {
  [K in keyof M]: (
    ...args: MutatorArgs<M[K]>
  ) => WrappedDelta<MutatorCoreReturn<M[K]>>;
};

// The wrapped CRDT instance you return from Type(...)(id)
export type CRDTInstance<
  S = any,
  V = any,
  M extends MutatorMap = MutatorMap
> = EmitterLike & {
  id: string;
  type: string;
  typeName: string;

  value(): V;

  // apply wraps the *new state* in a delta envelope
  apply(delta: any): WrappedDelta<S>;

  // join wraps whatever Type.join returns; we don't know its exact shape
  join(s: S, d: any, ...rest: any[]): WrappedDelta<any>;

  state(): S;
} & MutatorMethods<M>;
