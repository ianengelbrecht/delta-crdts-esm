// ---- Concrete types: GSet ----

import type { CRDTInstance, MutatorMap } from './core.d.ts';

// gset.js:
//   initial() -> Set
//   value(s) -> new Set(s)
//   mutators: { add(id, s, value) { ... } }

type GSetState<T = any> = Set<T>;
type GSetValue<T = any> = Set<T>;

interface GSetMutators<T = any> extends MutatorMap {
  add: (id: string, state: GSetState<T>, value: T) => GSetState<T>;
}

export type GSetInstance<T = any> = CRDTInstance<
  GSetState<T>,
  GSetValue<T>,
  GSetMutators<T>
>;

export interface GSetFactory<T = any> {
  (id: string): GSetInstance<T>;
}
