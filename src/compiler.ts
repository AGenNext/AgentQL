import { AgentQL } from './types';
import { validate } from './validators';

export type CompiledQuery = {
  sql: string;
  params: Record<string, unknown>;
};

export function compile(input: AgentQL): CompiledQuery {
  validate(input);

  switch (input.op) {
    case 'memory.search': {
      const limit = Math.min(input.limit ?? 8, 20);

      const expansions = (input.expand ?? [])
        .map((r) => `->${r}->${r} AS ${r}`)
        .join(',\n  ');

      return {
        sql: `SELECT
  id,
  content,
  confidence,
  source,
  created_at,
  vector::distance::knn() AS distance${expansions ? ',\n  ' + expansions : ''}
FROM memory
WHERE
  agent = type::thing("agent", $agent)
  AND embedding <|${limit}|> $embedding
ORDER BY distance
LIMIT ${limit};`,
        params: {
          agent: input.agent,
          embedding: '__embedding_vector__',
          query: input.query
        }
      };
    }

    case 'graph.expand': {
      const projections = input.relations
        .map((r) => `->${r}->${r} AS ${r}`)
        .join(',\n  ');

      return {
        sql: `SELECT
  ${projections}
FROM ${input.from};`,
        params: {}
      };
    }

    case 'task.create': {
      return {
        sql: `CREATE task CONTENT {
  objective: $objective,
  status: "queued",
  assigned_to: type::thing("agent", $agent),
  created_at: time::now()
};`,
        params: {
          objective: input.objective,
          agent: input.assign_to
        }
      };
    }

    case 'belief.assert': {
      return {
        sql: `CREATE belief CONTENT {
  statement: $statement,
  confidence: $confidence,
  created_at: time::now()
};`,
        params: {
          statement: input.statement,
          confidence: input.confidence,
          source: input.source
        }
      };
    }
  }
}
