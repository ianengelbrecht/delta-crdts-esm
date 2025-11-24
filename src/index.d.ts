import type { CRDTInstance, MutatorMap } from './core.d.ts';
import type { TwoPSetFactory, TwoPSetInstance } from './2pset.d.ts';
import type { AWORSetFactory, AWORSetInstance } from './aworset.d.ts';
import type { CCounterFactory, CCounterInstance } from './ccounter.d.ts';
import type { DWFlagFactory, DWFlagInstance } from './dwflag.d.ts';
import type { EWFlagFactory, EWFlagInstance } from './ewflag.d.ts';
import type { GCounterFactory, GCounterInstance } from './gcounter.d.ts';
import type { GSetFactory, GSetInstance } from './gset.d.ts';
import type { LexCounterFactory, LexCounterInstance } from './lexcounter.d.ts';
import type { LWWRegFactory, LWWRegInstance } from './lwwreg.d.ts';
import type { MVRegFactory, MVRegInstance } from './mvreg.d.ts';
import type { ORMapFactory, ORMapInstance } from './ormap.d.ts';
import type { PNCounterFactory, PNCounterInstance } from './pncounter.d.ts';
import type { RGAFactory, RGAInstance } from './rga.d.ts';
import type { RWLWWSetFactory, RWLWWSetInstance } from './rwlwwset.d.ts';
import type { RWORSetFactory, RWORSetInstance } from './rworset.d.ts';


// ---- Generic / less-typed CRDTs for your other types ----
type GenericInstance = CRDTInstance<any, any, MutatorMap>;
type GenericFactory = (id: string) => GenericInstance;

// If you want, you can later replace these with specific factories like above.
interface CRDTFactoryMap {
  '2pset': TwoPSetFactory<any>;
  aworset: AWORSetFactory<any>;
  ccounter: CCounterFactory;
  dwflag: DWFlagFactory;
  ewflag: EWFlagFactory;
  gcounter: GCounterFactory;
  gset: GSetFactory<any>;
  pncounter: PNCounterFactory;
  lexcounter: LexCounterFactory;
  lwwreg: LWWRegFactory<any>;
  mvreg: MVRegFactory<any>;
  ormap: ORMapFactory;
  rga: RGAFactory;
  rwlwwset: RWLWWSetFactory<any>;
  rworset: RWORSetFactory<any>;
}

// ---- The CRDT() default export itself ----

// Overload 1: known type name → specific factory
declare function CRDT<K extends keyof CRDTFactoryMap>(
  typeName: K
): CRDTFactoryMap[K];

// Overload 2: unknown string → generic CRDT factory
declare function CRDT(typeName: string): GenericFactory;

// Merge in the static methods: CRDT.define, CRDT.type
declare namespace CRDT {
  function define(typeName: string, impl: any): void;
  function type(typeName: string): any;
}

export default CRDT;

// ---- Re-export encode/decode from msgpack.js ----

export function encode(value: any): Uint8Array;
export function decode<T = any>(
  data: ArrayLike<number> | ArrayBuffer | ArrayBufferView
): T;

// export factories
export {
  MVRegFactory,
  GSetFactory,
  TwoPSetFactory,
  AWORSetFactory,
  RWORSetFactory,
  DWFlagFactory,
  EWFlagFactory,
  GCounterFactory,
  PNCounterFactory,
  LexCounterFactory,
  LWWRegFactory,
  RWLWWSetFactory,
  RGAFactory,
  ORMapFactory,
};

// and instance types
export {
  MVRegInstance,
  GSetInstance,
  TwoPSetInstance,
  AWORSetInstance,
  RWORSetInstance,
  DWFlagInstance,
  EWFlagInstance,
  GCounterInstance,
  PNCounterInstance,
  LexCounterInstance,
  LWWRegInstance,
  RWLWWSetInstance,
  RGAInstance,
  ORMapInstance,
};



