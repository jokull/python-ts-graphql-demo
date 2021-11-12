# Modern Python Web Stack

![image](https://user-images.githubusercontent.com/701/141482559-1992d50a-07f1-42e6-b0f6-bc0bb65ccc9e.png)

SQLAlchemy now has an asyncio extension. Strawberry is a new-ish GraphQL library based on Python
dataclasses that makes full use of type hints and mypy extensions. Codegen can generate typed React
hooks in TypeScript. This template or reference project shows how all these pieces can be put
together for an awesome typed developer experience.

This is a mini version of the [Inch](https://tryinch.com) tech stack. The schema is monitored by
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
poetry run uvicorn app:app --reload --host '::'
```

Start the GraphQL server

```bash
npm run codegen --watch
```

Run the frontend

```bash
npm run dev
```

## VS Code

Inside `.vscode/settings.json` you'll see how to have nice VS Code mypy errors, import sorting and
code formatting. Pylance does not yet deal well with declarative type hinted SQLAlchemy models.
However there are pretty good SQLA type stubs and a mypy plugin. That's why in the settings you'll
see `python.analysis.typeCheckingMode` switched off and mypy enabled instead.
