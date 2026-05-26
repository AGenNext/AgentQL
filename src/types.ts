export type ExpandRelation =
  | 'mentions'
  | 'derived_from'
  | 'supports'
  | 'contradicts';

export type MemorySearch = {
  op: 'memory.search';
  query: string;
  agent: string;
  mode?: 'semantic' | 'keyword' | 'hybrid';
  expand?: ExpandRelation[];
  limit?: number;
};

export type GraphExpand = {
  op: 'graph.expand';
  from: string;
  relations: ExpandRelation[];
  depth?: number;
};

export type TaskCreate = {
  op: 'task.create';
  objective: string;
  assign_to: string;
};

export type BeliefAssert = {
  op: 'belief.assert';
  statement: string;
  confidence: number;
  source?: string;
};

export type AgentQL =
  | MemorySearch
  | GraphExpand
  | TaskCreate
  | BeliefAssert;
