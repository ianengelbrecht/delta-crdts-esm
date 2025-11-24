import type { CRDTInstance, MutatorMap } from './core.d.ts';

type RGAAddedVertices<T = any> = Map<string | null, T>;
type RGARemovedVertices = Set<string>;
type RGAEdges = Map<string | null, string | null>;
type RGAUnmergedEdge = [string | null, string];
type RGAUnmergedEdges = Set<RGAUnmergedEdge>;

type RGAState<T = any> = [
  RGAAddedVertices<T>,
  RGARemovedVertices,
  RGAEdges,
  RGAUnmergedEdges
];

type RGAValue<T = any> = T[];

interface RGAMutators<T = any> extends MutatorMap {
  addRight(
    id: string,
    state: RGAState<T>,
    beforeVertex: string | null,
    value: T
  ): RGAState<T>;

  push(
    id: string,
    state: RGAState<T>,
    value: T
  ): RGAState<T>;

  remove(
    id: string,
    state: RGAState<T>,
    vertex: string
  ): RGAState<T>;

  removeAt(
    id: string,
    state: RGAState<T>,
    pos: number
  ): RGAState<T>;

  insertAt(
    id: string,
    state: RGAState<T>,
    pos: number,
    value: T
  ): RGAState<T>;

  insertAllAt(
    id: string,
    state: RGAState<T>,
    pos: number,
    values: T[]
  ): RGAState<T>;

  updateAt(
    id: string,
    state: RGAState<T>,
    pos: number,
    value: T
  ): RGAState<T>;
}

export type RGAInstance<T = any> = CRDTInstance<
  RGAState<T>,
  RGAValue<T>,
  RGAMutators<T>
>;

export interface RGAFactory<T = any> {
  (id: string): RGAInstance<T>;
}
