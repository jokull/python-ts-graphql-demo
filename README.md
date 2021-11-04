## Getting started

Install Python and NPM packages

```bash
poetry install
npm i
```

Drop and recreate all database tables

```bash
poetry run python models.py
```

Run the Python GraphQL backend on port :8000 - Next.js will reverse proxy `/graphql` to here

```bash
poetry run uvicorn app:app --reload
```

![](https://ss.solberg.is/7GOZ7I+)

Start the GraphQL server

```bash
npm run codegen --watch
```

![](https://ss.solberg.is/hTHyzj+)

Run the frontend

```bash
npm run dev
```

![](https://ss.solberg.is/chu0zY+)