import type { CRDTInstance, MutatorMap, DotSet } from './core.d.ts';

type AWORSetState<T = any> = DotSet<T>;
type AWORSetValue<T = any> = Set<T>;

interface AWORSetMutators<T = any> extends MutatorMap {
  add(id: string, state: AWORSetState<T>, value: T): AWORSetState<T>;
  remove(id: string, state: AWORSetState<T>, value: T): AWORSetState<T>;
}

export type AWORSetInstance<T = any> = CRDTInstance<
  AWORSetState<T>,
  AWORSetValue<T>,
  AWORSetMutators<T>
>;

export interface AWORSetFactory<T = any> {
  (id: string): AWORSetInstance<T>;
}
