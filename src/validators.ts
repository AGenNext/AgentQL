import { AgentQL, ExpandRelation } from './types';

const MAX_LIMIT = 20;

const allowedRelations: ExpandRelation[] = [
  'mentions',
  'derived_from',
  'supports',
  'contradicts'
];

export function validate(input: AgentQL): void {
  switch (input.op) {
    case 'memory.search': {
      if (!input.query?.trim()) {
        throw new Error('memory.search requires query');
      }

      if ((input.limit ?? 8) > MAX_LIMIT) {
        throw new Error(`limit exceeds max of ${MAX_LIMIT}`);
      }

      for (const relation of input.expand ?? []) {
        if (!allowedRelations.includes(relation)) {
          throw new Error(`invalid relation: ${relation}`);
        }
      }

      return;
    }

    case 'graph.expand': {
      for (const relation of input.relations) {
        if (!allowedRelations.includes(relation)) {
          throw new Error(`invalid relation: ${relation}`);
        }
      }

      return;
    }

    case 'task.create': {
      if (!input.objective.trim()) {
        throw new Error('task objective required');
      }

      return;
    }

    case 'belief.assert': {
      if (input.confidence < 0 || input.confidence > 1) {
        throw new Error('confidence must be between 0 and 1');
      }

      return;
    }
  }
}
