import type { CRDTInstance, MutatorMap, DotSet } from './core.d.ts';

// ---- Concrete types: MVReg ----

// mvreg.js:
//   initial() -> DotSet
//   value(s) -> Set of values
//   mutators: { write(id, s, value) { ... } }

type MVRegState<T = any> = DotSet<T>;
type MVRegValue<T = any> = Set<T>;

interface MVRegMutators<T = any> extends MutatorMap {
  write: (id: string, state: MVRegState<T>, value: T) => MVRegState<T>;
}

export type MVRegInstance<T = any> = CRDTInstance<
  MVRegState<T>,
  MVRegValue<T>,
  MVRegMutators<T>
>;

export interface MVRegFactory<T = any> {
  (id: string): MVRegInstance<T>;
}