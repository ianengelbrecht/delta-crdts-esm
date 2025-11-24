import type { CRDTInstance, MutatorMap } from './core.d.ts';

type GCounterState = Map<string, number>;
type GCounterValue = number;

interface GCounterMutators extends MutatorMap {
  inc(id: string, state: GCounterState): GCounterState;
}

export type GCounterInstance = CRDTInstance<
  GCounterState,
  GCounterValue,
  GCounterMutators
>;

export interface GCounterFactory {
  (id: string): GCounterInstance;
}
