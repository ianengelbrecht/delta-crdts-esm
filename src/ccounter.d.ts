import type { CRDTInstance, MutatorMap, DotSet } from './core.d.ts';


type CCounterState = DotSet<number>;
type CCounterValue = number;

interface CCounterMutators extends MutatorMap {
  inc(id: string, state: CCounterState, by?: number): CCounterState;
  dec(id: string, state: CCounterState, by?: number): CCounterState;
}

export type CCounterInstance = CRDTInstance<
  CCounterState,
  CCounterValue,
  CCounterMutators
>;

export interface CCounterFactory {
  (id: string): CCounterInstance;
}
