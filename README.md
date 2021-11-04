## Getting started

Regenerate the schema and codegen

```bash
poetry run strawberry export-schema app:schema > schema.graphql
npm run codegen
```

Drop and recreate all database tables

```bash
poetry run python models.py
```

Run the backend

```bash
poetry run uvicorn app:app --reload
```

Run the frontend

```bash
npm run dev
```
