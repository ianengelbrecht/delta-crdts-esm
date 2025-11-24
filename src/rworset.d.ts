import type { CRDTInstance, MutatorMap, DotSet } from './core.d.ts';

type RWORSetState<T = any> = DotSet<[T, boolean]>;
type RWORSetValue<T = any> = Set<T>;

interface RWORSetMutators<T = any> extends MutatorMap {
  add(id: string, state: RWORSetState<T>, value: T): RWORSetState<T>;
  remove(id: string, state: RWORSetState<T>, value: T): RWORSetState<T>;
}

export type RWORSetInstance<T = any> = CRDTInstance<
  RWORSetState<T>,
  RWORSetValue<T>,
  RWORSetMutators<T>
>;

export interface RWORSetFactory<T = any> {
  (id: string): RWORSetInstance<T>;
}
