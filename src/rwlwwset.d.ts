import type { CRDTInstance, MutatorMap } from './core.d.ts';

type RWLWWSetState<T = any> = Map<T, [number, boolean]>;
type RWLWWSetValue<T = any> = Set<T>;

interface RWLWWSetMutators<T = any> extends MutatorMap {
  add(id: string, state: RWLWWSetState<T>, ts: number, value: T): RWLWWSetState<T>;
  remove(id: string, state: RWLWWSetState<T>, ts: number, value: T): RWLWWSetState<T>;
}

export type RWLWWSetInstance<T = any> = CRDTInstance<
  RWLWWSetState<T>,
  RWLWWSetValue<T>,
  RWLWWSetMutators<T>
>;

export interface RWLWWSetFactory<T = any> {
  (id: string): RWLWWSetInstance<T>;
}
