This is a mini version of the [Inch](https://tryinch.com) tech stack that has a Python asyncio backend 
querying with SQLAlchemy and Strawberry serving GraphQL with Starlette. The schema is monitored by
[codegen](https://www.graphql-code-generator.com) that creates 
[urql](https://github.com/FormidableLabs/urql) TypeScript hooks. The goal was to have strong data 
consistency between the backend and frontend. Another benefit is a great VS Code environment that 
highlights any potential errors when communicating with the backend. 

![](https://user-images.githubusercontent.com/701/140308942-264f40fa-f6ac-43cf-88f0-b6c4bfdfe105.mp4)

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


