// 2pset.d.ts
import type { CRDTInstance, MutatorMap } from './core.d.ts';

// State is [added, removed]
type TwoPSetState<T = any> = [Set<T>, Set<T>];

// value(s) returns the "added" side (minus removed), i.e. s[0]
type TwoPSetValue<T = any> = Set<T>;

interface TwoPSetMutators<T = any> extends MutatorMap {
  add(id: string, state: TwoPSetState<T>, value: T): TwoPSetState<T>;
  remove(id: string, state: TwoPSetState<T>, value: T): TwoPSetState<T>;
}

export type TwoPSetInstance<T = any> = CRDTInstance<
  TwoPSetState<T>,
  TwoPSetValue<T>,
  TwoPSetMutators<T>
>;

export interface TwoPSetFactory<T = any> {
  (id: string): TwoPSetInstance<T>;
}
