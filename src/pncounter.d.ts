import type { CRDTInstance, MutatorMap } from './core.d.ts';
import type { GCounterState } from './gcounter.d.ts';

type PNCounterState = [GCounterState, GCounterState];
type PNCounterValue = number;

interface PNCounterMutators extends MutatorMap {
  inc(id: string, state: PNCounterState): PNCounterState;
  dec(id: string, state: PNCounterState): PNCounterState;
}

export type PNCounterInstance = CRDTInstance<
  PNCounterState,
  PNCounterValue,
  PNCounterMutators
>;

export interface PNCounterFactory {
  (id: string): PNCounterInstance;
}
