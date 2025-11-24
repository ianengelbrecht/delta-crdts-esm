import type { CRDTInstance, MutatorMap } from './core.d.ts';

type LWWRegState<T = any> = [number, T | null];
type LWWRegValue<T = any> = T | null;

interface LWWRegMutators<T = any> extends MutatorMap {
  write(id: string, state: LWWRegState<T>, ts: number, value: T): LWWRegState<T>;
}

export type LWWRegInstance<T = any> = CRDTInstance<
  LWWRegState<T>,
  LWWRegValue<T>,
  LWWRegMutators<T>
>;

export interface LWWRegFactory<T = any> {
  (id: string): LWWRegInstance<T>;
}
