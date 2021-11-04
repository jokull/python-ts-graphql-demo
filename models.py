import asyncio
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Optional

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

Base = declarative_base()


class Location(Base):
    __tablename__ = "locations"
    id: int = Column(Integer, primary_key=True, index=True)
    name: str = Column(String, nullable=False, unique=True)

    tasks: list["Task"] = relationship("Task", lazy="joined", back_populates="location")


class Task(Base):
    __tablename__ = "tasks"
    id: int = Column(Integer, primary_key=True, index=True)
    name: str = Column(String, nullable=False)
    location_id: Optional[int] = Column(Integer, ForeignKey(Location.id), nullable=True)

    location: Optional[Location] = relationship(Location, lazy="joined", back_populates="tasks")


engine = create_async_engine(
    "sqlite+aiosqlite:///./database.db", connect_args={"check_same_thread": False}
)

async_session = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


@asynccontextmanager
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        async with session.begin():
            try:
                yield session
            finally:
                await session.close()


async def _async_main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()


if __name__ == "__main__":
    print("Dropping and creating tables")
    asyncio.run(_async_main())
    print("Done.")
