import type { CRDTInstance, MutatorMap, DotSet } from './core.d.ts';

type EWFlagState = DotSet<boolean>;
type EWFlagValue = boolean;

interface EWFlagMutators extends MutatorMap {
  enable(id: string, state: EWFlagState): EWFlagState;
  disable(id: string, state: EWFlagState): EWFlagState;
}

export type EWFlagInstance = CRDTInstance<
  EWFlagState,
  EWFlagValue,
  EWFlagMutators
>;

export interface EWFlagFactory {
  (id: string): EWFlagInstance;
}
