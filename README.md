# AgentQL

AgentQL is a constrained, agent-friendly query layer that compiles safe JSON operations into SurrealQL.

The goal is to let agents request memory search, graph expansion, task creation, and belief assertions without allowing arbitrary database writes or unrestricted SurrealQL generation.

## Why AgentQL

Raw LLM-generated SurrealQL is powerful but risky. AgentQL narrows the interface to validated operations:

- `memory.search`
- `graph.expand`
- `task.create`
- `belief.assert`

Each operation is checked against an allowlist, bounded by limits, and compiled into parameterized SurrealQL templates.

## Repository layout

```text
schema/
  surrealdb.surql
src/
  compiler.ts
  index.ts
  types.ts
  validators.ts
examples/
  memory-search.json
  graph-expand.json
  task-create.json
  belief-assert.json
```

## Example AgentQL JSON

```json
{
  "op": "memory.search",
  "query": "SurrealDB vector search and graph traversal",
  "agent": "researcher",
  "mode": "semantic",
  "expand": ["mentions", "derived_from"],
  "limit": 8
}
```

## Compiled SurrealQL shape

```sql
SELECT
  id,
  content,
  confidence,
  source,
  created_at,
  vector::distance::knn() AS distance,
  ->mentions->concept AS mentions,
  ->derived_from->document AS derived_from
FROM memory
WHERE
  agent = type::thing("agent", $agent)
  AND embedding <|8|> $embedding
ORDER BY distance
LIMIT 8;
```

## Safety model

AgentQL intentionally blocks open-ended SQL generation. The compiler only emits known SurrealQL templates.

Validation includes:

- operation allowlist
- relation allowlist
- maximum result limits
- safe record identifiers
- bounded graph expansion
- required field checks

## SurrealDB setup

Apply `schema/surrealdb.surql` to a SurrealDB namespace/database before using the runtime.

The default vector dimension is `1536`, matching common embedding models. Change the index dimension if your embedding provider uses a different size.
