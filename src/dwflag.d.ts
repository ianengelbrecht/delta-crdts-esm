import type { CRDTInstance, MutatorMap, DotSet } from './core.d.ts';

type DWFlagState = DotSet<boolean>;
type DWFlagValue = boolean;

interface DWFlagMutators extends MutatorMap {
  enable(id: string, state: DWFlagState): DWFlagState;
  disable(id: string, state: DWFlagState): DWFlagState;
}

export type DWFlagInstance = CRDTInstance<
  DWFlagState,
  DWFlagValue,
  DWFlagMutators
>;

export interface DWFlagFactory {
  (id: string): DWFlagInstance;
}
