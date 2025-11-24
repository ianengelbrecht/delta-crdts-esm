import type { CRDTInstance, MutatorMap } from './core.d.ts';

type ORMapState = any;

type ORMapValue = Record<string, any>;

interface ORMapMutators extends MutatorMap {
  applySub(
    id: string,
    state: ORMapState,
    key: string,
    typeName: string,
    mutatorName: string,
    ...args: any[]
  ): ORMapState;

  remove(
    id: string,
    state: ORMapState,
    key: string
  ): ORMapState;
}

export type ORMapInstance = CRDTInstance<
  ORMapState,
  ORMapValue,
  ORMapMutators
>;

export interface ORMapFactory {
  (id: string): ORMapInstance;
}
