import type { CRDTInstance, MutatorMap } from './core.d.ts';

type LexCounterState = Map<string, [number, number]>;
type LexCounterValue = number;

interface LexCounterMutators extends MutatorMap {
  inc(id: string, state: LexCounterState): LexCounterState;
  dec(id: string, state: LexCounterState): LexCounterState;
}

export type LexCounterInstance = CRDTInstance<
  LexCounterState,
  LexCounterValue,
  LexCounterMutators
>;

export interface LexCounterFactory {
  (id: string): LexCounterInstance;
}
