DEFINE TABLE agent SCHEMAFULL;
DEFINE FIELD name ON agent TYPE string;
DEFINE FIELD role ON agent TYPE string;
DEFINE FIELD created_at ON agent TYPE datetime DEFAULT time::now();

DEFINE TABLE memory SCHEMAFULL;
DEFINE FIELD agent ON memory TYPE record<agent>;
DEFINE FIELD kind ON memory TYPE string;
DEFINE FIELD content ON memory TYPE string;
DEFINE FIELD source ON memory TYPE option<string>;
DEFINE FIELD confidence ON memory TYPE float DEFAULT 0.5;
DEFINE FIELD embedding ON memory TYPE array<float>;
DEFINE FIELD created_at ON memory TYPE datetime DEFAULT time::now();

DEFINE TABLE concept SCHEMAFULL;
DEFINE FIELD name ON concept TYPE string;
DEFINE FIELD description ON concept TYPE option<string>;

DEFINE TABLE document SCHEMAFULL;
DEFINE FIELD title ON document TYPE string;
DEFINE FIELD url ON document TYPE option<string>;
DEFINE FIELD content ON document TYPE string;
DEFINE FIELD embedding ON document TYPE array<float>;

DEFINE TABLE task SCHEMAFULL;
DEFINE FIELD objective ON task TYPE string;
DEFINE FIELD status ON task TYPE string DEFAULT "queued";
DEFINE FIELD assigned_to ON task TYPE record<agent>;
DEFINE FIELD result ON task TYPE option<object>;
DEFINE FIELD created_at ON task TYPE datetime DEFAULT time::now();

DEFINE TABLE belief SCHEMAFULL;
DEFINE FIELD statement ON belief TYPE string;
DEFINE FIELD confidence ON belief TYPE float;
DEFINE FIELD created_at ON belief TYPE datetime DEFAULT time::now();

DEFINE TABLE mentions TYPE RELATION;
DEFINE TABLE derived_from TYPE RELATION;
DEFINE TABLE supports TYPE RELATION;
DEFINE TABLE contradicts TYPE RELATION;
DEFINE TABLE assigned TYPE RELATION;

DEFINE ANALYZER simple TOKENIZERS blank, class, camel, punct FILTERS lowercase, ascii;

DEFINE INDEX memory_text
ON TABLE memory
FIELDS content
FULLTEXT ANALYZER simple BM25;

DEFINE INDEX memory_vector
ON TABLE memory
FIELDS embedding
HNSW DIMENSION 1536 DIST COSINE;
