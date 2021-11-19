import asyncio
from typing import AsyncGenerator, Optional

import aioredis
import async_timeout
import strawberry
from sqlalchemy import select
from starlette.applications import Starlette
from strawberry.asgi import GraphQL

import models


@strawberry.type
class Location:
    id: strawberry.ID
    name: str

    @classmethod
    def marshal(cls, model: models.Location) -> "Location":
        return cls(id=strawberry.ID(str(model.id)), name=model.name)


@strawberry.type
class Task:
    id: strawberry.ID
    name: str
    location: Optional[Location] = None

    @classmethod
    def marshal(cls, model: models.Task) -> "Task":
        return cls(
            id=strawberry.ID(str(model.id)),
            name=model.name,
            location=Location.marshal(model.location) if model.location else None,
        )


# @strawberry.type
# class LocationNotFound:
#     message: str = "Location with this name does not exist"


AddTaskResponse = strawberry.union("AddTaskResponse", (Task,))


@strawberry.type
class LocationExists:
    message: str = "Location with this name already exist"


AddLocationResponse = strawberry.union("AddLocationResponse", (Location, LocationExists))


redis = aioredis.Redis.from_url("redis://localhost", decode_responses=True)
psub = redis.pubsub()


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def add_task(self, name: str, location_name: Optional[str]) -> AddTaskResponse:
        async with models.get_session() as s:
            db_location = None
            if location_name:
                sql = select(models.Location).where(models.Location.name == location_name)
                db_location = (await s.execute(sql)).scalars().first()
                # if db_location is None:
                #     return LocationNotFound()
            db_task = models.Task(name=name, location=db_location)
            s.add(db_task)
            await s.commit()
        await redis.publish("tasks", str(db_task.id))
        return Task.marshal(db_task)

    @strawberry.mutation
    async def add_location(self, name: str) -> AddLocationResponse:
        async with models.get_session() as s:
            sql = select(models.Location).where(models.Location.name == name)
            existing_db_location = (await s.execute(sql)).first()
            if existing_db_location is not None:
                return LocationExists()
            db_location = models.Location(name=name)
            s.add(db_location)
            await s.commit()
        return Location.marshal(db_location)


@strawberry.type
class Query:
    @strawberry.field
    async def tasks(self) -> list[Task]:
        async with models.get_session() as s:
            sql = select(models.Task).order_by(models.Task.name)
            db_tasks = (await s.execute(sql)).scalars().unique().all()
        return [Task.marshal(task) for task in db_tasks]

    @strawberry.field
    async def locations(self) -> list[Location]:
        async with models.get_session() as s:
            sql = select(models.Location).order_by(models.Location.name)
            db_locations = (await s.execute(sql)).scalars().unique().all()
        return [Location.marshal(loc) for loc in db_locations]


async def reader(channel: aioredis.client.PubSub):
    while True:
        try:
            async with async_timeout.timeout(1):
                message = await channel.get_message(ignore_subscribe_messages=True)
                if message is not None:
                    yield message
                await asyncio.sleep(0.01)
        except asyncio.TimeoutError:
            pass


@strawberry.type
class Subscription:
    @strawberry.subscription
    async def taskAdded(self) -> AsyncGenerator[Task, None]:
        print("HEY")
        async with psub as hub:
            print("HEY2")
            await hub.subscribe("tasks")
            print("SUBSCRIBED")
            while True:
                try:
                    data = await hub.get_message(ignore_subscribe_messages=True)
                    print("ACCEPTED", data)
                    async with models.get_session() as s:
                        sql = select(models.Task).where(models.Task.id == int(data["data"]))
                        db_task = (await s.execute(sql)).scalars().one()
                        yield Task.marshal(db_task)
                finally:
                    await hub.unsubscribe("tasks")
                    hub.close()


# # closing all open connections
# await psub.close()


schema = strawberry.Schema(query=Query, mutation=Mutation, subscription=Subscription)
graphql_app = GraphQL(schema)
app = Starlette()
app.add_route("/graphql", graphql_app)
app.add_websocket_route("/graphql", graphql_app)
